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
  child: Component;

  constructor(child: Component) {
    this.child = child;
  }

  preventDbInstance(element: string) {
    if (element && getInstance(element)) throw new Error(`Instance already exist on ${element}`);
  }

  sync() {
    createEvent(this.child.el, 'component.sync');
    this.child.removeListeners();
    this.child.setupListeners();
  }

  reset() {
    createEvent(this.child.el, 'component.reset');
    this.child.removeListeners();
    this.child.setup();
  }

  destroy() {
    createEvent(this.child.el, 'component.destroy');
    this.child.removeListeners();

    const index = instances.findIndex((ins) => ins.instance.el.id === this.child.el.id);
    instances.splice(index, 1);
  }
}
