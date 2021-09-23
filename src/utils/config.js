export { version } from '../../package.json';

export const instances = [];

export const config = {
  components: [],
  plugins: [],
  prefix: 'ax',
  mode: '', // can be '' or 'prefixed'
};

export const getCssVar = (variable) => `--${config.prefix}-${variable}`;

export const getComponentClass = (component) => config.components.find((c) => c.name === component).class;

export const getDataElements = () => {
  const dataComponents = config.components.filter((component) => component.dataDetection);
  const dataPlugins = config.plugins.filter((plugin) => plugin.dataDetection);

  return [...dataComponents, ...dataPlugins].reduce((acc, el) => {
    acc.push(el.name);
    return acc;
  }, []);
};

export const getAutoInitElements = () => {
  const autoInitComponents = config.components.filter(
    (component) => component.autoInit && component.autoInit.enabled
  );
  const autoInitPlugins = config.plugins.filter((plugin) => plugin.autoInit && plugin.autoInit.enabled);

  return [...autoInitComponents, ...autoInitPlugins].reduce((acc, el) => {
    acc[el.name] = document.querySelectorAll(el.autoInit.selector);
    return acc;
  }, {});
};

/**
 * @param {{ name: string, dataDetection?: boolean, autoInit?: {enabled: boolean, selector: string}, class: any }} el
 * @param {String} term
 */
const register = (el, term) => {
  if (!el.name || !el.class) {
    console.error(`[Axentix] Error registering ${term} : Missing required parameters.`);
    return;
  }

  if (config[term].some((elem) => elem.name === el.name)) {
    console.error(`[Axentix] Error registering ${term} : Already exist.`);
    return;
  }

  config[term].push(el);
};

export const registerComponent = (component) => {
  register(component, 'components');
};

export const registerPlugin = (plugin) => {
  register(plugin, 'plugins');
};

export const exportToWindow = () => {
  if (!window) return;

  if (!window.Axentix) window.Axentix = {};
  [...config.components, ...config.plugins].map((el) => {
    window.Axentix[el.name] = el.class;
  });
};
