import { useState, useEffect } from 'react';
import { Settings, Play, Users } from 'lucide-react';

export default function HostControls({ isHost, participants, settings, onUpdateSettings, onStart }) {
  const [localSettings, setLocalSettings] = useState(settings || {
    purse_money: 1200000000,
    bid_timer: 10,
    min_squad: 18,
    max_squad: 25,
    max_overseas: 8
  });

  useEffect(() => { if (settings) setLocalSettings(settings); }, [settings]);

  if (!isHost) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
         <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 animate-pulse">
           <Users className="w-10 h-10 text-primary" />
         </div>
         <h2 className="text-3xl font-extrabold text-slate-100 mb-2">Waiting for Host...</h2>
         <p className="text-slate-400">The auction will begin shortly. {participants.length}/10 managers joined.</p>
      </div>
    );
  }

  const handleSave = () => onUpdateSettings(localSettings);

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full pt-10">
       <div className="bg-card border-2 border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
          
          <h2 className="text-2xl font-black flex items-center gap-3 mb-8 text-slate-100 border-b border-slate-800 pb-4">
            <Settings className="text-primary w-6 h-6" /> Auction Settings
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Purse Money (₹)</label>
              <input type="number" value={localSettings.purse_money} onChange={e => setLocalSettings({...localSettings, purse_money: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-mono text-slate-100 focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bid Timer (s)</label>
              <input type="number" value={localSettings.bid_timer} onChange={e => setLocalSettings({...localSettings, bid_timer: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-mono text-slate-100 focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <button onClick={handleSave} className="flex-1 py-4 border border-slate-700 hover:bg-slate-800 font-bold rounded-xl transition-all">Save Config</button>
            <button onClick={onStart} disabled={participants.length === 0} className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all glow-box">
              <Play fill="currentColor" className="w-5 h-5" /> Start Auction
            </button>
          </div>
       </div>
    </div>
  );
}
