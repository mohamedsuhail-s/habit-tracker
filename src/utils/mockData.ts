import type { Habit, CompletionMap } from '../types/habit';
import { formatDateKey } from './dateUtils';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Morning Meditation',
    description: '15 minutes of mindfulness and deep breathing to start the day calm.',
    category: 'Mindset',
    color: 'violet',
    icon: 'Brain',
    targetDaysPerWeek: 7,
    archived: false,
    createdAt: getISO60DaysAgo(),
  },
  {
    id: 'habit-2',
    name: '10,000 Daily Steps',
    description: 'Walk or jog to hit daily movement goal for cardiovascular health.',
    category: 'Fitness',
    color: 'emerald',
    icon: 'Activity',
    targetDaysPerWeek: 7,
    archived: false,
    createdAt: getISO60DaysAgo(),
  },
  {
    id: 'habit-3',
    name: 'Deep Work / Side Project',
    description: '90 minutes of distraction-free focused coding or creative work.',
    category: 'Productivity',
    color: 'indigo',
    icon: 'Code',
    targetDaysPerWeek: 5,
    archived: false,
    createdAt: getISO60DaysAgo(),
  },
  {
    id: 'habit-4',
    name: 'Drink 3L Water',
    description: 'Stay hydrated throughout the day with a refillable water bottle.',
    category: 'Nutrition',
    color: 'cyan',
    icon: 'Droplet',
    targetDaysPerWeek: 7,
    archived: false,
    createdAt: getISO60DaysAgo(),
  },
  {
    id: 'habit-5',
    name: 'Read 20 Pages',
    description: 'Read non-fiction, technical books, or literature before sleep.',
    category: 'Mindset',
    color: 'amber',
    icon: 'BookOpen',
    targetDaysPerWeek: 6,
    archived: false,
    createdAt: getISO60DaysAgo(),
  },
  {
    id: 'habit-6',
    name: 'Healthy Nutrition & No Sugar',
    description: 'Avoid refined sugars, processed snacks, and eat clean whole foods.',
    category: 'Health',
    color: 'rose',
    icon: 'Heart',
    targetDaysPerWeek: 5,
    archived: false,
    createdAt: getISO60DaysAgo(),
  },
];

function getISO60DaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 60);
  return formatDateKey(d);
}

export function generateInitialCompletions(): CompletionMap {
  const completions: CompletionMap = {};
  const today = new Date();

  // Generate 60 days of historical data with realistic completion probabilities
  for (let i = 60; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);

    completions[dateKey] = {};

    INITIAL_HABITS.forEach((habit) => {
      // Create high completion rates for streaks (e.g. 75-85% success rate)
      // Slightly higher success rate in recent days to show active streaks!
      const randomVal = Math.random();
      const threshold = i < 14 ? 0.85 : 0.72;
      
      // Keep today partially checked for interactive testing
      if (i === 0) {
        if (['habit-1', 'habit-2', 'habit-4'].includes(habit.id)) {
          completions[dateKey][habit.id] = true;
        }
      } else {
        if (randomVal < threshold) {
          completions[dateKey][habit.id] = true;
        }
      }
    });
  }

  return completions;
}
