import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from '../styles/theme';
import { useThemeMode } from './ThemeContext';

const ThemeWrapper = ({ children }) => {
  const { darkMode } = useThemeMode();
  const theme = React.useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeWrapper;
