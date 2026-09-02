import React from 'react';
import type { Habit, CompletionMap } from '../types/habit';
import { calculateHabitStreak } from '../utils/streakUtils';
import { DynamicIcon, CATEGORY_COLORS } from './DynamicIcon';
import { Edit3, Trash2, Plus, Settings2, Target, Flame, Trophy } from 'lucide-react';

interface ManageViewProps {
  habits: Habit[];
  completions: CompletionMap;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onOpenAddModal: () => void;
}

export const ManageView: React.FC<ManageViewProps> = ({
  habits,
  completions,
  onEditHabit,
  onDeleteHabit,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#818CF8] font-mono font-semibold text-xs uppercase tracking-wider mb-1">
            <Settings2 className="w-4 h-4" />
            <span>Habits Manager</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Enterprise Protocols
          </h2>
          <p className="text-slate-500 dark:text-[#A1A1AA] text-xs mt-0.5">
            Configure routine streams, target liquidity frequencies, categories, and visual indicators.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#818CF8]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Protocol</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => {
          const streak = calculateHabitStreak(habit.id, completions, habit.createdAt);
          const colorTheme = CATEGORY_COLORS[habit.color] || CATEGORY_COLORS.indigo;

          return (
            <div
              key={habit.id}
              className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-[#27272A] hover:border-[#818CF8]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-xl border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}>
                      <DynamicIcon name={habit.icon} className="w-5 h-5" />
                    </div>
                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border ${colorTheme.badge}`}>
                      {habit.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditHabit(habit)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{habit.name}</h3>
                {habit.description && (
                  <p className="text-xs text-slate-500 dark:text-[#A1A1AA] line-clamp-2 mb-4">{habit.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-[#27272A]/60 mt-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-[#A1A1AA]">
                  <span className="flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Target Frequency</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{habit.targetDaysPerWeek} days / week</span>
                </div>

                <div className="flex items-center justify-between text-slate-500 dark:text-[#A1A1AA]">
                  <span className="flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Current Streak</span>
                  </span>
                  <span className="font-bold text-amber-500 dark:text-amber-400">{streak.currentStreak} days</span>
                </div>

                <div className="flex items-center justify-between text-slate-500 dark:text-[#A1A1AA]">
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Longest Streak</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{streak.longestStreak} days</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
