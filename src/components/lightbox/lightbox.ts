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

  #onClickRef: any;
  #transitionEndEventRef: any;
  #keyUpRef: any;
  #scrollRef: any;
  #resizeRef: any;
  #overlay: HTMLElement;
  #overlayClickEventRef: any;
  #overflowParents: Array<HTMLElement>;
  #baseRect: DOMRect;
  #newHeight = 0;
  #newWidth = 0;
  #isActive = false;
  #isResponsive = false;
  #container: HTMLDivElement;
  #isClosing = false;
  #isOpening = false;

  constructor(element: string, options?: ILightboxOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Lightbox', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Lightbox', options, this.el);

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
    this.#onClickRef = this.#onClickTrigger.bind(this);
    this.el.addEventListener('click', this.#onClickRef);

    this.#keyUpRef = this.#handleKeyUp.bind(this);
    this.#scrollRef = this.#handleScroll.bind(this);
    this.#resizeRef = this.#handleResize.bind(this);
    this.#transitionEndEventRef = this.#handleTransition.bind(this);

    window.addEventListener('keyup', this.#keyUpRef);
    window.addEventListener('scroll', this.#scrollRef);
    window.addEventListener('resize', this.#resizeRef);
    this.el.addEventListener('transitionend', this.#transitionEndEventRef);
  }

  removeListeners() {
    this.el.removeEventListener('click', this.#onClickRef);
    this.el.removeEventListener('transitionend', this.#transitionEndEventRef);

    window.removeEventListener('keyup', this.#keyUpRef);
    window.removeEventListener('scroll', this.#scrollRef);
    window.removeEventListener('resize', this.#resizeRef);

    this.#onClickRef = undefined;
    this.#keyUpRef = undefined;
    this.#scrollRef = undefined;
    this.#resizeRef = undefined;
    this.#transitionEndEventRef = undefined;
  }

  #setOverlay() {
    if (this.#overlay) {
      return;
    }

    this.#setOverflowParents();

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
    setTimeout(() => {
      this.#overlay.style.opacity = '1';
    }, 50);
  }

  #hideOverlay() {
    this.#overlay.style.opacity = '0';
  }

  #unsetOverlay() {
    this.#overlay.removeEventListener('click', this.#overlayClickEventRef);
    this.#overlay.remove();
    this.#overlay = null;
  }

  #calculateRatio() {
    const offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;

    if (window.innerWidth / window.innerHeight >= this.#baseRect.width / this.#baseRect.height) {
      this.#newHeight = window.innerHeight - offset;
      this.#newWidth = (this.#newHeight * this.#baseRect.width) / this.#baseRect.height;
    } else {
      this.#newWidth = window.innerWidth - offset;
      this.#newHeight = (this.#newWidth * this.#baseRect.height) / this.#baseRect.width;
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
        if (elem !== document.body) elem.style.setProperty('overflow', 'visible', 'important');
        document.body.style.overflowX = 'hidden';
      }
    }
  }

  #unsetOverflowParents() {
    this.#overflowParents.forEach((parent) => (parent.style.overflow = ''));
    document.body.style.overflowX = '';
  }

  #handleTransition(e) {
    if (!e.propertyName.includes('width') && !e.propertyName.includes('height')) {
      return;
    }

    if (this.#isClosing) {
      this.#clearLightbox();
      this.#isClosing = false;
      this.#isActive = false;
      createEvent(this.el, 'lightbox.closed');
    } else if (this.#isOpening) {
      this.#isOpening = false;
      createEvent(this.el, 'lightbox.opened');
    }
  }

  #handleKeyUp(e) {
    if (e.key === 'Escape' && (this.#isOpening || this.#isActive)) this.close();
  }

  #handleScroll() {
    if (this.#isActive || this.#isOpening) this.close();
  }

  #handleResize = () => {
    if (this.#isActive) this.close();
  };

  #clearLightbox() {
    this.el.classList.remove('active');
    this.#unsetOverlay();
    this.#unsetOverflowParents();

    if (this.#isResponsive) this.el.classList.add('responsive-media');

    this.#container.removeAttribute('style');
    this.el.style.position = '';
    this.el.style.left = '';
    this.el.style.top = '';
    this.el.style.width = '';
    this.el.style.height = '';
    this.el.style.transform = '';
  }

  #onClickTrigger() {
    if (this.#isOpening || this.#isActive) {
      this.close();
      return;
    }

    this.open();
  }

  /** Open lightbox */
  open() {
    this.#isOpening = true;
    let rect: DOMRect, containerRect: DOMRect;

    if (this.#isClosing) {
      rect = containerRect = this.#container.getBoundingClientRect();
    } else {
      rect = containerRect = this.el.getBoundingClientRect();
    }
    this.#isClosing = false;

    this.#setOverlay();
    this.#showOverlay();

    const centerTop = window.innerHeight / 2;
    const centerLeft = window.innerWidth / 2;

    this.#baseRect = rect;
    this.el.style.width = this.#baseRect.width + 'px';
    this.el.style.height = this.#baseRect.height + 'px';

    this.el.style.top = '0';
    this.el.style.left = '0';

    const newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
    const newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);

    this.#calculateRatio();
    this.#container.style.position = 'relative';

    setTimeout(() => {
      createEvent(this.el, 'lightbox.open');
      this.#isActive = true;

      if (this.el.classList.contains('responsive-media')) {
        this.#isResponsive = true;
        this.el.classList.remove('responsive-media');
      }
      this.el.classList.add('active');

      this.#container.style.width = this.#baseRect.width + 'px';
      this.#container.style.height = this.#baseRect.height + 'px';

      this.el.style.width = this.#newWidth + 'px';
      this.el.style.height = this.#newHeight + 'px';
      this.el.style.top = newTop - this.#newHeight / 2 + 'px';
      this.el.style.left = newLeft - this.#newWidth / 2 + 'px';
    }, 50);
  }

  /** Close lightbox */
  close(e?: any) {
    if (e?.key && e.key !== 'Escape') return;
    this.#isActive = false;
    this.#isClosing = true;
    this.#isOpening = false;

    createEvent(this.el, 'lightbox.close');
    this.#hideOverlay();

    this.el.style.position = 'absolute';
    this.el.style.top = '0px';
    this.el.style.left = '0px';
    this.el.style.width = this.#baseRect.width + 'px';
    this.el.style.height = this.#baseRect.height + 'px';
  }
}

registerComponent({
  class: Lightbox,
  name: 'Lightbox',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.lightbox',
  },
});
