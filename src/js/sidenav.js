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
      animationDelay: 300
    };

    this.el = document.querySelector(element);
    this.el.Sidenav = this;
    this.sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
    this.isActive = false;
    this.isFixed = this.el.classList.contains('fixed');
    this.isLarge = this.el.classList.contains('large');

    this.options = extend(this.defaultOptions, options);

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
    this.el.classList.contains('right-aligned') ? this._handleRightSide() : '';
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

  _handleRightSide() {
    document.body.classList.add('sidenav-right');
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
  }

  /**
   * Open sidenav
   */
  open() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.el.classList.add('active');
    this.overlay(true);
    this._toggleBodyScroll(false);
  }

  /**
   * Close sidenav
   */
  close() {
    if (!this.isActive) {
      return;
    }
    this.el.classList.remove('active');
    this.overlay(false);
    setTimeout(() => {
      this._toggleBodyScroll(true);
      this.isActive = false;
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
