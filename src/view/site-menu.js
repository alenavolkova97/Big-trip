import SmartView from './smart.js';
import {MenuItem} from "../const.js";

export default class SiteMenu extends SmartView {
  constructor(currentMenuItem) {
    super();

    this._currentMenuItem = currentMenuItem;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn ${this._currentMenuItem === MenuItem.TABLE ? `trip-tabs__btn--active` : ``}"
         href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
        <a class="trip-tabs__btn ${this._currentMenuItem === MenuItem.STATS ? `trip-tabs__btn--active` : ``}"
         href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
      </nav>`
    );
  }

  restoreHandlers() {
    this.setMenuClickHandler();
  }

  _menuClickHandler(evt) {
    this._currentMenuItem = evt.target.dataset.menuItem;

    this._callback.menuClick(this._currentMenuItem);

    this.updateElement();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback || this._callback.menuClick;

    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
