/**
 * Class Axentix
 * @class
 */
class Axentix {
  /**
   * Construct Axentix instance
   * @constructor
   * @param {String} component
   * @param {Object} options
   */
  constructor(component, options) {
    this.component = component[0].toUpperCase() + component.slice(1);
    this.isAll = component === 'all' ? true : false;
    this.options = this.isAll ? {} : options;
    this.instances = [];

    this._init();
  }

  /**
   * Init components
   */
  _init() {
    const componentList = {
      Collapsible: document.querySelectorAll('.collapsible:not(.no-axentix-init)'),
      Sidenav: document.querySelectorAll('.sidenav:not(.no-axentix-init)'),
      Modal: document.querySelectorAll('.modal:not(.no-axentix-init)')
    };

    const isInList = componentList.hasOwnProperty(this.component);
    if (isInList) {
      const ids = this._detectIds(componentList[this.component]);
      this._instanciate(ids, this.component);
    } else if (this.isAll) {
      Object.keys(componentList).forEach(component => {
        let ids = this._detectIds(componentList[component]);
        ids.length > 0 ? this._instanciate(ids, component) : '';
      });
    }
  }

  /**
   * Detects all ids
   * @param {NodeListOf<Element>} component
   * @return {Array<String>}
   */
  _detectIds(component) {
    let idList = [];
    component.forEach(el => {
      idList.push('#' + el.id);
    });
    return idList;
  }

  /**
   * Instanciate components
   * @param {Array<String>} ids
   * @param {String} component
   */
  _instanciate(ids, component) {
    ids.forEach(id => {
      let constructor = window[component];
      let args = [id, this.options];
      this.instances.push(new constructor(...args));
    });
  }

  /**
   * Get instance of element
   * @param {String} element Id of element
   */
  getInstance(element) {
    return this.instances.filter(instance => instance.el.id === element)[0];
  }

  /**
   * Get all instances
   */
  getAllInstances() {
    return this.instances;
  }
}
