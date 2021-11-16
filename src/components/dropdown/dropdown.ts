import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent } from '../../utils/config';
import { instances } from '../../utils/config';
import { createEvent, getComponentOptions, getInstanceByType } from '../../utils/utilities';

interface IDropdownOptions {
  animationDuration?: number;
  animationType?: 'none' | 'fade';
  hover?: boolean;
  autoClose?: boolean;
  preventViewport?: boolean;
}

const DropdownOptions: IDropdownOptions = {
  animationDuration: 300,
  animationType: 'none',
  hover: false,
  autoClose: true,
  preventViewport: false,
};

export class Dropdown extends AxentixComponent implements Component {
  static getDefaultOptions = () => DropdownOptions;

  options: IDropdownOptions;

  #dropdownContent: HTMLElement;
  #dropdownTrigger: HTMLElement;
  #isAnimated = false;
  #isActive = false;
  #documentClickRef: any;
  #listenerRef: any;

  constructor(element: string, options?: IDropdownOptions, isLoadedWithData?: boolean) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Dropdown', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Dropdown', options, this.el, isLoadedWithData);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Dropdown init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'dropdown.setup');

    this.#dropdownContent = this.el.querySelector('.dropdown-content');
    this.#dropdownTrigger = this.el.querySelector('.dropdown-trigger');
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
    this.#dropdownTrigger.addEventListener('click', this.#listenerRef);

    this.#documentClickRef = this.#onDocumentClick.bind(this);
    document.addEventListener('click', this.#documentClickRef, true);
  }

  removeListeners() {
    if (this.options.hover) return;

    this.#dropdownTrigger.removeEventListener('click', this.#listenerRef);
    this.#listenerRef = undefined;

    document.removeEventListener('click', this.#documentClickRef, true);
    this.#documentClickRef = undefined;
  }

  #setupAnimation() {
    const animationList = ['none', 'fade'];
    // @ts-ignore
    this.options.animationType = this.options.animationType.toLowerCase();
    if (!animationList.includes(this.options.animationType)) this.options.animationType = 'none';

    if (this.options.animationType !== 'none' && !this.options.hover) {
      if (this.options.hover) {
        this.el.style.animationDuration = this.options.animationDuration + 'ms';
      } else {
        this.el.style.transitionDuration = this.options.animationDuration + 'ms';
      }
      this.el.classList.add('dropdown-anim-' + this.options.animationType);
    }
  }

  #onDocumentClick(e: any) {
    if (e.target.matches('.dropdown-trigger') || this.#isAnimated || !this.#isActive) return;

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
      this.#isAnimated = false;
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
    selector: '.dropdown:not(.no-axentix-init)',
  },
});