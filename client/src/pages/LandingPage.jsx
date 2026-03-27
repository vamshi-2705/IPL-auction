import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Globe2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20 items-center relative overflow-hidden">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.2 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px] pointer-events-none"></motion.div>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.2 }} transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[100px] pointer-events-none"></motion.div>

      <div className="z-10 text-center max-w-4xl px-4">
        <motion.span initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="inline-block px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10 text-primary text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          🎯 Auction Ready
        </motion.span>
        
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 glow-text tracking-tight">
          Play IPL Auction <br className="hidden md:block" /> With Friends
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience the thrill of the real IPL auction. Build your dream squad in real-time, strategically outbid your friends, and dominate the league.
        </motion.p>
        
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button 
            onClick={() => navigate('/join?action=create')}
            className="px-8 py-4 bg-primary hover:bg-primaryHover text-white font-bold rounded-xl transition-all transform hover:scale-105 glow-box shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            Create Room
          </button>
          <button 
            onClick={() => navigate('/join?action=join')}
            className="px-8 py-4 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
          >
            Join Room
          </button>
          <button 
            onClick={() => navigate('/rooms')}
            className="px-8 py-4 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
          >
            Browse Live Rooms
          </button>
        </motion.div>

        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left pb-20">
          <FeatureCard icon={<Users className="w-8 h-8 text-primary" />} title="300+ IPL Players" desc="Current and past stars drawn from our accurate database." />
          <FeatureCard icon={<Activity className="w-8 h-8 text-blue-400" />} title="Real-time Multiplayer" desc="Sub-second latency bidding battles powered by Socket.IO." />
          <FeatureCard icon={<Trophy className="w-8 h-8 text-yellow-400" />} title="Strategic Building" desc="Manage your 120Cr purse and build a balanced T20 squad." />
          <FeatureCard icon={<Globe2 className="w-8 h-8 text-emerald-400" />} title="Live Rooms" desc="Spectate or join ongoing auctions around the globe instantly." />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div whileHover={{ translateY: -5, boxShadow: "0 10px 30px -10px rgba(139,92,246,0.2)" }} className="bg-card/80 backdrop-blur border border-slate-800 p-6 rounded-2xl hover:border-primary/30 transition-colors shadow-lg">
      <div className="mb-4 p-3 bg-slate-800/80 inline-block rounded-xl border border-slate-700">{icon}</div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
