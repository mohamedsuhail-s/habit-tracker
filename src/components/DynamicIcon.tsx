import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[name] || Icons.CheckCircle2;

  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_ICONS = [
  'Brain',
  'Activity',
  'Code',
  'Droplet',
  'BookOpen',
  'Heart',
  'Flame',
  'Zap',
  'Target',
  'Sun',
  'CheckCircle2',
  'Smile',
  'Dumbbell',
  'Coffee',
  'Award',
  'Star',
  'Sparkles',
  'Compass',
  'Clock',
  'Shield',
  'TrendingUp',
  'Laptop',
  'Music',
  'SmilePlus',
  'Bike',
  'Moon',
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; hex: string }> = {
  indigo: {
    bg: 'bg-[#818CF8]/10',
    text: 'text-[#818CF8] dark:text-[#818CF8] light:text-indigo-600',
    border: 'border-[#818CF8]/30',
    badge: 'bg-[#818CF8]/15 text-[#818CF8] border-[#818CF8]/30 dark:text-[#A5B4FC]',
    hex: '#818CF8'
  },
  accent: {
    bg: 'bg-[#F472B6]/10',
    text: 'text-[#F472B6] dark:text-[#F472B6] light:text-pink-600',
    border: 'border-[#F472B6]/30',
    badge: 'bg-[#F472B6]/15 text-[#F472B6] border-[#F472B6]/30 dark:text-[#FBCFE8]',
    hex: '#F472B6'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500 dark:text-emerald-400 light:text-emerald-600',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 dark:text-emerald-300',
    hex: '#10B981'
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-500 dark:text-cyan-400 light:text-cyan-600',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30 dark:text-cyan-300',
    hex: '#06B6D4'
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500 dark:text-amber-400 light:text-amber-600',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30 dark:text-amber-300',
    hex: '#F59E0B'
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-500 dark:text-violet-400 light:text-violet-600',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/15 text-violet-500 border-violet-500/30 dark:text-violet-300',
    hex: '#8B5CF6'
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-500 dark:text-rose-400 light:text-rose-600',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/15 text-rose-500 border-rose-500/30 dark:text-rose-300',
    hex: '#F43F5E'
  },
};
