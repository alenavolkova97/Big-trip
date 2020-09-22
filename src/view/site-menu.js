import AbstractView from './abstract.js';
import {MenuItem} from "../const.js";

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn  trip-tabs__btn--active"
          href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
        <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
      </nav>`
    );
  }

  _menuClickHandler(evt) {
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
