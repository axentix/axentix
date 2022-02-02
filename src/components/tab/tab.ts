import { AxentixComponent, Component } from '../../utils/component';
import { getComponentClass, registerComponent, getCssVar, instances } from '../../utils/config';
import { createEvent, getComponentOptions, wrap } from '../../utils/utilities';
import { Caroulix, ICaroulixOptions } from '../caroulix/caroulix';

interface ITabOptions {
  animationDuration?: number;
  animationType?: 'none' | 'slide';
  disableActiveBar?: boolean;
  caroulix?: ICaroulixOptions;
}

const TabOptions: ITabOptions = {
  animationDuration: 300,
  animationType: 'none',
  disableActiveBar: false,
  caroulix: {
    animationDuration: 300,
    backToOpposite: false,
    enableTouch: false,
    autoplay: {
      enabled: false,
    },
  },
};

export class Tab extends AxentixComponent implements Component {
  static getDefaultOptions = () => TabOptions;

  options: ITabOptions;

  #tabArrow: HTMLElement;
  #tabLinks: NodeListOf<HTMLElement>;
  #tabMenu: HTMLElement;
  #currentItemIndex = 0;
  #leftArrow: HTMLElement;
  #rightArrow: HTMLElement;
  #scrollLeftRef: any;
  #scrollRightRef: any;
  #arrowRef: any;
  #caroulixSlideRef: any;
  #resizeTabRef: any;
  #tabItems: Array<HTMLElement>;
  #tabCaroulix: HTMLDivElement;
  #tabCaroulixInit = false;
  #caroulixInstance: Caroulix;
  #isAnimated = false;

