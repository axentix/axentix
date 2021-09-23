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
    this._removeListeners();
    this._setupListeners();
  }

  /**
   * Reset component
   */
  reset() {
    createEvent(this.el, 'component.reset');
    this._removeListeners();
    this._setup();
  }

  /**
   * Destroy component
   */
  destroy() {
    createEvent(this.el, 'component.destroy');
    this._removeListeners();

    const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    instances.splice(index, 1);
  }
}
