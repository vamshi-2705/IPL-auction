import { useState } from 'react';

export const formatMoney = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val || 0}`;
};

const HistoryAvatar = ({ player }) => {
  const [error, setError] = useState(false);
  if (!player?.image_url || error) {
    return <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-300 font-extrabold text-lg">{player?.name ? player.name[0] : '?'}</div>;
  }
  return <img src={player.image_url} alt="avatar" onError={() => setError(true)} className="w-full h-full object-cover" />;
};

export default function AuctionRightPanel({ soldLog }) {
  return (
    <div className="flex w-full xl:w-80 flex-col border-l border-slate-800 bg-card overflow-y-auto p-5 h-full">
       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Auction History</h3>
       
       <div className="space-y-4">
         {soldLog.length === 0 && <p className="text-slate-500 text-sm text-center py-10 font-medium">No actions yet</p>}
         
         {soldLog.map((log, i) => (
           <div key={i} className={`p-4 rounded-xl border ${log.unsold ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
             <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 shadow-inner">
                 <HistoryAvatar player={log.playerDetails} />
               </div>
               <div>
                 <span className="block font-bold text-slate-200 text-sm leading-tight">{log.playerDetails?.name || 'Unknown Player'}</span>
                 <span className="text-[10px] text-slate-500 font-medium">{log.playerDetails?.role}</span>
               </div>
             </div>
             
             {log.unsold ? (
               <div className="mt-3 pt-3 border-t border-red-500/10 text-center">
                 <span className="text-xs font-bold text-red-500 uppercase tracking-widest">UNSOLD</span>
               </div>
             ) : (
               <div className="mt-3 pt-3 border-t border-emerald-500/10 flex justify-between items-center">
                 <span className="text-xs font-bold text-emerald-500">
                   SOLD TO: <span className="text-white ml-1">{log.soldTo?.split('_')[0]}</span>
                 </span>
                 <span className="text-sm font-black font-mono text-emerald-400">{formatMoney(log.price)}</span>
               </div>
             )}
           </div>
         ))}
       </div>
    </div>
  );
}
