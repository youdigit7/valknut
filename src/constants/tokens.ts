/**
 * VALKNUT Official Design System Tokens
 * Brand Identity: "OWN YOUR MIND. CONTROL YOUR WORLD."
 * Aesthetic: Minimal, Dark, Premium High-End Streetwear
 */

export const TOKENS = {
  colors: {
    bg: {
      main: '#0A0A0A',
      surface: '#0E1017',
      card: '#12141E',
      cardElevated: '#171926',
      overlay: 'rgba(0, 0, 0, 0.85)',
      glass: 'rgba(255, 255, 255, 0.03)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      contrast: '#000000',
      gold: '#D4AF37',
      goldHover: '#E2B714',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.16)',
      gold: 'rgba(212, 175, 55, 0.35)',
      goldActive: '#D4AF37',
    },
    accent: {
      gold: '#D4AF37',
      goldHover: '#E2B714',
      goldGlow: 'rgba(212, 175, 55, 0.25)',
      red: '#EF4444',
      purple: '#9333EA',
    }
  },
  typography: {
    fontFamilies: {
      heading: "'Syne', 'Cinzel', -apple-system, sans-serif",
      body: "'Inter', system-ui, -apple-system, sans-serif",
      display: "'Cinzel', 'Syne', serif",
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.05em',
      wider: '0.12em',
      widest: '0.25em',
      editorial: '0.35em',
    }
  },
  spacing: {
    sectionPadding: 'py-16 sm:py-20 lg:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerNarrow: 'max-w-4xl mx-auto px-4 sm:px-6',
  },
  radii: {
    none: '0px',
    sm: '2px',
    DEFAULT: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    DEFAULT: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  brand: {
    name: 'VALKNUT',
    tagline: 'OWN YOUR MIND. CONTROL YOUR WORLD.',
    foundingYear: '2024',
    origin: 'Colombo, Sri Lanka',
    currency: 'LKR',
  }
} as const;

export type DesignTokens = typeof TOKENS;
