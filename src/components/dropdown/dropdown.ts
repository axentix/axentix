import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances } from '../../utils/config';
import { createEvent, getComponentOptions, getInstanceByType, getTriggers } from '../../utils/utilities';

interface IDropdownOptions {
  animationDuration?: number;
  animationType?: 'none' | 'fade';
  hover?: boolean;
  autoClose?: boolean;
  preventViewport?: boolean;
  closeOnClick?: boolean;
}

const DropdownOptions: IDropdownOptions = {
  animationDuration: 300,
  animationType: 'none',
  hover: false,
  autoClose: true,
  preventViewport: false,
  closeOnClick: true,
};

export class Dropdown extends AxentixComponent implements Component {
  static getDefaultOptions = () => DropdownOptions;

  options: IDropdownOptions;

  #dropdownContent: HTMLElement;
  #trigger: HTMLElement;
  #isAnimated = false;
  #isActive = false;
  #documentClickRef: any;
  #listenerRef: any;
  #contentHeightRef: any;

  constructor(element: string, options?: IDropdownOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Dropdown', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Dropdown', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Dropdown init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'dropdown.setup');

    this.#dropdownContent = this.el.querySelector('.dropdown-content');
    this.#trigger = getTriggers(this.el.id)[0];
    this.#isAnimated = false;
    this.#isActive = this.el.classList.contains('active') ? true : false;

    if (this.options.hover) this.el.classList.add('active-hover');
    else this.setupListeners();

    if (this.options.preventViewport) this.el.classList.add('dropdown-vp');

    this.#setupAnimation();
  }

  setupListeners() {
    if (this.options.hover) return;

    this.#listenerRef = this.#onClickTrigger.bind(this);
    this.#trigger.addEventListener('click', this.#listenerRef);

    this.#documentClickRef = this.#onDocumentClick.bind(this);
    document.addEventListener('click', this.#documentClickRef, true);

    this.#contentHeightRef = this.#setContentHeight.bind(this);
    if (this.options.preventViewport) window.addEventListener('scroll', this.#contentHeightRef);
  }

  removeListeners() {
    if (this.options.hover) return;

    this.#trigger.removeEventListener('click', this.#listenerRef);
    this.#listenerRef = undefined;

    document.removeEventListener('click', this.#documentClickRef, true);
    this.#documentClickRef = undefined;

    if (this.options.preventViewport) window.removeEventListener('scroll', this.#contentHeightRef);
    this.#contentHeightRef = undefined;
  }

  #setupAnimation() {
    const animationList = ['none', 'fade'];
    // @ts-ignore
    this.options.animationType = this.options.animationType.toLowerCase();
    if (!animationList.includes(this.options.animationType)) this.options.animationType = 'none';

    if (this.options.animationType === 'fade' && !this.options.hover) {
      this.#dropdownContent.style.transitionDuration = this.options.animationDuration + 'ms';
      this.el.classList.add('dropdown-anim-fade');
    }
  }

  #onDocumentClick(e: any) {
    if (
      e.target === this.#trigger ||
      this.#isAnimated ||
      !this.#isActive ||
      (!this.options.closeOnClick && e.target.closest('.dropdown-content'))
    )
      return;

    this.close();
  }

  #onClickTrigger(e: Event) {
    e.preventDefault();
    if (this.#isAnimated) return;

    if (this.#isActive) this.close();
    else this.open();
  }

  #autoClose() {
    getInstanceByType('Dropdown').forEach((dropdown) => {
      if (dropdown.el.id !== this.el.id) dropdown.close();
    });
  }

  #setContentHeight() {
    const elRect = this.#dropdownContent.getBoundingClientRect();

    const bottom =
      elRect.height - (elRect.bottom - (window.innerHeight || document.documentElement.clientHeight)) - 10;

    this.#dropdownContent.style.maxHeight = bottom + 'px';
  }

  /** Open dropdown */
  open() {
    if (this.#isActive) return;

    createEvent(this.el, 'dropdown.open');
    this.#dropdownContent.style.display = 'flex';

    if (this.options.preventViewport) this.#setContentHeight();

    setTimeout(() => {
      this.el.classList.add('active');
      this.#isActive = true;
    }, 10);

    if (this.options.autoClose) this.#autoClose();

    if (this.options.animationType !== 'none') {
      this.#isAnimated = true;
      setTimeout(() => {
        this.#isAnimated = false;
        createEvent(this.el, 'dropdown.opened');
      }, this.options.animationDuration);
    } else {
      createEvent(this.el, 'dropdown.opened');
    }
  }

  /** Close dropdown */
  close() {
    if (!this.#isActive) return;

    createEvent(this.el, 'dropdown.close');
    this.el.classList.remove('active');

    if (this.options.animationType !== 'none') {
      this.#isAnimated = true;
      setTimeout(() => {
        this.#dropdownContent.style.display = '';
        this.#isAnimated = false;
        this.#isActive = false;
        createEvent(this.el, 'dropdown.closed');
      }, this.options.animationDuration);
    } else {
      this.#dropdownContent.style.display = '';
      this.#isActive = false;
      createEvent(this.el, 'dropdown.closed');
    }
  }
}

registerComponent({
  class: Dropdown,
  name: 'Dropdown',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.dropdown',
  },
});
