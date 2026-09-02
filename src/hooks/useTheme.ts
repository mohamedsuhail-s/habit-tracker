import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY_THEME = 'neurosync_theme_mode_v1';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load theme preference', e);
    }
    return 'dark'; // Dark mode default as specified in guidelines
  });

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem(STORAGE_KEY_THEME, themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    themeMode,
    isDark: themeMode === 'dark',
    toggleTheme,
    setThemeMode,
  };
}
