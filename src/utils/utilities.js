import { getComponentClass } from './config';
import { instances } from './core';
import { formatOptions } from './data';

export const extend = (...args) => {
  return args.reduce((acc, obj) => {
    for (let key in obj) {
      typeof obj[key] === 'object' && obj[key] !== null
        ? (acc[key] = extend(acc[key], obj[key]))
        : (acc[key] = obj[key]);
    }

    return acc;
  }, {});
};

export const getComponentOptions = (component, options, el, isLoadedWithData) =>
  extend(
    getComponentClass(component).getDefaultOptions(),
    isLoadedWithData ? {} : formatOptions(component, el),
    options
  );

export const wrap = (target, wrapper = document.createElement('div')) => {
  const parent = target[0].parentElement;
  parent.insertBefore(wrapper, target[0]);
  target.forEach((elem) => wrapper.appendChild(elem));
  return wrapper;
};

export const unwrap = (wrapper) => wrapper.replaceWith(...wrapper.childNodes);

export const createEvent = (element, eventName, extraData) => {
  const event = new CustomEvent('ax.' + eventName, {
    detail: extraData || {},
    bubbles: true,
  });
  element.dispatchEvent(event);
};

export const isTouchEnabled = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export const isPointerEnabled = () =>
  !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0;

export const getInstanceByType = (type) =>
  instances.filter((ins) => ins.type === type).map((ins) => ins.instance);

export const getInstance = (element) => {
  const el = instances.find((ins) => ins.type !== 'Toast' && '#' + ins.instance.el.id === element);

  if (el) {
    return el.instance;
  }
  return false;
};

export const getAllInstances = () => instances;

export const sync = (element) => getInstance(element).sync();

export const syncAll = () => instances.map((ins) => ins.instance.sync());

export const reset = (element) => getInstance(element).reset();

export const resetAll = () => instances.map((ins) => ins.instance.reset());

export const destroy = (element) => getInstance(element).destroy();

export const destroyAll = () => instances.map((ins) => ins.instance.destroy());
