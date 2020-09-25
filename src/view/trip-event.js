import {ARRIVALS} from '../const.js';
import AbstractView from './abstract.js';
import {formatEventDate, formatEventDuration} from '../utils/event.js';

export default class TripEvent extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
  }

  _createTripEventOffersTemplate(offers) {
    return offers.slice(0, 3).map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`);
    }).join(``);
  }

  getTemplate() {
    const {type, destination, time, price, offers} = this._event;
    return (
      `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png"
              alt="Event type icon">
          </div>
          <h3 class="event__title">${type[0].toUpperCase() + type.slice(1)}
            ${ARRIVALS.includes(type) ? `in` : `to`} ${destination}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T10:30">
                ${formatEventDate(time.start)}
              </time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T11:00">
                ${formatEventDate(time.end)}
              </time>
            </p>
            <p class="event__duration">${formatEventDuration(time.start, time.end)}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

        ${offers.length !== 0 ?
        `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
          ${this._createTripEventOffersTemplate(offers)}
          </ul>` : ``}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
  }

  _rollupClickHandler() {
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupClickHandler);
  }
}

