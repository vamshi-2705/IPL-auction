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

export default function PlayerCard({ player, timer, onBid, currentUser, currentPurse }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    // Generate ticking audio based on the timer dropping
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
  
  let increment = 500000;
  if (currentBid >= 10000000) increment = 2000000; 
  if (currentBid >= 20000000) increment = 5000000; 
  
  const nextBid = currentBid + (player.highest_bidder ? increment : 0);
  const canBid = currentPurse >= nextBid && player.highest_bidder !== currentUser.userId;

  return (
    <motion.div 
       key={player.id} 
       initial={{ scale: 0.9, opacity: 0, y: 20 }} 
       animate={{ scale: 1, opacity: 1, y: 0 }} 
       transition={{ type: "spring", stiffness: 300, damping: 25 }}
       className="w-full max-w-4xl flex flex-col md:flex-row bg-card/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative glow-box"
    >
       <div className={`absolute top-0 left-0 w-full h-1.5 z-20 ${timer <= 3 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-primary shadow-[0_0_10px_#8b5cf6]'} transition-all duration-1000`} style={{ width: `${(timer/10)*100}%` }}></div>
       
       <div className="w-full md:w-2/5 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></motion.div>
          
          <div className="absolute top-4 left-4 border border-slate-600 bg-slate-900/80 px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 backdrop-blur z-10 shadow-lg">
             {player.set_category || 'Draft'}
          </div>
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-32 h-32 md:w-56 md:h-56 rounded-full border-4 border-slate-600 bg-slate-800 overflow-hidden mb-6 md:mb-8 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center relative group">
             {player.image_url && !imgError ? (
               <img src={player.image_url} alt={player.name} onError={() => setImgError(true)} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
             ) : (
               <span className="text-5xl md:text-8xl text-slate-300 font-black drop-shadow-2xl">{player.name[0]}</span>
             )}
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl md:text-4xl font-black text-center text-white leading-tight mb-4 z-10 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{player.name}</motion.h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-2 text-[10px] md:text-sm font-bold text-slate-400 z-10">
            <span className="bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg shadow-inner">{player.role}</span>
            <span className="bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg shadow-inner">{player.country}</span>
          </motion.div>
       </div>

       <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-between relative bg-card/60">
          <div className={`absolute -right-4 top-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-black opacity-[0.02] leading-none pointer-events-none transition-all ${timer <= 3 ? 'text-red-500 opacity-10 scale-110 blur-sm animate-pulse' : 'text-slate-100'}`}>
            {timer}
          </div>

          <div className="z-10 relative">
             <div className="mb-6 md:mb-10 text-center md:text-left">
               <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Current Bid</span>
               <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4">
                 <AnimatePresence mode="popLayout">
                    <motion.span 
                       key={currentBid}
                       initial={{ opacity: 0, y: -20, scale: 0.8 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      {formatMoney(currentBid)}
                    </motion.span>
                 </AnimatePresence>

                 {player.highest_bidder && (
                   <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col bg-primary/20 border-2 border-primary/40 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:ml-auto text-center md:text-right shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                     <span className="text-[8px] md:text-[10px] w-full text-center md:text-right uppercase font-black text-primary/80 mb-[-2px] tracking-widest">Highest Bidder</span>
                     <span className="text-white font-black text-sm md:text-xl tracking-tight">{player.highest_bidder.split('_')[0]}</span>
                   </motion.div>
                 )}
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                <div className="bg-slate-900/60 border border-slate-700/50 p-3 md:p-5 rounded-2xl shadow-inner border-t-slate-700">
                   <span className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Base Price</span>
                   <span className="text-lg md:text-2xl font-bold font-mono text-slate-300 drop-shadow">{formatMoney(player.base_price)}</span>
                </div>
                <div className={`border p-3 md:p-5 rounded-2xl flex flex-col justify-center items-center backdrop-blur-md transition-all shadow-inner border-t-slate-700 ${timer <= 3 ? 'bg-red-500/10 border-red-500/30 glow-box' : 'bg-amber-500/10 border-amber-500/20'}`}>
                   <div className={`flex items-center gap-1 md:gap-2 mb-1 font-extrabold uppercase text-[10px] md:text-xs tracking-widest ${timer <= 3 ? 'text-red-400' : 'text-amber-500'}`}>
                     <Clock className="w-3 h-3 md:w-4 md:h-4" /> Clock
                   </div>
                   <motion.span key={timer} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-3xl md:text-5xl font-black font-mono leading-none ${timer <= 3 ? 'text-red-500 drop-shadow-[0_0_10px_red]' : 'text-amber-400'}`}>{timer}s</motion.span>
                </div>
             </div>
          </div>

          <div className="z-10 mt-6 md:mt-8 relative">
             <motion.button
                whileHover={canBid ? { scale: 1.02 } : {}}
                whileTap={canBid ? { scale: 0.96 } : {}}
                onClick={() => onBid(nextBid)}
                disabled={!canBid}
                className={`w-full py-4 md:py-6 text-white font-black text-xl md:text-3xl tracking-tighter rounded-2xl shadow-2xl transition-all flex justify-center items-center gap-2 md:gap-4 ${canBid ? 'bg-gradient-to-r from-primary to-blue-600 shadow-[0_0_30px_rgba(139,92,246,0.6)] border-t border-white/20' : 'bg-slate-800 border-2 border-slate-700 opacity-50 cursor-not-allowed'}`}
             >
                <Gavel className="w-5 h-5 md:w-8 md:h-8" /> 
                {player.highest_bidder === currentUser.userId ? 'Holding Highest' : `BID ${formatMoney(nextBid)}`}
             </motion.button>
             {!canBid && player.highest_bidder !== currentUser.userId && (
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 drop-shadow-[0_0_10px_red] tracking-widest bg-red-500/10 border border-red-500/30 py-2 rounded-xl w-full text-[10px] font-black mt-3 md:mt-4 uppercase">Insufficient Purse</motion.p>
             )}
          </div>
       </div>
    </motion.div>
  );
}
