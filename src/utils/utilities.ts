import { instances, getComponentClass } from './config';
import { formatOptions } from './data';

export const extend = (...args: any[]) => {
  return args.reduce((acc, obj) => {
    for (let key in obj) {
      acc[key] = typeof obj[key] === 'object' && obj[key] !== null ? extend(acc[key], obj[key]) : obj[key];
    }

    return acc;
  }, {});
};

export const getComponentOptions = (component, options, el) =>
  extend(getComponentClass(component).getDefaultOptions(), formatOptions(component, el), options);

export const wrap = (target, wrapper = document.createElement('div')) => {
  const parent = target[0].parentElement;
  parent.insertBefore(wrapper, target[0]);
  target.forEach((elem) => wrapper.appendChild(elem));
  return wrapper;
};

export const unwrap = (wrapper) => wrapper.replaceWith(...wrapper.childNodes);

export const createEvent = (element: HTMLElement, eventName: string, extraData?: any) => {
  const event = new CustomEvent('ax.' + eventName, {
    detail: extraData || {},
    bubbles: true,
  });
  element.dispatchEvent(event);
};

export const isTouchEnabled = () =>
  // @ts-ignore
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export const isPointerEnabled = () =>
  !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0;

export const getPointerType = () => {
  if (isTouchEnabled()) return 'touch';
  else if (isPointerEnabled()) return 'pointer';
  return 'mouse';
};

export const getInstanceByType = (type) =>
  instances.filter((ins) => ins.type === type).map((ins) => ins.instance);

export const getInstance = (element) => {
  const el = instances.find((ins) => ins.type !== 'Toast' && '#' + ins.instance.el.id === element);

  if (el) return el.instance;

  return false;
};

export const getUid = () => Math.random().toString().split('.')[1];

export const getAllInstances = () => instances;

export const sync = (element) => getInstance(element).sync();

export const syncAll = () => instances.map((ins) => ins.instance.sync());

export const reset = (element) => getInstance(element).reset();

export const resetAll = () => instances.map((ins) => ins.instance.reset());

export const destroy = (element) => getInstance(element).destroy();

export const destroyAll = () => instances.map((ins) => ins.instance.destroy());

export const createOverlay = (isActive, overlay, id, animationDuration) => {
  const overlayElement: HTMLElement =
    isActive && overlay
      ? document.querySelector(`.ax-overlay[data-target="${id}"]`)
      : document.createElement('div');
  overlayElement.classList.add('ax-overlay');
  overlayElement.style.transitionDuration = animationDuration + 'ms';
  overlayElement.dataset.target = id;

  return overlayElement;
};

export const updateOverlay = (overlay, overlayElement, listenerRef, state, animationDuration) => {
  if (!overlay) return;

  if (state) {
    overlayElement.addEventListener('click', listenerRef);
    document.body.appendChild(overlayElement);
    setTimeout(() => {
      overlayElement.classList.add('active');
    }, 50);
  } else {
    overlayElement.classList.remove('active');
    setTimeout(() => {
      overlayElement.removeEventListener('click', listenerRef);
      document.body.removeChild(overlayElement);
    }, animationDuration);
  }
};

export const getTriggers = (id: string, query = '[data-target="{ID}"]'): Array<HTMLElement> =>
  Array.from(document.querySelectorAll(query.replace('{ID}', id)));
