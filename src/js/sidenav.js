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
    this.defaultOptions = {
      overlay: true,
      bodyScrolling: false,
      animation: 'slide-in',
      animationDelay: 300
    };

    this.animationList = ['slide-in', 'push'];

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
    this.options = extend(this.defaultOptions, options);
    this.options.animation = this.options.animation.toLowerCase();

    this._setup();
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
      this._createOverlay();
      this.overlayElement.addEventListener('click', e => this._onClickTrigger(e, this.el.id));
    }
    this.el.classList.contains('large') ? document.body.classList.add('sidenav-large') : '';
    this.animationList.includes(this.options.animation) ? this._handleAnim() : '';
    this.el.style.transitionDuration = this.options.animationDelay + 'ms';
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
   * Add .anim-{name} to body
   */
  _handleAnim() {
    if (this.options.animation !== 'slide-in') {
      document.body.classList.add('anim-' + this.options.animation);
      document.body.style.transitionDuration = this.options.animationDelay + 'ms';
    }
  }

  /**
   * Enable or disable body scroll when option is true
   * @param {boolean} state Enable or disable body scroll
   */
  _toggleBodyScroll(state) {
    if (!this.options.bodyScrolling) {
      state ? (document.body.style.overflow = '') : (document.body.style.overflow = 'hidden');
    }
  }

  /**
   * Add .anim-active to body
   * @param {boolean} state Enable or disable animation
   */
  _toggleAnim(state) {
    if (this.options.animation !== 'slide-in') {
      state ? document.body.classList.add('anim-active') : document.body.classList.remove('anim-active');
    }
  }

  /**
   * Handle click on trigger
   */
  _onClickTrigger(e, id) {
    e.preventDefault();
    const sidenav = document.querySelector('#' + id).Sidenav;
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
    this._toggleAnim(true);
  }

  /**
   * Close sidenav
   */
  close() {
    this.el.classList.remove('active');
    this.overlay(false);
    this._toggleAnim(false);
    setTimeout(() => {
      this._toggleBodyScroll(true);
    }, this.options.animationDelay);
  }

  /**
   * Manage overlay
   * @param {boolean} state
   */
  overlay(state) {
    if (this.options.overlay) {
      state ? document.body.appendChild(this.overlayElement) : document.body.removeChild(this.overlayElement);
    }
  }
}
