/**
 * Class Caroulix
 * @class
 */
class Caroulix extends AxentixComponent {
  /**
   * Construct Caroulix instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    super();
    this.defaultOptions = {
      fixedHeight: true,
      height: '',
      animationDelay: 500,
      animationType: 'slide',
      indicators: {
        enabled: false,
        isFlat: false,
        customClasses: ''
      },
      autoplay: {
        enabled: true,
        interval: 5000,
        side: 'right'
      }
    };

    this.el = document.querySelector(element);

    this.options = Axentix.extend(this.defaultOptions, options);
    this._setup();
  }

  _setup() {
    Axentix.createEvent(this.el, 'caroulix.setup');

    const animationList = ['slide'];
    animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'slide');
    const autoplaySides = ['right', 'left'];
    autoplaySides.includes(this.options.autoplay.side) ? '' : (this.options.autoplay.side = 'right');
    this.currentItemIndex = 0;
    this.isAnimated = false;
    this._getChildrens();
    this.options.indicators.enabled ? this._enableIndicators() : '';
    this._getActiveElementIndex();
    this._setupListeners();

    this.el.classList.add('anim-' + this.options.animationType);
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.windowResizeRef = this._handleResizeEvent.bind(this);
    window.addEventListener('resize', this.windowResizeRef);

    if (this.arrowPrev && this.arrowNext) {
      this.arrowPrevRef = this.prev.bind(this, 1);
      this.arrowNextRef = this.next.bind(this, 1);

      this.arrowPrev.addEventListener('click', this.arrowPrevRef);
      this.arrowNext.addEventListener('click', this.arrowNextRef);
    }
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    window.removeEventListener('resize', this.windowResizeRef);
    this.windowResizeRef = undefined;

    if (this.arrowPrev && this.arrowNext) {
      this.arrowPrev.removeEventListener('click', this.arrowPrevRef);
      this.arrowNext.removeEventListener('click', this.arrowNextRef);
      this.arrowPrevRef = undefined;
      this.arrowNextRef = undefined;
    }
  }

  /**
   * Handle resize event
   */
  _handleResizeEvent(e) {
    this.updateHeight();
  }

  /**
   * Get caroulix childrens
   */
  _getChildrens() {
    this.childrens = Array.from(this.el.children).reduce((acc, child) => {
      child.classList.contains('caroulix-item') ? acc.push(child) : '';

      child.classList.contains('caroulix-prev') ? (this.arrowPrev = child) : '';
      child.classList.contains('caroulix-next') ? (this.arrowNext = child) : '';
      return acc;
    }, []);
  }

  _getActiveElementIndex() {
    this.childrens.map((child, i) => {
      if (child.classList.contains('active')) {
        this.currentItemIndex = i;
      }
    });

    const item = this.childrens[this.currentItemIndex];
    item.classList.contains('active') ? '' : item.classList.add('active');
    this.options.indicators.enabled
      ? this.indicators.children[this.currentItemIndex].classList.add('active')
      : '';

    this._waitUntilLoad(item);
  }

  _waitUntilLoad(item) {
    let isImage = false;
    if (this.options.fixedHeight) {
      this.totalLoadChild = 0;
      this.totalLoadedChild = 0;

      this.childrens.map(child => {
        const waitItem = child.querySelector('img, video');
        if (waitItem) {
          isImage = true;
          this.totalLoadChild++;
          if (waitItem.complete) {
            this._initWhenLoaded(waitItem, true);
          } else {
            waitItem.loadRef = this._initWhenLoaded.bind(this, waitItem);
            waitItem.addEventListener('load', waitItem.loadRef);
          }
        }
      });
    } else {
      const childItem = item.querySelector('img, video');
      if (childItem) {
        isImage = true;

        if (childItem.complete) {
          this._initWhenLoaded(childItem, true);
        } else {
          childItem.loadRef = this._initWhenLoaded.bind(this, childItem);
          childItem.addEventListener('load', childItem.loadRef);
        }
      }
    }

    if (!isImage) {
      this.updateHeight();
      this.options.autoplay.enabled ? this.play() : '';
    }
  }

  /**
   * Update height & remove listener when active element is loaded
   * @param {Element} item
   * @param {Boolean} alreadyLoad
   */
  _initWhenLoaded(item, alreadyLoad) {
    if (this.options.fixedHeight) {
      if (!alreadyLoad) {
        item.removeEventListener('load', item.loadRef);
        item.loadRef = undefined;
      }
      this.totalLoadedChild++;

      if (this.totalLoadedChild === this.totalLoadChild) {
        this.updateHeight();
        this.totalLoadedChild = undefined;
        this.totalLoadChild = undefined;
        this.options.autoplay.enabled ? this.play() : '';
      }
    } else {
      this.updateHeight();
      item.removeEventListener('load', item.loadRef);
      item.loadRef = undefined;
      this.options.autoplay.enabled ? this.play() : '';
    }
  }

  _setMaxHeight() {
    if (this.options.height) {
      this.el.style.height = this.options.height;
      return;
    }

    const childrensHeight = this.childrens.map(child => {
      return child.offsetHeight;
    });
    this.maxHeight = Math.max(...childrensHeight);

    this.el.style.height = this.maxHeight + 'px';
  }

