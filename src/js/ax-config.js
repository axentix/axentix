/* requires:
ax-core.js
*/
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
   * Register component
   * @param {{ name: string, dataDetection?: boolean, autoInit?: {enabled: boolean, selector: string}, class: any }} component
   */
  const registerComponent = (component) => {
    if (!component.name || !component.class) {
      console.error('Error registering component : Missing required parameters.');
      return;
    }

    if (config.components.some((cmp) => cmp.name === component.name)) {
      console.error('Error registering component : Already exist.');
      return;
    }

    config.components.push(component);

    Axentix[component.name] = component.class;
  };

  const registerPlugin = (plugin) => {};

  return {
    get,
    getDataElements,
    getAutoInitElements,
    registerComponent,
    registerPlugin,
  };
})();
