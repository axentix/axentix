Axentix.DataDetection = (() => {
  const getFormattedName = (name) => {
    return name
      .replace(/[\w]([A-Z])/g, (s) => {
        return s[0] + '-' + s[1];
      })
      .toLowerCase();
  };

  const getName = (name, baseName = '') => {
    const fmtName = getFormattedName(name);
    return baseName ? baseName + '-' + fmtName : fmtName;
  };

  const getOptions = (obj, component, element, baseName = '') => {
    return Object.keys(obj).reduce((acc, name, i) => {
      if (typeof obj[name] === 'object' && obj[name] !== null) {
        const tmpOptName = name[0].toUpperCase() + name.slice(1).toLowerCase();

        Axentix.Config.getDataElements().includes(tmpOptName) &&
        component !== 'Collapsible' &&
        tmpOptName !== 'Sidenav'
          ? (obj[name] = Axentix[tmpOptName].getDefaultOptions())
          : '';

        const fmtName = baseName ? baseName + '-' + name : name;
        const keys = getOptions(obj[name], component, element, fmtName);

        Object.keys(keys).length === 0 && obj.constructor === Object ? '' : (acc[name] = keys);
      } else if (obj[name] !== null) {
        const dataAttribute = 'data-' + component.toLowerCase() + '-' + getName(name, baseName);

        if (element.hasAttribute(dataAttribute)) {
          const attr = element.getAttribute(dataAttribute);
          acc[name] =
            typeof obj[name] === 'boolean'
              ? attr === 'true'
              : typeof obj[name] === 'number'
              ? Number(attr)
              : attr;
        }
      }

      return acc;
    }, {});
  };

  /**
   * Format options provided
   * @param {string} component
   * @param {Element} element
   * @return {object}
   */
  const formatOptions = (component, element) => {
    const defaultOptions = Axentix[component].getDefaultOptions();

    return getOptions(defaultOptions, component, element);
  };

  const setup = () => {
    const elements = document.querySelectorAll('[data-ax]');

    elements.forEach((el) => {
      let component = el.dataset.ax;
      component = component[0].toUpperCase() + component.slice(1).toLowerCase();

      if (!Axentix.Config.getDataElements().includes(component)) {
        console.error("[Axentix] Error: This component doesn't exist.", el);
        return;
      }

      try {
        const options = formatOptions(component, el);
        new Axentix[component](`#${el.id}`, options, true);
      } catch (error) {
        console.error('[Axentix] Data: Unable to load ' + component, error);
      }
    });
  };

  const setupAll = () => {
    new Axentix('all');
  };

  return {
    setup,
    setupAll,
    formatOptions,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.axentix ? Axentix.DataDetection.setupAll() : '';
  Axentix.DataDetection.setup();
});
