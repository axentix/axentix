// Type definitions for Axentix v1.0.x
// Project: https://useaxentix.com/
// Definitions by: Axel SIMONET <https://github.com/Xelzs>
//                 Vincent LEVEQUE <https://github.com/Stallos11>

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bootstrap/index.d.ts
// https://github.com/foundation/foundation-sites/blob/develop/js/typescript/foundation.d.ts

declare namespace Axentix {
  interface Caroulix {
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

  interface Collapsible {
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

  interface Dropdown {
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

  interface Fab {
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

  interface Modal {
    open(): void;
    close(): void;
    overlay(state: boolean): void;
  }

  interface ModelOptions {
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

  interface Sidenav {
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

  interface Tab {
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
}
