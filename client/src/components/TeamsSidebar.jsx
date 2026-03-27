import { Users, Globe, UserMinus } from 'lucide-react';

const getRoleBadge = (role) => {
   if (role === 'Wicket Keeper') return 'WK';
   if (role === 'Batsman') return 'BAT';
   if (role === 'Bowler') return 'BOWL';
   if (role === 'All-rounder') return 'AR';
   return 'UKN';
};

export default function TeamsSidebar({ participants, currentUser, squads = [], onKick }) {
  return (
    <div className="flex w-full lg:w-[350px] flex-col border-r border-slate-800 bg-card overflow-y-auto overflow-x-hidden p-5 custom-scroll h-full">
       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-between sticky top-0 bg-card z-10 py-2">
         <span>Managers Hierarchy</span>
         <span className="bg-slate-800 px-2 py-1 rounded text-white">{participants.length}/10</span>
       </h3>
       
       <div className="space-y-4">
         {participants.map(p => {
           const teamSquad = squads.filter(s => s.user_id === p.user_id);
           const overseasCount = teamSquad.filter(player => player.country !== 'India' && player.country).length;
           
           return (
           <div key={p.user_id} className={`p-5 rounded-2xl border transition-all ${p.user_id === currentUser.userId ? 'bg-primary/5 border-primary/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'bg-slate-900/50 border-slate-800'}`}>
             <div className="flex justify-between items-start mb-3">
               <div>
                 <span className="font-bold text-slate-200 block text-lg leading-tight mb-1 truncate max-w-[150px]">{p.username}</span>
                 <div className="flex flex-wrap gap-1 items-center">
                    {p.user_id === currentUser.userId && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider mr-1">YOU</span>}
                    {p.is_host && <span className="text-[10px] bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">HOST</span>}
                 </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <span className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-bold ml-2">{p.team}</span>
                 {currentUser.isHost && !p.is_host && (
                    <button 
                      onClick={() => onKick && onKick(p.user_id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title={`Kick ${p.username}`}
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                 )}
               </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Purse</span>
                <span className="text-sm font-mono text-emerald-400 font-black tracking-tighter">
                  ₹{(parseInt(p.purse_balance)/10000000).toFixed(2)} Cr
                </span>
             </div>

             {teamSquad.length > 0 && (
               <div className="mt-4 pt-4 border-t border-slate-800/50">
                 <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <Users className="w-3 h-3" /> Squad Insight
                   </div>
                   <div className="flex gap-2">
                     <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 ${overseasCount >= 6 ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        <Globe className="w-3 h-3" /> {overseasCount}/6
                     </span>
                     <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded outline outline-1 outline-slate-700">{teamSquad.length}</span>
                   </div>
                 </div>
                 <ul className="space-y-2 max-h-[200px] overflow-y-auto custom-scroll pr-1">
                   {teamSquad.map((player, idx) => {
                     const isOverseas = player.country !== 'India' && player.country;
                     return (
                       <li key={idx} className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 hover:bg-slate-800 transition-colors">
                         <div className="flex flex-col max-w-[140px]">
                            <span className="text-[13px] text-slate-200 font-bold truncate pr-2 flex items-center gap-1.5" title={player.name}>
                              {player.name}
                              {isOverseas && <Globe className="w-3 h-3 text-cyan-500/80 inline" />}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">{getRoleBadge(player.role)}</span>
                         </div>
                         <span className="text-[11px] text-emerald-400/90 font-mono font-black border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded shadow-inner">
                           {(parseInt(player.bought_price)/10000000).toFixed(1)}Cr
                         </span>
                       </li>
                     );
                   })}
                 </ul>
               </div>
             )}
           </div>
           );
         })}
       </div>
    </div>
  );
}
