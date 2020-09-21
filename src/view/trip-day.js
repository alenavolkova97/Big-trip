import {tripDays} from '../main.js';
import AbstractView from './abstract.js';
import {formatDate} from '../utils/trip.js';

export default class TripDay extends AbstractView {
  constructor(day) {
    super();
    this._day = day;
  }

  getTemplate() {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${tripDays.findIndex((day) => day.date === this._day.date) + 1}</span>
          <time class="day__date" datetime="2019-03-18">${formatDate(this._day.date)}</time>
        </div>
      </li>`
    );
  }
}
