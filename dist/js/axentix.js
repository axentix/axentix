"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Component: Ghost-Loading
 * Class GhostLoader
 * @class
 */
var GhostLoader =
/*#__PURE__*/
function () {
  /**
   * Construct GhostLoader instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  function GhostLoader(element, options) {
    _classCallCheck(this, GhostLoader);

    this.el = document.querySelector(element);

    this._getData();

    this._createOverlay();
    /**
     * Options
     * @member GhostLoader#options
     * @property {boolean} fullElement
     * @property {number} nbBar
     * @property {String} backgroundColor
     * @property {String} customClass
     */
    // this.options = options;

  }
  /**
   * Get dimension of element
   */


  _createClass(GhostLoader, [{
    key: "_getData",
    value: function _getData() {
      this.width = this.el.clientWidth;
      this.height = this.el.clientHeight;
    }
    /**
     * Create ghost overlay
     */

  }, {
    key: "_createOverlay",
    value: function _createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('ghost-overlay');
      this.overlay.style.width = this.width + 'px';
      this.overlay.style.height = this.height + 'px';
    }
    /**
     * Enable / Disable loader
     * @param {boolean} state
     */

  }, {
    key: "load",
    value: function load(state) {
      if (!state) {
        this.el.removeChild(this.overlay);
      } else {
        this.el.appendChild(this.overlay);
      }
    }
  }]);

  return GhostLoader;
}();
"use strict";

// By https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/ | MIT License
// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
function extend() {
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  }

  var merge = function merge(obj) {
    for (var prop in obj) {
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
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
}
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Component: Sidenav
 */
var defaultOptions = {
  overlay: true,
  bodyScrolling: true
};
/**
 * Class Sidenav
 * @class
 */

var Sidenav =
/*#__PURE__*/
function () {
  /**
   * Construct Sidenav instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  function Sidenav(element, options) {
    _classCallCheck(this, Sidenav);

    this.el = document.querySelector(element);
    this.el.Sidenav = this;
    this.sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
    this.isActive = false;
    this.isFixed = this.el.classList.contains('fixed');
    this.isLarge = this.el.classList.contains('large');
    /**
     * Options
     * @member Sidenav#options
     * @property {boolean} overlay Toggle overlay when sidenav is active
     * @property {boolean} bodyScrolling Prevent bodyScrolling when sidenav is active and over content
     */

    this.options = extend(defaultOptions, options);

    if (this.options.overlay) {
      this._createOverlay();
    }

    this._setup();

    this.el.classList.contains('large') ? document.body.classList.add('sidenav-large') : '';
  }
  /**
   * Setup listeners
   */


  _createClass(Sidenav, [{
    key: "_setup",
    value: function _setup() {
      var _this = this;

      this.sidenavTriggers.forEach(function (trigger) {
        if (trigger.dataset.target === _this.el.id) {
          trigger.addEventListener('click', function (e) {
            return _this._onClickTrigger(e, _this.el.id);
          });
        }
      });

      if (this.options.overlay) {
        this.overlayElement.addEventListener('click', this._onClickTrigger);
      }
    }
    /**
     * Create overlay element
     */

  }, {
    key: "_createOverlay",
    value: function _createOverlay() {
      this.overlayElement = document.createElement('div');
      this.overlayElement.classList.add('sidenav-overlay');
      this.overlayElement.dataset.target = this.el.id;
    }
    /**
     * Enable or disable body scroll when option is true
     * @param {boolean} state Enable or disable body scroll
     */

  }, {
    key: "_toggleBodyScroll",
    value: function _toggleBodyScroll(state) {
      if (this.options.bodyScrolling) {
        if (state) {
          document.body.style.overflow = '';
        } else {
          document.body.style.overflow = 'hidden';
        }
      }
    }
    /**
     * Handle click on trigger
     */

  }, {
    key: "_onClickTrigger",
    value: function _onClickTrigger(e, id) {
      e.preventDefault();
      var idElem = id ? '#' + id : '#' + document.querySelector('.' + e.target.className).dataset.target;
      var sidenav = document.querySelector(idElem).Sidenav;

      if (sidenav.isFixed && window.innerWidth >= 960) {
        return;
      }

      if (sidenav.isActive) {
        sidenav.close();
      } else {
        sidenav.open();
      }

      sidenav.isActive = !sidenav.isActive;
    }
    /**
     * Open sidenav
     */

  }, {
    key: "open",
    value: function open() {
      this.el.classList.add('active');
      this.overlay(true);

      this._toggleBodyScroll(false);
    }
    /**
     * Close sidenav
     */

  }, {
    key: "close",
    value: function close() {
      this.el.classList.remove('active');
      this.overlay(false);

      this._toggleBodyScroll(true);
    }
    /**
     * Manage overlay
     * @param {boolean} state
     */

  }, {
    key: "overlay",
    value: function overlay(state) {
      if (this.options.overlay) {
        if (state) {
          document.body.appendChild(this.overlayElement);
        } else {
          document.body.removeChild(this.overlayElement);
        }
      }
    }
  }]);

  return Sidenav;
}();