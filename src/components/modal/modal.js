import { AxentixComponent } from '../../utils/component';
import { registerComponent } from '../../utils/config';
import { instances } from '../../utils/config';
import { createEvent, createOverlay, getComponentOptions, updateOverlay } from '../../utils/utilities';

/** @namespace */
const ModalOptions = {
  overlay: true,
  bodyScrolling: false,
  animationDuration: 400,
};

export class Modal extends AxentixComponent {
  static getDefaultOptions = () => ModalOptions;

  /** Private variables */
  /** @type {NodeListOf<HTMLElement>} */
  #modalTriggers;
  #isActive = false;
  #isAnimated = false;
  #listenerRef;

  /**
   * @param {string} element
   * @param {ModalOptions} [options]
   * @param {boolean} [isLoadedWithData]
   */
  constructor(element, options, isLoadedWithData) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Modal', instance: this });

      this.el = document.querySelector(element);

      /** @type {ModalOptions} */
      this.options = getComponentOptions('Modal', options, this.el, isLoadedWithData);

      this.#setup();
    } catch (error) {
      console.error('[Axentix] Modal init error', error);
    }
  }

  #setup() {
    createEvent(this.el, 'modal.setup');
    this.#modalTriggers = document.querySelectorAll('.modal-trigger');
    this.#isActive = this.el.classList.contains('active') ? true : false;
    this.#isAnimated = false;

    this.setupListeners();
    if (this.options.overlay)
      this.overlayElement = createOverlay(
        this.#isActive,
        this.options.overlay,
        this.el.id,
        this.options.animationDuration
      );
    this.el.style.transitionDuration = this.options.animationDuration + 'ms';
    this.el.style.animationDuration = this.options.animationDuration + 'ms';
  }

  setupListeners() {
    this.#listenerRef = this.#onClickTrigger.bind(this);
    this.#modalTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.#listenerRef);
      }
    });
  }

  removeListeners() {
    this.#modalTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.removeEventListener('click', this.#listenerRef);
      }
    });
    this.#listenerRef = undefined;
  }

  /** @param {boolean} state */
  #toggleBodyScroll(state) {
    if (!this.options.bodyScrolling) document.body.style.overflow = state ? '' : 'hidden';
  }

  #setZIndex() {
    const totalModals = document.querySelectorAll('.modal.active').length + 1;

    if (this.options.overlay) this.overlayElement.style.zIndex = 800 + totalModals * 6;
    this.el.style.zIndex = 800 + totalModals * 10;
  }

  /** @param {Event} e */
  #onClickTrigger(e) {
    e.preventDefault();
    if (this.#isAnimated) return;

    if (this.#isActive) this.close();
    else this.open();
  }

  /** Open Modal */
  open() {
    if (this.#isActive) return;

    createEvent(this.el, 'modal.open');
    this.#isActive = true;
    this.#isAnimated = true;
    this.#setZIndex();
    this.el.style.display = 'block';
    updateOverlay(this.options.overlay, this.overlayElement, this.#listenerRef, true);

    this.#toggleBodyScroll(false);
    setTimeout(() => {
      this.el.classList.add('active');
    }, 50);

    setTimeout(() => {
      this.#isAnimated = false;
      createEvent(this.el, 'modal.opened');
    }, this.options.animationDuration);
  }

  /** Close Modal */
  close() {
    if (!this.#isActive) return;

    createEvent(this.el, 'modal.close');
    this.#isAnimated = true;
    this.el.classList.remove('active');
    updateOverlay(
      this.options.overlay,
      this.overlayElement,
      this.#listenerRef,
      false,
      this.options.animationDuration
    );

    setTimeout(() => {
      this.el.style.display = '';
      this.#isAnimated = false;
      this.#isActive = false;
      this.#toggleBodyScroll(true);
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
