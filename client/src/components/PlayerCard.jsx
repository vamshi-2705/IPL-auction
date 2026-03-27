import { useEffect, useState } from 'react';
import { Gavel, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const formatMoney = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val || 0}`;
};

const playTickSound = (isUrgent) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = isUrgent ? 'square' : 'triangle';
    oscillator.frequency.setValueAtTime(isUrgent ? 800 : 400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(isUrgent ? 400 : 200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(isUrgent ? 0.3 : 0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch(e) {
     // Fails silently if browser blocks AudioContext prior to interaction
  }
};

export default function PlayerCard({ player, timer, onBid, currentUser, currentPurse, onWithdraw, onVoteSkip, skipVotes }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    if (timer > 0 && timer <= 20) {
      playTickSound(timer <= 3);
    }
  }, [timer, player?.id]);

  if (!player) return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-slate-400 font-bold text-xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 drop-shadow-[0_0_10px_#8b5cf6]"></div>
        Processing Next Player in Queue...
     </motion.div>
  );

  const currentBid = parseInt(player.current_bid) || parseInt(player.base_price);
  const isLeading = player.highest_bidder === currentUser.userId;

  const increments = [2500000, 5000000, 10000000]; // 25L, 50L, 1Cr
  
  return (
    <motion.div 
       key={player.id} 
       initial={{ scale: 0.9, opacity: 0, y: 20 }} 
       animate={{ scale: 1, opacity: 1, y: 0 }} 
       className="w-full max-w-4xl flex flex-col bg-card/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative"
    >
       <div className={`absolute top-0 left-0 w-full h-1.5 z-20 ${timer <= 3 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-primary shadow-[0_0_10px_#8b5cf6]'} transition-all duration-1000`} style={{ width: `${(timer / 15) * 100}%` }}></div>
       
       <div className="flex flex-col md:flex-row border-b border-slate-800">
          <div className="w-full md:w-2/5 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 relative">
             <div className="absolute top-4 left-4 border border-slate-600 bg-slate-900/80 px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 backdrop-blur z-10">
                {player.set_category || 'Draft'}
             </div>
             <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-slate-600 bg-slate-800 overflow-hidden mb-4 shadow-2xl flex items-center justify-center relative">
                {player.image_url && !imgError ? (
                  <img src={player.image_url} alt={player.name} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl md:text-8xl text-slate-300 font-black">{player.name[0]}</span>
                )}
             </div>
             <h2 className="text-2xl md:text-4xl font-black text-center text-white leading-tight mb-2 uppercase tracking-tight">{player.name}</h2>
             <div className="flex gap-2 text-[10px] md:text-sm font-bold text-slate-400">
               <span className="bg-slate-900/80 border border-slate-700 px-3 py-1 rounded-lg">{player.role}</span>
               <span className="bg-slate-900/80 border border-slate-700 px-3 py-1 rounded-lg">{player.country}</span>
             </div>
          </div>

          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center items-center text-center relative bg-card/60">
             <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Current Bid</span>
             <motion.span key={currentBid} className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tighter mb-4">
                {formatMoney(currentBid)}
             </motion.span>
             
             {player.highest_bidder ? (
               <div className="bg-primary/20 border border-primary/40 px-6 py-2 rounded-full text-primary font-black animate-pulse uppercase tracking-widest text-xs">
                 {isLeading ? "YOU are leading" : `${player.highest_bidder.split('_')[0]} is leading`}
               </div>
             ) : (
               <div className="text-slate-500 font-bold uppercase tracking-widest text-xs py-2">Waiting for first bid...</div>
             )}

             <div className="text-4xl md:text-6xl font-black font-mono mt-8 mb-4 text-slate-200">
                {timer}
             </div>
             <div className={`w-32 h-1 rounded-full ${timer <= 3 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
          </div>
       </div>

       {/* Bid Control Panel */}
       <div className="p-4 bg-slate-900/80 backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {increments.map((inc, i) => {
             const nextPrice = currentBid + inc;
             const label = inc >= 10000000 ? `+₹1Cr` : inc >= 100000 ? `+₹${inc/100000}L` : `+₹${inc}`;
             return (
                <button 
                  key={i}
                  disabled={isLeading || currentPurse < nextPrice}
                  onClick={() => onBid(nextPrice)}
                  className={`py-4 rounded-xl font-black text-lg md:text-xl transition-all border-b-4 ${isLeading || currentPurse < nextPrice ? 'bg-slate-800 border-slate-950 opacity-40 grayscale pointer-events-none' : 'bg-amber-500 border-amber-700 text-slate-950 active:translate-y-1 active:border-b-0 hover:bg-amber-400'}`}
                >
                  {label}
                </button>
             );
          })}
          
          <div className="flex flex-col gap-2">
             <button 
               onClick={onWithdraw}
               disabled={!isLeading}
               className={`py-2 px-4 rounded-xl font-bold text-sm transition-all border-b-2 ${isLeading ? 'bg-red-500 border-red-800 text-white hover:bg-red-400' : 'hidden'}`}
             >
                WITHDRAW
             </button>
             
             <button 
               onClick={onVoteSkip}
               className={`py-2 px-4 rounded-xl font-bold text-sm transition-all border-b-2 bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600`}
             >
                SKIP ({skipVotes?.current || 0}/{skipVotes?.total || 1})
             </button>
          </div>
       </div>
    </motion.div>
  );
}
