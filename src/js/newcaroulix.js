(() => {
  /**
   * Class NewCaroulix
   * @class
   */
  class NewCaroulix extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 500,
      };
    }

    /**
     * Construct NewCaroulix instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      Axentix.instances.push({ type: 'NewCaroulix', instance: this });

      this.el = document.querySelector(element);

      this.options = Axentix.getComponentOptions('NewCaroulix', options, this.el, isLoadedWithData);

      this._setup();
    }

    _setup() {
      Axentix.createEvent(this.el, 'caroulix.setup');

      this.activeIndex = 0;

      this._getChildren();
      this.children[0].classList.add('active');
      this._waitForLoad();

      this._handleDrag();
    }

    /**
     * Get the children (caroulix-item...)
     */
    _getChildren() {
      this.children = Array.from(this.el.children).reduce((acc, child) => {
        child.classList.contains('caroulix-item') ? acc.push(child) : '';
        // child.classList.contains('caroulix-prev') ? (this.arrowPrev = child) : '';
        // child.classList.contains('caroulix-next') ? (this.arrowNext = child) : '';

        return acc;
      }, []);
    }

    /**
     * Wait for all the medias to be loaded
     */
    _waitForLoad() {
      this.totalMediaToLoad = 0;
      this.loadedMediaCount = 0;

      this.children.forEach((item) => {
        let media = item.querySelector('img, video');

        if (media) {
          media.loadRef = this._newItemLoaded.bind(this, media);
          media.addEventListener('load', media.loadRef);
          this.totalMediaToLoad++;
        }
      });
    }

    /**
     * Event sent when an item is loaded
     * @param {*} item
     */
    _newItemLoaded(item) {
      console.log(item, 'loaded');
      this.loadedMediaCount++;

      if (this.totalMediaToLoad == this.loadedMediaCount) {
        this._setBasicCaroulixHeight();
        this._setItemsPosition(true);
        // recall setItemsPosition on resize event
      }
    }

    /**
     * Set the caroulix-items position
     */
    _setItemsPosition(init = false) {
      let caroulixWidth = this.el.getBoundingClientRect().width;

      this.children.forEach(
        (child, index) =>
          (child.style.transform = `translateX(${
            caroulixWidth * index - caroulixWidth * this.activeIndex
          }px)`)
      );

      init
        ? setTimeout(() => (this.el.style.transitionDuration = this.options.animationDuration + 'ms'), 50)
        : '';
    }

    next(step = 1) {
      if (this.activeIndex < this.children.length - 1) {
        this.activeIndex += step;
        this._setItemsPosition();
      }
    }

    prev(step = 1) {
      if (this.activeIndex > 0) {
        this.activeIndex -= step;
        this._setItemsPosition();
      }
    }

    /**
     * Set the basic height of the Caroulix
     */
    _setBasicCaroulixHeight() {
      this.el.style.height = this.el.querySelector('.caroulix-item').getBoundingClientRect().height;
    }

    _handleDrag() {
      this.touchStartRef = this._handleDragStart.bind(this);
      this.touchMoveRef = this._handleDragMove.bind(this);
      this.touchReleaseRef = this._handleDragRelease.bind(this);

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

    _handleDragStart(e) {
      e.preventDefault();

      this.isPressed = true;
      this.isDragged = false;
      this.isVerticallyDragged = false;
      this.xStart = this._getXPosition(e);
      this.yStart = this._getYPosition(e);
    }

    _handleDragMove(e) {
      e.preventDefault();
      let x, y;

      if (this.isPressed) {
        x = this._getXPosition(e);
        y = this._getYPosition(e);
      }
    }

    _handleDragRelease(e) {
      e.preventDefault();
      this.isPressed ? (this.isPressed = false) : '';
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

    /**
     * Setup listeners
     */
    _setupListeners() {}

    /**
     * Remove listeners
     */
    _removeListeners() {}
  }

  Axentix.Config.registerComponent({
    class: NewCaroulix,
    name: 'NewCaroulix',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.caroulix:not(.no-axentix-init)',
    },
  });
})();
