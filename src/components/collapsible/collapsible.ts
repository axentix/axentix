import { AxentixComponent, Component } from '../../utils/component';
import { instances, registerComponent } from '../../utils/config';
import { createEvent, getComponentOptions, getInstanceByType } from '../../utils/utilities';

interface ICollapsibleOptions {
  animationDuration?: number;
  sidenav?: {
    activeClass?: boolean;
    activeWhenOpen?: boolean;
    autoClose?: boolean;
  };
}

const CollapsibleOptions: ICollapsibleOptions = {
  animationDuration: 300,
  sidenav: {
    activeClass: true,
    activeWhenOpen: true,
    autoClose: true,
  },
};

export class Collapsible extends AxentixComponent implements Component {
  static getDefaultOptions = () => CollapsibleOptions;

  options: ICollapsibleOptions;

  #collapsibleTriggers: NodeListOf<HTMLElement>;
  #isInitialStart = true;
  #isActive = false;
  #isAnimated = false;
  #isInSidenav = false;
  #childIsActive = false;
  #listenerRef: any;
  #resizeRef: any;
  #sidenavId = '';

  constructor(element: string, options?: ICollapsibleOptions, isLoadedWithData?: boolean) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Collapsible', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Collapsible', options, this.el, isLoadedWithData);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Collapsible init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'collapsible.setup');

    this.#collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    this.#isInitialStart = true;
    this.#isActive = this.el.classList.contains('active') ? true : false;
    this.#isAnimated = false;
    this.#isInSidenav = false;
    this.#childIsActive = false;

    this.setupListeners();
    this.el.style.transitionDuration = this.options.animationDuration + 'ms';

    this.#detectSidenav();
    this.#detectChild();
    if (this.options.sidenav.activeClass) this.#addActiveInSidenav();

    if (this.#isActive) this.open();
    this.#isInitialStart = false;
  }

  setupListeners() {
    this.#listenerRef = this.#onClickTrigger.bind(this);
    this.#collapsibleTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.#listenerRef);
      }
    });

    this.#resizeRef = this.#handleResize.bind(this);
    window.addEventListener('resize', this.#resizeRef);
  }

  removeListeners() {
    this.#collapsibleTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) trigger.removeEventListener('click', this.#listenerRef);
    });
    this.#listenerRef = undefined;

    window.removeEventListener('resize', this.#resizeRef);
    this.#resizeRef = undefined;
  }

  #handleResize() {
    if (this.#isActive && !this.#isInSidenav) this.el.style.maxHeight = this.el.scrollHeight + 'px';
  }

  #detectSidenav() {
    const sidenavElem = this.el.closest('.sidenav');

    if (sidenavElem) {
      this.#isInSidenav = true;
      this.#sidenavId = sidenavElem.id;
    }
  }

  #detectChild() {
    this.#childIsActive = this.el.querySelector('active') ? true : false;
  }

  #addActiveInSidenav() {
    if (this.#childIsActive && this.#isInSidenav) {
      const triggers = document.querySelectorAll('.sidenav .collapsible-trigger');
      triggers.forEach((trigger: HTMLElement) => {
        if (trigger.dataset.target === this.el.id) trigger.classList.add('active');
      });

      this.el.classList.add('active');
      this.open();
      this.#isActive = true;
    }
  }

  /** Enable / disable active state to trigger when collapsible is in sidenav */
  #addActiveToTrigger(state: boolean) {
    const triggers = document.querySelectorAll('.sidenav .collapsible-trigger');

    triggers.forEach((trigger: HTMLElement) => {
      if (trigger.dataset.target === this.el.id) {
        if (state) trigger.classList.add('active');
        else trigger.classList.remove('active');
      }
    });
  }

  #autoClose() {
    if (!this.#isInitialStart && this.#isInSidenav) {
      getInstanceByType('Collapsible').forEach((collapsible) => {
        if (
          collapsible.#isInSidenav &&
          collapsible.#sidenavId === this.#sidenavId &&
          collapsible.el.id !== this.el.id
        )
          collapsible.close();
      });
    }
  }

  #applyOverflow() {
    this.el.style.overflow = 'hidden';
    setTimeout(() => {
      this.el.style.overflow = '';
    }, this.options.animationDuration);
  }

  #onClickTrigger(e: Event) {
    e.preventDefault();
    if (this.#isAnimated) return;

    if (this.#isActive) this.close();
    else this.open();
  }

  /** Open collapsible */
  open() {
    if (this.#isActive && !this.#isInitialStart) return;

    createEvent(this.el, 'collapsible.open');
    this.#isActive = true;
    this.#isAnimated = true;
    this.el.style.display = 'block';
    this.#applyOverflow();
    this.el.style.maxHeight = this.el.scrollHeight + 'px';

    if (this.options.sidenav.activeWhenOpen) this.#addActiveToTrigger(true);
    if (this.options.sidenav.autoClose) this.#autoClose();

    setTimeout(() => {
      this.#isAnimated = false;
    }, this.options.animationDuration);
  }

  /** Close collapsible */
  close() {
    if (!this.#isActive) return;

    createEvent(this.el, 'collapsible.close');
    this.#isAnimated = true;
    this.el.style.maxHeight = '';
    this.#applyOverflow();

    if (this.options.sidenav.activeWhenOpen) this.#addActiveToTrigger(false);

    setTimeout(() => {
      this.el.style.display = '';
      this.#isAnimated = false;
      this.#isActive = false;
    }, this.options.animationDuration);
  }
}

registerComponent({
  class: Collapsible,
  name: 'Collapsible',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.collapsible:not(.no-axentix-init)',
  },
});