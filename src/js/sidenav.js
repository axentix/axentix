/**
 * Component: Sidenav
 */

let defaultOptions = {
  overlay: true,
  bodyScrolling: true
};

/**
 * Class Sidenav
 * @class
 */
class Sidenav {
  /**
   * Construct Sidenav instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
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
  _setup() {
    this.sidenavTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', e => this._onClickTrigger(e, this.el.id));
      }
    });
    if (this.options.overlay) {
      this.overlayElement.addEventListener('click', this._onClickTrigger);
    }
  }

  /**
   * Create overlay element
   */
  _createOverlay() {
    this.overlayElement = document.createElement('div');
    this.overlayElement.classList.add('sidenav-overlay');
    this.overlayElement.dataset.target = this.el.id;
  }

  /**
   * Enable or disable body scroll when option is true
   * @param {boolean} state Enable or disable body scroll
   */
  _toggleBodyScroll(state) {
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
  _onClickTrigger(e, id) {
    e.preventDefault();
    const idElem = id ? '#' + id : '#' + document.querySelector('.' + e.target.className).dataset.target;
    const sidenav = document.querySelector(idElem).Sidenav;
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
  open() {
    this.el.classList.add('active');
    this.overlay(true);
    this._toggleBodyScroll(false);
  }

  /**
   * Close sidenav
   */
  close() {
    this.el.classList.remove('active');
    this.overlay(false);
    this._toggleBodyScroll(true);
  }

  /**
   * Manage overlay
   * @param {boolean} state
   */
  overlay(state) {
    if (this.options.overlay) {
      if (state) {
        document.body.appendChild(this.overlayElement);
      } else {
        document.body.removeChild(this.overlayElement);
      }
    }
  }
}
