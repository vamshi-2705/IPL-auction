import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Globe, Calendar, Trophy, Star, Sparkles, ArrowLeft } from 'lucide-react';

const TEAMS = [
  { id: 'MI', name: 'Mumbai Indians', color: 'bg-blue-600 hover:shadow-[0_0_15px_blue]' },
  { id: 'CSK', name: 'Chennai Super Kings', color: 'bg-yellow-500 text-black hover:shadow-[0_0_15px_yellow]' },
  { id: 'RCB', name: 'Royal Challengers Bengaluru', color: 'bg-red-600 hover:shadow-[0_0_15px_red]' },
  { id: 'KKR', name: 'Kolkata Knight Riders', color: 'bg-purple-900 hover:shadow-[0_0_15px_purple]' },
  { id: 'DC', name: 'Delhi Capitals', color: 'bg-blue-800 hover:shadow-[0_0_15px_darkblue]' },
  { id: 'PBKS', name: 'Punjab Kings', color: 'bg-red-500 hover:shadow-[0_0_15px_red]' },
  { id: 'RR', name: 'Rajasthan Royals', color: 'bg-pink-500 hover:shadow-[0_0_15px_pink]' },
  { id: 'SRH', name: 'Sunrisers Hyderabad', color: 'bg-orange-500 hover:shadow-[0_0_15px_orange]' },
  { id: 'GT', name: 'Gujarat Titans', color: 'bg-teal-700 hover:shadow-[0_0_15px_teal]' },
  { id: 'LSG', name: 'Lucknow Super Giants', color: 'bg-cyan-700 hover:shadow-[0_0_15px_cyan]' }
];

const MODES = [
  { id: 'mock2026', title: 'IPL 2026 Mock Auction', desc: '350 players • 42 sets • Real retentions • Dec 2025', badge: 'Official List', icon: <Calendar className="w-5 h-5 text-amber-500" />, borderColor: 'border-amber-500/50' },
  { id: 'legendsUpgraded', title: 'Legends Upgraded', desc: '248 legends • 26 sets • Marquee to spinners', badge: 'NEW', icon: <Trophy className="w-5 h-5 text-yellow-400" />, borderColor: 'border-yellow-500/50' },
  { id: 'legends', title: 'IPL Legends Auction', desc: 'Top 100 batters & bowlers • IPL history 2008-2025', badge: '', icon: <Star className="w-5 h-5 text-purple-400" />, borderColor: 'border-purple-500/50' },
  { id: 'mega', title: 'Mega Auction', desc: 'All players in auction • ₹120 Cr purse • 230+ players', badge: '', icon: <Sparkles className="w-5 h-5 text-slate-300" />, borderColor: 'border-slate-500/50' }
];