  constructor(element: string, options?: ITabOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Tab', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Tab', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Tab init error', error);
    }
  }

  setup() {
    createEvent(this.el, 'tab.setup');

    const animationList = ['none', 'slide'];
    if (!animationList.includes(this.options.animationType)) this.options.animationType = 'none';
    this.#isAnimated = false;

    this.#tabArrow = this.el.querySelector('.tab-arrow');
    this.#tabLinks = this.el.querySelectorAll('.tab-menu .tab-link');
    this.#tabMenu = this.el.querySelector('.tab-menu');
    this.#currentItemIndex = 0;
    this.#tabItems = this.#getItems();

    if (this.#tabArrow) {
      this.#toggleArrowMode();
      this.#leftArrow = this.el.querySelector('.tab-arrow .tab-prev');
      this.#rightArrow = this.el.querySelector('.tab-arrow .tab-next');
    }

    this.setupListeners();

    this.#tabMenu.style.transitionDuration = this.options.animationDuration + 'ms';
    if (this.options.animationType === 'slide') this.#enableSlideAnimation();
    else this.updateActiveElement();
  }

  setupListeners() {
    this.#tabLinks.forEach((item: any) => {
      item.listenerRef = this.#onClickItem.bind(this, item);
      item.addEventListener('click', item.listenerRef);
    });

    this.#resizeTabRef = this.#handleResizeEvent.bind(this);
    window.addEventListener('resize', this.#resizeTabRef);

    if (this.#tabArrow) {
      this.#arrowRef = this.#toggleArrowMode.bind(this);
      window.addEventListener('resize', this.#arrowRef);

      this.#scrollLeftRef = this.#scrollLeft.bind(this);
      this.#scrollRightRef = this.#scrollRight.bind(this);
      this.#leftArrow.addEventListener('click', this.#scrollLeftRef);
      this.#rightArrow.addEventListener('click', this.#scrollRightRef);
    }
  }

  removeListeners() {
    this.#tabLinks.forEach((item: any) => {
      item.removeEventListener('click', item.listenerRef);
      item.listenerRef = undefined;
    });

    window.removeEventListener('resize', this.#resizeTabRef);
    this.#resizeTabRef = undefined;

    if (this.#tabArrow) {
      window.removeEventListener('resize', this.#arrowRef);
      this.#arrowRef = undefined;

      this.#leftArrow.removeEventListener('click', this.#scrollLeftRef);
      this.#rightArrow.removeEventListener('click', this.#scrollRightRef);
      this.#scrollLeftRef = undefined;
      this.#scrollRightRef = undefined;
    }

    if (this.#caroulixSlideRef) {
      this.el.removeEventListener('ax.caroulix.slide', this.#caroulixSlideRef);
      this.#caroulixSlideRef = undefined;
    }
  }

  #handleResizeEvent() {
    this.updateActiveElement();
    for (let i = 100; i < 500; i += 100) {
      setTimeout(() => {
        this.updateActiveElement();
      }, i);
    }
  }

  #handleCaroulixSlide() {
    if (this.#currentItemIndex !== this.#caroulixInstance.activeIndex) {
      this.#currentItemIndex = this.#caroulixInstance.activeIndex;
      this.#setActiveElement(this.#tabLinks[this.#currentItemIndex]);
    }
  }

  #getItems(): Array<HTMLElement> {
    return Array.from(this.#tabLinks).map((link) => {
      const id = link.children[0].getAttribute('href');
      return this.el.querySelector(id);
    });
  }

  #hideContent() {
    this.#tabItems.forEach((item) => (item.style.display = 'none'));
  }

  #enableSlideAnimation() {
    this.#tabItems.forEach((item) => item.classList.add('caroulix-item'));
    this.#tabCaroulix = wrap(this.#tabItems);
    this.#tabCaroulix.classList.add('caroulix');
    const nb = Math.random().toString().split('.')[1];
    this.#tabCaroulix.id = 'tab-caroulix-' + nb;
    this.#tabCaroulixInit = true;

    if (this.options.animationDuration !== 300)
      this.options.caroulix.animationDuration = this.options.animationDuration;

    this.updateActiveElement();
  }

  #setActiveElement(element: HTMLElement) {
    this.#tabLinks.forEach((item) => item.classList.remove('active'));

    if (!this.options.disableActiveBar) {
      const elementRect = element.getBoundingClientRect();

      const elementPosLeft = elementRect.left;
      const menuPosLeft = this.#tabMenu.getBoundingClientRect().left;
      const left = elementPosLeft - menuPosLeft + this.#tabMenu.scrollLeft;

      const elementWidth = elementRect.width;
      const right = this.#tabMenu.clientWidth - left - elementWidth;

      this.#tabMenu.style.setProperty(getCssVar('tab-bar-left-offset'), Math.floor(left) + 'px');
      this.#tabMenu.style.setProperty(getCssVar('tab-bar-right-offset'), Math.ceil(right) + 'px');
    }

    element.classList.add('active');
  }

  #toggleArrowMode() {
    const totalWidth = Array.from(this.#tabLinks).reduce((acc, element) => {
      acc += element.clientWidth;
      return acc;
    }, 0);
    const arrowWidth = this.#tabArrow.clientWidth;

    if (totalWidth > arrowWidth) {
      if (!this.#tabArrow.classList.contains('tab-arrow-show'))
        this.#tabArrow.classList.add('tab-arrow-show');
    } else {
      if (this.#tabArrow.classList.contains('tab-arrow-show'))
        this.#tabArrow.classList.remove('tab-arrow-show');
    }
  }

  #scrollLeft(e: Event) {
    e.preventDefault();
    this.#tabMenu.scrollLeft -= 40;
  }

  #scrollRight(e: Event) {
    e.preventDefault();
    this.#tabMenu.scrollLeft += 40;
  }

  #onClickItem(item: HTMLElement, e: Event) {
    e.preventDefault();
    if (this.#isAnimated || item.classList.contains('active')) return;

    const target = item.children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }

  #getPreviousItemIndex(step: number) {
    let previousItemIndex = 0;
    let index = this.#currentItemIndex;
    for (let i = 0; i < step; i++) {
      if (index > 0) {
        previousItemIndex = index - 1;
        index--;
      } else {
        index = this.#tabLinks.length - 1;
        previousItemIndex = index;
      }
    }
    return previousItemIndex;
  }

  #getNextItemIndex(step: number) {
    let nextItemIndex = 0;
    let index = this.#currentItemIndex;
    for (let i = 0; i < step; i++) {
      if (index < this.#tabLinks.length - 1) {
        nextItemIndex = index + 1;
        index++;
      } else {
        index = 0;
        nextItemIndex = index;
      }
    }
    return nextItemIndex;
  }

  /** Select tab */
  select(itemId: string) {
    if (this.#isAnimated) return;

    this.#isAnimated = true;
    const menuItem: HTMLElement = this.el.querySelector('.tab-menu a[href="#' + itemId + '"]');
    this.#currentItemIndex = Array.from(this.#tabLinks).findIndex((item) => item.children[0] === menuItem);

    createEvent(menuItem, 'tab.select', { currentIndex: this.#currentItemIndex });
    this.#setActiveElement(menuItem.parentElement);

    if (this.#tabCaroulixInit) {
      this.#tabItems.forEach((item) => (item.id === itemId ? item.classList.add('active') : ''));

      const caroulixClass = getComponentClass('Caroulix');
      this.#caroulixInstance = new caroulixClass(
        '#' + this.#tabCaroulix.id,
        this.options.caroulix,
        this.el,
        true
      );

      this.#caroulixSlideRef = this.#handleCaroulixSlide.bind(this);
      this.el.addEventListener('ax.caroulix.slide', this.#caroulixSlideRef);

      this.#tabCaroulixInit = false;
      this.#isAnimated = false;
      return;
    }

    if (this.options.animationType === 'slide') {
      const nb = this.#tabItems.findIndex((item) => item.id === itemId);
      this.#caroulixInstance.goTo(nb);
      setTimeout(() => {
        this.#isAnimated = false;
      }, this.options.animationDuration);
    } else {
      this.#hideContent();
      this.#tabItems.forEach((item) => {
        if (item.id === itemId) item.style.display = 'block';
      });
      this.#isAnimated = false;
    }
  }

  /** Detect active element & update component */
  updateActiveElement() {
    let itemSelected;
    this.#tabLinks.forEach((item, index) => {
      if (item.classList.contains('active')) {
        itemSelected = item;
        this.#currentItemIndex = index;
      }
    });

    if (!itemSelected) {
      itemSelected = this.#tabLinks.item(0);
      this.#currentItemIndex = 0;
    }
    const target = itemSelected.children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }

  /** Go to previous tab */
  prev(step = 1) {
    if (this.#isAnimated) return;

    const previousItemIndex = this.#getPreviousItemIndex(step);
    this.#currentItemIndex = previousItemIndex;
    createEvent(this.el, 'tab.prev', { step });

    const target = this.#tabLinks[previousItemIndex].children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }

  /** Go to next tab */
  next(step = 1) {
    if (this.#isAnimated) return;

    const nextItemIndex = this.#getNextItemIndex(step);
    this.#currentItemIndex = nextItemIndex;
    createEvent(this.el, 'tab.next', { step });

    const target = this.#tabLinks[nextItemIndex].children[0].getAttribute('href');
    this.select(target.split('#')[1]);
  }
}

registerComponent({
  class: Tab,
  name: 'Tab',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.tab',
  },
});
