import { instances } from './config';
import { createEvent, getInstance } from './utilities';

export interface Component {
  el: HTMLElement;

  /** Synchronize all listeners */
  sync(): void;
  /** Reset component */
  reset(): void;
  /** Destroy component */
  destroy(): void;

  removeListeners(): void;
  setupListeners(): void;
  setup(): void;
}

export class AxentixComponent {
  el: HTMLElement;

  removeListeners() {
    // Define this method for sync, reset and destroy method
  }

  setupListeners() {
    // Define this method for sync, reset and destroy method
  }

  setup() {
    // Define this method for sync, reset and destroy method
  }

  preventDbInstance(element: string) {
    if (element && getInstance(element)) throw new Error(`Instance already exist on ${element}`);
  }

  sync() {
    createEvent(this.el, 'component.sync');
    this.removeListeners();
    this.setupListeners();
  }

  reset() {
    createEvent(this.el, 'component.reset');
    this.removeListeners();
    this.setup();
  }

  destroy() {
    createEvent(this.el, 'component.destroy');
    this.removeListeners();

    const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    instances.splice(index, 1);
  }
}
