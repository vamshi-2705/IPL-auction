import { Gavel, Users, History } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'live', label: 'Live', icon: Gavel },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-[60] px-6 py-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center max-w-md mx-auto relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-1 group"
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-primary scale-110 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
