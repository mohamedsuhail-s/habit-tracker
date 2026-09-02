import React from 'react';
import type { Habit, CompletionMap } from '../types/habit';
import { calculateHabitStreak } from '../utils/streakUtils';
import { getTodayStr, formatReadableDate } from '../utils/dateUtils';
import { DynamicIcon, CATEGORY_COLORS } from './DynamicIcon';
import { Check, Flame, Target, Calendar, Sparkles, Edit3, Trash2, Trophy, TrendingUp, Zap, Activity } from 'lucide-react';

interface DailyViewProps {
  habits: Habit[];
  completions: CompletionMap;
  onToggleHabit: (id: string, dateStr?: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onOpenAddModal: () => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  habits,
  completions,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onOpenAddModal,
}) => {
  const todayStr = getTodayStr();
  const todayRecord = completions[todayStr] || {};

  const totalHabits = habits.length;
  const completedCount = habits.filter(h => !!todayRecord[h.id]).length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  const strokeWidth = 10;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Executive Financial Summary Banner */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#27272A] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#818CF8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-[#F472B6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-[#818CF8] font-mono font-semibold text-xs uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>{formatReadableDate(todayStr)}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completionPercentage === 100 ? "🎉 Peak Operational Liquidity Reached!" : "Executive Routine Overview"}
            </h2>
            <p className="text-slate-600 dark:text-[#A1A1AA] text-sm mt-1 max-w-md">
              {completedCount} of {totalHabits} daily protocols satisfied. {completionPercentage === 100 ? "Maximum efficiency across all target streams!" : "Monitor overall operational liquidity and daily execution metrics."}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-[#27272A]"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-[#818CF8] transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center font-mono">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{completionPercentage}%</span>
                <span className="text-[10px] text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">Yield</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Capital Dashboard Feature Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#27272A] flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#818CF8]/15 text-[#818CF8]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-slate-500 dark:text-[#A1A1AA] uppercase">Liquidity Stream</div>
            <div className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
              {completionPercentage > 75 ? "High Efficiency" : completionPercentage > 40 ? "Steady Stream" : "Initial Flow"}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#27272A] flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#F472B6]/15 text-[#F472B6]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-slate-500 dark:text-[#A1A1AA] uppercase">Active Nodes</div>
            <div className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
              {completedCount} Operational Protocols
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#27272A] flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-slate-500 dark:text-[#A1A1AA] uppercase">Trajectory Rate</div>
            <div className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
              +14% vs Prev Week
            </div>
          </div>
        </div>
      </div>

      {/* Habit Checklist Grid */}
      {habits.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-200 dark:border-[#27272A]">
          <div className="w-16 h-16 rounded-2xl bg-[#818CF8]/10 border border-[#818CF8]/20 text-[#818CF8] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Habits Found</h3>
          <p className="text-slate-500 dark:text-[#A1A1AA] text-sm mt-1 mb-6 max-w-md mx-auto">
            No routines matching your search filter. Create a habit protocol to start tracking your daily trajectory!
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#818CF8]/30 transition-all"
          >
            Create First Protocol
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => {
            const isCompleted = !!todayRecord[habit.id];
            const streak = calculateHabitStreak(habit.id, completions, habit.createdAt);
            const colorTheme = CATEGORY_COLORS[habit.color] || CATEGORY_COLORS.indigo;

            return (
              <div
                key={habit.id}
                className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative group ${
                  isCompleted 
                    ? 'bg-slate-100/90 dark:bg-[#18181C] border-emerald-500/40 ring-1 ring-emerald-500/20' 
                    : 'hover:border-[#818CF8]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  <div className="flex items-start space-x-4 flex-1">
                    
                    <button
                      onClick={() => onToggleHabit(habit.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 transform active:scale-90 mt-0.5 ${
                        isCompleted
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                          : 'bg-slate-200 dark:bg-[#212126] border border-slate-300 dark:border-[#27272A] hover:border-[#818CF8] text-transparent hover:text-slate-400'
                      }`}
                    >
                      <Check className={`w-5 h-5 stroke-[3] transition-transform ${isCompleted ? 'scale-100' : 'scale-50'}`} />
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`p-1.5 rounded-lg border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}>
                          <DynamicIcon name={habit.icon} className="w-4 h-4" />
                        </div>
                        <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border ${colorTheme.badge}`}>
                          {habit.category}
                        </span>
                      </div>

                      <h3 className={`text-base font-bold transition-colors ${isCompleted ? 'text-slate-400 dark:text-[#A1A1AA] line-through' : 'text-slate-900 dark:text-white'}`}>
                        {habit.name}
                      </h3>

                      {habit.description && (
                        <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-1 line-clamp-1">
                          {habit.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 mt-3 font-mono">
                        <div className="flex items-center space-x-1 text-xs text-amber-500 dark:text-amber-400">
                          <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold">{streak.currentStreak}d streak</span>
                        </div>

                        <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-[#A1A1AA]">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Best: {streak.longestStreak}d</span>
                        </div>

                        <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-[#A1A1AA]">
                          <Target className="w-3.5 h-3.5" />
                          <span>{habit.targetDaysPerWeek}x/wk</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={() => onEditHabit(habit)}
                      title="Edit Habit"
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      title="Delete Habit"
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                <div className="mt-4 w-full bg-slate-200 dark:bg-[#27272A] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-[#818CF8]'}`} 
                    style={{ width: `${streak.completionRate}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
