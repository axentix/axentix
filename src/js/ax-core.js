/**
 * Class Axentix
 * @class
 */
class Axentix {
  /**
   * Construct Axentix instance
   * @constructor
   * @param {String} component
   * @param {Object} options
   */
  constructor(component, options) {
    this.component = component[0].toUpperCase() + component.slice(1);
    this.isAll = component === 'all' ? true : false;
    this.options = this.isAll ? {} : options;
    this.instances = [];

    this._init();
  }

  /**
   * Init components
   */
  _init() {
    const componentList = {
      Collapsible: document.querySelectorAll('.collapsible:not(.no-axentix-init)'),
      Sidenav: document.querySelectorAll('.sidenav:not(.no-axentix-init)'),
      Modal: document.querySelectorAll('.modal:not(.no-axentix-init)'),
      Dropdown: document.querySelectorAll('.dropdown:not(.no-axentix-init)'),
      Tab: document.querySelectorAll('.tab:not(.no-axentix-init)'),
      Fab: document.querySelectorAll('.fab:not(i):not(.no-axentix-init)'),
      Caroulix: document.querySelectorAll('.caroulix:not(.no-axentix-init)'),
    };

    const isInList = componentList.hasOwnProperty(this.component);
    if (isInList) {
      const ids = this._detectIds(componentList[this.component]);
      this._instanciate(ids, this.component);
    } else if (this.isAll) {
      Object.keys(componentList).map((component) => {
        let ids = this._detectIds(componentList[component]);
        ids.length > 0 ? this._instanciate(ids, component) : '';
      });
    }
  }

  /**
   * Detects all ids
   * @param {NodeListOf<Element>} component
   * @return {Array<String>}
   */
  _detectIds(component) {
    let idList = [];
    component.forEach((el) => {
      idList.push('#' + el.id);
    });
    return idList;
  }

  /**
   * Instanciate components
   * @param {Array<String>} ids
   * @param {String} component
   */
  _instanciate(ids, component) {
    ids.map((id) => {
      let constructor = Axentix[component];
      let args = [id, this.options];

      try {
        this.instances.push(new constructor(...args));
      } catch (error) {
        console.error('Axentix : Unable to load ' + component);
      }
    });
  }

  /**
   * Get instance of element
   * @param {String} element Id of element
   */
  getInstance(element) {
    return this.instances.filter((instance) => '#' + instance.el.id === element)[0];
  }

  /**
   * Get all instances
   */
  getAllInstances() {
    return this.instances;
  }

  /**
   * Sync instance of element
   * @param {String} element Id of element
   */
  sync(element) {
    this.getInstance(element).sync();
  }

  /**
   * Sync all instances
   */
  syncAll() {
    this.instances.map((instance) => instance.sync());
  }

  /**
   * Reset instance of element
   * @param {String} element Id of element
   */
  reset(element) {
    this.getInstance(element).reset();
  }

  /**
   * Reset all instances
   */
  resetAll() {
    this.instances.map((instance) => instance.reset());
  }
}

Axentix.DataDetection = (() => {
  const availableComponents = [
    'Caroulix',
    'Collapsible',
    'Dropdown',
    'Fab',
    'Modal',
    'Sidenav',
    'Stepper',
    'Tab',
    'Tooltip',
  ];

  /**
   * Format options provided
   * @param {Element} element
   * @param {string} component
   * @return {object}
   */
  const formatOptions = (element, component) => {
    const defaultOptions = Axentix[component].getDefaultOptions();
    const defaultOptionKeys = Object.keys(defaultOptions);
    let options = {};

    defaultOptionKeys.map((name) => {
      const formattedName = name
        .replace(/[\w]([A-Z])/g, (s) => {
          return s[0] + '-' + s[1];
        })
        .toLowerCase();

      const dataAttribute = 'data-' + component.toLowerCase() + '-' + formattedName;
      if (element.hasAttribute(dataAttribute)) {
        options[name] = element.getAttribute(dataAttribute);
      }
    });

    return options;
  };

  const setup = () => {
    const elements = document.querySelectorAll('[data-ax]');
    let instanciateElements = [];

    elements.forEach((el) => {
      let component = el.dataset.ax;
      component = component[0].toUpperCase() + component.slice(1);

      if (!availableComponents.includes(component)) {
        console.error("Error: Component don't exist.", el);
        return;
      }

      const options = formatOptions(el, component);

      instanciateElements.push(new Axentix[component](...[`#${el.id}`, options]));
    });

    Axentix.dataElements = instanciateElements;
  };

  const setupAll = () => {
    Axentix.axentix = new Axentix('all');
  };

  return {
    setup,
    setupAll,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.axentix ? Axentix.DataDetection.setupAll() : '';
  Axentix.DataDetection.setup();
});
