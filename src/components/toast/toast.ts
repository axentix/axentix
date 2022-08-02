import { getCssVar, registerComponent, instances } from '../../utils/config';
import {
  createEvent,
  extend,
  getClientXPosition,
  getInstanceByType,
  getPointerType,
} from '../../utils/utilities';

interface IToastOptions {
  animationDuration?: number;
  duration?: number;
  classes?: string;
  position?: 'right' | 'left';
  direction?: 'top' | 'bottom';
  mobileDirection?: 'bottom' | 'top';
  offset?: { x?: string; y?: string; mobileX?: string; mobileY?: string };
  isClosable?: boolean;
  isSwipeable?: boolean;
  closableContent?: string;
  loading?: {
    enabled?: boolean;
    border?: string;
  };
}

const ToastOptions: IToastOptions = {
  animationDuration: 400,
  duration: 4000,
  classes: '',
  position: 'right',
  direction: 'top',
  mobileDirection: 'bottom',
  offset: { x: '5%', y: '0%', mobileX: '10%', mobileY: '0%' },
  isClosable: false,
  isSwipeable: true,
  closableContent: 'x',
  loading: {
    enabled: true,
    border: '2px solid #E2E2E2',
  },
};

export class Toast {
  static getDefaultOptions = () => ToastOptions;

  options: IToastOptions;
  id: string;

