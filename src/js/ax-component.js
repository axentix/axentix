/**
 * Class AxentixComponent
 * @class
 */
class AxentixComponent {
  /**
   * Sync all listeners
   */
  sync() {
    this._removeListeners();
    this._setupListeners();
  }

  /**
   * Reset component
   */
  reset() {
    this._removeListeners();
    this._setup();
  }
}
