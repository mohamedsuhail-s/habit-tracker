import React, { useRef } from 'react';
import type { ViewMode, HabitCategory } from '../types/habit';
import { 
  CalendarDays, 
  Grid3X3, 
  CalendarRange, 
  BarChart3, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Settings2,
  TrendingUp,
  Flame,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: HabitCategory | 'All';
  onCategoryChange: (cat: HabitCategory | 'All') => void;
  maxStreak: number;
  todayRate: number;
  onExport: () => void;
  onImport: (json: string) => void;
  onReset: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const CATEGORIES: (HabitCategory | 'All')[] = [
  'All',
  'Fitness',
  'Productivity',
  'Health',
  'Mindset',
  'Nutrition',
  'Creative',
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenAddModal,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  maxStreak,
  todayRate,
  onExport,
  onImport,
  onReset,
  isDark,
  onToggleTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const navTabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'daily', label: 'Daily Overview', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'weekly', label: 'Weekly Matrix', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'monthly', label: 'Monthly Heatmap', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'yearly', label: 'Yearly Trajectory', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'manage', label: 'Habits Manager', icon: <Settings2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200 dark:border-[#27272A] mb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Capital Overview Dashboard Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#818CF8] via-indigo-500 to-[#F472B6] flex items-center justify-center shadow-lg shadow-[#818CF8]/20 ring-2 ring-[#818CF8]/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  HabitFlow Overview
                </h1>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30 px-2 py-0.5 rounded-full">
                  EXECUTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">Capital Overview & Habit Performance Matrix</p>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Active Streak Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-mono">
              <Flame className="w-4 h-4 fill-amber-500 dark:fill-amber-400 animate-pulse" />
              <span className="text-xs font-bold">{maxStreak} Day Streak</span>
            </div>

            {/* Today Rate Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#818CF8]/10 border border-[#818CF8]/30 text-[#818CF8] font-mono">
              <span className="text-xs font-bold">{todayRate}% Liquidity Rate</span>
            </div>

            {/* Dark / Light Theme Enable-Disable Switch Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-[#212126] border border-slate-300 dark:border-[#27272A] text-slate-800 dark:text-slate-200 hover:border-[#818CF8] transition-all font-mono text-xs font-semibold"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Data Tools */}
            <div className="flex items-center bg-slate-100 dark:bg-[#18181C] border border-slate-200 dark:border-[#27272A] rounded-xl p-1">
              <button 
                onClick={onExport} 
                title="Export Backup (JSON)"
                className="p-1.5 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()} 
                title="Import Backup (JSON)"
                className="p-1.5 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />

              <button 
                onClick={() => {
                  if (confirm('Reset to initial demo habits and data?')) {
                    onReset();
                  }
                }} 
                title="Reset Demo Data"
                className="p-1.5 text-slate-500 dark:text-[#A1A1AA] hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-2 px-4 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-white font-medium text-sm rounded-xl shadow-lg shadow-[#818CF8]/25 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Habit</span>
            </button>
          </div>

        </div>

        {/* View Switcher Tabs & Search Filter */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-[#27272A]">
          
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {navTabs.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onViewChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#818CF8] text-white shadow-md shadow-[#818CF8]/30'
                      : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#212126]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {['daily', 'weekly', 'manage'].includes(currentView) && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full glass-input pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#818CF8] text-white'
                          : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#212126]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};
