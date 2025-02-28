// src/styles/theme.js

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#213547',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff'
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
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 4
  },
  spacing: 8
});