  /**
   * Dynamic height option
   * @param {number} index
   */
  _setDynamicHeight(index = this.currentItemIndex) {
    const height = this.childrens[index].offsetHeight;
    this.el.style.height = height + 'px';
  }

  /**
   * Enable indicators
   */
  _enableIndicators() {
    this.indicators = document.createElement('ul');
    this.indicators.classList.add('caroulix-indicators');
    this.options.indicators.isFlat ? this.indicators.classList.add('caroulix-flat') : '';

    this.options.indicators.customClasses
      ? (this.indicators.className = this.indicators.className + ' ' + this.options.indicators.customClasses)
      : '';
    for (let i = 0; i < this.childrens.length; i++) {
      const li = document.createElement('li');
      li.triggerRef = this._handleIndicatorClick.bind(this, i);
      li.addEventListener('click', li.triggerRef);
      this.indicators.appendChild(li);
    }
    this.el.appendChild(this.indicators);
  }

  /***** Animation Section *****/

  /**
   * Slide animation
   * @param {number} number
   * @param {string} side
   */
  _animationSlide(number, side) {
    const nextItem = this.childrens[number];
    const currentItem = this.childrens[this.currentItemIndex];
    let nextItemPercentage = '',
      currentItemPercentage = '';

    if (side === 'right') {
      nextItemPercentage = '100%';
      currentItemPercentage = '-100%';
    } else {
      nextItemPercentage = '-100%';
      currentItemPercentage = '100%';
    }

    nextItem.style.transform = `translateX(${nextItemPercentage})`;
    nextItem.classList.add('active');

    setTimeout(() => {
      nextItem.style.transitionDuration = this.options.animationDelay + 'ms';
      nextItem.style.transform = '';
      currentItem.style.transitionDuration = this.options.animationDelay + 'ms';
      currentItem.style.transform = `translateX(${currentItemPercentage})`;
    }, 50);

    setTimeout(() => {
      nextItem.removeAttribute('style');
      currentItem.classList.remove('active');
      currentItem.removeAttribute('style');

      this.currentItemIndex = number;
      this.isAnimated = false;
      this.options.autoplay.enabled ? this.play() : '';
    }, this.options.animationDelay + 50);
  }

  /***** [END] Animation Section [END] *****/

  /**
   * Handle indicator click
   * @param {number} i
   * @param {Event} e
   */
  _handleIndicatorClick(i, e) {
    e.preventDefault();

    if (i === this.currentItemIndex) {
      return;
    }

    this.goTo(i);
  }

  _getPreviousItemIndex(step) {
    let previousItemIndex = 0;
    let index = this.currentItemIndex;
    for (let i = 0; i < step; i++) {
      if (index > 0) {
        previousItemIndex = index - 1;
        index--;
      } else {
        index = this.childrens.length - 1;
        previousItemIndex = index;
      }
    }
    return previousItemIndex;
  }

  _getNextItemIndex(step) {
    let nextItemIndex = 0;
    let index = this.currentItemIndex;
    for (let i = 0; i < step; i++) {
      if (index < this.childrens.length - 1) {
        nextItemIndex = index + 1;
        index++;
      } else {
        index = 0;
        nextItemIndex = index;
      }
    }
    return nextItemIndex;
  }

  /**
   * Update height of caroulix container
   * @param {number} indexRef
   */
  updateHeight(indexRef) {
    this.options.fixedHeight ? this._setMaxHeight() : this._setDynamicHeight(indexRef);
  }

  /**
   * Go to {n} item
   * @param {number} number
   * @param {string} side
   */
  goTo(number, side) {
    if (this.isAnimated || number === this.currentItemIndex) {
      return;
    }

    side ? '' : number > this.currentItemIndex ? (side = 'right') : (side = 'left');

    this.options.autoplay.enabled && this.autoTimeout ? this.stop() : '';

    Axentix.createEvent(this.el, 'caroulix.slide', {
      side,
      nextElement: this.childrens[number],
      currentElement: this.childrens[this.currentItemIndex]
    });
    this.isAnimated = true;
    const animFunction =
      '_animation' +
      this.options.animationType.charAt(0).toUpperCase() +
      this.options.animationType.substring(1);

    if (this.options.indicators.enabled) {
      Array.from(this.indicators.children).map(li => {
        li.removeAttribute('class');
      });
      this.indicators.children[number].classList.add('active');
    }

    this.options.fixedHeight ? '' : this.updateHeight(number);
    this[animFunction](number, side);
  }

  prev(step = 1) {
    if (this.isAnimated) {
      return;
    }

    Axentix.createEvent(this.el, 'caroulix.prev', { step });
    const previousItemIndex = this._getPreviousItemIndex(step);
    this.goTo(previousItemIndex, 'left');
  }

  next(step = 1) {
    if (this.isAnimated) {
      return;
    }

    Axentix.createEvent(this.el, 'caroulix.next', { step });
    const nextItemIndex = this._getNextItemIndex(step);
    this.goTo(nextItemIndex, 'right');
  }

  play() {
    this.autoTimeout = setTimeout(() => {
      this.options.autoplay.side === 'right' ? this.next() : this.prev();
    }, this.options.autoplay.interval);
  }

  stop() {
    clearTimeout(this.autoTimeout);
    this.autoTimeout = false;
  }
}
Axentix.Caroulix = Caroulix;
