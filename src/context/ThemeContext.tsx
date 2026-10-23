import React, { createContext, useContext, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeContextType {
  mode: 'dark';
}

const ThemeContext = createContext<ThemeContextType>({ mode: 'dark' });

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always force dark mode — light mode has been removed.
  useEffect(() => {
    const root = document.documentElement;
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
    // Clear any previously saved theme preference
    localStorage.removeItem('valknut_theme_mode');
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#D4AF37', dark: '#E2B714' },
          background: { default: '#06070a', paper: '#0e1017' },
          text: { primary: '#f8fafc', secondary: '#94a3b8' },
          divider: 'rgba(255, 255, 255, 0.08)',
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
    []
  );

  return (
    <ThemeContext.Provider value={{ mode: 'dark' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
