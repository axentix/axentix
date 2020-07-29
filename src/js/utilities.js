Axentix.extend = (...args) => {
  return args.reduce((acc, obj) => {
    for (let key in obj) {
      typeof obj[key] === 'object' && obj[key] !== null
        ? (acc[key] = Axentix.extend(acc[key], obj[key]))
        : (acc[key] = obj[key]);
    }

    return acc;
  }, {});
};

Axentix.getComponentOptions = (component, options, el, isLoadedWithData) => {
  return Axentix.extend(
    Axentix[component].getDefaultOptions(),
    isLoadedWithData ? {} : Axentix.DataDetection.formatOptions(component, el),
    options
  );
};

/**
 * Wrap content inside an element (<div> by default)
 * @param {Array<Element>} target
 * @param {Element} wrapper
 * @return {Element}
 */
Axentix.wrap = (target, wrapper = document.createElement('div')) => {
  const parent = target[0].parentElement;
  target.forEach((elem) => wrapper.appendChild(elem));
  parent.appendChild(wrapper);
  return wrapper;
};

/**
 * Create custom event
 * @param {Element} element
 * @param {string} eventName
 * @param {Object} extraData
 */
Axentix.createEvent = (element, eventName, extraData) => {
  const event = new CustomEvent('ax.' + eventName, {
    detail: extraData || {},
    bubbles: true,
  });
  element.dispatchEvent(event);
};

Axentix.isTouchEnabled = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

/**
 * Get instance of element
 * @param {String} element Id of element
 */
Axentix.getInstance = (element) => {
  return Axentix.instances.filter((instance) => '#' + instance.el.id === element)[0];
};

/**
 * Get all instances
 */
Axentix.getAllInstances = () => {
  return Axentix.instances;
};

/**
 * Sync instance of element
 * @param {String} element Id of element
 */
Axentix.sync = (element) => {
  Axentix.getInstance(element).sync();
};

/**
 * Sync all instances
 */
Axentix.syncAll = () => {
  Axentix.instances.map((instance) => instance.sync());
};

/**
 * Reset instance of element
 * @param {String} element Id of element
 */
Axentix.reset = (element) => {
  Axentix.getInstance(element).reset();
};

/**
 * Reset all instances
 */
Axentix.resetAll = () => {
  Axentix.instances.map((instance) => instance.reset());
};
