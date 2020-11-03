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
        indicators: {
          enabled: true,
          isFlat: true,
          customClasses: '',
        },
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

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'NewCaroulix', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('NewCaroulix', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] NewCaroulix init error', error);
      }
    }

    _setup() {
      Axentix.createEvent(this.el, 'caroulix.setup');

      const animationList = ['slide'];
      animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'slide');

      this.activeIndex = 0;
      this.draggedPositionX = 0;
      this.isAnimated = false;

      this._getChildren();
      this.options.indicators.enabled ? this._enableIndicators() : '';
      this.children[0].classList.add('active');

      if (this.options.isInfinite && this.children.length > 2) {
        this.options.backToOpposite = true;
      } else if (this.options.isInfinite) {
        this.options.isInfinite = false;
      }

      this._waitForLoad();

      this._setupListeners();

      this.options.autoplay.enabled ? this._setAutoPlay() : '';
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
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

    /**
     * Remove listeners
     */
    _removeListeners() {}

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
        let media = item.querySelector('img, video');

        if (media) {
          media.loadRef = this._newItemLoaded.bind(this);
          media.addEventListener('load', media.loadRef);
          this.totalMediaToLoad++;
        }
      });
    }

    /**
     * Event sent when an item is loaded
     * @param {*} item
     */
    _newItemLoaded() {
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

      // a voir si on peut SORTIR LE ACTIVEINDEX A SET HORS DES 3 GROS IF, en tous les cas je le place au centre
      if (this.options.isInfinite) {
        if (this.activeIndex == 0) {
          this.children.map((child, index) => {
            if (index <= 1) {
              this._translate(child, caroulixWidth * index - this.draggedPositionX);
            }
          });
          reversedChildren.map((child, index) => {
            if (index < this.children.length - 2) {
              this._translate(child, -caroulixWidth * (index + 1) - this.draggedPositionX);
            }
          });
        } else if (this.activeIndex < this.children.length - 1) {
          this._translate(this.children[this.activeIndex + 1], caroulixWidth - this.draggedPositionX);

          this.children
            .slice(0, this.activeIndex)
            .reverse()
            .map((child, index) => {
              this._translate(child, -caroulixWidth * (index + 1) - this.draggedPositionX);
              leftItemCount++;
            });

          this.children.slice(this.activeIndex).map((child, index) => {
            if (index == 1) {
              this._translate(child, caroulixWidth - this.draggedPositionX);
              return;
            }
            this._translate(child, -caroulixWidth * (leftItemCount + index) - this.draggedPositionX);
          });

          this.children[this.activeIndex].style.transform = `translateX(${-this.draggedPositionX}px)`;
          leftItemCount = 0;
        } else if (this.activeIndex == this.children.length - 1) {
          let translateValue;

          this.children
            .slice()
            .reverse()
            .map((child, index) => {
              if (this.children.indexOf(child) != this.activeIndex && index != this.children.length - 1) {
                translateValue = -caroulixWidth * index - this.draggedPositionX;
              } else if (index != this.children.length - 1) {
                translateValue = -this.draggedPositionX;
              } else if (index == this.children.length - 1) {
                translateValue = caroulixWidth - this.draggedPositionX;
              }
              this._translate(child, translateValue);
            });
        }
      } else {
        this.children.map((child, index) => {
          child.style.transform = `translateX(${
            caroulixWidth * index - caroulixWidth * this.activeIndex - this.draggedPositionX
          }px)`;
        });
      }

      if (this.options.indicators.enabled) {
        this._resetIndocators();
      }

      init ? setTimeout(() => this._setTransitionDuration(this.options.animationDuration), 50) : '';
    }

    /**
     * Set the basic height of the Caroulix
     */
    _setBasicCaroulixHeight() {
      // mettre l'el actif pas children[0]
      this.el.style.height = this.children[0].getBoundingClientRect().height;
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
      if (!this.isPressed || (this.options.isInfinite && this.isAnimated)) {
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

    _resetIndocators() {
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

    _setAutoPlay() {
      this.options.autoplay.side = this.options.autoplay.side.toLowerCase();

      const sideList = ['right', 'left'];
      sideList.includes(this.options.autoplay.side) ? '' : (this.options.autoplay.side = 'right');

      setInterval(() => {
        this.options.autoplay.side === 'right' ? this.next() : this.prev();
      }, this.options.autoplay.interval);
    }

    _translate(child, value) {
      child.style.transform = `translateX(${value}px)`;
    }

    _teleportItem(direction) {
      if (this.activeIndex == 0) {
        direction === 'next'
          ? this._timeoutTransition(this.children[2])
          : this._timeoutTransition(this.children[1]);
      } else if (this.activeIndex < this.children.length - 2) {
        direction === 'next'
          ? this._timeoutTransition(this.children[this.activeIndex + 2])
          : this._timeoutTransition(this.children[this.activeIndex + 1]);
      } else if (this.activeIndex == this.children.length - 2) {
        direction === 'next'
          ? this._timeoutTransition(this.children[0])
          : this._timeoutTransition(this.children[this.children.length - 1]);
      } else if (this.activeIndex == this.children.length - 1) {
        direction === 'next'
          ? this._timeoutTransition(this.children[1])
          : this._timeoutTransition(this.children[0]);
      }
    }

    _timeoutTransition(child) {
      child.style.transitionDuration = '0ms';

      setTimeout(() => {
        child.style.transitionDuration = '';
      }, this.options.animationDuration);
    }

    goTo(number) {
      if (this.isAnimated || number === this.activeIndex) {
        return;
      }

      console.log('goto');
      let side;
      number > this.activeIndex ? (side = 'right') : (side = 'left');

      // this.options.autoplay.enabled && this.autoTimeout ? this.stop() : '';

      Axentix.createEvent(this.el, 'caroulix.slide', {
        side,
        nextElement: this.children[number],
        currentElement: this.children[this.activeIndex],
      });

      side === 'left'
        ? this.prev(Math.abs(this.activeIndex - number))
        : this.next(Math.abs(this.activeIndex - number));

      if (this.options.indicators.enabled) {
        this._resetIndocators();
      }
    }

    next(step = 1) {
      console.log('next1');
      if (this.options.isInfinite && this.isAnimated === false) {
        this.isAnimated = true;
        this.options.isInfinite ? this._teleportItem('next') : '';
      } else if (this.options.isInfinite) {
        return;
      }
      console.log('next2');

      if (this.activeIndex < this.children.length - 1) {
        this.activeIndex += step;
        this._setItemsPosition();
      } else if (this.options.backToOpposite) {
        this.activeIndex = 0;
        this._setItemsPosition();
      }

      if (this.isAnimated) {
        setTimeout(() => {
          this.isAnimated = false;
        }, this.options.animationDuration);
      }
    }

    prev(step = 1) {
      if (this.options.isInfinite && this.isAnimated === false) {
        this.isAnimated = true;
        this.options.isInfinite ? this._teleportItem('prev') : '';
      } else if (this.options.isInfinite) {
        return;
      }

      if (this.activeIndex > 0) {
        this.activeIndex -= step;
        this._setItemsPosition();
      } else if (this.options.backToOpposite) {
        this.activeIndex = this.children.length - 1;
        this._setItemsPosition();
      }

      if (this.isAnimated) {
        setTimeout(() => {
          this.isAnimated = false;
        }, this.options.animationDuration);
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
