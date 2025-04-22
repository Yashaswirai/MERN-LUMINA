import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return THEMES.SYSTEM; // Default to system preference
  });

  // Function to determine if dark mode should be active
  const isDarkMode = () => {
    if (theme === THEMES.DARK) return true;
    if (theme === THEMES.LIGHT) return false;
    // If theme is 'system', check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Apply theme to document
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply dark mode class to document if needed
    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system preference changes if using system theme
  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial check
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Listen for changes
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === THEMES.LIGHT) return THEMES.DARK;
      if (prevTheme === THEMES.DARK) return THEMES.LIGHT;
      // If system, choose opposite of system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.LIGHT 
        : THEMES.DARK;
    });
  };

  // Set a specific theme
  const setThemeMode = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode: isDarkMode(), toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
