import React, { useState } from 'react';
import type { Habit, CompletionMap } from '../types/habit';
import { getWeekDays } from '../utils/dateUtils';
import { DynamicIcon, CATEGORY_COLORS } from './DynamicIcon';
import { ChevronLeft, ChevronRight, Check, X, Calendar, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyViewProps {
  habits: Habit[];
  completions: CompletionMap;
  onToggleHabit: (id: string, dateStr?: string) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  habits,
  completions,
  onToggleHabit,
}) => {
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());

  const weekDays = getWeekDays(referenceDate);

  const handlePrevWeek = () => {
    const prev = new Date(referenceDate);
    prev.setDate(prev.getDate() - 7);
    setReferenceDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(referenceDate);
    next.setDate(next.getDate() + 7);
    setReferenceDate(next);
  };

  const handleResetWeek = () => {
    setReferenceDate(new Date());
  };

  const dailyChartData = weekDays.map((day) => {
    const dayRecord = completions[day.dateStr] || {};
    const completedCount = habits.filter((h) => !!dayRecord[h.id]).length;
    return {
      dayName: day.dayName,
      dateNum: day.dayNumber,
      completed: completedCount,
      total: habits.length,
      isToday: day.isToday,
    };
  });

  const weekStartStr = weekDays[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekEndStr = weekDays[6].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      
      {/* Weekly Header Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#818CF8] font-mono font-semibold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Weekly Matrix Overview</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {weekStartStr} — {weekEndStr}
          </h2>
          <p className="text-slate-500 dark:text-[#A1A1AA] text-xs mt-0.5">
            Click any cell in the grid matrix to toggle habit execution for that date.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-[#18181C] border border-slate-200 dark:border-[#27272A] rounded-xl p-1.5 font-mono">
          <button
            onClick={handlePrevWeek}
            className="p-2 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
            title="Previous Week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleResetWeek}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
          >
            Current Week
          </button>

          <button
            onClick={handleNextWeek}
            className="p-2 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
            title="Next Week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekly Completion Bar Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-[#818CF8]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Structural Execution Stream</h3>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-[#A1A1AA]">Habits completed per day</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="dayName" 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181C', 
                  borderColor: '#27272A', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
                formatter={(value: any) => [`${value} / ${habits.length} habits`, 'Completed']}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {dailyChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isToday ? '#818CF8' : '#27272A'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Matrix Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-[#27272A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#27272A] bg-slate-100/60 dark:bg-[#18181C] font-mono text-xs font-semibold text-slate-500 dark:text-[#A1A1AA]">
                <th className="p-4 pl-6 min-w-[220px]">Routine Protocol</th>
                {weekDays.map((day) => (
                  <th
                    key={day.dateStr}
                    className={`p-3 text-center min-w-[70px] ${
                      day.isToday ? 'bg-[#818CF8]/10 text-[#818CF8] font-bold border-b-2 border-[#818CF8]' : ''
                    }`}
                  >
                    <div className="uppercase tracking-wider text-[10px]">{day.dayName}</div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{day.dayNumber}</div>
                  </th>
                ))}
                <th className="p-4 text-center min-w-[100px]">Weekly Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]/60 text-sm">
              {habits.map((habit) => {
                const colorTheme = CATEGORY_COLORS[habit.color] || CATEGORY_COLORS.indigo;
                
                let weekCompletions = 0;
                weekDays.forEach((day) => {
                  if (completions[day.dateStr]?.[habit.id]) {
                    weekCompletions++;
                  }
                });

                const targetDays = habit.targetDaysPerWeek || 7;
                const weekRate = Math.round((weekCompletions / targetDays) * 100);

                return (
                  <tr key={habit.id} className="hover:bg-slate-100/40 dark:hover:bg-[#212126] transition-colors">
                    
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}>
                          <DynamicIcon name={habit.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{habit.name}</div>
                          <div className="font-mono text-[11px] text-slate-500 dark:text-[#A1A1AA]">Target: {habit.targetDaysPerWeek}d / week</div>
                        </div>
                      </div>
                    </td>

                    {weekDays.map((day) => {
                      const isDone = !!completions[day.dateStr]?.[habit.id];

                      return (
                        <td key={day.dateStr} className="p-2 text-center">
                          <button
                            onClick={() => onToggleHabit(habit.id, day.dateStr)}
                            className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center transition-all duration-200 transform active:scale-90 ${
                              isDone
                                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 dark:text-emerald-400 shadow-sm'
                                : 'bg-slate-200/50 dark:bg-[#212126] border border-slate-300 dark:border-[#27272A] hover:border-slate-400 text-slate-400'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-5 h-5 stroke-[3]" />
                            ) : (
                              <X className="w-3.5 h-3.5 opacity-30" />
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="p-4 text-center font-mono">
                      <div className="flex flex-col items-center">
                        <span className={`text-xs font-extrabold ${weekRate >= 100 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {weekCompletions}/{targetDays} ({weekRate}%)
                        </span>
                        <div className="w-16 bg-slate-200 dark:bg-[#27272A] rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${weekRate >= 100 ? 'bg-emerald-500' : 'bg-[#818CF8]'}`}
                            style={{ width: `${Math.min(weekRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
