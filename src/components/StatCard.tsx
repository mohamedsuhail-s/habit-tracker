import React from 'react';
import { DynamicIcon } from './DynamicIcon';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  const getGradient = (col: string) => {
    switch (col) {
      case 'indigo': 
        return 'from-[#818CF8]/20 via-[#818CF8]/5 to-transparent border-[#818CF8]/30 text-[#818CF8]';
      case 'accent':
        return 'from-[#F472B6]/20 via-[#F472B6]/5 to-transparent border-[#F472B6]/30 text-[#F472B6]';
      case 'emerald': 
        return 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-500 dark:text-emerald-400';
      case 'amber': 
        return 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/30 text-amber-500 dark:text-amber-400';
      case 'cyan': 
        return 'from-cyan-500/20 via-cyan-500/5 to-transparent border-cyan-500/30 text-cyan-500 dark:text-cyan-400';
      default: 
        return 'from-[#818CF8]/20 via-[#818CF8]/5 to-transparent border-[#818CF8]/30 text-[#818CF8]';
    }
  };

  return (
    <div className={`glass-panel bg-gradient-to-br ${getGradient(color)} rounded-2xl p-5 border relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA] mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className="font-mono text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-1">{subtitle}</p>}
        </div>

        <div className="w-12 h-12 rounded-xl bg-slate-200/80 dark:bg-[#212126] border border-slate-300 dark:border-[#27272A] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
          <DynamicIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
