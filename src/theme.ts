'use client';
import { createTheme } from '@mui/material/styles';
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#0092D1',
      light: '#E1F6FD',
    },
    secondary: {
      main: '#F18F22',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#D1D5DB',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#4B5563',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  colorSchemes: { light: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
        },
        containedSecondary: {
          backgroundColor: '#4B5563',
          '&:hover': {
            backgroundColor: '#374151',
          },
        },
        outlinedSecondary: {
          borderColor: '#4B5563',
          color: '#4B5563',
          '&:hover': {
            borderColor: '#374151',
            backgroundColor: 'rgba(75, 85, 99, 0.04)',
          },
        },
        textSecondary: {
          color: '#4B5563',
          '&:hover': {
            backgroundColor: 'rgba(75, 85, 99, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
              WebkitTextFillColor: '#374151 !important',
              caretColor: '#374151 !important',
            },
            '&:-webkit-autofill:hover': {
              WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
            },
            '&:-webkit-autofill:focus': {
              WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
