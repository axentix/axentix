import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances } from '../../utils/config';
import { createEvent, getComponentOptions, getTriggers } from '../../utils/utilities';

interface IFabOptions {
  animationDuration?: number;
  hover?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offsetX?: string;
  offsetY?: string;
}

const FabOptions: IFabOptions = {
  animationDuration: 300,
  hover: true,
  direction: 'top',
  position: 'bottom-right',
  offsetX: '1rem',
  offsetY: '1.5rem',
};

export class Fab extends AxentixComponent implements Component {
  static getDefaultOptions = () => FabOptions;

  options: IFabOptions;

  #isAnimated = false;
  #isActive = false;
  #trigger: HTMLElement;
  #fabMenu: HTMLElement;
  #openRef: any;
  #closeRef: any;
  #documentClickRef: any;
  #listenerRef: any;

  constructor(element: string, options?: IFabOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Fab', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Fab', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Fab init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'fab.setup');

    this.#isAnimated = false;
    this.#isActive = false;
    this.#trigger = getTriggers(this.el.id)[0];
    this.#fabMenu = this.el.querySelector('.fab-menu');

    this.#verifOptions();
    this.setupListeners();
    this.el.style.transitionDuration = this.options.animationDuration + 'ms';
    this.#setProperties();
  }

  #verifOptions() {
    const directionList = ['right', 'left', 'top', 'bottom'];
    if (!directionList.includes(this.options.direction)) this.options.direction = 'top';

    const positionList = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
    if (!positionList.includes(this.options.position)) this.options.position = 'bottom-right';
  }

  setupListeners() {
    if (this.options.hover) {
      this.#openRef = this.open.bind(this);
      this.#closeRef = this.close.bind(this);
      this.el.addEventListener('mouseenter', this.#openRef);
      this.el.addEventListener('mouseleave', this.#closeRef);
    } else {
      this.#listenerRef = this.#onClickTrigger.bind(this);
      this.el.addEventListener('click', this.#listenerRef);
    }

    this.#documentClickRef = this.#handleDocumentClick.bind(this);
    document.addEventListener('click', this.#documentClickRef, true);
  }

  removeListeners() {
    if (this.options.hover) {
      this.el.removeEventListener('mouseenter', this.#openRef);
      this.el.removeEventListener('mouseleave', this.#closeRef);
      this.#openRef = undefined;
      this.#closeRef = undefined;
    } else {
      this.el.removeEventListener('click', this.#listenerRef);
      this.#listenerRef = undefined;
    }

    document.removeEventListener('click', this.#documentClickRef, true);
    this.#documentClickRef = undefined;
  }

  #setProperties() {
    if (this.options.position.split('-')[0] === 'top') this.el.style.top = this.options.offsetY;
    else this.el.style.bottom = this.options.offsetY;

    if (this.options.position.split('-')[1] === 'right') this.el.style.right = this.options.offsetX;
    else this.el.style.left = this.options.offsetX;

    if (this.options.direction === 'right' || this.options.direction === 'left')
      this.el.classList.add('fab-dir-x');

    this.#setMenuPosition();
  }

  #setMenuPosition() {
    if (this.options.direction === 'top' || this.options.direction === 'bottom') {
      const height = this.#trigger.clientHeight;
      if (this.options.direction === 'top') this.#fabMenu.style.bottom = height + 'px';
      else this.#fabMenu.style.top = height + 'px';
    } else {
      const width = this.#trigger.clientWidth;
      if (this.options.direction === 'right') this.#fabMenu.style.left = width + 'px';
      else this.#fabMenu.style.right = width + 'px';
    }
  }

  #handleDocumentClick(e: any) {
    const isInside = this.el.contains(e.target);

    if (!isInside && this.#isActive) this.close();
  }

  #onClickTrigger(e: Event) {
    e.preventDefault();
    if (this.#isAnimated) return;

    if (this.#isActive) this.close();
    else this.open();
  }

  /** Open fab */
  open() {
    if (this.#isActive) return;

    createEvent(this.el, 'fab.open');
    this.#isAnimated = true;
    this.#isActive = true;
    this.el.classList.add('active');
    setTimeout(() => {
      this.#isAnimated = false;
    }, this.options.animationDuration);
  }

  /** Close fab */
  close() {
    if (!this.#isActive) return;

    createEvent(this.el, 'fab.close');
    this.#isAnimated = true;
    this.#isActive = false;
    this.el.classList.remove('active');
    setTimeout(() => {
      this.#isAnimated = false;
    }, this.options.animationDuration);
  }
}

registerComponent({
  class: Fab,
  name: 'Fab',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.fab:not(i)',
  },
});
