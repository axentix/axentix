import { instances } from './config';
import { createEvent, getInstance } from './utilities';

/**
 * Class AxentixComponent
 * @class
 */
export class AxentixComponent {
  preventDbInstance(element) {
    if (element && getInstance(element)) {
      throw new Error(`Instance already exist on ${element}`);
    }
  }

  /**
   * Sync all listeners
   */
  sync() {
    createEvent(this.el, 'component.sync');
    this.removeListeners();
    this.setupListeners();
  }

  /**
   * Reset component
   */
  reset() {
    createEvent(this.el, 'component.reset');
    this.removeListeners();
    this.setup();
  }

  /**
   * Destroy component
   */
  destroy() {
    createEvent(this.el, 'component.destroy');
    this.removeListeners();

    const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    instances.splice(index, 1);
  }
}
