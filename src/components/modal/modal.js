import { AxentixComponent } from '../../utils/component';
import { registerComponent } from '../../utils/config';
import { instances } from '../../utils/core';
import { createEvent, createOverlay, getComponentOptions, updateOverlay } from '../../utils/utilities';

export class Modal extends AxentixComponent {
  static getDefaultOptions() {
    return {
      overlay: true,
      bodyScrolling: false,
      animationDuration: 400,
    };
  }

  /**
   * Construct Modal instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options, isLoadedWithData) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Modal', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Modal', options, this.el, isLoadedWithData);

      this._setup();
    } catch (error) {
      console.error('[Axentix] Modal init error', error);
    }
  }

  /**
   * Setup component
   */
  _setup() {
    createEvent(this.el, 'modal.setup');
    this.modalTriggers = document.querySelectorAll('.modal-trigger');
    this.isActive = this.el.classList.contains('active') ? true : false;
    this.isAnimated = false;

    this._setupListeners();
    if (this.options.overlay)
      this.overlayElement = createOverlay(
        this.isActive,
        this.options.overlay,
        this.el.id,
        this.options.animationDuration
      );
    this.el.style.transitionDuration = this.options.animationDuration + 'ms';
    this.el.style.animationDuration = this.options.animationDuration + 'ms';
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.listenerRef = this._onClickTrigger.bind(this);
    this.modalTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.listenerRef);
      }
    });
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.modalTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.removeEventListener('click', this.listenerRef);
      }
    });
    this.listenerRef = undefined;
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
  _onClickTrigger(e) {
    e.preventDefault();
    if (this.isAnimated) {
      return;
    }

    this.isActive ? this.close() : this.open();
  }

  /**
   * Open the modal
   */
  open() {
    if (this.isActive) {
      return;
    }
    createEvent(this.el, 'modal.open');
    this.isActive = true;
    this.isAnimated = true;
    this._setZIndex();
    this.el.style.display = 'block';
    updateOverlay(this.options.overlay, this.overlayElement, this.listenerRef, true);

    this._toggleBodyScroll(false);
    setTimeout(() => {
      this.el.classList.add('active');
    }, 50);

    setTimeout(() => {
      this.isAnimated = false;
      createEvent(this.el, 'modal.opened');
    }, this.options.animationDuration);
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.isActive) {
      return;
    }
    createEvent(this.el, 'modal.close');
    this.isAnimated = true;
    this.el.classList.remove('active');
    updateOverlay(
      this.options.overlay,
      this.overlayElement,
      this.listenerRef,
      false,
      this.options.animationDuration
    );

    setTimeout(() => {
      this.el.style.display = '';
      this.isAnimated = false;
      this.isActive = false;
      this._toggleBodyScroll(true);
      createEvent(this.el, 'modal.closed');
    }, this.options.animationDuration);
  }
}

registerComponent({
  class: Modal,
  name: 'Modal',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.modal:not(.no-axentix-init)',
  },
});
