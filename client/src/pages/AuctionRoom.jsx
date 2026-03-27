import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuctionSocket } from '../hooks/useAuctionSocket';
import HostControls from '../components/HostControls';
import PlayerCard from '../components/PlayerCard';
import PlayerQueue from '../components/PlayerQueue';
import TeamsSidebar from '../components/TeamsSidebar';
import AuctionRightPanel from '../components/AuctionRightPanel';
import AuctionSummary from '../components/AuctionSummary';
import CelebrationOverlay from '../components/CelebrationOverlay';
import MobileNav from '../components/MobileNav';
import { ShieldAlert, PauseCircle, PlayCircle, StopCircle } from 'lucide-react';

export default function AuctionRoom() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [celebrationData, setCelebrationData] = useState(null);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    const rawUser = localStorage.getItem('auction_user');
    if (!rawUser) {
      navigate('/join?action=join&roomId=' + roomId);
      return;
    }
    const parsed = JSON.parse(rawUser);
    setUser(parsed);
  }, [roomId, navigate]);

  const {
    participants, settings, auctionStatus, currentPlayer, timer, soldLog, squads, queue,
    updateSettings, startAuction, placeBid, pauseAuction, resumeAuction, endAuction
  } = useAuctionSocket(roomId, user?.userId);

  const prevSoldLength = useRef(0);

  useEffect(() => {
    if (soldLog.length > prevSoldLength.current) {
        const item = soldLog[0];
        const speech = new SpeechSynthesisUtterance();
        speech.rate = 1.0;
        speech.pitch = 1.1;
        
        if (item.unsold) {
            speech.text = `${item.playerDetails?.name || 'Player'} is unsold.`;
        } else {
            const buyer = participants.find(p => p.user_id === item.soldTo);
            const teamName = buyer ? buyer.team : "a team";
            
            const formatRs = (val) => {
               if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Crore`;
               if (val >= 100000) return `${(val / 100000).toFixed(1)} Lakh`;
               return val.toString();
            };
            
            speech.text = `Sold! ${item.playerDetails?.name || 'Player'} sold to ${teamName} for ${formatRs(item.price)}.`;
            
            setCelebrationData({
               playerDetails: item.playerDetails,
               price: item.price,
               teamName: teamName,
               soldTo: item.soldTo
            });

            // Play synthetic applause/cheer
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const bufferSize = audioCtx.sampleRate * 2.5; 
              const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
              const data = buffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
              const filter = audioCtx.createBiquadFilter();
              filter.type = 'lowpass';
              filter.frequency.value = 800;
              const noiseSource = audioCtx.createBufferSource();
              noiseSource.buffer = buffer;
              const gainNode = audioCtx.createGain();
              gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.5);
              noiseSource.connect(filter);
              filter.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              noiseSource.start();
            } catch(e) {}
        }
        
        window.speechSynthesis.cancel(); // kill prev speech
        window.speechSynthesis.speak(speech);

        // Auto-clear celebration after 6 seconds
        setTimeout(() => setCelebrationData(null), 6000);

        prevSoldLength.current = soldLog.length;
    }
  }, [soldLog, participants]);

  const handleCloseRoom = () => {
    if (window.confirm("Are you sure you want to CLOSE this room for everyone?")) {
      closeRoom();
    }
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold text-xl animate-pulse">Loading Room Data...</div>;

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col pt-16">
      <nav className="fixed top-0 left-0 w-full h-16 bg-card border-b border-slate-800 flex items-center justify-between px-6 z-50">
         <div className="flex items-center gap-6">
           <span className="font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 cursor-pointer" onClick={()=>navigate('/')}>IPL AUCTION</span>
           <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">LIVE ROOM</span>
             <span className="text-slate-200 font-mono font-bold">{roomId}</span>
           </div>
         </div>
         <div className="flex items-center gap-4">
           {user.isHost && (
             <button onClick={handleCloseRoom} className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded font-black tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all">Close Room</button>
           )}
           {user.isHost && (
             <span className="flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full shadow-lg">
               <ShieldAlert className="w-4 h-4" /> HOST
             </span>
           )}
           <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center font-bold text-white shadow-lg border-2 border-slate-700/50 text-lg">
             {user.username.charAt(0).toUpperCase()}
           </div>
         </div>
      </nav>

      <div className="flex-1 flex w-full h-[calc(100vh-4rem)] relative overflow-hidden">
        {/* Teams Sidebar - Responsive Toggle */}
        <div className={`${activeTab === 'teams' ? 'flex w-full' : 'hidden'} lg:flex lg:w-[350px] h-full`}>
          <TeamsSidebar participants={participants} currentUser={user} squads={squads} onKick={kickUser} />
        </div>
        
        {/* Center Dashboard - Responsive Toggle */}
        <div className={`${activeTab === 'live' ? 'flex' : 'hidden lg:flex'} flex-1 p-4 md:p-8 relative flex flex-col justify-start items-center overflow-y-auto custom-scroll pb-32 lg:pb-8`}>
          {auctionStatus === 'waiting' && <HostControls isHost={user.isHost} participants={participants} settings={settings} onUpdateSettings={updateSettings} onStart={startAuction} />}
          
          {(auctionStatus === 'running' || auctionStatus === 'paused') && (
             <div className="w-full flex flex-col items-center relative">
               
               {auctionStatus === 'paused' && (
                 <div className="absolute inset-x-0 top-0 z-40 bg-background/80 backdrop-blur-sm h-full flex flex-col items-center justify-center rounded-3xl border border-amber-500/20 py-20">
                    <PauseCircle className="w-16 h-16 text-amber-500 mb-4 animate-pulse" />
                    <h2 className="text-3xl md:text-5xl font-black text-amber-500 tracking-widest drop-shadow-lg">AUCTION PAUSED</h2>
                    <p className="font-bold text-slate-300 mt-2 text-base md:text-lg">Waiting for Host to resume...</p>
                 </div>
               )}

               <PlayerCard player={currentPlayer} timer={timer} onBid={placeBid} currentUser={user} currentPurse={parseInt(participants.find(p=>p.user_id===user.userId)?.purse_balance || 0)} />
               
               <PlayerQueue queue={queue} />

               {user.isHost && (
                 <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 w-max flex justify-center items-center gap-4 md:gap-6 bg-slate-900/95 backdrop-blur-xl px-4 md:px-8 py-3.5 rounded-full border-2 border-primary/40 shadow-[0_10px_40px_rgba(139,92,246,0.3)] z-50 scale-90 md:scale-100">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest absolute -top-2.5 bg-slate-900 px-3 rounded-full border border-slate-700">Host Engine</span>
                    
                    {auctionStatus === 'running' ? (
                       <button onClick={pauseAuction} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-black tracking-wider transition-colors drop-shadow text-xs md:text-sm">
                          <PauseCircle className="w-4 h-4 md:w-5 md:h-5" /> PAUSE
                       </button>
                    ) : (
                       <button onClick={resumeAuction} className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-black tracking-wider transition-colors drop-shadow text-xs md:text-sm">
                          <PlayCircle className="w-4 h-4 md:w-5 md:h-5" /> RESUME
                       </button>
                    )}
                    
                    <div className="w-px h-6 bg-slate-700"></div>
                    
                    <button onClick={endAuction} className="flex items-center gap-2 text-red-500 hover:text-red-400 font-black tracking-wider transition-colors drop-shadow text-xs md:text-sm">
                       <StopCircle className="w-4 h-4 md:w-5 md:h-5" /> END
                    </button>
                 </div>
               )}
             </div>
          )}
          
          {auctionStatus === 'finished' && (
             <div className="absolute inset-0 z-[100] bg-background">
               <AuctionSummary squads={squads} participants={participants} currentUser={user} onReturn={() => navigate('/')} />
             </div>
          )}
        </div>

        {/* History Panel - Responsive Toggle */}
        <div className={`${activeTab === 'history' ? 'flex w-full' : 'hidden'} xl:flex xl:w-80 h-full`}>
          <AuctionRightPanel soldLog={soldLog} participants={participants} />
        </div>
      </div>
      
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <CelebrationOverlay data={celebrationData} onComplete={() => setCelebrationData(null)} />
    </div>
  );
}