export default function GameEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreate = searchParams.get('action') === 'create';
  const paramRoomId = searchParams.get('roomId') || '';
  
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState(paramRoomId);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [auctionMode, setAuctionMode] = useState('mock2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !selectedTeam || (!isCreate && !roomId)) {
      return setError('Please fill all fields');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isCreate ? '/api/create-room' : '/api/join-room';
      const payload = isCreate ? { username, team: selectedTeam, privacy, mode: auctionMode } : { roomId, username, team: selectedTeam };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enter game');
      
      localStorage.setItem('auction_user', JSON.stringify({
         username: data.username,
         userId: data.userId,
         team: data.team,
         isHost: data.isHost
      }));
      
      navigate(`/room/${data.roomId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden custom-scroll overflow-y-auto pt-16 pb-16">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 0.15 }} transition={{ duration: 1.5 }} className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] pointer-events-none"></motion.div>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 0.15 }} transition={{ duration: 1.5, delay: 0.3 }} className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[120px] pointer-events-none"></motion.div>
      
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 100 }} className={`w-full ${isCreate ? 'max-w-2xl' : 'max-w-md'} bg-[#121212]/90 backdrop-blur-3xl border border-slate-800/80 shadow-2xl rounded-3xl p-8 relative z-10 glow-box`}>
         
         <div className="flex items-center mb-8 border-b border-slate-800 pb-4">
            <button type="button" onClick={() => navigate('/')} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold text-sm transition-colors">
               <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="ml-auto flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)]">{selectedTeam || '?'}</div>
               <span className="font-bold text-slate-300 truncate max-w-[120px]">{username || 'Manager Name'}</span>
            </div>
         </div>
        
        {error && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 mb-6 bg-red-500/10 border border-red-500/50 text-red-400 font-bold rounded-xl text-sm">{error}</motion.div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {isCreate && (
             <div className="mb-10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
               <div className="flex gap-4">
                  <button type="button" onClick={() => setPrivacy('public')} className={`flex-1 flex flex-col p-4 rounded-xl border-2 transition-all ${privacy === 'public' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-slate-800 bg-[#1a1a1a]/50 text-slate-400 hover:border-slate-700'}`}>
                     <div className={`flex items-center gap-2 font-black mb-1 ${privacy === 'public' ? 'text-emerald-400' : 'text-slate-300'}`}><Globe className="w-4 h-4" /> Public</div>
                     <span className="text-xs font-semibold opacity-70">Anyone can find & join</span>
                  </button>
                  <button type="button" onClick={() => setPrivacy('private')} className={`flex-1 flex flex-col p-4 rounded-xl border-2 transition-all ${privacy === 'private' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-slate-800 bg-[#1a1a1a]/50 text-slate-400 hover:border-slate-700'}`}>
                     <div className={`flex items-center gap-2 font-black mb-1 ${privacy === 'private' ? 'text-primary' : 'text-slate-300'}`}><Lock className="w-4 h-4" /> Private</div>
                     <span className="text-xs font-semibold opacity-70">Only people you invite</span>
                  </button>
               </div>

               <div>
                 <label className="block text-sm font-black text-slate-300 mb-4 drop-shadow">Auction Mode</label>
                 <div className="flex flex-col gap-3">
                   {MODES.map(m => (
                      <button type="button" onClick={() => setAuctionMode(m.id)} key={m.id} className={`w-full text-left p-4 rounded-xl border border-b-2 transition-all flex items-center gap-5 ${auctionMode === m.id ? `${m.borderColor} bg-slate-800/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02] z-10` : 'border-slate-800 bg-[#1a1a1a]/40 text-slate-400 hover:border-slate-700'}`}>
                          <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner`}>{m.icon}</div>
                          <div>
                             <div className="flex items-center gap-3 mb-1.5">
                                <span className={`font-black text-sm ${auctionMode === m.id ? 'text-white' : 'text-slate-200'}`}>{m.title}</span>
                                {m.badge && <span className={`text-[10px] px-2 py-0.5 rounded font-black ${m.badge === 'NEW' ? 'bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)] text-amber-500 border border-amber-500/30' : 'bg-orange-500/20 text-orange-500 border border-orange-500/30'}`}>{m.badge}</span>}
                             </div>
                             <span className="text-xs font-semibold opacity-60">{m.desc}</span>
                          </div>
                      </button>
                   ))}
                 </div>
               </div>
             </div>
          )}

          {!isCreate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest drop-shadow">Room Code</label>
              <input 
                type="text" 
                value={roomId}
                onChange={e => setRoomId(e.target.value.toUpperCase())}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-5 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary uppercase font-mono transition-all font-bold"
                placeholder="Ex: A1B2C3"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest drop-shadow">Manager Name</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-5 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all font-bold"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest drop-shadow">Select Franchise</label>
            <div className="grid grid-cols-5 gap-3">
              {TEAMS.map(team => (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeam(team.id)}
                  className={`py-3.5 rounded-xl text-sm font-black border-2 transition-all shadow-inner ${
                    selectedTeam === team.id 
                      ? `${team.color} border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] text-white z-10` 
                      : 'bg-slate-800/80 border-slate-700/50 text-slate-400 opacity-80 hover:opacity-100'
                  }`}
                  title={team.name}
                >
                  {team.id}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-extrabold text-xl rounded-xl transition-all disabled:opacity-50 mt-8 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex justify-center items-center gap-3 border-t border-white/20"
          >
            {loading ? <span className="animate-pulse">Loading...</span> : (isCreate ? <><Globe className="w-5 h-5"/> Launch Auction Room</> : 'Enter Auction Room')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
