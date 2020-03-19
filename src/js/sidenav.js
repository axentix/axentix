/**
 * Class Sidenav
 * @class
 */
class Sidenav extends AxentixComponent {
  /**
   * Construct Sidenav instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    super();
    this.defaultOptions = {
      overlay: true,
      bodyScrolling: false,
      animationDelay: 300
    };

    this.el = document.querySelector(element);

    this.options = Axentix.extend(this.defaultOptions, options);
    this._setup();
  }

  /**
   * Setup component
   */
  _setup() {
    Axentix.createEvent(this.el, 'sidenav.setup');
    this.sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
    this.isActive = false;
    this.isFixed = this.el.classList.contains('fixed');
    this.isLarge = this.el.classList.contains('large');

    this._setupListeners();

    this.options.overlay ? this._createOverlay() : '';

    this.el.classList.contains('large')
      ? document.body.classList.add('sidenav-large')
      : document.body.classList.remove('sidenav-large');

    this._handleRightSidenav();
    this.el.style.transitionDuration = this.options.animationDelay + 'ms';
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.listenerRef = this._onClickTrigger.bind(this);
    this.sidenavTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.listenerRef);
      }
    });
    this.windowResizeRef = this.close.bind(this);
    window.addEventListener('resize', this.windowResizeRef);
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.sidenavTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.removeEventListener('click', this.listenerRef);
      }
    });
    this.listenerRef = undefined;
    window.removeEventListener('resize', this.windowResizeRef);
    this.windowResizeRef = undefined;
  }

  /**
   * Handle right sidenav detection
   */
  _handleRightSidenav() {
    const sidenavs = document.querySelectorAll('.sidenav');
    const found = Array.from(sidenavs).some(sidenav => sidenav.classList.contains('right-aligned'));

    if (found && !document.body.classList.contains('sidenav-right')) {
      document.body.classList.add('sidenav-right');
    } else if (!found && document.body.classList.contains('sidenav-right')) {
      document.body.classList.remove('sidenav-right');
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
   * @param {boolean} state
   */
  _toggleBodyScroll(state) {
    if (!this.options.bodyScrolling) {
      state ? (document.body.style.overflow = '') : (document.body.style.overflow = 'hidden');
    }
  }

  /**
   * Handle click on trigger
   * @param {Event} e
   */
  _onClickTrigger(e) {
    e.preventDefault();
    if (this.isFixed && window.innerWidth >= 960) {
      return;
    }

    this.isActive ? this.close() : this.open();
  }

  /**
   * Open sidenav
   */
  open() {
    if (this.isActive) {
      return;
    }
    Axentix.createEvent(this.el, 'sidenav.open');
    this.isActive = true;
    this.el.classList.add('active');
    this.overlay(true);
    this._toggleBodyScroll(false);

    setTimeout(() => {
      Axentix.createEvent(this.el, 'sidenav.opened');
    }, this.options.animationDelay);
  }

  /**
   * Close sidenav
   */
  close() {
    if (!this.isActive) {
      return;
    }
    Axentix.createEvent(this.el, 'sidenav.close');
    this.el.classList.remove('active');
    this.overlay(false);
    setTimeout(() => {
      this._toggleBodyScroll(true);
      this.isActive = false;
      Axentix.createEvent(this.el, 'sidenav.closed');
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
Axentix.Sidenav = Sidenav;
