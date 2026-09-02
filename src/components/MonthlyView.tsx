import React, { useState } from 'react';
import type { Habit, CompletionMap } from '../types/habit';
import { getMonthCalendarGrid, getMonthName, getPastNDays } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyViewProps {
  habits: Habit[];
  completions: CompletionMap;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({
  habits,
  completions,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarGrid = getMonthCalendarGrid(currentYear, currentMonth);

  const totalActiveHabits = habits.length;
  let totalPossibleCompletions = 0;
  let actualCompletions = 0;

  calendarGrid.forEach(cell => {
    if (cell.inCurrentMonth) {
      totalPossibleCompletions += totalActiveHabits;
      const dayRecord = completions[cell.dateStr] || {};
      const completedCount = Object.keys(dayRecord).length;
      actualCompletions += completedCount;
    }
  });

  const monthlyConsistency = totalPossibleCompletions > 0 
    ? Math.round((actualCompletions / totalPossibleCompletions) * 100) 
    : 0;

  const past30DaysKeys = getPastNDays(30);
  const lineChartData = past30DaysKeys.map(dateStr => {
    const dayRecord = completions[dateStr] || {};
    const count = habits.filter(h => !!dayRecord[h.id]).length;
    const percentage = totalActiveHabits > 0 ? Math.round((count / totalActiveHabits) * 100) : 0;
    
    const [, m, d] = dateStr.split('-');
    const label = `${m}/${d}`;

    return {
      dateStr,
      label,
      percentage,
      count,
    };
  });

  const getCellIntensity = (percentage: number) => {
    if (percentage === 0) return 'bg-slate-100 dark:bg-[#18181C] border-slate-200 dark:border-[#27272A] text-slate-400';
    if (percentage <= 33) return 'bg-[#818CF8]/15 border-[#818CF8]/30 text-[#818CF8] font-mono';
    if (percentage <= 66) return 'bg-[#818CF8]/40 border-[#818CF8]/60 text-white font-mono shadow-sm';
    return 'bg-[#818CF8] border-[#818CF8] text-white font-mono font-bold shadow-md shadow-[#818CF8]/20';
  };

  return (
    <div className="space-y-8">

      {/* Monthly Navigation Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#818CF8] font-mono font-semibold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Monthly Liquidity Heatmap</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <p className="text-slate-500 dark:text-[#A1A1AA] text-xs mt-0.5">
            Visualize your daily habit completion intensity and global aggregated metrics.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 rounded-xl bg-[#818CF8]/10 border border-[#818CF8]/30 flex items-center space-x-2 text-[#818CF8] font-mono">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">{monthlyConsistency}% Global Consistency</span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#18181C] border border-slate-200 dark:border-[#27272A] rounded-xl p-1.5 font-mono">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 30-Day Line Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#818CF8]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Operational Trajectory (30 Days)</h3>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-[#A1A1AA]">Yield Rate Percentage</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="label" 
                stroke="#A1A1AA" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#A1A1AA" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
                unit="%"
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
                formatter={(value: any) => [`${value}% (${lineChartData.find(d=>d.percentage===value)?.count || 0} habits)`, 'Completion Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#818CF8" 
                strokeWidth={3} 
                dot={{ fill: '#818CF8', r: 3 }} 
                activeDot={{ r: 6, stroke: '#F472B6', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar Heatmap Grid */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A]">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-[#27272A]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#818CF8]" />
            <span>Operational Density Matrix</span>
          </h3>

          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#A1A1AA] font-mono">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-slate-200 dark:bg-[#18181C] border border-slate-300 dark:border-[#27272A]" />
            <div className="w-3 h-3 rounded bg-[#818CF8]/20 border border-[#818CF8]/40" />
            <div className="w-3 h-3 rounded bg-[#818CF8]/60" />
            <div className="w-3 h-3 rounded bg-[#818CF8]" />
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs font-bold text-slate-500 dark:text-[#A1A1AA] mb-3">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        <div className="grid grid-cols-7 gap-2.5">
          {calendarGrid.map((cell, idx) => {
            const dayRecord = completions[cell.dateStr] || {};
            const count = habits.filter(h => !!dayRecord[h.id]).length;
            const percentage = totalActiveHabits > 0 ? Math.round((count / totalActiveHabits) * 100) : 0;
            const intensityClass = getCellIntensity(percentage);

            return (
              <div
                key={idx}
                className={`relative min-h-[70px] rounded-2xl p-2.5 border transition-all duration-200 flex flex-col justify-between ${
                  !cell.inCurrentMonth ? 'opacity-25' : ''
                } ${intensityClass} ${cell.isToday ? 'ring-2 ring-[#818CF8]' : ''}`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold">{cell.dayNumber}</span>
                  {cell.isToday && (
                    <span className="text-[9px] uppercase font-black tracking-wider bg-[#818CF8] text-white px-1.5 py-0.2 rounded-md">
                      Today
                    </span>
                  )}
                </div>

                {cell.inCurrentMonth && (
                  <div className="mt-2 text-right font-mono">
                    <span className="text-xs font-extrabold">{count}/{totalActiveHabits}</span>
                    <div className="text-[10px] opacity-75">{percentage}%</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
