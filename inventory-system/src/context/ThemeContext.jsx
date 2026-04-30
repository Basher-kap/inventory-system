import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Persistent memory: Check if the user already has a saved preference
    const saved = localStorage.getItem('lab_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    localStorage.setItem('lab_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};