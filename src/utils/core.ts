import { getAutoInitElements, getComponentClass } from './config';

export class Axentix {
  component: string;
  isAll: boolean;
  options: any;

  constructor(component: string, options?: any) {
    this.component = component[0].toUpperCase() + component.slice(1).toLowerCase();
    this.isAll = component === 'all' ? true : false;
    this.options = this.isAll ? {} : options;

    this.#init();
  }

  #init() {
    const componentList = getAutoInitElements();

    const isInList = componentList.hasOwnProperty(this.component);
    if (isInList) {
      const ids = this.#detectIds(componentList[this.component]);
      this.#instanciate(ids, this.component);
    } else if (this.isAll) {
      Object.keys(componentList).forEach((component) => {
        const ids = this.#detectIds(componentList[component]);
        if (ids.length > 0) this.#instanciate(ids, component);
      });
    }
  }

  #detectIds(component: NodeListOf<Element>): Array<string> {
    return Array.from(component).map((el) => '#' + el.id);
  }

  #instanciate(ids: Array<string>, component: string) {
    ids.forEach((id) => {
      const constructor = getComponentClass(component);
      const args = [id, this.options];

      try {
        new constructor(...args);
      } catch (error) {
        console.error('[Axentix] Unable to load ' + component, error);
      }
    });
  }
}
