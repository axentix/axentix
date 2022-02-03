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
  #timeoutRef: any;
  #elRect: DOMRect;
  #tooltipRect: DOMRect;

  constructor(element: string, options?: ITooltipOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Tooltip', instance: this });

      this.el = document.querySelector(element);
      this.options = getComponentOptions('Tooltip', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Tooltip init error', error);
    }
  }

  setup() {
    if (!this.options.content) return console.error(`Tooltip #${this.el.id} : empty content.`);

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
    if (!this.#positionList.includes(this.options.position)) this.options.position = 'top';

    this.setupListeners();
    this.updatePosition();

    this.#tooltip.style.display = 'none';
  }

  setupListeners() {
    this.#listenerEnterRef = this.#onHover.bind(this);
    this.#listenerLeaveRef = this.#onHoverOut.bind(this);
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
    const isVerticalSide = this.options.position == 'top' || this.options.position == 'bottom';

    if (isVerticalSide) {
      const top = this.options.position === 'top' ? this.#elRect.top : this.#elRect.top + this.#elRect.height;
      this.#tooltip.style.top = top + 'px';
    } else if (this.options.position == 'right') {
      this.#tooltip.style.left = this.#elRect.left + this.#elRect.width + 'px';
    }
  }

  /** Manually transform the tooltip location */
  #manualTransform() {
    const isVerticalSide = this.options.position == 'top' || this.options.position == 'bottom';

    if (isVerticalSide) {
      this.#tooltip.style.left =
        this.#elRect.left + this.#elRect.width / 2 - this.#tooltipRect.width / 2 + 'px';
    } else {
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

  #onHover(e: Event) {
    e.preventDefault();
    this.show();
  }

  #onHoverOut(e: Event) {
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
    this.#tooltip.style.display = 'block';
    this.updatePosition();
    clearTimeout(this.#timeoutRef);

    this.#timeoutRef = setTimeout(() => {
      createEvent(this.el, 'tooltip.show');

      const negativity = this.options.position == 'top' || this.options.position == 'left' ? '-' : '';
      const verticality = this.options.position == 'top' || this.options.position == 'bottom' ? 'Y' : 'X';

      this.#tooltip.style.transform = `translate${verticality}(${negativity}${this.options.offset})`;

      this.#tooltip.style.opacity = '1';
    }, this.options.animationDelay);
  }

  /** Hide tooltip */
  hide() {
    createEvent(this.el, 'tooltip.hide');
    clearTimeout(this.#timeoutRef);

    this.#tooltip.style.transform = 'translate(0)';
    this.#tooltip.style.opacity = '0';

    this.#timeoutRef = setTimeout(() => {
      this.#tooltip.style.display = 'none';
    }, this.options.animationDuration);
  }

  /** Change current options */
  change(options?: ITooltipOptions) {
    this.options = getComponentOptions('Tooltip', options, this.el);

    if (!this.#positionList.includes(this.options.position)) this.options.position = 'top';

    this.#setProperties();
    this.updatePosition();
  }
}

registerComponent({
  class: Tooltip,
  name: 'Tooltip',
  dataDetection: true,
});
