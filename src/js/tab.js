(() => {
  /**
   * Class Tab
   * @class
   */
  class Tab extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        animationType: 'none',
        disableActiveBar: false,
        caroulix: {},
      };
    }

    /**
     * Construct Tab instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Tab', instance: this });

        this.caroulixOptions = {
          animationDuration: 300,
          backToOpposite: false,
          enableTouch: false,
          autoplay: {
            enabled: false,
          },
        };

        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Tab', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Tab init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'tab.setup');

      const animationList = ['none', 'slide'];
      animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'none');
      this.isAnimated = false;

      this.tabArrow = this.el.querySelector('.tab-arrow');
      this.tabLinks = this.el.querySelectorAll('.tab-menu .tab-link');
      this.tabMenu = this.el.querySelector('.tab-menu');
      this.currentItemIndex = 0;
      this._getItems();

      if (this.tabArrow) {
        this._toggleArrowMode();
        this.leftArrow = this.el.querySelector('.tab-arrow .tab-prev');
        this.rightArrow = this.el.querySelector('.tab-arrow .tab-next');
      }

      this._setupListeners();

      this.tabMenu.style.transitionDuration = this.options.animationDuration + 'ms';
      this.options.animationType === 'slide' ? this._enableSlideAnimation() : this.updateActiveElement();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.tabLinks.forEach((item) => {
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
      this.tabLinks.forEach((item) => {
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

      if (this.caroulixSlideRef) {
        this.el.removeEventListener('ax.caroulix.slide', this.caroulixSlideRef);
        this.caroulixSlideRef = undefined;
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

    _handleCaroulixSlide() {
      if (this.currentItemIndex !== this.caroulixInstance.activeIndex) {
        this.currentItemIndex = this.caroulixInstance.activeIndex;
        this._setActiveElement(this.tabLinks[this.currentItemIndex]);
      }
    }

    /**
     * Get all items
     */
    _getItems() {
      this.tabItems = Array.from(this.tabLinks).map((link) => {
        const id = link.children[0].getAttribute('href');
        return this.el.querySelector(id);
      });
    }

    /**
     * Hide all tab items
     */
    _hideContent() {
      this.tabItems.map((item) => (item.style.display = 'none'));
    }

    /**
     * Init slide animation
     */
    _enableSlideAnimation() {
      this.tabItems.map((item) => item.classList.add('caroulix-item'));
      this.tabCaroulix = Axentix.wrap(this.tabItems);
      this.tabCaroulix.classList.add('caroulix');
      const nb = Math.random().toString().split('.')[1];
      this.tabCaroulix.id = 'tab-caroulix-' + nb;
      this.tabCaroulixInit = true;

      this.options.caroulix = Axentix.extend(this.caroulixOptions, this.options.caroulix);
      this.options.animationDuration !== 300
        ? (this.options.caroulix.animationDuration = this.options.animationDuration)
        : '';
      this.updateActiveElement();
    }

    /**
     * Set active bar position
     * @param {Element} element
     */
    _setActiveElement(element) {
      this.tabLinks.forEach((item) => item.classList.remove('active'));

      if (!this.options.disableActiveBar) {
        const elementRect = element.getBoundingClientRect();

        const elementPosLeft = elementRect.left;
        const menuPosLeft = this.tabMenu.getBoundingClientRect().left;
        const left = elementPosLeft - menuPosLeft + this.tabMenu.scrollLeft;

        const elementWidth = elementRect.width;
        const right = this.tabMenu.clientWidth - left - elementWidth;

        this.tabMenu.style.setProperty('--tab-bar-left-offset', Math.floor(left) + 'px');
        this.tabMenu.style.setProperty('--tab-bar-right-offset', Math.ceil(right) + 'px');
      }

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
        this.tabArrow.classList.contains('tab-arrow-show')
          ? ''
          : this.tabArrow.classList.add('tab-arrow-show');
      } else {
        this.tabArrow.classList.contains('tab-arrow-show')
          ? this.tabArrow.classList.remove('tab-arrow-show')
          : '';
      }
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

    _getPreviousItemIndex(step) {
      let previousItemIndex = 0;
      let index = this.currentItemIndex;
      for (let i = 0; i < step; i++) {
        if (index > 0) {
          previousItemIndex = index - 1;
          index--;
        } else {
          index = this.tabLinks.length - 1;
          previousItemIndex = index;
        }
      }
      return previousItemIndex;
    }

    _getNextItemIndex(step) {
      let nextItemIndex = 0;
      let index = this.currentItemIndex;
      for (let i = 0; i < step; i++) {
        if (index < this.tabLinks.length - 1) {
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
     * Select tab
     * @param {String} itemId
     */
    select(itemId) {
      if (this.isAnimated) {
        return;
      }

      this.isAnimated = true;
      const menuItem = this.el.querySelector('.tab-menu a[href="#' + itemId + '"]');
      this.currentItemIndex = Array.from(this.tabLinks).findIndex((item) => item.children[0] === menuItem);

      Axentix.createEvent(menuItem, 'tab.select', { currentIndex: this.currentItemIndex });

      this._setActiveElement(menuItem.parentElement);

      if (this.tabCaroulixInit) {
        this.tabItems.map((item) => (item.id === itemId ? item.classList.add('active') : ''));

        this.caroulixInstance = new Axentix.Caroulix(
          '#' + this.tabCaroulix.id,
          this.options.caroulix,
          this.el,
          true
        );

        this.caroulixSlideRef = this._handleCaroulixSlide.bind(this);
        this.el.addEventListener('ax.caroulix.slide', this.caroulixSlideRef);

        this.tabCaroulixInit = false;
        this.isAnimated = false;
        return;
      }

      if (this.options.animationType === 'slide') {
        const nb = this.tabItems.findIndex((item) => item.id === itemId);
        this.caroulixInstance.goTo(nb);
        setTimeout(() => {
          this.isAnimated = false;
        }, this.options.animationDuration);
      } else {
        this._hideContent();
        this.tabItems.map((item) => (item.id === itemId ? (item.style.display = 'block') : ''));
        this.isAnimated = false;
      }
    }

    /**
     * Detect active element & update component
     */
    updateActiveElement() {
      let itemSelected;
      this.tabLinks.forEach((item, index) => {
        item.classList.contains('active') ? ((itemSelected = item), (this.currentItemIndex = index)) : '';
      });

      itemSelected ? '' : ((itemSelected = this.tabLinks.item(0)), (this.currentItemIndex = 0));
      const target = itemSelected.children[0].getAttribute('href');
      this.tabSelected = target;
      this.select(target.split('#')[1]);
    }

    /**
     * Go to previous tab
     */
    prev(step = 1) {
      if (this.isAnimated) {
        return;
      }

      const previousItemIndex = this._getPreviousItemIndex(step);
      this.currentItemIndex = previousItemIndex;
      Axentix.createEvent(this.el, 'tab.prev', { step });

      const target = this.tabLinks[previousItemIndex].children[0].getAttribute('href');
      this.select(target.split('#')[1]);
    }

    /**
     * Go to next tab
     */
    next(step = 1) {
      if (this.isAnimated) {
        return;
      }

      const nextItemIndex = this._getNextItemIndex(step);
      this.currentItemIndex = nextItemIndex;
      Axentix.createEvent(this.el, 'tab.next', { step });

      const target = this.tabLinks[nextItemIndex].children[0].getAttribute('href');
      this.select(target.split('#')[1]);
    }
  }

  Axentix.Config.registerComponent({
    class: Tab,
    name: 'Tab',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.tab:not(.no-axentix-init)',
    },
  });
})();
