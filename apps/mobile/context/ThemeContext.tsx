import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const Colors = {
  light: {
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#6b7280',
    primary: '#bef264', // Lime
    border: '#f3f4f6',
    input: '#ffffff',
    tabBar: '#ffffff',
  },
  dark: {
    background: '#000000',
    surface: '#111827',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    primary: '#bef264',
    border: '#1f2937',
    input: '#1f2937',
    tabBar: '#111827',
  }
};

type ThemeContextType = {
  isDark: boolean;
  theme: typeof Colors.light;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    // Load saved preference
    SecureStore.getItemAsync('theme_preference').then((saved) => {
      if (saved) {
        setIsDark(saved === 'dark');
      }
    });
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    SecureStore.setItemAsync('theme_preference', newValue ? 'dark' : 'light');
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
