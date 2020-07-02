// Type definitions for Axentix v1.0.x
// Project: https://useaxentix.com/
// Definitions by: Axel SIMONET <https://github.com/Xelzs>
//                 Vincent LEVEQUE <https://github.com/Stallos11>

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bootstrap/index.d.ts
// https://github.com/foundation/foundation-sites/blob/develop/js/typescript/foundation.d.ts

export namespace Axentix {
  export class Caroulix {
    constructor(el: string, options?: CaroulixOptions);

    updateHeight(): void;
    goTo(number: number, side: string): void;

    /**
     * Go to previous {step}
     * @param step DESC HERE
     */
    prev(step?: number): void;
    next(step?: number): void;
    play(): void;
    stop(): void;
  }

  interface CaroulixOptions {
    /**
     * @default 500
     */
    animationDelay: number;

    /**
     * @default 'slide'
     */
    animationType: 'slide';

    /**
     * @default true
     */
    fixedHeight: boolean;

    /**
     * @default ''
     */
    height: string;

    indicators: {
      /**
       * @default false
       */
      enabled: boolean;

      /**
       * @default false
       */
      isFlat: boolean;

      /**
       * @default ''
       */
      customClasses: string;
    };

    autoplay: {
      /**
       * @default true
       */
      enabled: boolean;

      /**
       * @default 5000
       */
      interval: number;

      /**
       * @default 'right'
       */
      side: 'right' | 'left';
    };
  }

  export class Collapsible {
    constructor(el: string, options?: CollapsibleOptions);

    open(): void;
    close(): void;
  }

  interface CollapsibleOptions {
    /**
     * @default 300
     */
    animationDelay: number;

    sidenav: {
      /**
       * @default true
       */
      activeClass: boolean;

      /**
       * @default true
       */
      activeWhenOpen: boolean;

      /**
       * @default true
       */
      autoCloseOtherCollapsible: boolean;
    };
  }

  export class Dropdown {
    constructor(el: string, options?: DropdownOptions);

    open(): void;
    close(): void;
  }

  interface DropdownOptions {
    /**
     * @default false
     */
    hover: boolean;

    /**
     * @default 'none'
     */
    animationType: 'none' | 'fade';

    /**
     * @default 300
     */
    animationDelay: number;
  }

  export class Fab {
    constructor(el: string, options?: FabOptions);

    open(): void;
    close(): void;
  }

  interface FabOptions {
    /**
     * @default 300
     */
    animationDelay: number;

    /**
     * @default true
     */
    hover: boolean;

    /**
     * @default 'top'
     */
    direction: 'top' | 'bottom' | 'left' | 'right';

    /**
     * @default 'bottom-right'
     */
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

    /**
     * @default '1rem'
     */
    offsetX: string;

    /**
     * @default '1.5rem'
     */
    offsetY: string;
  }

  export class Modal {
    constructor(el: string, options?: ModalOptions);

    open(): void;
    close(): void;
    overlay(state: boolean): void;
  }

  interface ModalOptions {
    /**
     * @default true
     */
    overlay: boolean;

    /**
     * @default 400
     */
    animationDelay: number;

    /**
     * @default false
     */
    bodyScrolling: boolean;
  }

  export class Sidenav {
    constructor(el: string, options?: SidenavOptions);

    open(): void;
    close(): void;
    overlay(state: boolean): void;
  }

  interface SidenavOptions {
    /**
     * @default true
     */
    overlay: boolean;

    /**
     * @default false
     */
    bodyScrolling: boolean;

    /**
     * @default 300
     */
    animationDelay: number;
  }

  export class Tab {
    constructor(el: string, options?: TabOptions);

    updateActiveElement(): void;
    select(itemId: string): void;
  }

  interface TabOptions {
    /**
     * @default 'none'
     */
    animationType: 'none' | 'slide';

    /**
     * @default 300
     */
    animationDelay: number;

    /**
     * @default ''
     */
    caroulix: CaroulixOptions | '';
  }

  export class Toast {
    constructor(content: string, options?: ToastOptions);

    show(): void;
    change(content: string, options: ToastOptions): void;
  }

  interface ToastOptions {
    /**
     * @default 400
     */
    animationDelay: number;

    /**
     * @default 4000
     */
    duration: number;

    /**
     * @default ''
     */
    classes: string;

    /**
     * @default 'right'
     */
    position: 'right' | 'left';

    /**
     * @default 'top'
     */
    direction: 'top' | 'bottom';

    /**
     * @default 'bottom'
     */
    mobileDirection: 'top' | 'bottom';
  }

  // JS Utilities
  export function createEvent(element: Element, eventName: string, extraData?: object): void;
  export function wrap(target: Array<Element>, wrapper?: Element): Element;
  export function extend(defaultObject: object, object: object): object;

  // Material forms
  export function updateInputs(inputElements?: NodeListOf<Element>): void;
}

export class Axentix {
  constructor(component: string | 'all', options?: object);

  // Core
  getInstance(element: string): Axentix.Caroulix | Axentix.Dropdown | Axentix.Collapsible;
  getAllInstances(): Array<Axentix.Caroulix | Axentix.Dropdown>;
}
