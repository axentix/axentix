import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances } from '../../utils/config';
import { createEvent, getComponentOptions, wrap } from '../../utils/utilities';

interface ILightboxOptions {
  animationDuration?: number;
  overlayClass?: string;
  offset?: number;
  mobileOffset?: number;
  caption?: string;
}

const LightboxOptions: ILightboxOptions = {
  animationDuration: 400,
  overlayClass: 'grey dark-4',
  offset: 150,
  mobileOffset: 80,
  caption: '',
};

export class Lightbox extends AxentixComponent implements Component {
  static getDefaultOptions = () => LightboxOptions;

  options: ILightboxOptions;

  #openOnClickRef: any;
  #closeEventRef: any;
  #overlay: HTMLElement;
  #overlayClickEventRef: any;
  #overflowParents: Array<HTMLElement>;
  #basicWidth = 0;
  #basicHeight = 0;
  #newTop = 0;
  #newLeft = 0;
  #newHeight = 0;
  #newWidth = 0;
  #isActive = false;
  #isAnimated = false;
  #isResponsive = false;
  #container: HTMLDivElement;

  constructor(element: string, options?: ILightboxOptions, isLoadedWithData?: boolean) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Lightbox', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Lightbox', options, this.el, isLoadedWithData);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Lightbox init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'lightbox.setup');
    this.el.style.transitionDuration = this.options.animationDuration + 'ms';

    this.#container = wrap([this.el]);

    this.setupListeners();
  }

  setupListeners() {
    this.#openOnClickRef = this.open.bind(this);
    this.el.addEventListener('click', this.#openOnClickRef);

    this.#closeEventRef = this.close.bind(this);
    window.addEventListener('keyup', this.#closeEventRef);
    window.addEventListener('scroll', this.#closeEventRef);
    window.addEventListener('resize', this.#closeEventRef);
  }

  removeListeners() {
    this.el.removeEventListener('click', this.#openOnClickRef);

    window.removeEventListener('keyup', this.#closeEventRef);
    window.removeEventListener('scroll', this.#closeEventRef);
    window.removeEventListener('resize', this.#closeEventRef);

    this.#openOnClickRef = undefined;
    this.#closeEventRef = undefined;
  }

  #setOverlay() {
    this.#overlay = document.createElement('div');
    this.#overlay.style.transitionDuration = this.options.animationDuration + 'ms';
    this.#overlay.className = 'lightbox-overlay ' + this.options.overlayClass;
    this.#container.appendChild(this.#overlay);

    if (this.options.caption) {
      const caption = document.createElement('p');
      caption.className = 'lightbox-caption';
      caption.innerHTML = this.options.caption;
      this.#overlay.appendChild(caption);
    }

    this.#overlayClickEventRef = this.close.bind(this);
    this.#overlay.addEventListener('click', this.#overlayClickEventRef);
  }

  #showOverlay() {
    this.#overlay.style.opacity = '1';
  }

  #unsetOverlay() {
    this.#overlay.style.opacity = '0';

    this.#overlay.removeEventListener('click', this.#overlayClickEventRef);
    setTimeout(() => {
      this.#overlay.remove();
    }, this.options.animationDuration);
  }

  #calculateRatio() {
    const offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;

    if (window.innerWidth / window.innerHeight >= this.#basicWidth / this.#basicHeight) {
      this.#newHeight = window.innerHeight - offset;
      this.#newWidth = (this.#newHeight * this.#basicWidth) / this.#basicHeight;
    } else {
      this.#newWidth = window.innerWidth - offset;
      this.#newHeight = (this.#newWidth * this.#basicHeight) / this.#basicWidth;
    }
  }

  #setOverflowParents() {
    this.#overflowParents = [];
    // @ts-ignore
    for (let elem = this.el; elem && elem !== document; elem = elem.parentNode) {
      const elementSyle = window.getComputedStyle(elem);
      if (
        elementSyle.overflow === 'hidden' ||
        elementSyle.overflowX === 'hidden' ||
        elementSyle.overflowY === 'hidden'
      ) {
        this.#overflowParents.push(elem);
        elem.style.setProperty('overflow', 'visible', 'important');
        document.body.style.overflowX = 'hidden';
      }
    }
  }

  #unsetOverflowParents() {
    this.#overflowParents.forEach((parent) => (parent.style.overflow = ''));
    document.body.style.overflowX = '';
  }

  /** Open lightbox */
  open() {
    if (this.#isActive) return this.close();
    else if (this.#isAnimated) return;

    this.#setOverflowParents();

    const centerTop = window.innerHeight / 2;
    const centerLeft = window.innerWidth / 2;

    const rect = this.el.getBoundingClientRect();
    const containerRect = this.el.getBoundingClientRect();

    this.#basicWidth = rect.width;
    this.el.style.width = this.#basicWidth + 'px';
    this.#basicHeight = rect.height;
    this.el.style.height = this.#basicHeight + 'px';

    this.el.style.top = '0';
    this.el.style.left = '0';

    this.#newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
    this.#newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);

    this.#calculateRatio();

    this.#container.style.position = 'relative';
    this.#setOverlay();

    setTimeout(() => {
      createEvent(this.el, 'lightbox.open');

      this.#isAnimated = true;

      this.el.classList.add('active');

      if (this.el.classList.contains('responsive-media')) {
        this.el.classList.remove('responsive-media');
        this.#isResponsive = true;
      } else {
        this.#isResponsive = false;
      }

      this.#isActive = true;

      this.#showOverlay();
      this.#container.style.width = this.#basicWidth + 'px';
      this.#container.style.height = this.#basicHeight + 'px';

      this.el.style.width = this.#newWidth + 'px';
      this.el.style.height = this.#newHeight + 'px';
      this.el.style.top = this.#newTop - this.#newHeight / 2 + 'px';
      this.el.style.left = this.#newLeft - this.#newWidth / 2 + 'px';

      this.#isAnimated = false;
    }, 50);

    setTimeout(() => {
      createEvent(this.el, 'lightbox.opened');
    }, this.options.animationDuration + 50);
  }

  /** Close lightbox */
  close(e?: any) {
    if (!this.#isActive || (e && e.key && e.key !== 'Escape') || this.#isAnimated) return;

    this.#isAnimated = true;

    this.el.style.top = '0';
    this.el.style.left = '0';

    this.el.style.width = this.#basicWidth + 'px';
    this.el.style.height = this.#basicHeight + 'px';
    this.#unsetOverlay();

    createEvent(this.el, 'lightbox.close');

    setTimeout(() => {
      this.el.classList.remove('active');

      if (this.#isResponsive) this.el.classList.add('responsive-media');

      this.#container.removeAttribute('style');
      this.el.style.left = '';
      this.el.style.top = '';
      this.el.style.width = '';
      this.el.style.height = '';
      this.el.style.transform = '';

      this.#unsetOverflowParents();

      this.#isActive = false;
      this.#isAnimated = false;

      createEvent(this.el, 'lightbox.closed');
    }, this.options.animationDuration + 50);
  }
}

registerComponent({
  class: Lightbox,
  name: 'Lightbox',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.lightbox:not(.no-axentix-init)',
  },
});
