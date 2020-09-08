import {tripDays} from '../main.js';
import {createElement} from '../utils.js';

export default class TripDay {
  constructor(day) {
    this._element = null;
    this._day = day;
  }

  getTemplate() { // отделить список событий по необходимости
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${tripDays.indexOf(this._day) + 1}</span>
          <time class="day__date" datetime="2019-03-18">${this._day.date}</time>
        </div>

        <ul class="trip-events__list"></ul>
      </li>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
