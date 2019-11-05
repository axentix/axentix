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
      animationDelay: 400
    };

    this.el = document.querySelector(element);
    this.el.Modal = this;
    this.modalTriggers = document.querySelectorAll('.modal-trigger');
    this.isActive = this.el.classList.contains('active') ? true : false;
    this.isAnimated = false;

    this.options = extend(this.defaultOptions, options);

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
   * Set Z-Index when modal is open
   */
  _setZIndex() {
    const totalModals = document.querySelectorAll('.modal.active').length + 1;

    this.overlayElement.style.zIndex = 800 + totalModals * 6;
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
    modal.isActive = !modal.isActive;
  }

  /**
   * Open the modal
   */
  open() {
    this.isAnimated = true;
    this._setZIndex();
    this.el.style.display = 'block';
    this.overlay(true);
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
    this.isAnimated = true;
    this.el.classList.remove('active');
    this.overlay(false);
    setTimeout(() => {
      this.el.style.display = '';
      this.isAnimated = false;
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
