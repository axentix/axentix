const removeTarget = (e: Event) => {
  const targetId = (e.currentTarget as HTMLElement).getAttribute('data-close');
  if (!targetId) return console.error('[Axentix] A closable target must be set');

  const target = document.getElementById(targetId);
  if (target) target.remove();
};

const setup = () => {
  const elements = document.querySelectorAll('[data-close]');
  elements.forEach((el) => el.addEventListener('click', removeTarget));
};

document.addEventListener('DOMContentLoaded', setup);

export {};
