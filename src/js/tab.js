/**
 * Class Tab
 * @class
 */
class Tab {
  /**
   * Construct Tab instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {
      animationDelay: 300,
      animationType: 'none'
    };

    this.el = document.querySelector(element);
    this.elQuery = element;

    this.options = Axentix.extend(this.defaultOptions, options);
    this._setup();
  }

  /**
   * Setup component
   */
  _setup() {
    this.isAnimated = false;
    this.tabArrow = document.querySelector(this.elQuery + ' .tab-arrow');
    this.tabItems = document.querySelectorAll(this.elQuery + ' .tab-menu .tab-item');
    this.tabMenu = document.querySelector(this.elQuery + ' .tab-menu');

    if (this.tabArrow) {
      this._toggleArrowMode();
      this.leftArrow = document.querySelector(this.elQuery + ' .tab-arrow .tab-prev');
      this.rightArrow = document.querySelector(this.elQuery + ' .tab-arrow .tab-next');
    }

    this._setupListeners();

    this.el.style.transitionDuration = this.options.animationDelay + 'ms';
    this._hideContent();
    this.updateActiveElement();
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.tabItems.forEach(item => {
      item.listenerRef = this._onClickItem.bind(this, item);
      item.addEventListener('click', item.listenerRef);
    });

    if (this.tabArrow) {
      this.arrowListener = this._toggleArrowMode.bind(this);
      window.addEventListener('resize', this.arrowListener);

      this.scrollLeftListener = this._scrollLeft.bind(this);
      this.scrollRightLstener = this._scrollRight.bind(this);
      this.leftArrow.addEventListener('click', this.scrollLeftListener);
      this.rightArrow.addEventListener('click', this.scrollRightLstener);
    }
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.tabItems.forEach(item => {
      item.removeEventListener('click', item.listenerRef);
      item.listenerRef = undefined;
    });

    if (this.tabArrow) {
      window.removeEventListener('resize', this.arrowListener);
      this.arrowListener = undefined;

      this.leftArrow.removeEventListener('click', this.scrollLeftListener);
      this.rightArrow.removeEventListener('click', this.scrollRightLstener);
      this.scrollLeftListener = undefined;
      this.scrollRightLstener = undefined;
    }
  }

  /**
   * Hide all tabs except tab-menu
   */
  _hideContent() {
    for (const child of this.el.children) {
      if (!child.classList.contains('tab-menu') && !child.classList.contains('tab-arrow')) {
        child.style.display = 'none';
      }
    }
  }

  /**
   * Set active bar position
   * @param {Element} element
   */
  _setActiveElement(element) {
    this.tabItems.forEach(item => {
      item.classList.remove('active');
    });

    const width = element.clientWidth;
    const elementPosLeft = element.getBoundingClientRect().left;

    let left = 0;
    const menuPosLeft = this.tabMenu.getBoundingClientRect().left;
    left = elementPosLeft - menuPosLeft + this.tabMenu.scrollLeft;

    this.tabMenu.style.setProperty('--tab-bar-left-offset', left + 'px');
    this.tabMenu.style.setProperty('--tab-bar-width', width + 'px');

    element.classList.add('active');
  }

  /**
   * Toggle arrow mode
   */
  _toggleArrowMode() {
    const totalWidth = Array.from(this.tabItems).reduce((acc, element) => {
      acc += element.clientWidth;
      return acc;
    }, 0);
    const menuWidth = this.tabMenu.clientWidth;

    if (totalWidth > menuWidth) {
      this.tabArrow.classList.contains('tab-arrow-show') ? '' : this.tabArrow.classList.add('tab-arrow-show');
    } else {
      this.tabArrow.classList.contains('tab-arrow-show')
        ? this.tabArrow.classList.remove('tab-arrow-show')
        : '';
    }

    this.updateActiveElement();
  }

  /**
   * Scroll left
   * @param {Event} e
   */
  _scrollLeft(e) {
    e.preventDefault();
    this.tabMenu.scrollLeft -= 40;
  }

  /**
   * Scroll right
   * @param {Event} e
   */
  _scrollRight(e) {
    e.preventDefault();
    this.tabMenu.scrollLeft += 40;
  }

  /**
   * Handle click on menu item
   * @param {Element} item
   * @param {Event} e
   */
  _onClickItem(item, e) {
    e.preventDefault();
    if (this.isAnimated || item.classList.contains('active')) {
      return;
    }

    const target = item.children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }

  /**
   * Select tab
   * @param {String} item_id
   */
  select(item_id) {
    if (this.options.animationType !== 'none') {
      this.isAnimated = true;
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDelay);
    }

    const menuItem = document.querySelector(this.elQuery + ' .tab-menu a[href="#' + item_id + '"]');
    this._setActiveElement(menuItem.parentElement);

    this._hideContent();
    for (const child of this.el.children) {
      if (!child.classList.contains('tab-menu') && child.id === item_id) {
        child.style.display = 'block';
      }
    }
  }

  updateActiveElement() {
    let itemSelected;
    this.tabItems.forEach(item => {
      if (item.classList.contains('active')) {
        itemSelected = item;
      }
    });

    itemSelected ? '' : (itemSelected = this.tabItems.item(0));
    const target = itemSelected.children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }
}
