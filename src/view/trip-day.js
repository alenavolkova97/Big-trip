import {tripDays} from '../main.js';
import {createElement} from '../utils.js';

const createTripDayTemplate = (tripDay) => { // нужно ли отделять список событий в отдельный модуль ?
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${tripDays.indexOf(tripDay) + 1}</span>
        <time class="day__date" datetime="2019-03-18">${tripDay.date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class TripDay {
  constructor(day) {
    this._element = null;
    this._day = day;
  }

  _getTemplate() {
    return createTripDayTemplate(this._day);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() { // ?
    this._element = null;
  }
}
