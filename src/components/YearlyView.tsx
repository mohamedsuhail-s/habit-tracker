import React from 'react';
import type { Habit, CompletionMap } from '../types/habit';
import { calculateHabitStreak } from '../utils/streakUtils';
import { DynamicIcon, CATEGORY_COLORS } from './DynamicIcon';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Trophy, Flame } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface YearlyViewProps {
  habits: Habit[];
  completions: CompletionMap;
}

export const YearlyView: React.FC<YearlyViewProps> = ({
  habits,
  completions,
}) => {
  const currentYear = new Date().getFullYear();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = monthNames.map((mName, mIdx) => {
    let totalCompletions = 0;
    let possibleCompletions = 0;

    const daysInMonth = new Date(currentYear, mIdx + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(mIdx + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

      const dayRecord = completions[dateKey];
      if (dayRecord) {
        totalCompletions += Object.keys(dayRecord).length;
      }
      possibleCompletions += habits.length;
    }

    const rate = possibleCompletions > 0 ? Math.round((totalCompletions / possibleCompletions) * 100) : 0;

    return {
      month: mName,
      completions: totalCompletions,
      rate,
    };
  });

  const categoryCounts: Record<string, number> = {};
  habits.forEach(h => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const pieChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat],
    color: (CATEGORY_COLORS[habits.find(h=>h.category===cat)?.color || 'indigo'] || CATEGORY_COLORS.indigo).hex,
  }));

  const habitLeaderboard = habits
    .map(h => {
      const streak = calculateHabitStreak(h.id, completions, h.createdAt);
      return {
        habit: h,
        streak,
      };
    })
    .sort((a, b) => b.streak.currentStreak - a.streak.currentStreak || b.streak.completionRate - a.streak.completionRate);

  const totalAllTimeCompletions = habitLeaderboard.reduce((acc, curr) => acc + curr.streak.totalCompletions, 0);
  const highestStreak = habitLeaderboard.length > 0 ? habitLeaderboard[0].streak.currentStreak : 0;

  return (
    <div className="space-y-8">
      
      {/* Capital Executive Summary Banner */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#27272A] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#818CF8]/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center space-x-2 text-[#818CF8] font-mono font-semibold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Financial & Trajectory Summary</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {currentYear} Capital Trajectory
          </h2>
          <p className="text-slate-500 dark:text-[#A1A1AA] text-sm mt-1 max-w-lg">
            Monitor overall operational liquidity, structural outflow streams, and global aggregated metrics across enterprise habits.
          </p>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#27272A] text-center min-w-[120px]">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalAllTimeCompletions}</div>
            <div className="text-[11px] text-slate-500 dark:text-[#A1A1AA] font-semibold uppercase tracking-wider mt-0.5">Total Executions</div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 border border-amber-500/30 text-center min-w-[120px] bg-amber-500/10">
            <div className="text-2xl font-black text-amber-500 dark:text-amber-400 flex items-center justify-center space-x-1">
              <Flame className="w-5 h-5 fill-amber-400" />
              <span>{highestStreak}d</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-300 font-semibold uppercase tracking-wider mt-0.5">Peak Streak</div>
          </div>
        </div>
      </div>

      {/* Grid of Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Area Chart: Yearly Trajectory Rate */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#818CF8]" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Annual Consistency Trajectory (%)</h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yearlyRateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181C', borderColor: '#27272A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Consistency']}
                />
                <Area type="monotone" dataKey="rate" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#yearlyRateGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Monthly Total Completions */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#F472B6]" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Aggregate Completions</h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181C', borderColor: '#27272A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} completions`, 'Total']}
                />
                <Bar dataKey="completions" fill="#F472B6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Category Allocation & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A] flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-[#818CF8]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue & Category Distribution</h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181C', borderColor: '#27272A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-[#27272A]">
            {pieChartData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs font-mono">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                <span className="text-slate-500 font-bold">({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-[#27272A]">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Enterprise Protocols</h3>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-[#A1A1AA]">Ranked by operational streak</span>
          </div>

          <div className="space-y-3">
            {habitLeaderboard.map((item, index) => {
              const colorTheme = CATEGORY_COLORS[item.habit.color] || CATEGORY_COLORS.indigo;

              return (
                <div 
                  key={item.habit.id}
                  className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#27272A] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-[#18181C] text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center border border-transparent dark:border-[#27272A]">
                      #{index + 1}
                    </div>

                    <div className={`p-2 rounded-xl border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}>
                      <DynamicIcon name={item.habit.icon} className="w-4 h-4" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.habit.name}</h4>
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${colorTheme.badge}`}>
                        {item.habit.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 font-mono">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-amber-500 dark:text-amber-400 flex items-center space-x-1 justify-end">
                        <Flame className="w-4 h-4 fill-amber-400" />
                        <span>{item.streak.currentStreak}d</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-[#A1A1AA]">Current Streak</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#818CF8]">
                        {item.streak.completionRate}%
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-[#A1A1AA]">Yield Rate</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
