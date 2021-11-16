// @ts-ignore
export { version } from '../../package.json';

interface RegisterElement {
  name: string;
  dataDetection?: boolean;
  autoInit?: { enabled?: boolean; selector?: string };
  class: any;
}

export const instances = [];

interface Config {
  components: Array<RegisterElement>;
  plugins: Array<RegisterElement>;
  prefix: string;
  mode: '' | 'prefixed';
}

export const config: Config = {
  components: [],
  plugins: [],
  prefix: 'ax',
  mode: '',
};

export const getCssVar = (variable: string) => `--${config.prefix}-${variable}`;

export const getComponentClass = (component: string) =>
  config.components.find((c) => c.name === component).class;

export const getDataElements = () => {
  const dataComponents = config.components.filter((component) => component.dataDetection);
  const dataPlugins = config.plugins.filter((plugin) => plugin.dataDetection);

  return [...dataComponents, ...dataPlugins].map((el) => el.name);
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

const register = (el: RegisterElement, term: string) => {
  if (!el.name || !el.class) {
    console.error(`[Axentix] Error registering ${term} : Missing required parameters.`);
    return;
  }

  if (config[term].some((elem: RegisterElement) => elem.name === el.name)) {
    console.error(`[Axentix] Error registering ${term} : Already exist.`);
    return;
  }

  if (el.autoInit) el.autoInit.selector = el.autoInit.selector += ':not(.no-axentix-init)';

  config[term].push(el);
};

export const registerComponent = (component: RegisterElement) => {
  register(component, 'components');
};

export const registerPlugin = (plugin: RegisterElement) => {
  register(plugin, 'plugins');
};

export const exportToWindow = () => {
  if (!window) return;

  // @ts-ignore
  if (!window.Axentix) window.Axentix = {};
  [...config.components, ...config.plugins].forEach((el) => {
    // @ts-ignore
    window.Axentix[el.name] = el.class;
  });
};
