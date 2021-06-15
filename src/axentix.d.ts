// Type definitions for Axentix v1.0.x
// Project: https://useaxentix.com/
// Definitions by: Axel SIMONET <https://github.com/Xelzs>
//                 Vincent LEVEQUE <https://github.com/Stallos11>

export namespace Axentix {
  class AxentixComponent {
    sync(): void;
    reset(): void;
    destroy(): void;
  }

  class Caroulix extends AxentixComponent {
    constructor(el: string, options?: CaroulixOptions);

    goTo(number: number, side: string): void;
    prev(step?: number, resetAutoplay?: boolean): void;
    next(step?: number, resetAutoplay?: boolean): void;
    play(): void;
    stop(): void;
  }

  interface CaroulixOptions {
    /**
     * @default 500
     */
    animationDuration?: number;

    /**
     * @default true
     */
    backToOpposite?: boolean;

    /**
     * @default true
     */
    enableTouch?: boolean;

    /**
     * @default ''
     */
    height?: string;

    indicators?: {
      /**
       * @default false
       */
      enabled?: boolean;

      /**
       * @default false
       */
      isFlat?: boolean;

      /**
       * @default ''
       */
      customClasses?: string;
    };

    autoplay?: {
      /**
       * @default true
       */
      enabled?: boolean;

      /**
       * @default 5000
       */
      interval?: number;

      /**
       * @default 'right'
       */
      side?: 'right' | 'left';
    };
  }

  class Collapsible extends AxentixComponent {
    constructor(el: string, options?: CollapsibleOptions);

    open(): void;
    close(): void;
  }

  interface CollapsibleOptions {
    /**
     * @default 300
     */
    animationDuration?: number;

    sidenav?: {
      /**
       * @default true
       */
      activeClass?: boolean;

      /**
       * @default true
       */
      activeWhenOpen?: boolean;

      /**
       * @default true
       */
      autoClose?: boolean;
    };
  }

  class Dropdown extends AxentixComponent {
    constructor(el: string, options?: DropdownOptions);

    open(): void;
    close(): void;
  }

  interface DropdownOptions {
    /**
     * @default false
     */
    hover?: boolean;

    /**
     * @default 'none'
     */
    animationType?: 'none' | 'fade';

    /**
     * @default 300
     */
    animationDuration?: number;

    /**
     * @default true
     */
    autoClose?: boolean;

    /**
     * @default false
     */
    preventViewport?: boolean;
  }

  class Fab extends AxentixComponent {
    constructor(el: string, options?: FabOptions);

    open(): void;
    close(): void;
  }

  interface FabOptions {
    /**
     * @default 300
     */
    animationDuration?: number;

    /**
     * @default true
     */
    hover?: boolean;

    /**
     * @default 'top'
     */
    direction?: 'top' | 'bottom' | 'left' | 'right';

    /**
     * @default 'bottom-right'
     */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

    /**
     * @default '1rem'
     */
    offsetX?: string;

    /**
     * @default '1.5rem'
     */
    offsetY?: string;
  }

  class Lightbox extends AxentixComponent {
    constructor(el: string, options?: LightboxOptions);

    open(): void;
    close(): void;
  }

  interface LightboxOptions {
    /**
     * @default 400
     */
    animationDuration?: number;

    /**
     * @default 'grey dark 4'
     */
    overlayColor?: string;

    /**
     * @default 150
     */
    offset?: number;

    /**
     * @default 80
     */
    mobileOffset?: number;

    /**
     * @default ''
     */
    caption?: string;
  }

  class Modal extends AxentixComponent {
    constructor(el: string, options?: ModalOptions);

    open(): void;
    close(): void;
    overlay(state: boolean): void;
  }

  interface ModalOptions {
    /**
     * @default true
     */
    overlay?: boolean;

    /**
     * @default 400
     */
    animationDuration?: number;

    /**
     * @default false
     */
    bodyScrolling?: boolean;
  }

  class ScrollSpy extends AxentixComponent {
    constructor(el: string, options?: ScrollSpyOptions);
  }

  interface ScrollSpyOptions {
    /**
     * @default 200
     */
    offset?: number;

    /**
     * @default 'a'
     */
    linkSelector?: string;

    /**
     * @default 'active'
     */
    classes?: string;

    auto?: {
      /**
       * @default false
       */
      enabled?: boolean;

      /**
       * @default ''
       */
      classes?: string;

      /**
       * @default ''
       */
      selector?: string;
    };
  }

  class Sidenav extends AxentixComponent {
    constructor(el: string, options?: SidenavOptions);

    open(): void;
    close(): void;
    overlay(state: boolean): void;
  }

  interface SidenavOptions {
    /**
     * @default true
     */
    overlay?: boolean;

    /**
     * @default false
     */
    bodyScrolling?: boolean;

    /**
     * @default 300
     */
    animationDuration?: number;
  }

  class Tab extends AxentixComponent {
    constructor(el: string, options?: TabOptions);

    updateActiveElement(): void;
    select(itemId: string): void;
    prev(step?: number): void;
    next(step?: number): void;
  }

