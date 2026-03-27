import { motion, AnimatePresence } from 'framer-motion';
import { formatMoney } from './PlayerCard';
import { useState } from 'react';

const QueueAvatar = ({ player }) => {
  const [error, setError] = useState(false);
  if (!player?.image_url || error) {
    return <div className="w-full h-full flex items-center justify-center font-black text-xl text-slate-500 bg-slate-800">{player?.name ? player.name[0] : '?'}</div>;
  }
  return <img src={player.image_url} alt="img" onError={() => setError(true)} className="w-full h-full object-cover" />;
};

export default function PlayerQueue({ queue }) {
  if (!queue || queue.length === 0) return null;
  
  return (
    <div className="w-full max-w-4xl mt-12 mb-10 pb-4">
      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-between">
         <span>Upcoming in Queue</span>
         <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-lg text-xs font-black shadow-[0_0_15px_rgba(139,92,246,0.2)]">Next {queue.length}</span>
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-6 custom-scroll">
        <AnimatePresence>
          {queue.map((p, idx) => (
            <motion.div 
               layout
               initial={{ opacity: 0, x: 50, scale: 0.9 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               key={p.name + idx} 
               className="min-w-[240px] flex-shrink-0 bg-slate-900/60 backdrop-blur-md border hover:border-slate-500/80 border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
               <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 absolute top-2 right-2 bg-slate-800/80 backdrop-blur border border-slate-700 px-2 py-0.5 rounded shadow">{p.set_category}</div>
               <div className="w-14 h-14 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden border-2 border-slate-600 shadow-inner mt-2">
                  <QueueAvatar player={p} />
               </div>
               <div className="mt-2">
                 <h4 className="text-sm font-extrabold text-slate-200 truncate w-[130px] drop-shadow-sm">{p.name}</h4>
                 <div className="text-xs font-bold text-slate-500">{p.role}</div>
                 <div className="text-sm font-mono font-black text-emerald-500/90 mt-1 drop-shadow-sm">{formatMoney(p.base_price)}</div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
