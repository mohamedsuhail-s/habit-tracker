import { useState, useEffect, useCallback } from 'react';
import type { Habit, CompletionMap, HabitCategory } from '../types/habit';
import { INITIAL_HABITS, generateInitialCompletions } from '../utils/mockData';
import { getTodayStr } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

const STORAGE_KEY_HABITS = 'habit_tracker_habits_v2';
const STORAGE_KEY_COMPLETIONS = 'habit_tracker_completions_v2';

export function useHabits() {
  const { user } = useAuth();

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

  // Firestore Real-Time Listener when User is Logged In
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.habits)) {
          setHabits(data.habits);
        }
        if (data.completions && typeof data.completions === 'object') {
          setCompletions(data.completions);
        }
      } else {
        // First login: sync current demo/local data to Firestore for user
        setDoc(userDocRef, {
          habits,
          completions,
          updatedAt: new Date().toISOString(),
        }, { merge: true }).catch(err => console.warn('Firestore initial sync notice:', err));
      }
    }, (error) => {
      console.warn('Firestore listener warning (using local backup mode):', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Helper to persist state to LocalStorage and Firestore
  const persistState = useCallback((newHabits: Habit[], newCompletions: CompletionMap) => {
    setHabits(newHabits);
    setCompletions(newCompletions);

    // Save to LocalStorage
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(newHabits));
    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(newCompletions));

    // Save to Firestore if authenticated
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, {
        habits: newHabits,
        completions: newCompletions,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(err => console.warn('Firestore save notice:', err));
    }
  }, [user]);

  // Toggle habit completion for a date
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

      const updatedCompletions = {
        ...prev,
        [dateStr]: dayRecord,
      };

      // Confetti celebration if today completed all active habits
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
            // ignore
          }
        }
      }

      // Persist changes
      persistState(habits, updatedCompletions);

      return updatedCompletions;
    });
  }, [habits, persistState]);

  const addHabit = useCallback((newHabitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    const id = `habit-${Date.now()}`;
    const newHabit: Habit = {
      ...newHabitData,
      id,
      archived: false,
      createdAt: getTodayStr(),
    };
    const updatedHabits = [...habits, newHabit];
    persistState(updatedHabits, completions);
  }, [habits, completions, persistState]);

  const editHabit = useCallback((id: string, updatedData: Partial<Habit>) => {
    const updatedHabits = habits.map(h => (h.id === id ? { ...h, ...updatedData } : h));
    persistState(updatedHabits, completions);
  }, [habits, completions, persistState]);

  const deleteHabit = useCallback((id: string) => {
    const updatedHabits = habits.filter(h => h.id !== id);
    const updatedCompletions = { ...completions };
    Object.keys(updatedCompletions).forEach(date => {
      if (updatedCompletions[date][id]) {
        const dayRecord = { ...updatedCompletions[date] };
        delete dayRecord[id];
        updatedCompletions[date] = dayRecord;
      }
    });
    persistState(updatedHabits, updatedCompletions);
  }, [habits, completions, persistState]);

  const resetDemoData = useCallback(() => {
    const freshHabits = INITIAL_HABITS;
    const freshCompletions = generateInitialCompletions();
    persistState(freshHabits, freshCompletions);
  }, [persistState]);

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
        persistState(parsed.habits, parsed.completions);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  }, [persistState]);

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
