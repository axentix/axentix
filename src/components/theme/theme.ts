import { createEvent, isDarkMode } from '../../utils/utilities';
import { Forms } from '../forms/index';

export let themeMode = 'system';
export let theme = '';
export let enabled = false;

export const enable = () => (enabled = true);
export const disable = () => (enabled = false);

export const toggle = (forceTheme = 'system') => {
  if (!enabled) return;

  themeMode = forceTheme;

  if (forceTheme === 'system') {
    forceTheme = isDarkMode() ? 'dark' : 'light';
    localStorage.removeItem('ax-theme');
  }

  if (theme) document.documentElement.classList.remove(theme);
  theme = `theme-${forceTheme}`;
  document.documentElement.classList.add(theme);

  Forms.updateInputs();

  createEvent(document.documentElement, 'theme.change', { theme });

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