  #content: string;
  #toasters: {
    right?: HTMLElement;
    left?: HTMLElement;
  };
  #pointerType: string;
  #touchStartRef: any;
  #touchMoveRef: any;
  #touchReleaseRef: any;
  #isPressed: boolean;
  #xStart: number;

  constructor(content: string, options?: IToastOptions) {
    if (getInstanceByType('Toast').length > 0) {
      console.error("[Axentix] Toast: Don't try to create multiple toast instances");
      return;
    }

    instances.push({ type: 'Toast', instance: this });

    this.id = Math.random().toString().split('.')[1];

    this.#content = content;
    this.options = extend(Toast.getDefaultOptions(), options);
    this.#pointerType = getPointerType();
    // @ts-ignore
    this.options.position = this.options.position.toLowerCase();
    // @ts-ignore
    this.options.direction = this.options.direction.toLowerCase();
    // @ts-ignore
    this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
    this.#toasters = {};
  }

  destroy() {
    const index = instances.findIndex((ins) => ins.instance.id === this.id);
    instances.splice(index, 1);
  }

  /** Create toast container */
  #createToaster() {
    let toaster = document.createElement('div');

    const positionList = ['right', 'left'];
    if (!positionList.includes(this.options.position)) this.options.position = 'right';

    if (this.options.position === 'right') toaster.style.right = this.options.offset.x;
    else toaster.style.left = this.options.offset.x;

    const directionList = ['bottom', 'top'];
    if (!directionList.includes(this.options.direction)) this.options.direction = 'top';

    if (this.options.direction === 'top') toaster.style.top = this.options.offset.y;
    else toaster.style.bottom = this.options.offset.y;

    if (!directionList.includes(this.options.mobileDirection)) this.options.mobileDirection = 'bottom';

    toaster.style.setProperty(
      getCssVar('toaster-m-width'),
      100 - (this.options.offset.mobileX.slice(0, -1) as any) + '%'
    );
    toaster.style.setProperty(getCssVar('toaster-m-offset'), this.options.offset.mobileY);

    if (this.options.loading.enabled)
      toaster.style.setProperty(getCssVar('toast-loading-border'), this.options.loading.border);

    toaster.className = `toaster toaster-${this.options.position} toast-${this.options.direction} toaster-m-${this.options.mobileDirection}`;

    this.#toasters[this.options.position] = toaster;
    document.body.appendChild(toaster);
  }

  /** Remove toast container */
  #removeToaster() {
    for (const key in this.#toasters) {
      let toaster: HTMLElement = this.#toasters[key];
      if (toaster.childElementCount <= 0) {
        toaster.remove();
        delete this.#toasters[key];
      }
    }
  }

  /** Toast in animation */
  #fadeInToast(toast: HTMLElement) {
    setTimeout(() => {
      createEvent(toast, 'toast.show');
      if (this.options.loading.enabled) {
        toast.classList.add('toast-loading');
        toast.style.setProperty(getCssVar('toast-loading-duration'), this.options.duration + 'ms');
      }
      toast.classList.add('toast-animated');

      setTimeout(() => {
        createEvent(toast, 'toast.shown');
        if (this.options.loading.enabled) toast.classList.add('toast-load');
      }, this.options.animationDuration);
    }, 50);
  }

  /** Toast out animation */
  #fadeOutToast(toast: HTMLElement) {
    setTimeout(() => {
      createEvent(toast, 'toast.hide');
      this.#hide(toast);
    }, this.options.duration + this.options.animationDuration);
  }

  /** Anim out toast */
  #animOut(toast: HTMLElement) {
    toast.style.transitionTimingFunction = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';
    toast.style.paddingTop = '0';
    toast.style.paddingBottom = '0';
    toast.style.margin = '0';
    toast.style.height = '0';
  }

  #setupSwipeListeners(toast) {
    this.#touchStartRef = this.#handleDragStart.bind(this);
    this.#touchMoveRef = this.#handleDragMove.bind(this);
    this.#touchReleaseRef = this.#handleDragRelease.bind(this);

    toast.addEventListener(
      `${this.#pointerType}${this.#pointerType === 'touch' ? 'start' : 'down'}`,
      this.#touchStartRef
    );

    toast.addEventListener(`${this.#pointerType}move`, this.#touchMoveRef);
    toast.addEventListener(
      `${this.#pointerType}${this.#pointerType === 'touch' ? 'end' : 'up'}`,
      this.#touchReleaseRef
    );
    toast.addEventListener(
      this.#pointerType === 'pointer' ? 'pointerleave' : 'mouseleave',
      this.#touchReleaseRef
    );
  }

  #setupCloseListeners(toast: HTMLDivElement) {
    toast.querySelectorAll("[data-toast-close]").forEach(el => {
      el.addEventListener('click', () => {
        this.#hide(toast);
      })
    });
  }

  #handleDragStart(e: any) {
    if ((e.target as HTMLElement).closest('.toast-trigger')) return;
    const toast = e.target.closest('.toast') as HTMLElement;
    if (toast.dataset.closing) return;
    this.#xStart = getClientXPosition(e);
    this.#isPressed = true;
    toast.style.transitionProperty = 'height, margin, padding, transform, box-shadow';
  }

  #handleDragMove(e: any) {
    if (!this.#isPressed) return;
    const toast: HTMLElement = e.target.closest('.toast');
    const client = toast.getBoundingClientRect();
    const absDiff = Math.abs(getClientXPosition(e) - this.#xStart);

    toast.style.left = getClientXPosition(e) - this.#xStart + 'px';
    toast.style.opacity = absDiff < client.width ? (0.99 - absDiff / client.width).toString() : '0.01';
  }

  #handleDragRelease(e: any) {
    if (!this.#isPressed) return;
    if (e.cancelable) e.preventDefault();

    this.#isPressed = false;
    const toast = e.target.closest('.toast');

    toast.style.transitionProperty = 'height, margin, opacity, padding, transform, box-shadow, left';

    if (Math.abs(getClientXPosition(e) - this.#xStart) > toast.getBoundingClientRect().width / 2) {
      this.#hide(toast);
      toast.dataset.closing = 'true';
    } else {
      toast.style.left = '0px';
      toast.style.opacity = 1;
    }
  }

  #handleSwipe(toast: HTMLElement) {
    this.#setupSwipeListeners(toast);
  }

  #createToast() {
    let toast = document.createElement('div');

    toast.className = 'toast shadow-1 ' + this.options.classes;
    toast.innerHTML = this.#content;
    toast.style.transitionDuration = this.options.animationDuration + 'ms';

    if (this.options.isClosable) {
      let trigger = document.createElement('div');
      trigger.className = 'toast-trigger';
      trigger.innerHTML = this.options.closableContent;
      (trigger as any).listenerRef = this.#hide.bind(this, toast, trigger);
      trigger.addEventListener('click', (trigger as any).listenerRef);
      toast.appendChild(trigger);
    }
    
    if (this.options.isSwipeable) this.#handleSwipe(toast);
    this.#fadeInToast(toast);

    this.#setupCloseListeners(toast);

    this.#toasters[this.options.position].appendChild(toast);

    this.#fadeOutToast(toast);

    const height = toast.clientHeight;
    toast.style.height = height + 'px';
  }

  /** Hide toast */
  #hide(toast: HTMLElement, trigger?: HTMLElement, e?: Event) {
    if ((toast as any).isAnimated) return;

    let timer = 1;
    if (e) {
      e.preventDefault();
      timer = 0;
      if (this.options.isClosable) trigger.removeEventListener('click', (trigger as any).listenerRef);
    }

    toast.style.opacity = '0';
    (toast as any).isAnimated = true;
    const delay = timer * this.options.animationDuration + this.options.animationDuration;
    setTimeout(() => {
      this.#animOut(toast);
    }, delay / 2);
    setTimeout(() => {
      toast.remove();
      createEvent(toast, 'toast.remove');
      this.#removeToaster();
    }, delay * 1.45);
  }

  /** Showing the toast */
  show() {
    try {
      if (!Object.keys(this.#toasters).includes(this.options.position)) this.#createToaster();

      this.#createToast();
    } catch (error) {
      console.error('[Axentix] Toast error', error);
    }
  }

  /** Change */
  change(content: string, options?: IToastOptions) {
    this.#content = content;
    this.options = extend(this.options, options);
  }
}

registerComponent({
  class: Toast,
  name: 'Toast',
});
