// src/styles/theme.js

import { createTheme } from '@mui/material/styles';

// Apply CSS variables to match our theme
document.documentElement.style.setProperty('--background-default', '#f8f9fa');
document.documentElement.style.setProperty('--background-paper', '#ffffff');
document.documentElement.style.setProperty('--primary-main', '#2196f3');
document.documentElement.style.setProperty('--primary-light', '#64b5f6');
document.documentElement.style.setProperty('--primary-dark', '#1976d2');
document.documentElement.style.setProperty('--primary-contrast-text', '#ffffff');
document.documentElement.style.setProperty('--secondary-main', '#3f51b5');
document.documentElement.style.setProperty('--secondary-light', '#7986cb');
document.documentElement.style.setProperty('--secondary-dark', '#303f9f');
document.documentElement.style.setProperty('--secondary-contrast-text', '#ffffff');
document.documentElement.style.setProperty('--text-primary', '#212121');
document.documentElement.style.setProperty('--text-secondary', '#757575');
document.documentElement.style.setProperty('--text-disabled', '#9e9e9e');

export const theme = createTheme({
  palette: {
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#ffffff'
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000'
    },
    info: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7',
      contrastText: '#ffffff'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e'
    },
    divider: '#e0e0e0'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out'
        },
        contained: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px'
          // Removed global padding and height to fix AppBar size
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#212121',
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: '#2196f3'
            }
          }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5'
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  },
  spacing: 8, // Base 8pt grid unit
  
  // Custom spacing tokens for consistency
  customSpacing: {
    xs: 4,   // 0.5 * 8pt
    sm: 8,   // 1 * 8pt
    md: 16,  // 2 * 8pt
    lg: 24,  // 3 * 8pt
    xl: 32,  // 4 * 8pt
    xxl: 40, // 5 * 8pt
    xxxl: 48 // 6 * 8pt
  },
  
  // Border radius system
  customBorderRadius: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
});
