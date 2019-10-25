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

    /**
     * Options
     * @member Modal#options
     * @property {boolean} overlay Toggle overlay when the modal is active
     * @property {integer} animationDelay Delay to show modal
     */
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
      this.overlayElement.addEventListener('click', this._onClickTrigger);
    }
  }

  _createOverlay() {
    this.overlayElement = document.createElement('div');
    this.overlayElement.classList.add('modal-overlay');
    this.overlayElement.dataset.target = this.el.id;
  }

  /**
   * Handle click on trigger
   */
  _onClickTrigger(e, id) {
    e.preventDefault();
    const idElem = id ? '#' + id : '#' + document.querySelector('.' + e.target.className).dataset.target;
    const modal = document.querySelector(idElem).Modal;

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
    this.el.classList.add('active');
    this.overlay(true);
  }

  /**
   * Close the modal
   */

  close() {
    this.el.classList.remove('active');
    this.overlay(false);
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
