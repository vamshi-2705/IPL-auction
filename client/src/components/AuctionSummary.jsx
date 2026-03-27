import { ShieldAlert, Trophy, Users, Wallet, Download, Loader2 } from 'lucide-react';
import { formatMoney } from './PlayerCard';
import { useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';

export default function AuctionSummary({ squads, participants, currentUser, onReturn }) {
  const summaryRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sort teams by most spent (or highest purse)
  const sortedTeams = [...participants].sort((a, b) => parseInt(a.purse_balance) - parseInt(b.purse_balance));

  const handleDownload = async () => {
    if (!summaryRef.current) return;
    
    setIsDownloading(true);
    console.log("Starting download process v2.2...");
    
    try {
      // High-compatibility blob generation
      const blob = await toBlob(summaryRef.current, {
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'none',
          padding: '20px'
        }
      });
      
      const safeUsername = (currentUser.username || 'user').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `IPL_Squad_${safeUsername}_${Date.now()}.png`;
      
      console.log(`Blob generated: ${blob.size} bytes. saving as ${fileName}`);
      saveAs(blob, fileName);
      
    } catch (err) {
      console.error("Download failed details:", err);
      // Only alert on ACTUAL error
      alert("DOWNLOAD ERROR: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col items-center overflow-y-auto custom-scroll">
      <div ref={summaryRef} className="w-full flex flex-col items-center p-4">
        <div className="text-center mb-10 mt-6 relative w-full max-w-4xl">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
           <h2 className="text-3xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-600 drop-shadow-lg relative z-10 flex justify-center items-center gap-3 md:gap-4">
              <Trophy className="w-8 h-8 md:w-12 md:h-12 text-amber-400" />
              POST-AUCTION REPORT <span className="text-xs text-amber-500/50 align-top">v2.2</span>
           </h2>
           <p className="text-slate-400 text-sm md:text-lg font-medium">Final squad distributions and purses</p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 pb-20">
           {sortedTeams.map(team => {
              const teamPlayers = squads.filter(s => s.user_id === team.user_id);
              const isMe = team.user_id === currentUser.userId;
              
              return (
                <div key={team.user_id} className={`bg-card/80 backdrop-blur-xl border ${isMe ? 'border-primary/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] shadow-primary/20' : 'border-slate-800'} rounded-3xl overflow-hidden flex flex-col`}>
                  <div className={`p-5 border-b ${isMe ? 'bg-primary/10 border-primary/30' : 'bg-slate-900/50 border-slate-800'} flex justify-between items-center`}>
                     <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          {team.team}
                          {isMe && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">You</span>}
                        </h3>
                        <p className="text-sm font-bold text-slate-400">{team.username}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Purse Remaining</p>
                        <p className="text-lg font-mono font-black text-emerald-400">{formatMoney(parseInt(team.purse_balance))}</p>
                     </div>
                  </div>

                  <div className="p-5 flex-1 bg-slate-900/20">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1"><Users className="w-3 h-3" /> Squad ({teamPlayers.length})</span>
                     </div>
                     
                     {teamPlayers.length === 0 ? (
                       <div className="text-center py-8 text-slate-600 font-bold text-sm">No players purchased.</div>
                     ) : (
                       <div className="space-y-2">
                         {teamPlayers.map((p, i) => (
                           <div key={i} className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                              <div>
                                 <p className="text-sm font-bold text-slate-200">{p.name}</p>
                                 <span className="text-[10px] text-slate-500 font-semibold">{p.role} • {p.country}</span>
                              </div>
                              <span className="text-xs font-mono font-black text-emerald-500/90 bg-emerald-500/10 px-2 py-1 rounded bg-opacity-20">{formatMoney(p.bought_price)}</span>
                           </div>
                         ))}
                       </div>
                     )}
                  </div>
                </div>
              );
           })}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-background to-transparent flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 z-50 transition-all">
        <button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="w-full md:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black tracking-widest rounded-full shadow-2xl transition-all border-4 border-amber-500 flex items-center justify-center gap-3 active:scale-95"
        >
           {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
           {isDownloading ? 'GENERATING...' : 'DOWNLOAD SQUAD'}
        </button>
        <button onClick={onReturn} className="w-full md:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black tracking-widest rounded-full shadow-2xl transition-all border border-slate-600 flex items-center justify-center gap-3">
           <ShieldAlert className="w-5 h-5" /> LOBBY
        </button>
      </div>
    </div>
  );
}
