import React, { useState, useEffect } from 'react';
import type { Habit, HabitCategory } from '../types/habit';
import { AVAILABLE_ICONS, CATEGORY_COLORS, DynamicIcon } from './DynamicIcon';
import { X, Check } from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  initialData?: Habit | null;
}

const CATEGORIES: HabitCategory[] = [
  'Fitness',
  'Productivity',
  'Health',
  'Mindset',
  'Nutrition',
  'Creative',
  'Other',
];

const COLORS = ['indigo', 'accent', 'emerald', 'amber', 'rose', 'cyan', 'violet'];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Fitness');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);
  const [color, setColor] = useState('indigo');
  const [icon, setIcon] = useState('Activity');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setCategory(initialData.category);
      setTargetDaysPerWeek(initialData.targetDaysPerWeek);
      setColor(initialData.color);
      setIcon(initialData.icon);
    } else {
      setName('');
      setDescription('');
      setCategory('Fitness');
      setTargetDaysPerWeek(7);
      setColor('indigo');
      setIcon('Activity');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      targetDaysPerWeek,
      color,
      icon,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-300 dark:border-[#27272A] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#27272A] mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {initialData ? 'Edit Habit Protocol' : 'Create New Habit Protocol'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Meditation, 10k Steps"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] mb-2">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 15 minutes of mindfulness to start the day"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'bg-[#818CF8] border-[#818CF8] text-white shadow-md'
                      : 'bg-slate-200/50 dark:bg-[#18181C] border-slate-300 dark:border-[#27272A] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] mb-2">
              Goal Frequency (Days per week)
            </label>
            <div className="flex items-center space-x-2 font-mono">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setTargetDaysPerWeek(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    targetDaysPerWeek === num
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-200/50 dark:bg-[#18181C] border-slate-300 dark:border-[#27272A] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {num}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] mb-2">
              Color Theme
            </label>
            <div className="flex items-center space-x-3">
              {COLORS.map((colKey) => {
                const colorInfo = CATEGORY_COLORS[colKey];
                return (
                  <button
                    type="button"
                    key={colKey}
                    onClick={() => setColor(colKey)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-transform ${
                      color === colKey ? 'scale-110 border-white ring-2 ring-[#818CF8]/50' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: colorInfo.hex }}
                  >
                    {color === colKey && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] mb-2">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-100 dark:bg-[#18181C] rounded-xl border border-slate-300 dark:border-[#27272A]">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                    icon === iconName
                      ? 'bg-[#818CF8] text-white shadow-md'
                      : 'text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A]'
                  }`}
                >
                  <DynamicIcon name={iconName} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-[#27272A]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-mono text-xs font-semibold text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white font-semibold font-mono text-xs rounded-xl shadow-lg shadow-[#818CF8]/30 transition-all"
            >
              {initialData ? 'Update Protocol' : 'Create Protocol'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
