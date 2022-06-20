import { isDarkMode } from '../../utils/utilities';
import { Forms } from '../forms/index';

export let themeMode = 'light';
export let theme = '';

export const toggleMode = (forceTheme = 'system') => {
  themeMode = forceTheme;

  if (forceTheme === 'system') {
    forceTheme = isDarkMode() ? 'dark' : 'light';
    localStorage.removeItem('ax-theme');
  }

  document.documentElement.classList.remove(theme);
  document.documentElement.classList.add(forceTheme);
  theme = forceTheme;

  Forms.updateInputs();

  if (themeMode !== 'system') localStorage.setItem('ax-theme', theme);
};

const setup = () => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => themeMode === 'system' && toggleMode('system'));

  const localTheme = localStorage.getItem('ax-theme');
  if (localTheme) toggleMode(localTheme);
  else toggleMode(themeMode);
};

document.addEventListener('DOMContentLoaded', setup);
