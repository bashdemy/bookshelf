export const theme = {
  colors: {
    primary: {
      main: '#E178A0',
      light: '#F0B7C8',
      dark: '#B65F83',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#7A5C9E',
      light: '#A189C6',
      dark: '#563F78',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#FFF7FA',
      paper: '#FFFAFD',
    },
    text: {
      primary: '#2A1E2A',
      secondary: '#6E5A6E',
    },
    divider: '#EED9E3',
    info: '#6C7BD9',
    success: '#2E7D6E',
    warning: '#E0A24C',
    error: '#D04A5A',
    accent: {
      lavender: '#C7B7E2',
      blush: '#F5C1D0',
      plum: '#5A3D69',
    },
  },
  borderRadius: {
    base: '14px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 6px rgba(122, 92, 158, 0.08)',
    md: '0 4px 10px rgba(225, 120, 160, 0.10)',
    lg: '0 6px 14px rgba(90, 61, 105, 0.12)',
    xl: '0 8px 24px rgba(90, 61, 105, 0.14)',
    primary: '0 6px 14px rgba(225, 120, 160, 0.25)',
    secondary: '0 6px 14px rgba(122, 92, 158, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #E178A0 0%, #7A5C9E 100%)',
    soft: 'linear-gradient(135deg, #F5C1D0 0%, #C7B7E2 100%)',
  },
} as const;

