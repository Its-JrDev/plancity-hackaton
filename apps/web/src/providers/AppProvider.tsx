import { useEffect, useState, type ReactNode } from 'react';
import { AppContext } from '@/contexts';

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', 'desert-sands');
    document.documentElement.style.colorScheme =
      theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
