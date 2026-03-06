import { useState, useEffect, useCallback } from 'react';

type Theme = 'default' | 'sc';

const STORAGE_KEY = 'meta-tracker-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'sc' ? 'sc' : 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'sc') {
      html.setAttribute('data-theme', 'sc');
    } else {
      html.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'sc' ? 'default' : 'sc'));
  }, []);

  return { theme, toggleTheme } as const;
}
