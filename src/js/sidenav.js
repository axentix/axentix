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
    this.sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
    this.isActive = false;
    this.isFixed = this.el.classList.contains('fixed');
    this.isLarge = this.el.classList.contains('large');

    this.options = Axentix.extend(this.defaultOptions, options);

    this._setup();
  }

  /**
   * Setup listeners
   */
  _setup() {
    this.listenerRef = this._onClickTrigger.bind(this);
    this.sidenavTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.listenerRef);
      }
    });
    if (this.options.overlay) {
      this._createOverlay();
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
  _onClickTrigger(e) {
    e.preventDefault();
    if (this.isFixed && window.innerWidth >= 960) {
      return;
    }

    if (this.isActive) {
      this.close();
    } else {
      this.open();
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
      if (state) {
        this.overlayElement.addEventListener('click', this.listenerRef);
        document.body.appendChild(this.overlayElement);
      } else {
        this.overlayElement.removeEventListener('click', this.listenerRef);
        document.body.removeChild(this.overlayElement);
      }
    }
  }
}
