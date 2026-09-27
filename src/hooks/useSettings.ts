import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { AppSettings, ThemePreference } from '../types/game';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  colorblindMode: false,
  reducedMotion: false,
  sound: false,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('pokeguess:settings', DEFAULT_SETTINGS);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      let dark: boolean;
      if (settings.theme === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        dark = settings.theme === 'dark';
      }
      root.classList.toggle('dark', dark);
      root.style.colorScheme = dark ? 'dark' : 'light';
    };
    applyTheme();

    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', applyTheme);
      return () => mq.removeEventListener('change', applyTheme);
    }
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('colorblind', settings.colorblindMode);
  }, [settings.colorblindMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', settings.reducedMotion);
  }, [settings.reducedMotion]);

  const updateTheme = (theme: ThemePreference) => setSettings((s) => ({ ...s, theme }));
  const toggleColorblind = () => setSettings((s) => ({ ...s, colorblindMode: !s.colorblindMode }));
  const toggleReducedMotion = () => setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }));
  const toggleSound = () => setSettings((s) => ({ ...s, sound: !s.sound }));

  return {
    settings,
    updateTheme,
    toggleColorblind,
    toggleReducedMotion,
    toggleSound,
  };
}
