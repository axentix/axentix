Axentix.extend = (...args) => {
  return args.reduce((acc, obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc[key] = Axentix.extend(acc[key], obj[key]);
      } else {
        acc[key] = obj[key];
      }
    }

    return acc;
  }, {});
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

Axentix.getComponentOptions = (component, options, el, isLoadedWithData) => {
  return Axentix.extend(
    Axentix[component].getDefaultOptions(),
    isLoadedWithData ? {} : Axentix.DataDetection.formatOptions(component, el),
    options
  );
};
