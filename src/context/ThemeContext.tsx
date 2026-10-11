import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('valknut_theme_mode');
    return (savedMode === 'light' || savedMode === 'dark') ? savedMode : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('valknut_theme_mode', mode);
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      root.style.setProperty('--bg-main', '#06070a');
      root.style.setProperty('--bg-surface', '#0e1017');
      root.style.setProperty('--bg-card', '#12141d');
      root.style.setProperty('--bg-card-inner', '#141620');
      root.style.setProperty('--bg-glass', 'rgba(255, 255, 255, 0.03)');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--border-strong', 'rgba(255, 255, 255, 0.16)');
      root.style.setProperty('--border-gold', 'rgba(212, 175, 55, 0.3)');
      root.style.setProperty('--shadow-card', '0 10px 30px rgba(0, 0, 0, 0.6)');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      root.style.setProperty('--bg-main', '#f8fafc');
      root.style.setProperty('--bg-surface', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--bg-card-inner', '#f1f5f9');
      root.style.setProperty('--bg-glass', 'rgba(0, 0, 0, 0.03)');
      root.style.setProperty('--text-primary', '#090d16');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--border-strong', 'rgba(0, 0, 0, 0.16)');
      root.style.setProperty('--border-gold', 'rgba(184, 144, 28, 0.4)');
      root.style.setProperty('--shadow-card', '0 8px 24px rgba(0, 0, 0, 0.06)');
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#D4AF37', dark: '#E2B714' },
          background: mode === 'dark'
            ? { default: '#06070a', paper: '#0e1017' }
            : { default: '#f8fafc', paper: '#ffffff' },
          text: mode === 'dark'
            ? { primary: '#f8fafc', secondary: '#94a3b8' }
            : { primary: '#090d16', secondary: '#475569' },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
          h1: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
          h2: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
          h3: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 700, textTransform: 'uppercase' },
          h4: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 700, textTransform: 'uppercase' },
          h5: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 700, textTransform: 'uppercase' },
          h6: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase' },
          body1: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' },
          body2: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' },
          button: { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 700, letterSpacing: '0.05em' },
          caption: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 500, letterSpacing: '0.05em' },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                textTransform: 'uppercase',
                fontWeight: 700,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
