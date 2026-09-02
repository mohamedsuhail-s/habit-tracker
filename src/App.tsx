import React, { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import type { ViewMode, Habit } from './types/habit';
import { calculateOverallStats } from './utils/streakUtils';

// Components
import { Navbar } from './components/Navbar';
import { StatCard } from './components/StatCard';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView';
import { YearlyView } from './components/YearlyView';
import { ManageView } from './components/ManageView';
import { HabitModal } from './components/HabitModal';

export const App: React.FC = () => {
  const {
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
  } = useHabits();

  const { isDark, toggleTheme } = useTheme();

  const [currentView, setCurrentView] = useState<ViewMode>('daily');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const stats = calculateOverallStats(habits, completions);

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    if (editingHabit) {
      editHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1016] dark:bg-[#0D1016] light:bg-[#F8FAFC] text-slate-100 dark:text-slate-100 light:text-slate-900 font-sans selection:bg-[#CC8066] selection:text-white transition-colors duration-300">
      
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={handleOpenAddModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        maxStreak={stats.maxCurrentStreak}
        todayRate={stats.todayCompletionRate}
        onExport={exportData}
        onImport={(json) => {
          if (importData(json)) {
            alert('Habits backup restored successfully!');
          } else {
            alert('Failed to parse backup JSON file.');
          }
        }}
        onReset={resetDemoData}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        
        {/* Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Cognitive Flow Rate"
            value={`${stats.todayCompletionRate}%`}
            subtitle={`${stats.completedTodayCount} of ${stats.totalActiveHabits} protocols done`}
            icon="CheckCircle2"
            color="terracotta"
          />

          <StatCard
            title="Peak Neural Streak"
            value={`${stats.maxCurrentStreak} Days`}
            subtitle="Current longest consecutive streak"
            icon="Flame"
            color="amber"
          />

          <StatCard
            title="Total Checks"
            value={stats.totalAllTimeCompletions}
            subtitle="All-time completed habit checkmarks"
            icon="Trophy"
            color="emerald"
          />

          <StatCard
            title="Active Protocols"
            value={stats.totalActiveHabits}
            subtitle="Routines tracked daily & weekly"
            icon="Target"
            color="cyan"
          />
        </div>

        {/* Dynamic View Router */}
        {currentView === 'daily' && (
          <DailyView
            habits={filteredHabits}
            completions={completions}
            onToggleHabit={toggleHabitCompletion}
            onEditHabit={handleOpenEditModal}
            onDeleteHabit={deleteHabit}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {currentView === 'weekly' && (
          <WeeklyView
            habits={filteredHabits}
            completions={completions}
            onToggleHabit={toggleHabitCompletion}
          />
        )}

        {currentView === 'monthly' && (
          <MonthlyView
            habits={habits}
            completions={completions}
          />
        )}

        {currentView === 'yearly' && (
          <YearlyView
            habits={habits}
            completions={completions}
          />
        )}

        {currentView === 'manage' && (
          <ManageView
            habits={filteredHabits}
            completions={completions}
            onEditHabit={handleOpenEditModal}
            onDeleteHabit={deleteHabit}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

      </main>

      {/* Habit Create/Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        initialData={editingHabit}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300">NeuroSync Pro</span> — Master Your Mind | React & TypeScript Habit Tracker
          </div>
          <div>
            Built with React, TypeScript, Tailwind CSS, & Recharts
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
