import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances } from '../../utils/config';
import {
  createEvent,
  createOverlay,
  getComponentOptions,
  updateOverlay,
  getTriggers,
} from '../../utils/utilities';

interface IModalOptions {
  overlay?: boolean;
  bodyScrolling?: boolean;
  animationDuration?: number;
}

const ModalOptions: IModalOptions = {
  overlay: true,
  bodyScrolling: false,
  animationDuration: 400,
};

export class Modal extends AxentixComponent implements Component {
  static getDefaultOptions = () => ModalOptions;

  options: IModalOptions;
  overlayElement: HTMLElement;

  #triggers: Array<HTMLElement>;
  #isActive = false;
  #isAnimated = false;
  #listenerRef: any;

  constructor(element: string, options?: IModalOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Modal', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Modal', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Modal init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'modal.setup');
    this.#triggers = getTriggers(this.el.id);
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
    this.#triggers.forEach((trigger) => trigger.addEventListener('click', this.#listenerRef));
  }

  removeListeners() {
    this.#triggers.forEach((trigger) => trigger.removeEventListener('click', this.#listenerRef));
    this.#listenerRef = undefined;
  }

  #toggleBodyScroll(state: boolean) {
    if (!this.options.bodyScrolling) document.body.style.overflow = state ? '' : 'hidden';
  }

  #setZIndex() {
    const totalModals = document.querySelectorAll('.modal.active').length + 1;

    if (this.options.overlay) this.overlayElement.style.zIndex = String(800 + totalModals * 10 - 2);
    this.el.style.zIndex = String(800 + totalModals * 10);
  }

  #onClickTrigger(e: Event) {
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
    updateOverlay(
      this.options.overlay,
      this.overlayElement,
      this.#listenerRef,
      true,
      this.options.animationDuration
    );

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
    selector: '.modal',
  },
});
