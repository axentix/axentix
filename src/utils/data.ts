import { getComponentClass, getDataElements } from './config';

const getFormattedName = (name: string) => {
  return name
    .replace(/[\w]([A-Z])/g, (s) => {
      return s[0] + '-' + s[1];
    })
    .toLowerCase();
};

const getName = (name: string, baseName = '') => {
  const fmtName = getFormattedName(name);
  return baseName ? baseName + '-' + fmtName : fmtName;
};

const getOptionsForObject = (
  obj: any,
  name: string,
  component: string,
  element: HTMLElement,
  baseName = ''
) => {
  const tmpOptName = name[0].toUpperCase() + name.slice(1).toLowerCase();

  if (getDataElements().includes(tmpOptName) && component !== 'Collapsible' && tmpOptName !== 'Sidenav')
    obj[name] = getComponentClass(tmpOptName).getDefaultOptions();

  const fmtName = baseName ? baseName + '-' + name : name;
  const keys = getOptions(obj[name], component, element, fmtName);

  if (!(Object.keys(keys).length === 0 && obj.constructor === Object)) return keys;
};

const getOptions = (obj: any, component: string, element: HTMLElement, baseName = '') => {
  return Object.keys(obj).reduce((acc, name) => {
    if (typeof obj[name] === 'object' && obj[name] !== null) {
      const opts = getOptionsForObject(obj, name, component, element, baseName);
      if (opts) acc[name] = opts;
    } else if (obj[name] !== null) {
      const dataAttribute = 'data-' + component.toLowerCase() + '-' + getName(name, baseName);

      if (element.hasAttribute(dataAttribute)) {
        const attr = element.getAttribute(dataAttribute);

        acc[name] = typeof obj[name] === 'number' ? Number(attr) : attr;

        if (typeof obj[name] === 'boolean') acc[name] = attr === 'true';
      }
    }

    return acc;
  }, {});
};

export const formatOptions = (component: string, element: HTMLElement): any => {
  const defaultOptions = Object.assign({}, getComponentClass(component).getDefaultOptions());

  return getOptions(defaultOptions, component, element);
};

const setup = () => {
  const elements = document.querySelectorAll('[data-ax]');

  elements.forEach((el: HTMLElement) => {
    let component = el.dataset.ax;
    component = component[0].toUpperCase() + component.slice(1).toLowerCase();

    if (!getDataElements().includes(component)) {
      console.error(
        `[Axentix] Error: ${component} component doesn't exist. \n Did you forget to register him ?`,
        el
      );
      return;
    }

    try {
      const classDef = getComponentClass(component);
      new classDef(`#${el.id}`);
    } catch (error) {
      console.error('[Axentix] Data: Unable to load ' + component, error);
    }
  });
};

const setupAll = () => {
  try {
    // @ts-ignore : Axentix refer to window.Axentix
    new Axentix.Axentix('all');
  } catch (error) {
    console.error('[Axentix] Unable to auto init.', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.documentElement.dataset.axentix) setupAll();
  setup();
});
