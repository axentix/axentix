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

      let activeEl = this.el.querySelector('.active');
      if (activeEl) {
        this.activeIndex = this.children.indexOf(activeEl);
      }

      this._waitForLoad();
      this.totalMediaToLoad === 0 ? this._setBasicCaroulixHeight() : '';

      this._setupListeners();

      this.options.autoplay.enabled ? this.play() : '';
    }

    _setupListeners() {
      this.windowResizeRef = this._handleResizeEvent.bind(this);
      window.addEventListener('resize', this.windowResizeRef);

      this.touchStartRef = this._handleDragStart.bind(this);
      this.touchMoveRef = this._handleDragMove.bind(this);
      this.touchReleaseRef = this._handleDragRelease.bind(this);

      if (this.arrowNext) {
        this.arrowNextRef = this.next.bind(this, 1);
        this.arrowNext.addEventListener('click', this.arrowNextRef);
      }

      if (this.arrowPrev) {
        this.arrowPrevRef = this.prev.bind(this, 1);
        this.arrowPrev.addEventListener('click', this.arrowPrevRef);
      }

      if (Axentix.isTouchEnabled()) {
        this.el.addEventListener('touchstart', this.touchStartRef);
        this.el.addEventListener('touchmove', this.touchMoveRef);
        this.el.addEventListener('touchend', this.touchReleaseRef);
      }

      this.el.addEventListener('mousedown', this.touchStartRef);
      this.el.addEventListener('mousemove', this.touchMoveRef);
      this.el.addEventListener('mouseup', this.touchReleaseRef);
      this.el.addEventListener('mouseleave', this.touchReleaseRef);
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

      if (Axentix.isTouchEnabled()) {
        this.el.removeEventListener('touchstart', this.touchStartRef);
        this.el.removeEventListener('touchmove', this.touchMoveRef);
        this.el.removeEventListener('touchend', this.touchReleaseRef);
      }

      this.el.removeEventListener('mousedown', this.touchStartRef);
      this.el.removeEventListener('mousemove', this.touchMoveRef);
      this.el.removeEventListener('mouseup', this.touchReleaseRef);
      this.el.removeEventListener('mouseleave', this.touchReleaseRef);

      this.touchStartRef = undefined;
      this.touchMoveRef = undefined;
      this.touchReleaseRef = undefined;
    }

    _handleResizeEvent() {
      this._setBasicCaroulixHeight();
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

      this.children.forEach((item, index) => {
        let media = item.querySelector('img, video');

        if (media) {
          media.loadRef = this._newItemLoaded.bind(this);
          media.addEventListener('load', media.loadRef);
          this.totalMediaToLoad++;
        }
      });
    }

    _newItemLoaded() {
      this.loadedMediaCount++;

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

      if (this.options.indicators.enabled) {
        this._resetIndicators();
      }

      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);

      init ? setTimeout(() => this._setTransitionDuration(this.options.animationDuration), 50) : '';
    }

    _setBasicCaroulixHeight() {
      this.isResizing = true;
      this.el.style.transitionDuration = '';

      if (this.options.autoplay.enabled) {
        this.stop();
        this.play();
      }

      if (this.options.height) {
        this.el.style.height = this.options.height;
      } else {
        this.el.style.height = this.children[this.activeIndex].getBoundingClientRect().height + 'px';
      }

      this._setItemsPosition();

      setTimeout(() => {
        this.el.style.transitionDuration = this.options.animationDuration + 'ms';
        this.isResizing = false;
      }, 50);
    }

    _handleDragStart(e) {
      e.preventDefault();
      if (this.isAnimated) {
        return;
      }

      this._setTransitionDuration(0);
      this.isPressed = true;
      this.isDragged = false;
      this.isVerticallyDragged = false;

      this.deltaX = 0;
      this.deltaY = 0;
      this.xStart = this._getXPosition(e);
      this.yStart = this._getYPosition(e);
    }

    _handleDragMove(e) {
      if (!this.isPressed) {
        return;
      }

      e.preventDefault();

      let x, y;
      x = this._getXPosition(e);
      y = this._getYPosition(e);

      this.deltaX = this.xStart - x;
      this.deltaY = this.yStart - y;

      this.draggedPositionX = this.deltaX;
      this._setItemsPosition();
    }

    _handleDragRelease(e) {
      e.preventDefault();
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

      if (i === this.activeIndex) {
        return;
      }

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

    goTo(number) {
      if (number === this.activeIndex) {
        return;
      }

      let side;
      number > this.activeIndex ? (side = 'right') : (side = 'left');

      Axentix.createEvent(this.el, 'caroulix.slide', {
        side,
        nextElement: this.children[number],
        currentElement: this.children[this.activeIndex],
      });

      side === 'left'
        ? this.prev(Math.abs(this.activeIndex - number))
        : this.next(Math.abs(this.activeIndex - number));

      if (this.options.indicators.enabled) {
        this._resetIndicators();
      }
    }

    play() {
      this.autoplayInterval = setInterval(() => {
        this.options.autoplay.side === 'right' ? this.next(1, false) : this.prev(1, false);
      }, this.options.autoplay.interval);
    }

    stop() {
      clearInterval(this.autoplayInterval);
    }

    next(step = 1, resetAutoplay = true) {
      if (this.isResizing) {
        return;
      }

      Axentix.createEvent(this.el, 'caroulix.next', { step });

      this.isAnimated = true;

      resetAutoplay && this.options.autoplay.enabled ? this.stop() : '';

      if (this.activeIndex < this.children.length - 1) {
        this.activeIndex += step;
        this._setItemsPosition();
      } else if (this.options.backToOpposite) {
        this.activeIndex = 0;
        this._setItemsPosition();
      }

      resetAutoplay && this.options.autoplay.enabled ? this.play() : '';
    }

    prev(step = 1, resetAutoplay = true) {
      if (this.isResizing) {
        return;
      }

      Axentix.createEvent(this.el, 'caroulix.prev', { step });

      this.isAnimated = true;

      resetAutoplay && this.options.autoplay.enabled ? this.stop() : '';

      if (this.activeIndex > 0) {
        this.activeIndex -= step;
        this._setItemsPosition();
      } else if (this.options.backToOpposite) {
        this.activeIndex = this.children.length - 1;
        this._setItemsPosition();
      }

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
