(() => {
  /**
   * Class NewCaroulix
   * @class
   */
  class NewCaroulix extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 500,
        animationType: 'slide',
        backToOpposite: true,
        isInfinite: true,
        autoplay: {
          enabled: false,
          interval: 4000,
          side: 'right',
        },
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

      const animationList = ['slide'];
      animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'slide');

      this.activeIndex = 0;
      this.draggedPositionX = 0;

      this._getChildren();
      this.children[0].classList.add('active');

      if (this.options.isInfinite && this.children.length > 2) {
        this.options.isInfinite ? (this.options.backToOpposite = true) : '';
      } else if (this.options.isInfinite) {
        this.options.isInfinite = false;
      }

      this._waitForLoad();

      this._handleDrag();

      this.options.autoplay.enabled ? this._setAutoPlay() : '';
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

      this.children.forEach((item, index) => {
        item.dataset.index = index;
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
      }
    }

    /**
     * Set the caroulix-items position
     */
    _setItemsPosition(init = false) {
      let caroulixWidth = this.el.getBoundingClientRect().width;
      let reversedChildren = this.children.slice().reverse();
      let leftItemCount = -1;

      this.children.forEach((child, index) => {});

      // a voir si on peut SORTIR LE ACTIVEINDEX A SET HORS DES 3 GROS IF, en tous les cas je le place au centre
      if (this.options.isInfinite) {
        if (this.activeIndex == 0) {
          this.children.forEach((child, index) => {
            if (index <= 1) {
              child.style.transform = `translateX(${caroulixWidth * index - this.draggedPositionX}px)`;
            }
          });
          reversedChildren.forEach((child, index) => {
            if (index < this.children.length - 2) {
              child.style.transform = `translateX(${-caroulixWidth * (index + 1) - this.draggedPositionX}px)`;
            }
          });
        } else if (this.activeIndex < this.children.length - 1) {
          this.children.forEach((child, index) => {
            if (index == this.activeIndex + 1) {
              child.style.transform = `translateX(${caroulixWidth - this.draggedPositionX}px)`;
            }
          });

          this.children
            .slice(0, this.activeIndex)
            .reverse()
            .forEach((child, index) => {
              child.style.transform = `translateX(${-caroulixWidth * (index + 1) - this.draggedPositionX}px)`;
              leftItemCount++;
            });

          this.children.slice(this.activeIndex).forEach((child, index) => {
            if (index == 1) {
              child.style.transform = `translateX(${caroulixWidth - this.draggedPositionX}px)`;
              return;
            }
            child.style.transform = `translateX(${
              -caroulixWidth * (leftItemCount + index) - this.draggedPositionX
            }px)`;
          });

          this.children[this.activeIndex].style.transform = `translateX(${-this.draggedPositionX}px)`;
          leftItemCount = 0;
        } else if (this.activeIndex == this.children.length - 1) {
          console.log('lafin');
          this.children
            .slice()
            .reverse()
            .forEach((child, index) => {
              if (child.dataset.index != this.activeIndex && index != this.children.length - 1) {
                child.style.transform = `translateX(${-caroulixWidth * index - this.draggedPositionX}px)`;
              } else if (index != this.children.length - 1) {
                child.style.transform = `translateX(${-this.draggedPositionX}px)`;
              } else if (index == this.children.length - 1) {
                child.style.transform = `translateX(${caroulixWidth - this.draggedPositionX}px)`;
              }
            });
        }
      } else {
        this.children.forEach((child, index) => {
          child.style.transform = `translateX(${
            caroulixWidth * index - caroulixWidth * this.activeIndex - this.draggedPositionX
          }px)`;
        });
      }

      init ? setTimeout(() => this._setTransitionDuration(this.options.animationDuration), 50) : '';
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
      // console.log(x, y, this.deltaX, this.deltaY);
      this.draggedPositionX = this.deltaX;
      this._setItemsPosition();
    }

    _handleDragRelease(e) {
      e.preventDefault();
      if (this.isPressed) {
        this._setTransitionDuration(this.options.animationDuration);
        let caroulixWidth = this.el.getBoundingClientRect().width;

        this.isPressed = false;

        if (this.deltaX > (caroulixWidth * 15) / 100) {
          this.next();
        } else if (this.deltaX < (-caroulixWidth * 15) / 100) {
          this.prev();
        }

        this.deltaX = 0;
        this.draggedPositionX = 0;

        this._setItemsPosition();
      }
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

    _setAutoPlay() {
      this.options.autoplay.side = this.options.autoplay.side.toLowerCase();

      const sideList = ['right', 'left'];
      sideList.includes(this.options.autoplay.side) ? '' : (this.options.autoplay.side = 'right');

      setInterval(() => {
        this.options.autoplay.side === 'right' ? this.next() : this.prev();
        this._setItemsPosition();
      }, this.options.autoplay.interval);
    }

    /**
     * Setup listeners
     */
    _setupListeners() {}

    /**
     * Remove listeners
     */
    _removeListeners() {}

    next(step = 1) {
      if (this.activeIndex < this.children.length - 1) {
        this.activeIndex += step;
        this._setItemsPosition();
      } else if (this.options.backToOpposite) {
        this.activeIndex = 0;
        this._setItemsPosition();
      }
    }

    prev(step = 1) {
      if (this.activeIndex > 0) {
        this.activeIndex -= step;
        this._setItemsPosition();
      } else if (this.options.backToOpposite) {
        this.activeIndex = this.children.length - 1;
        this._setItemsPosition();
      }
    }
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