  interface TabOptions {
    /**
     * @default 'none'
     */
    animationType?: 'none' | 'slide';

    /**
     * @default 300
     */
    animationDuration?: number;

    /**
     * @default false
     */
    disableActiveBar?: boolean;

    /**
     * @default TabCaroulixOptions
     */
    caroulix?: TabCaroulixOptions | CaroulixOptions;
  }

  interface TabCaroulixOptions {
    /**
     * @default 300
     */
    animationDuration?: number;

    /**
     * @default false
     */
    backToOpposite?: boolean;

    /**
     * @default false
     */
    enableTouch?: boolean;

    autoplay?: {
      /**
       * @default false
       */
      enabled?: boolean;
    };
  }

  class Toast {
    constructor(content: string, options?: ToastOptions);

    show(): void;
    change(content: string, options?: ToastOptions): void;
    destroy(): void;
  }

  interface ToastOptions {
    /**
     * @default 400
     */
    animationDuration?: number;

    /**
     * @default 4000
     */
    duration?: number;

    /**
     * @default ''
     */
    classes?: string;

    /**
     * @default 'right'
     */
    position?: 'right' | 'left';

    /**
     * @default 'top'
     */
    direction?: 'top' | 'bottom';

    /**
     * @default 'bottom'
     */
    mobileDirection?: 'top' | 'bottom';

    offset?: {
      /**
       * @default '5%'
       */
      x?: string;

      /**
       * @default '0%'
       */
      y?: string;

      /**
       * @default '10%'
       */
      mobileX?: string;

      /**
       * @default '0%'
       */
      mobileY?: string;
    };

    /**
     * @default false
     */
    isClosable?: boolean;

    /**
     * @default 'x'
     */
    closableContent?: string;

    loading?: {
      /**
       * @default true
       */
      enabled?: boolean;

      /**
       * @default '2px solid #E2E2E2'
       */
      border?: string;
    };
  }

  class Tooltip extends AxentixComponent {
    constructor(el: string, options?: TooltipOptions);

    updatePosition(): void;
    show(): void;
    hide(): void;
    change(options?: TooltipOptions): void;
  }

  interface TooltipOptions {
    /**
     * @default ''
     */
    content?: string;

    /**
     * @default 0
     */
    animationDelay?: number;

    /**
     * @default '10px'
     */
    offset?: string;

    /**
     * @default 200
     */
    animationDuration?: number;

    /**
     * @default 'grey dark-4 light-shadow-2 p-2'
     */
    classes?: string;

    /**
     * @default 'top'
     */
    position?: 'top' | 'bottom' | 'left' | 'right';
  }

  namespace Config {
    function get(): {
      components: Array<any>;
      plugins: Array<any>;
    };

    function getDataElements(): Array<string>;
    function getAutoInitElements(): Array<any>;
    function registerComponent(component: {
      name: string;
      class: any;
      dataDetection?: boolean;
      autoInit?: { enabled: boolean; selector: string };
    }): void;

    function registerPlugin(plugin: {
      name: string;
      class: any;
      dataDetection?: boolean;
      autoInit?: { enabled: boolean; selector: string };
      author?: string;
      description?: string;
    }): void;
  }

  // Material forms
  function updateInputs(inputElements?: NodeListOf<Element>): void;

  // JS Utilities
  function createEvent(element: Element, eventName: string, extraData?: any): void;
  function wrap(target: Array<Element>, wrapper?: Element): Element;
  function unwrap(wrapper: Element): void;
  function extend(...args: Array<any>): any;
  function getComponentOptions(
    component: string,
    options: any,
    el: Element | '',
    isLoadedWithData: boolean
  ): any;
  function isTouchEnabled(): boolean;

  function getInstanceByType(
    type: string
  ): Array<
    | Axentix.Caroulix
    | Axentix.Collapsible
    | Axentix.Dropdown
    | Axentix.Fab
    | Axentix.Lightbox
    | Axentix.Modal
    | Axentix.ScrollSpy
    | Axentix.Sidenav
    | Axentix.Tab
    | Axentix.Toast
    | Axentix.Tooltip
    | []
  >;

  function getInstance(
    element: string
  ):
    | Axentix.Caroulix
    | Axentix.Collapsible
    | Axentix.Dropdown
    | Axentix.Fab
    | Axentix.Lightbox
    | Axentix.Modal
    | Axentix.ScrollSpy
    | Axentix.Sidenav
    | Axentix.Tab
    | Axentix.Toast
    | Axentix.Tooltip
    | false;

  function getAllInstances(): Array<
    | Axentix.Caroulix
    | Axentix.Collapsible
    | Axentix.Dropdown
    | Axentix.Fab
    | Axentix.Lightbox
    | Axentix.Modal
    | Axentix.ScrollSpy
    | Axentix.Sidenav
    | Axentix.Tab
    | Axentix.Toast
    | Axentix.Tooltip
    | []
  >;

  function sync(element: string): void;
  function syncAll(): void;

  function reset(element: string): void;
  function resetAll(): void;

  function destroy(element: string): void;
  function destroyAll(): void;
}

export class Axentix {
  constructor(component: string | 'all', options?: any);
}
