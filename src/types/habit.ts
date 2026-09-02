export type HabitCategory = 
  | 'Fitness' 
  | 'Productivity' 
  | 'Health' 
  | 'Mindset' 
  | 'Creative' 
  | 'Nutrition'
  | 'Other';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string; // Tailwind color key or hex (e.g., 'indigo', 'emerald', 'rose', 'amber', 'violet', 'cyan')
  icon: string; // Lucide icon name
  targetDaysPerWeek: number; // 1 to 7
  archived: boolean;
  createdAt: string; // ISO date format YYYY-MM-DD
}

// Maps YYYY-MM-DD string to Record<habitId, boolean>
export type CompletionMap = Record<string, Record<string, boolean>>;

export type ViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'manage';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // percentage
}

export interface DayStats {
  dateStr: string; // YYYY-MM-DD
  dayName: string; // e.g. Mon, Tue
  completedCount: number;
  totalHabits: number;
  percentage: number;
}

export interface CategoryStat {
  category: HabitCategory;
  count: number;
  completions: number;
  color: string;
}
