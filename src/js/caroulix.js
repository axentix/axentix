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
    this.isAnimated = false;
    this._getChildrens();
    this._getActiveElementIndex();
    this._setupListeners();

    this.el.classList.add('anim-' + this.options.animationType);

    this.updateHeight();
  }

  _setupListeners() {
    this.windowResizeRef = this._setMaxHeight.bind(this);
    window.addEventListener('resize', this.windowResizeRef);

    if (this.arrowPrev && this.arrowNext) {
      this.arrowPrevRef = this.prev.bind(this);
      this.arrowNextRef = this.next.bind(this);

      this.arrowPrev.addEventListener('click', this.arrowPrevRef);
      this.arrowNext.addEventListener('click', this.arrowNextRef);
    }
  }

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

  _getChildrens() {
    this.childrens = Array.from(this.el.children).reduce((acc, child) => {
      child.classList.contains('caroulix-item') ? acc.push(child) : '';

      child.classList.contains('caroulix-prev') ? (this.arrowPrev = child) : '';
      child.classList.contains('caroulix-next') ? (this.arrowNext = child) : '';
      return acc;
    }, []);
  }

  _getActiveElementIndex() {
    let find = false;
    this.childrens.map((child, i) => {
      if (child.classList.contains('active')) {
        this.currentItemIndex = i;
        find = true;
      }
    });
    find ? '' : this.childrens[0].classList.add('active');
  }

  _setMaxHeight() {
    const childrensHeight = this.childrens.map(child => {
      return child.offsetHeight;
    });
    this.maxHeight = Math.max(...childrensHeight);

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
   * Update height of caroulix container
   */
  updateHeight() {
    if (this.options.fixedHeight) {
      this._setMaxHeight();
      return;
    }
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

  prev() {
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
