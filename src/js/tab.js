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
    this.tabMenu = document.querySelector(this.elQuery + ' .tab-menu');
    this._setupListeners();

    this.el.style.transitionDuration = this.options.animationDelay + 'ms';
    this._hideContent();
    this.updateActiveElement();
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    for (const item of this.tabMenu.children) {
      item.listenerRef = this._onClickItem.bind(this, item);
      item.addEventListener('click', item.listenerRef);
    }
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    for (const item of this.tabMenu.children) {
      item.removeEventListener('click', item.listenerRef);
      item.listenerRef = undefined;
    }
  }

  /**
   * Hide all tabs except tab-menu
   */
  _hideContent() {
    for (const child of this.el.children) {
      if (!child.classList.contains('tab-menu')) {
        child.style.display = 'none';
      }
    }
  }

  /**
   * Set active bar position
   * @param {Element} element
   */
  _setActiveElement(element) {
    for (const item of this.tabMenu.children) {
      item.classList.remove('active');
    }

    const width = element.clientWidth + 'px';
    const elementPosLeft = element.getBoundingClientRect().left;
    const menuPosLeft = this.el.getBoundingClientRect().left;
    const left = elementPosLeft - menuPosLeft + 'px';

    this.tabMenu.style.setProperty('--tab-bar-left-offset', left);
    this.tabMenu.style.setProperty('--tab-bar-width', width);

    element.classList.add('active');
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

    const target = item.getAttribute('href');
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
    this._setActiveElement(menuItem);

    this._hideContent();
    for (const child of this.el.children) {
      if (!child.classList.contains('tab-menu') && child.id === item_id) {
        child.style.display = 'block';
      }
    }
  }

  updateActiveElement() {
    let itemSelected = '';
    for (const child of this.tabMenu.children) {
      if (child.classList.contains('active')) {
        itemSelected = child;
      }
    }

    itemSelected ? '' : (itemSelected = this.tabMenu.children[0]);
    this._setActiveElement(itemSelected);
    const target = itemSelected.getAttribute('href');
    this.select(target.split('#')[1]);
  }
}
