/**
 * Class AxentixComponent
 * @class
 */
class AxentixComponent {
  preventDbInstance(element) {
    if (element && Axentix.getInstance(element)) {
      throw new Error(`Instance already exist on ${element}`);
    }
  }

  /**
   * Sync all listeners
   */
  sync() {
    Axentix.createEvent(this.el, 'component.sync');
    this._removeListeners();
    this._setupListeners();
  }

  /**
   * Reset component
   */
  reset() {
    Axentix.createEvent(this.el, 'component.reset');
    this._removeListeners();
    this._setup();
  }

  /**
   * Destroy component
   */
  destroy() {
    Axentix.createEvent(this.el, 'component.destroy');
    this._removeListeners();

    const index = Axentix.instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    Axentix.instances.splice(index, 1);
  }
}
