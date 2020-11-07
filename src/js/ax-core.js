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
    this.component = component[0].toUpperCase() + component.slice(1).toLowerCase();
    this.isAll = component === 'all' ? true : false;
    this.options = this.isAll ? {} : options;

    this._init();
  }

  /**
   * Init components
   */
  _init() {
    const componentList = Axentix.Config.getAutoInitElements();

    const isInList = componentList.hasOwnProperty(this.component);
    if (isInList) {
      const ids = this._detectIds(componentList[this.component]);
      this._instanciate(ids, this.component);
    } else if (this.isAll) {
      Object.keys(componentList).map((component) => {
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
    component.forEach((el) => {
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
    ids.map((id) => {
      let constructor = Axentix[component];
      let args = [id, this.options];

      try {
        new constructor(...args);
      } catch (error) {
        console.error('[Axentix] Unable to load ' + component, error);
      }
    });
  }
}

Axentix.instances = [];
