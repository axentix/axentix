import { AxentixComponent } from '../../utils/component';
import { registerComponent } from '../../utils/config';
import { instances } from '../../utils/config';
import { createEvent, getComponentOptions, isPointerEnabled, isTouchEnabled } from '../../utils/utilities';

/** @namespace */
export const CaroulixOptions = {
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

/**
 * Caroulix component
 */
export class Caroulix extends AxentixComponent {
  static getDefaultOptions = () => CaroulixOptions;

  /** Private variables */
  #draggedPositionX = 0;
  #isAnimated = false;
  /** @type {Array<HTMLElement>} */
  #children;
  #totalMediaToLoad = 0;
  #loadedMediaCount = 0;
  #isResizing = false;
  #isScrolling = false;
  #isPressed = false;
  #deltaX = 0;
  #deltaY = 0;
  #windowResizeRef;
  /** @type {HTMLElement} */
  #arrowPrev;
  /** @type {HTMLElement} */
  #arrowNext;
  #arrowNextRef;
  #arrowPrevRef;
  #touchStartRef;
  #touchMoveRef;
  #touchReleaseRef;
  #xStart = 0;
  #yStart = 0;
  /** @type {HTMLElement} */
  #indicators;
  /** @type {number} */
  #autoplayInterval;

  /**
   * @param {string} element
   * @param {CaroulixOptions} [options]
   * @param {boolean} [isLoadedWithData]
   */
  constructor(element, options, isLoadedWithData) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Caroulix', instance: this });

      this.el = document.querySelector(element);

      /** @type {CaroulixOptions} */
      this.options = getComponentOptions('Caroulix', options, this.el, isLoadedWithData);

      this.#setup();
    } catch (error) {
      console.error('[Axentix] Caroulix init error', error);
    }
  }

  #setup() {
    createEvent(this.el, 'caroulix.setup');

    this.options.autoplay.side = this.options.autoplay.side.toLowerCase();

    const sideList = ['right', 'left'];
    if (!sideList.includes(this.options.autoplay.side)) this.options.autoplay.side = 'right';

    this.activeIndex = 0;
    this.#draggedPositionX = 0;
    this.#isAnimated = false;

    this.#children = this.#getChildren();
    if (this.options.indicators.enabled) this.#enableIndicators();

    const activeEl = this.el.querySelector('.active');
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

      const isTouch = isTouchEnabled(),
        isPointer = isPointerEnabled();

      this.el.addEventListener(
        isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousestart',
        this.#touchStartRef
      );
      this.el.addEventListener(
        isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove',
        this.#touchMoveRef
      );
      this.el.addEventListener(
        isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup',
        this.#touchReleaseRef
      );
      this.el.addEventListener(isPointer ? 'pointerleave' : 'mouseleave', this.#touchReleaseRef);
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
      const isTouch = isTouchEnabled(),
        isPointer = isPointerEnabled();

      this.el.removeEventListener(
        isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousestart',
        this.#touchStartRef
      );
      this.el.removeEventListener(
        isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove',
        this.#touchMoveRef
      );
      this.el.removeEventListener(
        isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup',
        this.#touchReleaseRef
      );
      this.el.removeEventListener(isPointer ? 'pointerleave' : 'mouseleave', this.#touchReleaseRef);

      this.#touchStartRef = undefined;
      this.#touchMoveRef = undefined;
      this.#touchReleaseRef = undefined;
    }
  }

  /** @returns {Array<HTMLElement>} */
  #getChildren() {
    return Array.from(this.el.children).reduce((acc, child) => {
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
      const media = item.querySelector('img, video');

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

  /**
   * @param {HTMLElement} media
   * @param {boolean} alreadyLoad
   */
  #newItemLoaded(media, alreadyLoad) {
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

  /** @param {boolean} init */
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

  #handleDragStart(e) {
    if (e.target.closest('.caroulix-arrow') || e.target.closest('.caroulix-#indicators') || this.#isAnimated)
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

  #handleDragMove(e) {
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

  #handleDragRelease(e) {
    if (e.target.closest('.caroulix-arrow') || e.target.closest('.caroulix-#indicators')) return;

    if (e.cancelable) e.preventDefault();

    if (this.#isPressed) {
      this.#setTransitionDuration(this.options.animationDuration);
      let caroulixWidth = this.el.getBoundingClientRect().width;

      this.#isPressed = false;

      if (
        (this.options.backToOpposite &&
          this.activeIndex !== this.#children.length - 1 &&
          this.#deltaX > (caroulixWidth * 15) / 100) ||
        (!this.options.backToOpposite && this.#deltaX > (caroulixWidth * 15) / 100)
      ) {
        this.next();
      } else if (
        (this.options.backToOpposite &&
          this.activeIndex !== 0 &&
          this.#deltaX < (-caroulixWidth * 15) / 100) ||
        (!this.options.backToOpposite && this.#deltaX < (-caroulixWidth * 15) / 100)
      ) {
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
    this.#indicators.classList.add('caroulix-#indicators');
    if (this.options.indicators.isFlat) this.#indicators.classList.add('caroulix-flat');

    if (this.options.indicators.customClasses)
      this.#indicators.className = `${this.#indicators.className} ${this.options.indicators.customClasses}`;

    for (let i = 0; i < this.#children.length; i++) {
      const li = document.createElement('li');
      li.triggerRef = this.#handleIndicatorClick.bind(this, i);
      li.addEventListener('click', li.triggerRef);
      this.#indicators.appendChild(li);
    }
    this.el.appendChild(this.#indicators);
  }

  /**
   * @param {number} i
   * @param {Event} e
   */
  #handleIndicatorClick(i, e) {
    e.preventDefault();

    if (i === this.activeIndex) return;

    this.goTo(i);
  }

  #resetIndicators() {
    Array.from(this.#indicators.children).map((li) => {
      li.removeAttribute('class');
    });
    this.#indicators.children[this.activeIndex].classList.add('active');
  }

  /**
   * @param {MouseEvent} e
   * @returns {number}
   */
  #getXPosition(e) {
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientX;
    }

    return e.clientX;
  }

  /**
   * @param {MouseEvent} e
   * @returns {number}
   */
  #getYPosition(e) {
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientY;
    }

    return e.clientY;
  }

  /** @param {number} duration */
  #setTransitionDuration(duration) {
    this.el.style.transitionDuration = duration + 'ms';
  }

  #emitSlideEvent() {
    createEvent(this.el, 'caroulix.slide', {
      nextElement: this.#children[this.activeIndex],
      currentElement: this.#children[this.#children.findIndex((child) => child.classList.contains('active'))],
    });
  }

  /** @param {number} number */
  goTo(number) {
    if (number === this.activeIndex) return;

    const side = number > this.activeIndex ? 'right' : 'left';

    side === 'left'
      ? this.prev(Math.abs(this.activeIndex - number))
      : this.next(Math.abs(this.activeIndex - number));

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

  /**
   * @param {number} step
   * @param {boolean} resetAutoplay
   */
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

  /**
   * @param {number} step
   * @param {boolean} resetAutoplay
   */
  prev(step = 1, resetAutoplay = true) {
    if (this.#isResizing || (this.activeIndex === 0 && !this.options.backToOpposite)) return;

    createEvent(this.el, 'caroulix.prev', { step });

    this.#isAnimated = true;

    if (resetAutoplay && this.options.autoplay.enabled) this.stop();

    if (this.activeIndex > 0) {
      this.activeIndex -= step;
    } else if (this.options.backToOpposite) {
      this.activeIndex = this.#children.length - 1;
    }

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
    selector: '.caroulix:not(.no-axentix-init)',
  },
});
