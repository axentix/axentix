import { isDarkMode } from '../../utils/utilities';
import { Forms } from '../forms/index';

export let themeMode = 'light';
export let theme = '';

export const toggle = (forceTheme = 'system') => {
  themeMode = forceTheme;

  if (forceTheme === 'system') {
    forceTheme = isDarkMode() ? 'dark' : 'light';
    localStorage.removeItem('ax-theme');
  }

  if (theme) document.documentElement.classList.remove(theme);
  theme = `theme-${forceTheme}`;
  document.documentElement.classList.add(theme);

  Forms.updateInputs();

  if (themeMode !== 'system') localStorage.setItem('ax-theme', theme);
};

const setup = () => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => themeMode === 'system' && toggle('system'));

  const localTheme = localStorage.getItem('ax-theme');
  if (localTheme) toggle(localTheme.replace('theme-', ''));
  else toggle(themeMode);
};

document.addEventListener('DOMContentLoaded', setup);
