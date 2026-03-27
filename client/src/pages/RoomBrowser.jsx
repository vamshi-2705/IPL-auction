import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomBrowser() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => navigate('/')} className="p-4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors text-slate-300 shadow-lg">
              <ArrowLeft className="w-6 h-6"/>
            </button>
            <div>
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 mb-2 tracking-tight">Live Public Rooms</h1>
              <p className="text-slate-400 font-medium text-lg">Join ongoing public auctions or spectate the bidding wars.</p>
            </div>
          </div>
          
          <button type="button" onClick={() => navigate('/join?action=join')} className="flex items-center gap-3 px-8 py-4 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-2xl text-slate-200 font-black hover:bg-slate-800 hover:border-slate-500 transition-all shadow-2xl hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Key className="w-5 h-5 text-primary" /> Got a Private Code?
          </button>
        </div>

        {loading ? (
           <div className="text-center py-32 animate-pulse text-2xl font-bold text-slate-600">Scanning global servers for live rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {rooms.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/20 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-slate-500 mb-6 font-medium">No public rooms are currently active.</p>
                  <button type="button" onClick={() => navigate('/join?action=create')} className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-white font-black text-xl rounded-2xl transition-all hover:scale-105">Create the First Room</button>
                </motion.div>
              ) : (
                rooms.map((room) => (
                  <motion.div 
                     layout
                     initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                     animate={{ opacity: 1, scale: 1, y: 0 }} 
                     exit={{ opacity: 0, scale: 0.9 }}
                     key={room.id} 
                     className="bg-card/70 backdrop-blur-2xl border border-slate-700/60 p-8 rounded-3xl hover:border-emerald-500/50 transition-all glow-box shadow-2xl group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2 drop-shadow">Room Code</span>
                        <h3 className="text-4xl font-mono font-black text-slate-100 group-hover:text-emerald-400 transition-colors drop-shadow-sm">{room.id}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2.5">
                         <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-inner">Public</span>
                         <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner max-w-[100px] text-right truncate">
                            {room.mode === 'mock2026' ? 'IPL 2026' : room.mode === 'legendsUpgraded' ? 'LEGENDS UP.' : room.mode === 'legends' ? 'LEGENDS' : 'MEGA AUCTION'}
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-10 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shadow-inner">
                      <Users className="w-6 h-6 text-slate-400" />
                      <span className="font-bold text-slate-400 text-lg"><span className="text-white text-xl">{room.participants_count}</span> / 10 Managers</span>
                    </div>

                    <div className="mt-auto">
                      <button 
                        type="button"
                        onClick={() => navigate(`/join?action=join&roomId=${room.id}`)}
                        className="w-full py-5 bg-slate-800/80 border-2 border-transparent group-hover:border-emerald-500/50 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white font-black text-lg rounded-2xl transition-all shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex justify-center items-center gap-2"
                      >
                        Enter Auction
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Background elements */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>
    </div>
  );
}
