import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
       return;
    }

    const handler = e => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = evt => {
    evt.preventDefault();
    if (!promptInstall) return;
    
    promptInstall.prompt();
    promptInstall.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        setSupportsPWA(false);
        setIsDismissed(true);
      }
    });
  };

  if (!supportsPWA || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] sm:w-auto min-w-[320px] bg-slate-900 border border-primary/50 shadow-[0_10px_40px_rgba(139,92,246,0.3)] rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
             <Download className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide">Install Auction App</h4>
            <p className="text-slate-400 text-xs mt-0.5">Quick access & offline sync</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-6">
           <button 
             onClick={() => setIsDismissed(true)} 
             className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
           <button 
             onClick={onClick} 
             className="bg-primary hover:bg-primaryHover text-white px-4 py-2.5 text-sm font-bold rounded-lg shadow-lg flex items-center shadow-[0_0_15px_rgba(139,92,246,0.4)]"
           >
             Install
           </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
