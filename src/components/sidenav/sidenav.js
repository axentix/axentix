import { registerComponent } from '../../utils/config';
import { AxentixComponent } from '../../utils/component';
import { instances } from '../../utils/config';
import {
  createEvent,
  createOverlay,
  getComponentOptions,
  getInstanceByType,
  updateOverlay,
} from '../../utils/utilities';

/** @namespace */
const SidenavOptions = {
  overlay: true,
  bodyScrolling: false,
  animationDuration: 300,
};

export class Sidenav extends AxentixComponent {
  static getDefaultOptions = () => SidenavOptions;

  /** Private variables */
  /** @type {NodeListOf<HTMLElement>} */
  #sidenavTriggers;
  #isActive = false;
  #isAnimated = false;
  #isFixed = false;
  #firstSidenavInit = false;
  /** @type {HTMLElement} */
  #layoutEl;
  /** @type {HTMLElement} */
  #overlayElement;
  #listenerRef;
  #windowResizeRef;

  /**
   * @param {string} element
   * @param {SidenavOptions} [options]
   * @param {boolean} [isLoadedWithData]
   */
  constructor(element, options, isLoadedWithData) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Sidenav', instance: this });

      this.el = document.querySelector(element);

      /** @type {SidenavOptions} */
      this.options = getComponentOptions('Sidenav', options, this.el, isLoadedWithData);

      this.#setup();
    } catch (error) {
      console.error('[Axentix] Sidenav init error', error);
    }
  }

  #setup() {
    createEvent(this.el, 'sidenav.setup');
    this.#sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
    this.#isActive = false;
    this.#isAnimated = false;
    this.#isFixed = this.el.classList.contains('sidenav-fixed');

    const sidenavFixed = getInstanceByType('Sidenav').find((sidenav) => sidenav.#isFixed);
    this.#firstSidenavInit = sidenavFixed && sidenavFixed.el === this.el;

    this.#layoutEl = document.querySelector('.layout, [class*="layout-"]');

    if (this.#layoutEl && this.#firstSidenavInit) this.#cleanLayout();

    this.setupListeners();

    if (this.options.overlay)
      this.#overlayElement = createOverlay(
        this.#isActive,
        this.options.overlay,
        this.el.id,
        this.options.animationDuration
      );

    if (this.#layoutEl && this.#isFixed) this.#handleMultipleSidenav();

    this.el.style.transitionDuration = this.options.animationDuration + 'ms';
  }

  setupListeners() {
    this.#listenerRef = this.#onClickTrigger.bind(this);
    this.#sidenavTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) trigger.addEventListener('click', this.#listenerRef);
    });
    this.#windowResizeRef = this.close.bind(this);
    window.addEventListener('resize', this.#windowResizeRef);
  }

  removeListeners() {
    this.#sidenavTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) trigger.removeEventListener('click', this.#listenerRef);
    });
    this.#listenerRef = undefined;
    window.removeEventListener('resize', this.#windowResizeRef);
    this.#windowResizeRef = undefined;
  }

  destroy() {
    createEvent(this.el, 'component.destroy');
    this.removeListeners();

    if (this.#layoutEl) this.#cleanLayout();

    const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    instances.splice(index, 1);
  }

  #cleanLayout() {
    ['layout-sidenav-right', 'layout-sidenav-both'].forEach((classes) =>
      this.#layoutEl.classList.remove(classes)
    );
  }

  #handleMultipleSidenav() {
    if (!this.#firstSidenavInit) return;

    const sidenavs = Array.from(document.querySelectorAll('.sidenav')).filter((sidenav) =>
      sidenav.classList.contains('sidenav-fixed')
    );

    const { sidenavsRight, sidenavsLeft } = sidenavs.reduce(
      (acc, sidenav) => {
        sidenav.classList.contains('sidenav-right')
          ? acc.sidenavsRight.push(sidenav)
          : acc.sidenavsLeft.push(sidenav);
        return acc;
      },
      { sidenavsRight: [], sidenavsLeft: [] }
    );

    const isBoth = sidenavsLeft.length > 0 && sidenavsRight.length > 0;

    if (sidenavsRight.length > 0 && !isBoth) this.#layoutEl.classList.add('layout-sidenav-right');
    else if (isBoth) this.#layoutEl.classList.add('layout-sidenav-both');
  }

  /** @param {boolean} state */
  #toggleBodyScroll(state) {
    if (!this.options.bodyScrolling) document.body.style.overflow = state ? '' : 'hidden';
  }

  /** @param {Event} e */
  #onClickTrigger(e) {
    e.preventDefault();
    if (this.#isFixed && window.innerWidth >= 960) return;

    if (this.#isActive) this.close();
    else this.open();
  }

  /** Open Sidenav */
  open() {
    if (this.#isActive || this.#isAnimated) return;

    createEvent(this.el, 'sidenav.open');
    this.#isActive = true;
    this.#isAnimated = true;
    this.el.classList.add('active');
    updateOverlay(this.options.overlay, this.#overlayElement, this.#listenerRef, true);

    this.#toggleBodyScroll(false);

    setTimeout(() => {
      this.#isAnimated = false;
      createEvent(this.el, 'sidenav.opened');
    }, this.options.animationDuration);
  }

  /** Close Sidenav */
  close() {
    if (!this.#isActive || this.#isAnimated) return;

    this.#isAnimated = true;
    createEvent(this.el, 'sidenav.close');
    this.el.classList.remove('active');
    updateOverlay(
      this.options.overlay,
      this.#overlayElement,
      this.#listenerRef,
      false,
      this.options.animationDuration
    );

    setTimeout(() => {
      this.#toggleBodyScroll(true);
      this.#isActive = false;
      this.#isAnimated = false;
      createEvent(this.el, 'sidenav.closed');
    }, this.options.animationDuration);
  }
}

registerComponent({
  class: Sidenav,
  name: 'Sidenav',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.sidenav:not(.no-axentix-init)',
  },
});
