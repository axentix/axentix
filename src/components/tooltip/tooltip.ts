import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances } from '../../utils/config';
import { createEvent, getComponentOptions } from '../../utils/utilities';

interface ITooltipOptions {
  content: string;
  animationDelay: number;
  offset: string;
  animationDuration: number;
  classes: string;
  position: 'top' | 'left' | 'right' | 'bottom';
}

const TooltipOptions: ITooltipOptions = {
  content: '',
  animationDelay: 0,
  offset: '10px',
  animationDuration: 200,
  classes: 'grey dark-4 light-shadow-2 p-2',
  position: 'top',
};

export class Tooltip extends AxentixComponent implements Component {
  static getDefaultOptions = () => TooltipOptions;

  options: ITooltipOptions;

  #tooltip: HTMLElement;
  #positionList: Array<string>;
  #listenerEnterRef: any;
  #listenerLeaveRef: any;
  #listenerResizeRef: any;
  #elRect: DOMRect;
  #tooltipRect: DOMRect;

  constructor(element: string, options?: ITooltipOptions, isLoadedWithData?: boolean) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Tooltip', instance: this });

      this.el = document.querySelector(element);
      this.options = getComponentOptions('Tooltip', options, this.el, isLoadedWithData);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Tooltip init error', error);
    }
  }

  setup() {
    if (!this.options.content) return console.error('Tooltip #' + this.el.id + ' : empty content.');

    createEvent(this.el, 'tooltip.setup');

    // @ts-ignore
    this.options.position = this.options.position.toLowerCase();

    const tooltips = document.querySelectorAll('.tooltip');

    tooltips.forEach((tooltip: HTMLElement) => {
      if (tooltip.dataset.tooltipId && tooltip.dataset.tooltipId === this.el.id) this.#tooltip = tooltip;
    });

    if (!this.#tooltip) this.#tooltip = document.createElement('div');
    if (this.#tooltip.dataset.tooltipId !== this.el.id) this.#tooltip.dataset.tooltipId = this.el.id;

    this.#setProperties();
    document.body.appendChild(this.#tooltip);

    this.#positionList = ['right', 'left', 'top', 'bottom'];
    this.#positionList.includes(this.options.position) ? '' : (this.options.position = 'top');

    this.setupListeners();

    this.updatePosition();
  }

  setupListeners() {
    this.#listenerEnterRef = this._onHover.bind(this);
    this.#listenerLeaveRef = this._onHoverOut.bind(this);
    this.#listenerResizeRef = this.updatePosition.bind(this);

    this.el.addEventListener('mouseenter', this.#listenerEnterRef);
    this.el.addEventListener('mouseleave', this.#listenerLeaveRef);
    window.addEventListener('resize', this.#listenerResizeRef);
  }

  removeListeners() {
    this.el.removeEventListener('mouseenter', this.#listenerEnterRef);
    this.el.removeEventListener('mouseleave', this.#listenerLeaveRef);
    window.removeEventListener('resize', this.#listenerResizeRef);

    this.#listenerEnterRef = undefined;
    this.#listenerLeaveRef = undefined;
    this.#listenerResizeRef = undefined;
  }

  #setProperties() {
    this.#tooltip.style.transform = 'translate(0)';
    this.#tooltip.style.opacity = '0';
    this.#tooltip.className = 'tooltip ' + this.options.classes;
    this.#tooltip.style.transitionDuration = this.options.animationDuration + 'ms';
    this.#tooltip.innerHTML = this.options.content;
  }

  #setBasicPosition() {
    if (this.options.position == 'top' || this.options.position == 'bottom') {
      if (this.options.position == 'top') this.#tooltip.style.top = this.#elRect.top + 'px';
      else this.#tooltip.style.top = this.#elRect.top + this.#elRect.height + 'px';
    } else if (this.options.position == 'left' || this.options.position == 'right') {
      if (this.options.position == 'right')
        this.#tooltip.style.left = this.#elRect.left + this.#elRect.width + 'px';
    }
  }

  /** Manually transform the tooltip location */
  #manualTransform() {
    if (this.options.position == 'top' || this.options.position == 'bottom') {
      this.#tooltip.style.left =
        this.#elRect.left + this.#elRect.width / 2 - this.#tooltipRect.width / 2 + 'px';
    } else if (this.options.position == 'left' || this.options.position == 'right') {
      this.#tooltip.style.top =
        this.#elRect.top + this.#elRect.height / 2 - this.#tooltipRect.height / 2 + 'px';
    }

    if (this.options.position == 'top') {
      this.#tooltip.style.top = this.#tooltipRect.top - this.#tooltipRect.height + 'px';
    } else if (this.options.position == 'left') {
      this.#tooltip.style.left = this.#elRect.left - this.#tooltipRect.width + 'px';
    }

    const scrollY = window.scrollY;
    const tooltipTop = parseFloat(this.#tooltip.style.top);

    if (this.options.position === 'top') this.#tooltip.style.top = scrollY * 2 + tooltipTop + 'px';
    else this.#tooltip.style.top = scrollY + tooltipTop + 'px';
  }

  _onHover(e: Event) {
    e.preventDefault();
    this.show();
  }

  _onHoverOut(e: Event) {
    e.preventDefault();
    this.hide();
  }

  /** Update current tooltip position */
  updatePosition() {
    this.#elRect = this.el.getBoundingClientRect();

    this.#setBasicPosition();

    this.#tooltipRect = this.#tooltip.getBoundingClientRect();

    this.#manualTransform();
  }

  /** Show tooltip */
  show() {
    this.updatePosition();

    setTimeout(() => {
      createEvent(this.el, 'tooltip.show');

      this.options.position == 'top'
        ? (this.#tooltip.style.transform = `translateY(-${this.options.offset})`)
        : this.options.position == 'right'
        ? (this.#tooltip.style.transform = `translateX(${this.options.offset})`)
        : this.options.position == 'bottom'
        ? (this.#tooltip.style.transform = `translateY(${this.options.offset})`)
        : this.options.position == 'left'
        ? (this.#tooltip.style.transform = `translateX(-${this.options.offset})`)
        : '';

      this.#tooltip.style.opacity = '1';
    }, this.options.animationDelay);
  }

  /** Hide tooltip */
  hide() {
    createEvent(this.el, 'tooltip.hide');

    this.#tooltip.style.transform = 'translate(0)';
    this.#tooltip.style.opacity = '0';
  }

  /** Change current options */
  change(options?: ITooltipOptions) {
    this.options = getComponentOptions('Tooltip', options, this.el, true);

    this.#positionList.includes(this.options.position) ? '' : (this.options.position = 'top');

    this.#setProperties();
    this.updatePosition();
  }
}

registerComponent({
  class: Tooltip,
  name: 'Tooltip',
  dataDetection: true,
});
