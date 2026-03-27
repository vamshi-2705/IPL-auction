import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, PartyPopper } from 'lucide-react';

const TEAM_THEMES = {
  MI: { primary: '#004BA0', secondary: '#D1AB3E', text: '#FFFFFF' },
  CSK: { primary: '#FDB913', secondary: '#0081E9', text: '#2D2D2D' },
  RCB: { primary: '#2B2A29', secondary: '#D11D26', text: '#FFFFFF' },
  KKR: { primary: '#3A225D', secondary: '#B3A123', text: '#FFFFFF' },
  SRH: { primary: '#F7A721', secondary: '#000000', text: '#FFFFFF' },
  DC: { primary: '#00008B', secondary: '#FF0000', text: '#FFFFFF' },
  RR: { primary: '#EA1A85', secondary: '#004BA0', text: '#FFFFFF' },
  PBKS: { primary: '#ED1B24', secondary: '#D1D3D4', text: '#FFFFFF' },
  GT: { primary: '#1B2133', secondary: '#D1AB3E', text: '#FFFFFF' },
  LSG: { primary: '#0057E7', secondary: '#CB9933', text: '#FFFFFF' },
};

const getTheme = (teamName) => {
  const code = teamName?.toUpperCase() || '';
  return TEAM_THEMES[code] || { primary: '#8B5CF6', secondary: '#3B82F6', text: '#FFFFFF' };
};

const Confetti = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: '50vw', 
            y: '100vh', 
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0 
          }}
          animate={{ 
            x: `${Math.random() * 100}vw`, 
            y: `${Math.random() * -100}vh`,
            rotate: 360 * 2,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 2 + 1.5, 
            ease: "easeOut",
            delay: Math.random() * 0.2
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][i % 5],
            borderRadius: i % 2 === 0 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

const ClappingJersey = ({ theme }) => {
  return (
    <div className="relative w-64 h-80 flex flex-col items-center">
      {/* 3D-like Jersey Body */}
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        style={{ 
          width: '120px', 
          height: '160px', 
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary} 60%, ${theme.secondary} 100%)`,
          borderRadius: '10px 10px 20px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.3)',
          border: `2px solid ${theme.secondary}44`
        }}
        className="relative z-20 flex flex-col items-center pt-6"
      >
        <div className="w-full h-4 bg-white/10 mb-4 shadow-sm" />
        <Trophy className="w-12 h-12 text-white/40 drop-shadow-md" />
        <div className="absolute -top-4 w-12 h-6 bg-slate-900 rounded-full border-2 border-white/20" />
      </motion.div>

      {/* Arm Left */}
      <motion.div 
        animate={{ rotate: [-20, -50, -20], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
        style={{ 
          position: 'absolute',
          left: '20px',
          top: '40px',
          width: '25px',
          height: '100px',
          background: theme.primary,
          borderRadius: '20px',
          originX: '50%',
          originY: '10%',
          boxShadow: '-5px 10px 20px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
      />

      {/* Arm Right */}
      <motion.div 
        animate={{ rotate: [20, 50, 20], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
        style={{ 
          position: 'absolute',
          right: '20px',
          top: '40px',
          width: '25px',
          height: '100px',
          background: theme.primary,
          borderRadius: '20px',
          originX: '50%',
          originY: '10%',
          boxShadow: '5px 10px 20px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
      />
      
      {/* Sparkles */}
      <motion.div 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="absolute -top-10 text-amber-400"
      >
        <Star className="fill-current" />
      </motion.div>
    </div>
  );
};

export default function CelebrationOverlay({ data, onComplete }) {
  if (!data) return null;
  const theme = getTheme(data.teamName);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl"
      >
        <Confetti />
        
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="relative flex flex-col items-center"
        >
          <div className="absolute -top-24 flex gap-4">
             <PartyPopper className="w-12 h-12 text-yellow-400 animate-bounce" />
             <PartyPopper className="w-12 h-12 text-yellow-400 animate-bounce delay-150" />
          </div>

          <ClappingJersey theme={theme} />
          
          <div className="mt-8 text-center px-6">
            <motion.h2 
               animate={{ scale: [1, 1.1, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)] mb-4"
            >
               SQUAD ADDITION!
            </motion.h2>
            
            <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">{data.teamName} SECURED</p>
               <h3 className="text-4xl font-black text-white mb-2">{data.playerDetails?.name}</h3>
               <p className="text-3xl font-mono font-black text-emerald-400">₹{(data.price/10000000).toFixed(2)} CR</p>
            </div>
          </div>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-bold tracking-widest text-xs transition-all"
        >
          BACK TO ACTION
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
