import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances } from '../../utils/config';
import { createEvent, getComponentOptions, getPointerType } from '../../utils/utilities';

export interface ICaroulixOptions {
  animationDuration?: number;
  height?: string;
  backToOpposite?: boolean;
  enableTouch?: boolean;
  indicators?: {
    enabled?: boolean;
    isFlat?: boolean;
    customClasses?: string;
  };
  autoplay?: {
    enabled?: boolean;
    interval?: number;
    side?: 'right' | 'left';
  };
}

export const CaroulixOptions: ICaroulixOptions = {
  animationDuration: 500,
  height: '',
  backToOpposite: true,
  enableTouch: true,
  indicators: {
    enabled: false,
    isFlat: false,
    customClasses: '',
  },
  autoplay: {
    enabled: true,
    interval: 5000,
    side: 'right',
  },
};

export class Caroulix extends AxentixComponent implements Component {
  static getDefaultOptions = () => CaroulixOptions;

  options: ICaroulixOptions;
  activeIndex: number;

  #draggedPositionX = 0;
  #isAnimated = false;
  #children: Array<HTMLElement>;
  #totalMediaToLoad = 0;
  #loadedMediaCount = 0;
  #isResizing = false;
  #isScrolling = false;
  #isPressed = false;
  #deltaX = 0;
  #deltaY = 0;
  #windowResizeRef: any;
  #arrowPrev: HTMLElement;
  #arrowNext: HTMLElement;
  #arrowNextRef: any;
  #arrowPrevRef: any;
  #touchStartRef: any;
  #touchMoveRef: any;
  #touchReleaseRef: any;
  #xStart = 0;
  #yStart = 0;
  #indicators: HTMLElement;
  #autoplayInterval: number;
  #pointerType: string;

  constructor(element: string, options?: ICaroulixOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Caroulix', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Caroulix', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Caroulix init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'caroulix.setup');

    // @ts-ignore
    this.options.autoplay.side = this.options.autoplay.side.toLowerCase();

    const sideList = ['right', 'left'];
    if (!sideList.includes(this.options.autoplay.side)) this.options.autoplay.side = 'right';

    this.activeIndex = 0;
    this.#draggedPositionX = 0;
    this.#isAnimated = false;

    this.#pointerType = getPointerType();

    this.#children = this.#getChildren();
    if (this.options.indicators.enabled) this.#enableIndicators();

    const activeEl: HTMLElement = this.el.querySelector('.active');
    if (activeEl) this.activeIndex = this.#children.indexOf(activeEl);
    else this.#children[0].classList.add('active');

    this.#waitForLoad();
    if (this.#totalMediaToLoad === 0) this.#setBasicCaroulixHeight();

    this.setupListeners();

    if (this.options.autoplay.enabled) this.play();
  }

  setupListeners() {
    this.#windowResizeRef = this.#setBasicCaroulixHeight.bind(this);
    window.addEventListener('resize', this.#windowResizeRef);

    if (this.#arrowNext) {
      this.#arrowNextRef = this.next.bind(this, 1);
      this.#arrowNext.addEventListener('click', this.#arrowNextRef);
    }

    if (this.#arrowPrev) {
      this.#arrowPrevRef = this.prev.bind(this, 1);
      this.#arrowPrev.addEventListener('click', this.#arrowPrevRef);
    }

    if (this.options.enableTouch) {
      this.#touchStartRef = this.#handleDragStart.bind(this);
      this.#touchMoveRef = this.#handleDragMove.bind(this);
      this.#touchReleaseRef = this.#handleDragRelease.bind(this);

      this.el.addEventListener(
        `${this.#pointerType}${this.#pointerType === 'touch' ? 'start' : 'down'}`,
        this.#touchStartRef
      );
      this.el.addEventListener(`${this.#pointerType}move`, this.#touchMoveRef);
      this.el.addEventListener(
        `${this.#pointerType}${this.#pointerType === 'touch' ? 'end' : 'up'}`,
        this.#touchReleaseRef
      );
      this.el.addEventListener(
        this.#pointerType === 'pointer' ? 'pointerleave' : 'mouseleave',
        this.#touchReleaseRef
      );
    }
  }

  removeListeners() {
    window.removeEventListener('resize', this.#windowResizeRef);
    this.#windowResizeRef = undefined;

    if (this.#arrowNext) {
      this.#arrowNext.removeEventListener('click', this.#arrowNextRef);
      this.#arrowNextRef = undefined;
    }

    if (this.#arrowPrev) {
      this.#arrowPrev.removeEventListener('click', this.#arrowPrevRef);
      this.#arrowPrevRef = undefined;
    }

    if (this.options.enableTouch) {
      this.el.removeEventListener(
        `${this.#pointerType}${this.#pointerType === 'pointer' ? 'down' : 'start'}`,
        this.#touchStartRef
      );
      this.el.removeEventListener(`${this.#pointerType}move`, this.#touchMoveRef);
      this.el.removeEventListener(
        `${this.#pointerType}${this.#pointerType === 'touch' ? 'end' : 'up'}`,
        this.#touchReleaseRef
      );
      this.el.removeEventListener(
        this.#pointerType === 'pointer' ? 'pointerleave' : 'mouseleave',
        this.#touchReleaseRef
      );

      this.#touchStartRef = undefined;
      this.#touchMoveRef = undefined;
      this.#touchReleaseRef = undefined;
    }
  }

  #getChildren(): Array<HTMLElement> {
    return Array.from(this.el.children).reduce((acc: Array<HTMLElement>, child: HTMLElement) => {
      if (child.classList.contains('caroulix-item')) acc.push(child);
      if (child.classList.contains('caroulix-prev')) this.#arrowPrev = child;
      if (child.classList.contains('caroulix-next')) this.#arrowNext = child;

      return acc;
    }, []);
  }

  #waitForLoad() {
    this.#totalMediaToLoad = 0;
    this.#loadedMediaCount = 0;

    this.#children.forEach((item) => {
      const media: any = item.querySelector('img, video');

      if (media) {
        this.#totalMediaToLoad++;
        if (media.complete) {
          this.#newItemLoaded(media, true);
        } else {
          media.loadRef = this.#newItemLoaded.bind(this, media);
          media.addEventListener('load', media.loadRef);
        }
      }
    });
  }

