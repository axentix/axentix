/**
 * Class Tab
 * @class
 */
class Tab extends AxentixComponent {
  /**
   * Construct Tab instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    super();
    this.defaultAnimDelay = 300;
    this.caroulixOptions = {
      animationDelay: this.defaultAnimDelay,
      autoplay: {
        enabled: false
      }
    };

    this.defaultOptions = {
      animationDelay: this.defaultAnimDelay,
      animationType: 'none',
      caroulix: {}
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
    Axentix.createEvent(this.el, 'tab.setup');

    const animationList = ['none', 'slide'];
    animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'none');
    this.isAnimated = false;
    this.resizeEventDelay = 0;
    this.tabArrow = document.querySelector(this.elQuery + ' .tab-arrow');
    this.tabLinks = document.querySelectorAll(this.elQuery + ' .tab-menu .tab-link');
    this.tabMenu = document.querySelector(this.elQuery + ' .tab-menu');
    this._getItems();

    if (this.tabArrow) {
      this._toggleArrowMode();
      this.leftArrow = document.querySelector(this.elQuery + ' .tab-arrow .tab-prev');
      this.rightArrow = document.querySelector(this.elQuery + ' .tab-arrow .tab-next');
    }

    this._setupListeners();

    this.el.style.transitionDuration = this.options.animationDelay + 'ms';
    this.options.animationType === 'slide' ? this._enableSlideAnimation() : this.updateActiveElement();
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.tabLinks.forEach(item => {
      item.listenerRef = this._onClickItem.bind(this, item);
      item.addEventListener('click', item.listenerRef);
    });

    this.resizeTabListener = this._handleResizeEvent.bind(this);
    window.addEventListener('resize', this.resizeTabListener);

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
    this.tabLinks.forEach(item => {
      item.removeEventListener('click', item.listenerRef);
      item.listenerRef = undefined;
    });

    window.removeEventListener('resize', this.resizeTabListener);
    this.resizeTabListener = undefined;

    if (this.tabArrow) {
      window.removeEventListener('resize', this.arrowListener);
      this.arrowListener = undefined;

      this.leftArrow.removeEventListener('click', this.scrollLeftListener);
      this.rightArrow.removeEventListener('click', this.scrollRightLstener);
      this.scrollLeftListener = undefined;
      this.scrollRightLstener = undefined;
    }
  }

  _handleResizeEvent() {
    this.updateActiveElement();
    for (let i = 100; i < 500; i += 100) {
      setTimeout(() => {
        this.updateActiveElement();
      }, i);
    }
  }

  /**
   * Get all items
   */
  _getItems() {
    this.tabItems = Array.from(this.el.children).reduce((acc, child) => {
      !child.classList.contains('tab-menu') && !child.classList.contains('tab-arrow') ? acc.push(child) : '';
      return acc;
    }, []);
  }

  /**
   * Hide all tab items
   */
  _hideContent() {
    this.tabItems.map(item => (item.style.display = 'none'));
  }

  /**
   * Init slide animation
   */
  _enableSlideAnimation() {
    this.tabItems.map(item => item.classList.add('caroulix-item'));
    this.tabCaroulix = Axentix.wrap(this.tabItems);
    this.tabCaroulix.classList.add('caroulix');
    const nb = Math.random()
      .toString()
      .split('.')[1];
    this.tabCaroulix.id = 'tab-caroulix-' + nb;
    this.tabCaroulixInit = true;

    this.options.caroulix = Axentix.extend(this.caroulixOptions, this.options.caroulix);
    this.options.animationDelay !== this.defaultAnimDelay
      ? (this.options.caroulix.animationDelay = this.options.animationDelay)
      : '';
    this.updateActiveElement();
  }

  /**
   * Set active bar position
   * @param {Element} element
   */
  _setActiveElement(element) {
    this.tabLinks.forEach(item => item.classList.remove('active'));

    const elementRect = element.getBoundingClientRect();

    const elementPosLeft = elementRect.left;
    const menuPosLeft = this.tabMenu.getBoundingClientRect().left;
    const left = elementPosLeft - menuPosLeft + this.tabMenu.scrollLeft;

    const elementWidth = elementRect.width;
    const right = this.tabMenu.clientWidth - left - elementWidth;

    this.tabMenu.style.setProperty('--tab-bar-left-offset', Math.floor(left) + 'px');
    this.tabMenu.style.setProperty('--tab-bar-right-offset', Math.ceil(right) + 'px');

    element.classList.add('active');
  }

  /**
   * Toggle arrow mode
   */
  _toggleArrowMode() {
    const totalWidth = Array.from(this.tabLinks).reduce((acc, element) => {
      acc += element.clientWidth;
      return acc;
    }, 0);
    const arrowWidth = this.tabArrow.clientWidth;

    if (totalWidth > arrowWidth) {
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
   * @param {String} itemId
   */
  select(itemId) {
    if (this.isAnimated) {
      return;
    }

    this.isAnimated = true;
    const menuItem = document.querySelector(this.elQuery + ' .tab-menu a[href="#' + itemId + '"]');
    Axentix.createEvent(menuItem, 'tab.select');

    this._setActiveElement(menuItem.parentElement);

    if (this.tabCaroulixInit) {
      this.tabItems.map(item => (item.id === itemId ? item.classList.add('active') : ''));
      this.caroulixInstance = new Caroulix('#' + this.tabCaroulix.id, this.options.caroulix);
      this.tabCaroulixInit = false;
      this.isAnimated = false;
      return;
    }

    if (this.options.animationType === 'slide') {
      const nb = this.tabItems.findIndex(item => item.id === itemId);
      this.caroulixInstance.goTo(nb);
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDelay);
    } else {
      this._hideContent();
      this.tabItems.map(item => (item.id === itemId ? (item.style.display = 'block') : ''));
      this.isAnimated = false;
    }
  }

  /**
   * Detect active element & update component
   */
  updateActiveElement() {
    let itemSelected;
    this.tabLinks.forEach(item => {
      item.classList.contains('active') ? (itemSelected = item) : '';
    });

    itemSelected ? '' : (itemSelected = this.tabLinks.item(0));
    const target = itemSelected.children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }
}
Axentix.Tab = Tab;
