'use client';

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import EmotionRegistry from '@/lib/emotion-registry';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#000000',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-sora)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontFamily: 'var(--font-oooh-baby), cursive',
      fontWeight: 400,
    },
  },
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </EmotionRegistry>
  );
}

