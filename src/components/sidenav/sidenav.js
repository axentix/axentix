import { registerComponent } from '../../utils/config';
import { AxentixComponent } from '../../utils/component';
import { instances } from '../../utils/core';
import { createEvent, getComponentOptions, getInstanceByType } from '../../utils/utilities';

export class Sidenav extends AxentixComponent {
  static getDefaultOptions() {
    return {
      overlay: true,
      bodyScrolling: false,
      animationDuration: 300,
    };
  }

  /**
   * Construct Sidenav instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options, isLoadedWithData) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Sidenav', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Sidenav', options, this.el, isLoadedWithData);

      this._setup();
    } catch (error) {
      console.error('[Axentix] Sidenav init error', error);
    }
  }

  /**
   * Setup component
   */
  _setup() {
    createEvent(this.el, 'sidenav.setup');
    this.sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
    this.isActive = false;
    this.isAnimated = false;
    this.isFixed = this.el.classList.contains('sidenav-fixed');

    const sidenavFixed = getInstanceByType('Sidenav').find((sidenav) => sidenav.isFixed);
    this.firstSidenavInit = sidenavFixed && sidenavFixed.el === this.el;

    this.extraClasses = ['layout-sidenav-right', 'layout-sidenav-both'];

    this.layoutEl = document.querySelector('.layout, [class*="layout-"]');

    this.layoutEl && this.firstSidenavInit ? this._cleanLayout() : '';

    this._setupListeners();

    this.options.overlay ? this._createOverlay() : '';

    this.layoutEl && this.isFixed ? this._handleMultipleSidenav() : '';

    this.el.style.transitionDuration = this.options.animationDuration + 'ms';
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.listenerRef = this._onClickTrigger.bind(this);
    this.sidenavTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.listenerRef);
      }
    });
    this.windowResizeRef = this.close.bind(this);
    window.addEventListener('resize', this.windowResizeRef);
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.sidenavTriggers.forEach((trigger) => {
      if (trigger.dataset.target === this.el.id) {
        trigger.removeEventListener('click', this.listenerRef);
      }
    });
    this.listenerRef = undefined;
    window.removeEventListener('resize', this.windowResizeRef);
    this.windowResizeRef = undefined;
  }

  destroy() {
    createEvent(this.el, 'component.destroy');
    this._removeListeners();

    this.layoutEl ? this._cleanLayout() : '';

    const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    instances.splice(index, 1);
  }

  _cleanLayout() {
    this.extraClasses.map((classes) => this.layoutEl.classList.remove(classes));
  }

  _handleMultipleSidenav() {
    if (!this.firstSidenavInit) return;

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

    if (sidenavsRight.length > 0 && !isBoth) {
      this.layoutEl.classList.add('layout-sidenav-right');
    } else if (isBoth) {
      this.layoutEl.classList.add('layout-sidenav-both');
    }
  }

  /**
   * Create overlay element
   */
  _createOverlay() {
    this.overlayElement = document.createElement('div');
    this.overlayElement.classList.add('sidenav-overlay');
    this.overlayElement.style.transitionDuration = this.options.animationDuration + 'ms';
    this.overlayElement.dataset.target = this.el.id;
  }

  /**
   * Enable or disable body scroll when option is true
   * @param {boolean} state
   */
  _toggleBodyScroll(state) {
    if (!this.options.bodyScrolling) {
      state ? (document.body.style.overflow = '') : (document.body.style.overflow = 'hidden');
    }
  }

  /**
   * Handle click on trigger
   * @param {Event} e
   */
  _onClickTrigger(e) {
    e.preventDefault();
    if (this.isFixed && window.innerWidth >= 960) {
      return;
    }

    this.isActive ? this.close() : this.open();
  }

  /**
   * Open sidenav
   */
  open() {
    if (this.isActive || this.isAnimated) {
      return;
    }
    createEvent(this.el, 'sidenav.open');
    this.isActive = true;
    this.isAnimated = true;
    this.el.classList.add('active');
    this.overlay(true);
    this._toggleBodyScroll(false);

    setTimeout(() => {
      this.isAnimated = false;
      createEvent(this.el, 'sidenav.opened');
    }, this.options.animationDuration);
  }

  /**
   * Close sidenav
   */
  close() {
    if (!this.isActive || this.isAnimated) {
      return;
    }
    this.isAnimated = true;
    createEvent(this.el, 'sidenav.close');
    this.el.classList.remove('active');
    this.overlay(false);
    setTimeout(() => {
      this._toggleBodyScroll(true);
      this.isActive = false;
      this.isAnimated = false;
      createEvent(this.el, 'sidenav.closed');
    }, this.options.animationDuration);
  }

  /**
   * Manage overlay
   * @param {boolean} state
   */
  overlay(state) {
    if (this.options.overlay) {
      if (state) {
        this.overlayElement.addEventListener('click', this.listenerRef);
        document.body.appendChild(this.overlayElement);
        setTimeout(() => {
          this.overlayElement.classList.add('active');
        }, 50);
      } else {
        this.overlayElement.classList.remove('active');
        setTimeout(() => {
          this.overlayElement.removeEventListener('click', this.listenerRef);
          document.body.removeChild(this.overlayElement);
        }, this.options.animationDuration);
      }
    }
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
