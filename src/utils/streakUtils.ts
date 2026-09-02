import type { Habit, CompletionMap, StreakInfo } from '../types/habit';
import { formatDateKey, getTodayStr, parseDateKey } from './dateUtils';

export function calculateHabitStreak(
  habitId: string,
  completions: CompletionMap,
  createdAt: string
): StreakInfo {
  const todayStr = getTodayStr();
  const todayDate = parseDateKey(todayStr);
  const startDate = parseDateKey(createdAt);

  let totalCompletions = 0;

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(todayDate);
  
  // Check today first
  const todayKey = formatDateKey(checkDate);
  const isTodayCompleted = !!completions[todayKey]?.[habitId];

  if (isTodayCompleted) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If not completed today, check if yesterday was completed
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);
    if (completions[yesterdayKey]?.[habitId]) {
      checkDate = yesterday;
    } else {
      // Neither today nor yesterday completed -> streak is 0
      checkDate = null as any;
    }
  }

  // Trace back backwards from checkDate
  if (checkDate) {
    while (checkDate >= startDate) {
      const key = formatDateKey(checkDate);
      if (completions[key]?.[habitId]) {
        // Already counted today if isTodayCompleted was true
        if (key !== todayKey || !isTodayCompleted) {
          currentStreak++;
        }
      } else {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate longest streak & total completions historically
  let longestStreak = 0;
  let runningStreak = 0;
  let daysTotal = 0;

  const tempDate = new Date(startDate);
  while (tempDate <= todayDate) {
    daysTotal++;
    const key = formatDateKey(tempDate);
    if (completions[key]?.[habitId]) {
      totalCompletions++;
      runningStreak++;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const completionRate = daysTotal > 0 ? Math.round((totalCompletions / daysTotal) * 100) : 0;

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
  };
}

export function calculateOverallStats(
  habits: Habit[],
  completions: CompletionMap
): {
  todayCompletionRate: number;
  completedTodayCount: number;
  totalActiveHabits: number;
  maxCurrentStreak: number;
  totalAllTimeCompletions: number;
} {
  const activeHabits = habits.filter(h => !h.archived);
  if (activeHabits.length === 0) {
    return {
      todayCompletionRate: 0,
      completedTodayCount: 0,
      totalActiveHabits: 0,
      maxCurrentStreak: 0,
      totalAllTimeCompletions: 0,
    };
  }

  const todayStr = getTodayStr();
  let completedTodayCount = 0;
  let maxCurrentStreak = 0;
  let totalAllTimeCompletions = 0;

  activeHabits.forEach(h => {
    if (completions[todayStr]?.[h.id]) {
      completedTodayCount++;
    }
    const info = calculateHabitStreak(h.id, completions, h.createdAt);
    if (info.currentStreak > maxCurrentStreak) {
      maxCurrentStreak = info.currentStreak;
    }
    totalAllTimeCompletions += info.totalCompletions;
  });

  const todayCompletionRate = Math.round((completedTodayCount / activeHabits.length) * 100);

  return {
    todayCompletionRate,
    completedTodayCount,
    totalActiveHabits: activeHabits.length,
    maxCurrentStreak,
    totalAllTimeCompletions,
  };
}
