import { useState, useEffect, useCallback } from 'react';
import type { Habit, CompletionMap, HabitCategory } from '../types/habit';
import { INITIAL_HABITS, generateInitialCompletions } from '../utils/mockData';
import { getTodayStr } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

const STORAGE_KEY_HABITS = 'habit_tracker_habits_v2';
const STORAGE_KEY_COMPLETIONS = 'habit_tracker_completions_v2';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HABITS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load habits from localStorage', e);
    }
    return INITIAL_HABITS;
  });

  const [completions, setCompletions] = useState<CompletionMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load completions from localStorage', e);
    }
    return generateInitialCompletions();
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'All'>('All');

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  // Toggle habit completion for a given date (defaults to today)
  const toggleHabitCompletion = useCallback((habitId: string, targetDateStr?: string) => {
    const dateStr = targetDateStr || getTodayStr();

    setCompletions(prev => {
      const dayRecord = { ...(prev[dateStr] || {}) };
      const nextStatus = !dayRecord[habitId];

      if (nextStatus) {
        dayRecord[habitId] = true;
      } else {
        delete dayRecord[habitId];
      }

      const updated = {
        ...prev,
        [dateStr]: dayRecord,
      };

      // Check if all active habits completed for today and trigger confetti animation
      if (dateStr === getTodayStr() && nextStatus) {
        const activeCount = habits.filter(h => !h.archived).length;
        const completedCount = Object.keys(dayRecord).length;
        if (activeCount > 0 && completedCount === activeCount) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore if confetti fails
          }
        }
      }

      return updated;
    });
  }, [habits]);

  const addHabit = useCallback((newHabitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    const id = `habit-${Date.now()}`;
    const newHabit: Habit = {
      ...newHabitData,
      id,
      archived: false,
      createdAt: getTodayStr(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const editHabit = useCallback((id: string, updatedData: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...updatedData } : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setCompletions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        if (updated[date][id]) {
          const dayRecord = { ...updated[date] };
          delete dayRecord[id];
          updated[date] = dayRecord;
        }
      });
      return updated;
    });
  }, []);

  const resetDemoData = useCallback(() => {
    setHabits(INITIAL_HABITS);
    setCompletions(generateInitialCompletions());
    localStorage.removeItem(STORAGE_KEY_HABITS);
    localStorage.removeItem(STORAGE_KEY_COMPLETIONS);
  }, []);

  const exportData = useCallback(() => {
    const data = {
      habits,
      completions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${getTodayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [habits, completions]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.habits) && typeof parsed.completions === 'object') {
        setHabits(parsed.habits);
        setCompletions(parsed.completions);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  }, []);

  // Filtered habits
  const filteredHabits = habits.filter(habit => {
    if (habit.archived) return false;
    const matchesCategory = activeCategory === 'All' || habit.category === activeCategory;
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return {
    habits,
    filteredHabits,
    completions,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    toggleHabitCompletion,
    addHabit,
    editHabit,
    deleteHabit,
    resetDemoData,
    exportData,
    importData,
  };
}
