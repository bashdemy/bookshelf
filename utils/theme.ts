export const theme = {
  colors: {
    primary: {
      main: '#9E384D',
      light: '#C24B5D',
      dark: '#862B3E',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#394A60',
      light: '#536882',
      dark: '#263345',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#F8F6F1',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1B18',
      secondary: '#6B645B',
    },
    divider: '#E5E0D6',
    info: '#3D628D',
    success: '#2C6B5E',
    warning: '#B37424',
    error: '#B53A42',
    accent: {
      lavender: '#EEF1F5',
      blush: '#F6ECEB',
      plum: '#6F2132',
      tagBg: '#ECE7DE',
      tagText: '#454038',
    },
  },
  borderRadius: {
    sm: '6px',
    base: '10px',
    lg: '14px',
    xl: '18px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(26, 23, 20, 0.04), 0 1px 1px rgba(26, 23, 20, 0.02)',
    md: '0 1px 3px rgba(26, 23, 20, 0.05), 0 4px 12px rgba(26, 23, 20, 0.03)',
    lg: '0 4px 16px rgba(26, 23, 20, 0.07), 0 1px 3px rgba(26, 23, 20, 0.03)',
    xl: '0 8px 24px rgba(26, 23, 20, 0.09), 0 2px 6px rgba(26, 23, 20, 0.04)',
    card: '0 1px 3px rgba(26, 23, 20, 0.05), 0 1px 1px rgba(26, 23, 20, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
  },
} as const;
