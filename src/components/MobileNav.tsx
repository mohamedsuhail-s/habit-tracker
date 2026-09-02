import React from 'react';
import type { ViewMode } from '../types/habit';
import { 
  CalendarDays, 
  Grid3X3, 
  CalendarRange, 
  BarChart3, 
  Settings2
} from 'lucide-react';

interface MobileNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onViewChange }) => {
  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'daily', label: 'Daily', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'weekly', label: 'Weekly', icon: <Grid3X3 className="w-5 h-5" /> },
    { id: 'monthly', label: 'Monthly', icon: <CalendarRange className="w-5 h-5" /> },
    { id: 'yearly', label: 'Yearly', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'manage', label: 'Manage', icon: <Settings2 className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-200 dark:border-[#27272A] px-2 py-2 pb-safe bg-slate-900/90 dark:bg-[#18181C]/95 backdrop-blur-lg shadow-2xl transition-colors duration-300">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 min-w-[56px] min-h-[48px] ${
                isActive
                  ? 'bg-[#818CF8] text-white shadow-md shadow-[#818CF8]/30 font-bold'
                  : 'text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-mono mt-1 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
