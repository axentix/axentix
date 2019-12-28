/**
 * Class Modal
 * @class
 */
class Modal {
  /**
   * Construct Modal instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {
      overlay: true,
      bodyScrolling: false,
      animationDelay: 400
    };

    this.el = document.querySelector(element);
    this.el.Modal = this;
    this.modalTriggers = document.querySelectorAll('.modal-trigger');
    this.isActive = this.el.classList.contains('active') ? true : false;
    this.isAnimated = false;

    this.options = Axentix.extend(this.defaultOptions, options);

    if (this.options.overlay) {
      this._createOverlay();
    }

    this._setup();
    this.isActive ? this.open() : '';
  }

  /**
   * Setup listeners
   */
  _setup() {
    this.modalTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', e => this._onClickTrigger(e, this.el.id));
      }
    });
    if (this.options.overlay) {
      this.overlayElement.addEventListener('click', e => this._onClickTrigger(e, this.el.id));
    }
    this.el.style.transitionDuration = this.options.animationDelay + 'ms';
  }

  /**
   * Create overlay element
   */
  _createOverlay() {
    this.overlayElement = document.createElement('div');
    this.overlayElement.classList.add('modal-overlay');
    this.overlayElement.style.transitionDuration = this.options.animationDelay + 'ms';
    this.overlayElement.dataset.target = this.el.id;
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
   * Set Z-Index when modal is open
   */
  _setZIndex() {
    const totalModals = document.querySelectorAll('.modal.active').length + 1;

    this.options.overlay ? (this.overlayElement.style.zIndex = 800 + totalModals * 6) : '';
    this.el.style.zIndex = 800 + totalModals * 10;
  }

  /**
   * Handle click on trigger
   */
  _onClickTrigger(e, id) {
    e.preventDefault();
    const modal = document.querySelector('#' + id).Modal;

    if (modal.isAnimated) {
      return;
    }

    if (modal.isActive) {
      modal.close();
    } else {
      modal.open();
    }
  }

  /**
   * Open the modal
   */
  open() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.isAnimated = true;
    this._setZIndex();
    this.el.style.display = 'block';
    this.overlay(true);
    this._toggleBodyScroll(false);
    setTimeout(() => {
      this.el.classList.add('active');
    }, 50);

    setTimeout(() => {
      this.isAnimated = false;
    }, this.options.animationDelay);
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.isActive) {
      return;
    }
    this.isAnimated = true;
    this.el.classList.remove('active');
    this.overlay(false);
    setTimeout(() => {
      this.el.style.display = '';
      this.isAnimated = false;
      this.isActive = false;
      this._toggleBodyScroll(true);
    }, this.options.animationDelay);
  }

  /**
   * Manage overlay
   * @param {boolean} state
   */
  overlay(state) {
    if (this.options.overlay) {
      if (state) {
        document.body.appendChild(this.overlayElement);
        setTimeout(() => {
          this.overlayElement.classList.add('active');
        }, 50);
      } else {
        this.overlayElement.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(this.overlayElement);
        }, this.options.animationDelay);
      }
    }
  }
}
