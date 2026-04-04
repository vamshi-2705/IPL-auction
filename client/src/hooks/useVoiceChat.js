import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export function useVoiceChat({ socket, roomId, userId }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState({}); 
  // voiceUsers: { [userId]: { stream: MediaStream, isSpeaking: boolean, isMuted: boolean } }

  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const audioCtxRef = useRef(null);
  const analyserIntervalRef = useRef(null);
  const speakingRef = useRef(false);

  // Helper to safely clean up all voice connections
  const cleanupVoice = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    if (analyserIntervalRef.current) clearInterval(analyserIntervalRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(()=>{});
      audioCtxRef.current = null;
    }
    setVoiceUsers({});
    setIsConnected(false);
    speakingRef.current = false;
  }, []);

  const createPeer = useCallback((targetUserId, isInitiator) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    
    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate && socket) {
        socket.emit('webrtc_signal', {
          roomId,
          targetUserId,
          callerUserId: userId,
          signal: { type: 'candidate', candidate: e.candidate }
        });
      }
    };

    // Handle incoming stream
    pc.ontrack = (e) => {
      if (e.streams && e.streams[0]) {
        setVoiceUsers(prev => ({
          ...prev,
          [targetUserId]: {
            ...prev[targetUserId],
            stream: e.streams[0],
            isMuted: false,
            isSpeaking: false
          }
        }));
      }
    };

    // Handle disconnects
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        setVoiceUsers(prev => {
          const next = { ...prev };
          delete next[targetUserId];
          return next;
        });
        if (peersRef.current[targetUserId]) {
          peersRef.current[targetUserId].close();
          delete peersRef.current[targetUserId];
        }
      }
    };

    return pc;
  }, [roomId, userId, socket]);

  // Main socket event bindings
  useEffect(() => {
    if (!socket || !userId) return;

    const handleUserJoined = async ({ userId: newUserId }) => {
      if (!isConnected || newUserId === userId) return;
      
      // I am already established, so I will initiate connection to the new user.
      const pc = createPeer(newUserId, true);
      peersRef.current[newUserId] = pc;
      
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc_signal', {
          roomId,
          targetUserId: newUserId,
          callerUserId: userId,
          signal: offer
        });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    };

    const handleSignal = async ({ targetUserId, callerUserId, signal }) => {
      if (!isConnected || targetUserId !== userId) return;

      let pc = peersRef.current[callerUserId];
      
      try {
        if (signal.type === 'offer') {
          if (!pc) {
            pc = createPeer(callerUserId, false);
            peersRef.current[callerUserId] = pc;
          }
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc_signal', {
            roomId,
            targetUserId: callerUserId,
            callerUserId: userId,
            signal: answer
          });
        } 
        else if (signal.type === 'answer') {
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
          }
        } 
        else if (signal.type === 'candidate' && pc) {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      } catch (err) {
        console.error("WebRTC Signal processing error:", err);
      }
    };

    const handleVoiceStatus = ({ userId: peerUserId, isMuted, isSpeaking }) => {
      if (peerUserId === userId) return;
      setVoiceUsers(prev => {
        if (!prev[peerUserId]) return prev;
        return {
          ...prev,
          [peerUserId]: { ...prev[peerUserId], isMuted, isSpeaking }
        };
      });
    };

    const handleUserLeft = ({ userId: leftUserId }) => {
       setVoiceUsers(prev => {
         const next = { ...prev };
         delete next[leftUserId];
         return next;
       });
       if (peersRef.current[leftUserId]) {
         peersRef.current[leftUserId].close();
         delete peersRef.current[leftUserId];
       }
    };

    socket.on('user_joined_voice', handleUserJoined);
    socket.on('webrtc_signal', handleSignal);
    socket.on('voice_status_update', handleVoiceStatus);
    socket.on('user_left_voice', handleUserLeft);

    return () => {
      socket.off('user_joined_voice', handleUserJoined);
      socket.off('webrtc_signal', handleSignal);
      socket.off('voice_status_update', handleVoiceStatus);
      socket.off('user_left_voice', handleUserLeft);
    };
  }, [socket, isConnected, userId, roomId, createPeer]);

  // Handle local speaking detection to update everyone else
  const startLocalAudioAnalysis = (stream) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser); // Do not connect to destination (no echo)
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      analyserIntervalRef.current = setInterval(() => {
        // Skip if locally muted
         if (!localStreamRef.current || !localStreamRef.current.getAudioTracks()[0]?.enabled) {
            if (speakingRef.current) {
                speakingRef.current = false;
                socket?.emit('voice_status', { roomId, userId, isMuted: true, isSpeaking: false });
            }
            return;
         }

         analyser.getByteFrequencyData(dataArray);
         let sum = 0;
         for (let i=0; i<dataArray.length; i++) sum += dataArray[i];
         const avg = sum / dataArray.length;
         
         const isCurrentlySpeaking = avg > 15; // speaking threshold
         
         if (isCurrentlySpeaking !== speakingRef.current) {
            speakingRef.current = isCurrentlySpeaking;
            socket?.emit('voice_status', { 
               roomId, 
               userId, 
               isMuted: false, 
               isSpeaking: isCurrentlySpeaking 
            });
         }
      }, 100);
    } catch (e) {
      console.error("Audio Analysis failed", e);
    }
  };

  const joinVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      setIsConnected(true);
      setIsMuted(false);
      socket?.emit('voice_join', { roomId, userId });
      startLocalAudioAnalysis(stream);
      socket?.emit('voice_status', { roomId, userId, isMuted: false, isSpeaking: false });
    } catch (err) {
      console.error("Failed to access microphone:", err);
      alert("Microphone access is required to join Voice Chat. Please allow permission.");
    }
  };

  const leaveVoice = () => {
    socket?.emit('voice_leave', { roomId, userId });
    cleanupVoice();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        
        socket?.emit('voice_status', { 
          roomId, 
          userId, 
          isMuted: !audioTrack.enabled, 
          isSpeaking: false 
        });
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupVoice();
  }, [cleanupVoice]);

  return {
    isConnected,
    isMuted,
    voiceUsers,
    joinVoice,
    leaveVoice,
    toggleMute
  };
}
