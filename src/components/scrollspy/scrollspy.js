import { AxentixComponent } from '../../utils/component';
import { registerComponent } from '../../utils/config';
import { instances } from '../../utils/config';
import { createEvent, getComponentOptions } from '../../utils/utilities';

/** @namespace */
const ScrollSpyOptions = {
  offset: 200,
  linkSelector: 'a',
  classes: 'active',
  auto: {
    enabled: false,
    /** @type {string | Array<string>} */
    classes: '',
    selector: '',
  },
};

export class ScrollSpy extends AxentixComponent {
  static getDefaultOptions = () => ScrollSpyOptions;

  /** Private variables */
  #oldLink;
  #updateRef;
  /** @type {Array<HTMLElement>} */
  #links;
  /** @type {Array<HTMLElement>} */
  #elements;

  /**
   * @param {string} element
   * @param {ScrollSpyOptions} [options]
   * @param {boolean} [isLoadedWithData]
   */
  constructor(element, options, isLoadedWithData) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'ScrollSpy', instance: this });

      this.el = document.querySelector(element);

      /** @type {ScrollSpyOptions} */
      this.options = getComponentOptions('ScrollSpy', options, this.el, isLoadedWithData);

      this.#setup();
    } catch (error) {
      console.error('[Axentix] ScrollSpy init error', error);
    }
  }

  #setup() {
    createEvent(this.el, 'scrollspy.setup');
    if (this.options.auto.enabled) this.#setupAuto();
    else this.#setupBasic();
    if (typeof this.options.classes === 'string') this.options.classes = this.options.classes.split(' ');
    this.#oldLink = '';

    this.setupListeners();
    this.#update();
  }

  setupListeners() {
    this.#updateRef = this.#update.bind(this);
    window.addEventListener('scroll', this.#updateRef);
    window.addEventListener('resize', this.#updateRef);
  }

  removeListeners() {
    window.removeEventListener('scroll', this.#updateRef);
    window.removeEventListener('resize', this.#updateRef);
    this.#updateRef = undefined;
  }

  #setupBasic() {
    this.#links = Array.from(this.el.querySelectorAll(this.options.linkSelector));
    this.#elements = this.#links.map((link) => document.querySelector(link.getAttribute('href')));
  }

  #setupAuto() {
    this.#elements = Array.from(document.querySelectorAll(this.options.auto.selector));
    this.#links = this.#elements.map((el) => {
      const link = document.createElement('a');
      link.className = this.options.auto.classes;
      link.setAttribute('href', '#' + el.id);
      link.innerHTML = el.innerHTML;
      this.el.appendChild(link);

      return link;
    });
  }

  #getElement() {
    const top = window.scrollY,
      left = window.scrollX,
      right = window.innerWidth,
      bottom = window.innerHeight,
      topBreakpoint = top + this.options.offset;

    if (bottom + top >= document.body.offsetHeight - 2) return this.#elements[this.#elements.length - 1];

    return this.#elements.find((el) => {
      const elRect = el.getBoundingClientRect();
      return (
        elRect.top + top >= top &&
        elRect.left + left >= left &&
        elRect.right <= right &&
        elRect.bottom <= bottom &&
        elRect.top + top <= topBreakpoint
      );
    });
  }

  #removeOldLink() {
    if (!this.#oldLink) return;

    this.options.classes.forEach((cl) => this.#oldLink.classList.remove(cl));
  }

  #getClosestElem() {
    const top = window.scrollY;
    return this.#elements.reduce((prev, curr) => {
      const currTop = curr.getBoundingClientRect().top + top;
      const prevTop = prev.getBoundingClientRect().top + top;

      return currTop > top + this.options.offset
        ? prev
        : Math.abs(currTop - top) < Math.abs(prevTop - top)
        ? curr
        : prev;
    });
  }

  #update() {
    let element = this.#getElement();

    if (!element) element = this.#getClosestElem();

    const link = this.#links.find((link) => link.getAttribute('href').split('#')[1] === element.id);
    if (link === this.#oldLink) return;

    createEvent(this.el, 'scrollspy.update');
    this.#removeOldLink();

    this.options.classes.map((cl) => link.classList.add(cl));
    this.#oldLink = link;
  }
}

registerComponent({
  class: ScrollSpy,
  name: 'ScrollSpy',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.scrollspy:not(.no-axentix-init)',
  },
});
