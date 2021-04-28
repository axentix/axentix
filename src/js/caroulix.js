(() => {
  /**
   * Class Caroulix
   * @class
   */
  class Caroulix extends AxentixComponent {
    static getDefaultOptions() {
      return {
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
    }

    /**
     * Construct Caroulix instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Caroulix', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('Caroulix', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Caroulix init error', error);
      }
    }

    _setup() {
      Axentix.createEvent(this.el, 'caroulix.setup');

      this.options.autoplay.side = this.options.autoplay.side.toLowerCase();

      const sideList = ['right', 'left'];
      sideList.includes(this.options.autoplay.side) ? '' : (this.options.autoplay.side = 'right');

      this.activeIndex = 0;
      this.draggedPositionX = 0;
      this.isAnimated = false;

      this._getChildren();
      this.options.indicators.enabled ? this._enableIndicators() : '';

      const activeEl = this.el.querySelector('.active');
      if (activeEl) {
        this.activeIndex = this.children.indexOf(activeEl);
      } else {
        this.children[0].classList.add('active');
      }

      this._waitForLoad();
      this.totalMediaToLoad === 0 ? this._setBasicCaroulixHeight() : '';

      this._setupListeners();

      this.options.autoplay.enabled ? this.play() : '';
    }

    _setupListeners() {
      this.windowResizeRef = this._setBasicCaroulixHeight.bind(this);
      window.addEventListener('resize', this.windowResizeRef);

      if (this.arrowNext) {
        this.arrowNextRef = this.next.bind(this, 1);
        this.arrowNext.addEventListener('click', this.arrowNextRef);
      }

      if (this.arrowPrev) {
        this.arrowPrevRef = this.prev.bind(this, 1);
        this.arrowPrev.addEventListener('click', this.arrowPrevRef);
      }

      if (this.options.enableTouch) {
        this.touchStartRef = this._handleDragStart.bind(this);
        this.touchMoveRef = this._handleDragMove.bind(this);
        this.touchReleaseRef = this._handleDragRelease.bind(this);

        const isTouch = Axentix.isTouchEnabled(),
          isPointer = Axentix.isPointerEnabled();

        this.el.addEventListener(
          isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousestart',
          this.touchStartRef
        );
        this.el.addEventListener(
          isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove',
          this.touchMoveRef
        );
        this.el.addEventListener(
          isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup',
          this.touchReleaseRef
        );
        this.el.addEventListener(isPointer ? 'pointerleave' : 'mouseleave', this.touchReleaseRef);
      }
    }

    _removeListeners() {
      window.removeEventListener('resize', this.windowResizeRef);
      this.windowResizeRef = undefined;

      if (this.arrowNext) {
        this.arrowNext.removeEventListener('click', this.arrowNextRef);
        this.arrowNextRef = undefined;
      }

      if (this.arrowPrev) {
        this.arrowPrev.removeEventListener('click', this.arrowPrevRef);
        this.arrowPrevRef = undefined;
      }

      if (this.options.enableTouch) {
        const isTouch = Axentix.isTouchEnabled(),
          isPointer = Axentix.isPointerEnabled();

        this.el.removeEventListener(
          isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousestart',
          this.touchStartRef
        );
        this.el.removeEventListener(
          isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove',
          this.touchMoveRef
        );
        this.el.removeEventListener(
          isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup',
          this.touchReleaseRef
        );
        this.el.removeEventListener(isPointer ? 'pointerleave' : 'mouseleave', this.touchReleaseRef);

        this.touchStartRef = undefined;
        this.touchMoveRef = undefined;
        this.touchReleaseRef = undefined;
      }
    }

    _getChildren() {
      this.children = Array.from(this.el.children).reduce((acc, child) => {
        child.classList.contains('caroulix-item') ? acc.push(child) : '';
        child.classList.contains('caroulix-prev') ? (this.arrowPrev = child) : '';
        child.classList.contains('caroulix-next') ? (this.arrowNext = child) : '';

        return acc;
      }, []);
    }

    _waitForLoad() {
      this.totalMediaToLoad = 0;
      this.loadedMediaCount = 0;

      this.children.map((item) => {
        const media = item.querySelector('img, video');

        if (media) {
          this.totalMediaToLoad++;
          if (media.complete) {
            this._newItemLoaded(media, true);
          } else {
            media.loadRef = this._newItemLoaded.bind(this, media);
            media.addEventListener('load', media.loadRef);
          }
        }
      });
    }

    _newItemLoaded(media, alreadyLoad) {
      this.loadedMediaCount++;

      if (!alreadyLoad) {
        media.removeEventListener('load', media.loadRef);
        media.loadRef = undefined;
      }

      if (this.totalMediaToLoad == this.loadedMediaCount) {
        this._setBasicCaroulixHeight();
        this._setItemsPosition(true);
      }
    }

    _setItemsPosition(init = false) {
      const caroulixWidth = this.el.getBoundingClientRect().width;

      this.children.map((child, index) => {
        child.style.transform = `translateX(${
          caroulixWidth * index - caroulixWidth * this.activeIndex - this.draggedPositionX
        }px)`;
      });

      this.options.indicators.enabled ? this._resetIndicators() : '';

      const activeElement = this.children.find((child) => child.classList.contains('active'));
      activeElement.classList.remove('active');
      this.children[this.activeIndex].classList.add('active');

      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);

      init ? setTimeout(() => this._setTransitionDuration(this.options.animationDuration), 50) : '';
    }

    _setBasicCaroulixHeight() {
      this.isResizing = true;
      this.el.style.transitionDuration = '';

      this.options.autoplay.enabled ? this.play() : '';

      if (this.options.height) {
        this.el.style.height = this.options.height;
      } else {
        const childrenHeight = this.children.map((child) => {
          return child.offsetHeight;
        });
        const maxHeight = Math.max(...childrenHeight);

        this.el.style.height = maxHeight + 'px';
      }

      this._setItemsPosition();

      setTimeout(() => {
        this.el.style.transitionDuration = this.options.animationDuration + 'ms';
        this.isResizing = false;
      }, 50);
    }

    _handleDragStart(e) {
      if (e.target.closest('.caroulix-arrow') || e.target.closest('.caroulix-indicators')) return;

      e.type !== 'touchstart' ? e.preventDefault() : '';

      if (this.isAnimated) return;

      this.options.autoplay.enabled ? this.stop() : '';

      this._setTransitionDuration(0);
      this.isPressed = true;
      this.isScrolling = false;
      this.isVerticallyDragged = false;

      this.deltaX = 0;
      this.deltaY = 0;
      this.xStart = this._getXPosition(e);
      this.yStart = this._getYPosition(e);
    }

    _handleDragMove(e) {
      if (!this.isPressed || this.isScrolling) return;

      let x = this._getXPosition(e),
        y = this._getYPosition(e);

      this.deltaX = this.xStart - x;
      this.deltaY = Math.abs(this.yStart - y);

      if (e.type === 'touchmove' && this.deltaY > Math.abs(this.deltaX)) {
        this.isScrolling = true;
        this.deltaX = 0;
        return false;
      }

      e.cancelable ? e.preventDefault() : '';

      this.draggedPositionX = this.deltaX;
      this._setItemsPosition();
    }

    _handleDragRelease(e) {
      if (e.target.closest('.caroulix-arrow') || e.target.closest('.caroulix-indicators')) return false;

      e.cancelable ? e.preventDefault() : '';

      if (this.isPressed) {
        this._setTransitionDuration(this.options.animationDuration);
        let caroulixWidth = this.el.getBoundingClientRect().width;

        this.isPressed = false;

        if (
          (this.options.backToOpposite &&
            this.activeIndex !== this.children.length - 1 &&
            this.deltaX > (caroulixWidth * 15) / 100) ||
          (!this.options.backToOpposite && this.deltaX > (caroulixWidth * 15) / 100)
        ) {
          this.next();
        } else if (
          (this.options.backToOpposite &&
            this.activeIndex !== 0 &&
            this.deltaX < (-caroulixWidth * 15) / 100) ||
          (!this.options.backToOpposite && this.deltaX < (-caroulixWidth * 15) / 100)
        ) {
          this.prev();
        }

        this.deltaX = 0;
        this.draggedPositionX = 0;

        this._setItemsPosition();
        this.options.autoplay.enabled ? this.play() : '';
      }
    }

    _enableIndicators() {
      this.indicators = document.createElement('ul');
      this.indicators.classList.add('caroulix-indicators');
      this.options.indicators.isFlat ? this.indicators.classList.add('caroulix-flat') : '';

      this.options.indicators.customClasses
        ? (this.indicators.className =
            this.indicators.className + ' ' + this.options.indicators.customClasses)
        : '';
      for (let i = 0; i < this.children.length; i++) {
        const li = document.createElement('li');
        li.triggerRef = this._handleIndicatorClick.bind(this, i);
        li.addEventListener('click', li.triggerRef);
        this.indicators.appendChild(li);
      }
      this.el.appendChild(this.indicators);
    }

    _handleIndicatorClick(i, e) {
      e.preventDefault();

      if (i === this.activeIndex) return;

      this.goTo(i);
    }

    _resetIndicators() {
      Array.from(this.indicators.children).map((li) => {
        li.removeAttribute('class');
      });
      this.indicators.children[this.activeIndex].classList.add('active');
    }

    _getXPosition(e) {
      if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientX;
      }

      return e.clientX;
    }

    _getYPosition(e) {
      if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientY;
      }

      return e.clientY;
    }

    _setTransitionDuration(duration) {
      this.el.style.transitionDuration = duration + 'ms';
    }

    _emitSlideEvent() {
      Axentix.createEvent(this.el, 'caroulix.slide', {
        nextElement: this.children[this.activeIndex],
        currentElement: this.children[this.children.findIndex((child) => child.classList.contains('active'))],
      });
    }

    goTo(number) {
      if (number === this.activeIndex) return;

      let side;
      number > this.activeIndex ? (side = 'right') : (side = 'left');

      side === 'left'
        ? this.prev(Math.abs(this.activeIndex - number))
        : this.next(Math.abs(this.activeIndex - number));

      this.options.indicators.enabled ? this._resetIndicators() : '';
    }

    play() {
      if (!this.options.autoplay.enabled) return;

      this.stop();
      this.autoplayInterval = setInterval(() => {
        this.options.autoplay.side === 'right' ? this.next(1, false) : this.prev(1, false);
      }, this.options.autoplay.interval);
    }

    stop() {
      if (!this.options.autoplay.enabled) return;

      clearInterval(this.autoplayInterval);
    }

    next(step = 1, resetAutoplay = true) {
      if (this.isResizing || (this.activeIndex === this.children.length - 1 && !this.options.backToOpposite))
        return;

      Axentix.createEvent(this.el, 'caroulix.next', { step });

      this.isAnimated = true;

      resetAutoplay && this.options.autoplay.enabled ? this.stop() : '';

      if (this.activeIndex < this.children.length - 1) {
        this.activeIndex += step;
      } else if (this.options.backToOpposite) {
        this.activeIndex = 0;
      }

      this._emitSlideEvent();
      this._setItemsPosition();

      resetAutoplay && this.options.autoplay.enabled ? this.play() : '';
    }

    prev(step = 1, resetAutoplay = true) {
      if (this.isResizing || (this.activeIndex === 0 && !this.options.backToOpposite)) return;

      Axentix.createEvent(this.el, 'caroulix.prev', { step });

      this.isAnimated = true;

      resetAutoplay && this.options.autoplay.enabled ? this.stop() : '';

      if (this.activeIndex > 0) {
        this.activeIndex -= step;
      } else if (this.options.backToOpposite) {
        this.activeIndex = this.children.length - 1;
      }

      this._emitSlideEvent();
      this._setItemsPosition();

      resetAutoplay && this.options.autoplay.enabled ? this.play() : '';
    }
  }

  Axentix.Config.registerComponent({
    class: Caroulix,
    name: 'Caroulix',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.caroulix:not(.no-axentix-init)',
    },
  });
})();
