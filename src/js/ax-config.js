// require: ax-core.js
Axentix.Config = (() => {
  const config = {
    components: [],
    plugins: [],
  };

  const get = () => {
    return config;
  };

  const getDataElements = () => {
    const dataComponents = config.components.filter((component) => component.dataDetection);
    const dataPlugins = config.plugins.filter((plugin) => plugin.dataDetection);

    return [...dataComponents, ...dataPlugins].reduce((acc, el) => {
      acc.push(el.name);
      return acc;
    }, []);
  };

  const getAutoInitElements = () => {
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
   * Register an element
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

    Axentix[el.name] = el.class;
  };

  const registerComponent = (component) => {
    register(component, 'components');
  };

  const registerPlugin = (plugin) => {
    register(plugin, 'plugins');
  };

  return {
    get,
    getDataElements,
    getAutoInitElements,
    registerComponent,
    registerPlugin,
  };
})();
