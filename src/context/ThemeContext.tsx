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
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--bg-main', '#0A0A0A');
      document.documentElement.style.setProperty('--bg-surface', '#0e1017');
      document.documentElement.style.setProperty('--bg-card', 'rgba(18, 20, 29, 0.75)');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#94a3b8');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-main', '#f8fafc');
      document.documentElement.style.setProperty('--bg-surface', '#ffffff');
      document.documentElement.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.9)');
      document.documentElement.style.setProperty('--text-primary', '#0f172a');
      document.documentElement.style.setProperty('--text-secondary', '#475569');
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
            ? { default: '#06070a', paper: '#0A0C10' }
            : { default: '#f8fafc', paper: '#ffffff' },
          text: mode === 'dark'
            ? { primary: '#ffffff', secondary: '#94a3b8' }
            : { primary: '#0f172a', secondary: '#475569' },
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
