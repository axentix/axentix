const removeTarget = (e: Event) => {
  const targetId = (e.target as HTMLElement).getAttribute('data-close');
  if (!targetId) return console.error('[Axentix] A closable target must be set');

  const target = document.querySelector(targetId);
  if (target) target.remove();
};

const setup = () => {
  const closableElements = document.querySelectorAll('[data-close]');
  closableElements.forEach((el) => el.addEventListener('click', removeTarget));
};

document.addEventListener('DOMContentLoaded', setup);

export {};
