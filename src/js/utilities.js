// By https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/ | MIT License
Axentix.extend = function() {
  let extended = {};
  let deep = false;
  let i = 0;
  let length = arguments.length;

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  }

  let merge = function(obj) {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for (; i < length; i++) {
    let obj = arguments[i];
    merge(obj);
  }

  return extended;
};

/**
 * Wrap content inside an element (<div> by default)
 * @param {Array<Element>} target
 * @param {Element} wrapper
 * @return {Element}
 */
Axentix.wrap = (target, wrapper = document.createElement('div')) => {
  const parent = target[0].parentElement;
  target.forEach(elem => wrapper.appendChild(elem));
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
    bubbles: true
  });
  element.dispatchEvent(event);
};
