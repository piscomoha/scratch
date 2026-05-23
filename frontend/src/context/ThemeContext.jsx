import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () => (
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [theme, setTheme] = useState(() => {
    const syncTheme = localStorage.getItem('syncTheme') === 'true';
    if (syncTheme) return getSystemTheme();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    return 'light';
  });
  const [syncTheme, setSyncTheme] = useState(() => localStorage.getItem('syncTheme') === 'true');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('dark', 'light');
    
    // Add current theme class
    root.classList.add(theme);
    
    if (!syncTheme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('syncTheme', syncTheme ? 'true' : 'false');
    if (!syncTheme) return;

    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const applySystemTheme = () => setTheme(getSystemTheme());
    applySystemTheme();

    media?.addEventListener('change', applySystemTheme);
    return () => media?.removeEventListener('change', applySystemTheme);
  }, [syncTheme]);

  const setThemeMode = (nextTheme) => {
    setSyncTheme(false);
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const toggleTheme = () => {
    setThemeMode(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, syncTheme, setSyncTheme, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
