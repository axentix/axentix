/**
 * Class Caroulix
 * @class
 */
class Caroulix {
  /**
   * Construct Caroulix instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {
      fixedHeight: true,
      animationDelay: 500,
      animationType: 'slide'
    };

    this.el = document.querySelector(element);

    this.options = Axentix.extend(this.defaultOptions, options);
    this._setup();
  }

  _setup() {
    const animationList = ['slide'];
    animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'slide');
    this.currentItemIndex = 0;
    this.childrens = this.el.children;
    this._getActiveElementIndex();
    this.isAnimated = false;
    this._setupListeners();

    this.el.classList.add('anim-' + this.options.animationType);
    this.options.fixedHeight ? this._setMaxHeight() : '';
  }

  _setupListeners() {
    this.windowResizeRef = this._setMaxHeight.bind(this);
    window.addEventListener('resize', this.windowResizeRef);
  }

  _removeListeners() {
    window.removeEventListener('resize', this.windowResizeRef);
    this.windowResizeRef = undefined;
  }

  _getActiveElementIndex() {
    Array.from(this.childrens).map((child, i) => {
      child.classList.contains('active') ? (this.currentItemIndex = i) : '';
    });
  }

  _setMaxHeight() {
    let childrenHeight = [];
    for (const child of this.childrens) {
      childrenHeight.push(child.offsetHeight);
    }
    this.maxHeight = Math.max(...childrenHeight);

    this.el.style.height = this.maxHeight + 'px';
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
    }, 5);

    setTimeout(() => {
      nextItem.removeAttribute('style');
      currentItem.classList.remove('active');
      currentItem.removeAttribute('style');

      this.currentItemIndex = number;
      this.isAnimated = false;
    }, this.options.animationDelay);
  }

  /***** [END] Animation Section [END] *****/

  _getPreviousItem() {
    let previousItem = 0;
    if (this.currentItemIndex > 0) {
      previousItem = this.currentItemIndex - 1;
    } else {
      previousItem = this.childrens.length - 1;
    }
    return previousItem;
  }

  _getNextItem() {
    let nextItem = 0;
    if (this.currentItemIndex < this.childrens.length - 1) {
      nextItem = this.currentItemIndex + 1;
    }
    return nextItem;
  }

  /**
   * Go to {n} item
   * @param {number} number
   * @param {string} side
   */
  goTo(number, side) {
    if (this.isAnimated) {
      return;
    }

    this.isAnimated = true;
    const animFunction =
      '_animation' +
      this.options.animationType.charAt(0).toUpperCase() +
      this.options.animationType.substring(1);
    this[animFunction](number, side);
  }

  previous() {
    if (this.isAnimated) {
      return;
    }

    const previousItem = this._getPreviousItem();
    this.goTo(previousItem, 'left');
  }

  next() {
    if (this.isAnimated) {
      return;
    }

    const nextItem = this._getNextItem();
    this.goTo(nextItem, 'right');
  }
}