  #newItemLoaded(media: any, alreadyLoad: boolean) {
    this.#loadedMediaCount++;

    if (!alreadyLoad) {
      media.removeEventListener('load', media.loadRef);
      media.loadRef = undefined;
    }

    if (this.#totalMediaToLoad == this.#loadedMediaCount) {
      this.#setBasicCaroulixHeight();
      this.#setItemsPosition(true);
    }
  }

  #setItemsPosition(init = false) {
    const caroulixWidth = this.el.getBoundingClientRect().width;

    this.#children.forEach((child, index) => {
      child.style.transform = `translateX(${
        caroulixWidth * index - caroulixWidth * this.activeIndex - this.#draggedPositionX
      }px)`;
    });

    if (this.options.indicators.enabled) this.#resetIndicators();

    const activeElement = this.#children.find((child) => child.classList.contains('active'));
    activeElement.classList.remove('active');
    this.#children[this.activeIndex].classList.add('active');

    setTimeout(() => {
      this.#isAnimated = false;
    }, this.options.animationDuration);

    if (init) setTimeout(() => this.#setTransitionDuration(this.options.animationDuration), 50);
  }

  #setBasicCaroulixHeight() {
    this.#isResizing = true;
    this.el.style.transitionDuration = '';

    if (this.options.autoplay.enabled) this.play();

    if (this.options.height) {
      this.el.style.height = this.options.height;
    } else {
      const childrenHeight = this.#children.map((child) => child.offsetHeight);
      const maxHeight = Math.max(...childrenHeight);

      this.el.style.height = maxHeight + 'px';
    }

    this.#setItemsPosition();

    setTimeout(() => {
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';
      this.#isResizing = false;
    }, 50);
  }

  #handleDragStart(e: Event) {
    if (
      (e.target as HTMLElement).closest('.caroulix-arrow') ||
      (e.target as HTMLElement).closest('.caroulix-indicators') ||
      this.#isAnimated
    )
      return;

    if (e.type !== 'touchstart') e.preventDefault();

    if (this.options.autoplay.enabled) this.stop();

    this.#setTransitionDuration(0);
    this.#isPressed = true;
    this.#isScrolling = false;

    this.#deltaX = 0;
    this.#deltaY = 0;
    this.#xStart = this.#getXPosition(e);
    this.#yStart = this.#getYPosition(e);
  }

  #handleDragMove(e: Event) {
    if (!this.#isPressed || this.#isScrolling) return;

    let x = this.#getXPosition(e),
      y = this.#getYPosition(e);

    this.#deltaX = this.#xStart - x;
    this.#deltaY = Math.abs(this.#yStart - y);

    if (e.type === 'touchmove' && this.#deltaY > Math.abs(this.#deltaX)) {
      this.#isScrolling = true;
      this.#deltaX = 0;
      return false;
    }

    if (e.cancelable) e.preventDefault();

    this.#draggedPositionX = this.#deltaX;
    this.#setItemsPosition();
  }

  #handleDragRelease(e: Event) {
    if (
      (e.target as HTMLElement).closest('.caroulix-arrow') ||
      (e.target as HTMLElement).closest('.caroulix-indicators')
    )
      return;

    if (e.cancelable) e.preventDefault();

    if (this.#isPressed) {
      this.#setTransitionDuration(this.options.animationDuration);
      let caroulixWidth = this.el.getBoundingClientRect().width;

      this.#isPressed = false;
      const percent = (caroulixWidth * 15) / 100;

      if (this.activeIndex !== this.#children.length - 1 && this.#deltaX > percent) {
        this.next();
      } else if (this.activeIndex !== 0 && this.#deltaX < -percent) {
        this.prev();
      }

      this.#deltaX = 0;
      this.#draggedPositionX = 0;

      this.#setItemsPosition();
      if (this.options.autoplay.enabled) this.play();
    }
  }

  #enableIndicators() {
    this.#indicators = document.createElement('ul');
    this.#indicators.classList.add('caroulix-indicators');
    if (this.options.indicators.isFlat) this.#indicators.classList.add('caroulix-flat');

    if (this.options.indicators.customClasses)
      this.#indicators.className = `${this.#indicators.className} ${this.options.indicators.customClasses}`;

    for (let i = 0; i < this.#children.length; i++) {
      const li: any = document.createElement('li');
      li.triggerRef = this.#handleIndicatorClick.bind(this, i);
      li.addEventListener('click', li.triggerRef);
      this.#indicators.appendChild(li);
    }
    this.el.appendChild(this.#indicators);
  }

  #handleIndicatorClick(i: number, e: Event) {
    e.preventDefault();

    if (i === this.activeIndex) return;

    this.goTo(i);
  }

  #resetIndicators() {
    Array.from(this.#indicators.children).forEach((li) => li.removeAttribute('class'));
    this.#indicators.children[this.activeIndex].classList.add('active');
  }

  #getXPosition(e: any): number {
    if (e.targetTouches && e.targetTouches.length >= 1) return e.targetTouches[0].clientX;

    return e.clientX;
  }

  #getYPosition(e: any): number {
    if (e.targetTouches && e.targetTouches.length >= 1) return e.targetTouches[0].clientY;

    return e.clientY;
  }

  #setTransitionDuration(duration: number) {
    this.el.style.transitionDuration = duration + 'ms';
  }

  #emitSlideEvent() {
    createEvent(this.el, 'caroulix.slide', {
      nextElement: this.#children[this.activeIndex],
      currentElement: this.#children[this.#children.findIndex((child) => child.classList.contains('active'))],
    });
  }

  goTo(number: number) {
    if (number === this.activeIndex) return;

    const side = number > this.activeIndex ? 'right' : 'left';

    if (side === 'left') this.prev(Math.abs(this.activeIndex - number));
    else this.next(Math.abs(this.activeIndex - number));

    if (this.options.indicators.enabled) this.#resetIndicators();
  }

  play() {
    if (!this.options.autoplay.enabled) return;

    this.stop();
    this.#autoplayInterval = setInterval(() => {
      if (this.options.autoplay.side === 'right') this.next(1, false);
      else this.prev(1, false);
    }, this.options.autoplay.interval);
  }

  stop() {
    if (!this.options.autoplay.enabled) return;

    clearInterval(this.#autoplayInterval);
  }

  next(step = 1, resetAutoplay = true) {
    if (this.#isResizing || (this.activeIndex === this.#children.length - 1 && !this.options.backToOpposite))
      return;

    createEvent(this.el, 'caroulix.next', { step });

    this.#isAnimated = true;

    if (resetAutoplay && this.options.autoplay.enabled) this.stop();

    if (this.activeIndex < this.#children.length - 1) this.activeIndex += step;
    else if (this.options.backToOpposite) this.activeIndex = 0;

    this.#emitSlideEvent();
    this.#setItemsPosition();

    if (resetAutoplay && this.options.autoplay.enabled) this.play();
  }

  prev(step = 1, resetAutoplay = true) {
    if (this.#isResizing || (this.activeIndex === 0 && !this.options.backToOpposite)) return;

    createEvent(this.el, 'caroulix.prev', { step });

    this.#isAnimated = true;

    if (resetAutoplay && this.options.autoplay.enabled) this.stop();

    if (this.activeIndex > 0) this.activeIndex -= step;
    else if (this.options.backToOpposite) this.activeIndex = this.#children.length - 1;

    this.#emitSlideEvent();
    this.#setItemsPosition();

    if (resetAutoplay && this.options.autoplay.enabled) this.play();
  }
}

registerComponent({
  class: Caroulix,
  name: 'Caroulix',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.caroulix',
  },
});
