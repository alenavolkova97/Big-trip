import {ARRIVALS} from '../const.js';
import {createElement} from '../utils.js';

const createTripEventOffersTemplate = (offers) => {
  return offers.slice(0, 3).map((offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`).join(``);
};

const createTripEventTemplate = (tripEvent) => {
  const {type, destination, time, price, offers} = tripEvent;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${ARRIVALS.includes(type) ? `in` : `to`} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${time.start}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${time.end}</time>
          </p>
          <p class="event__duration">30M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createTripEventOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEvent {
  constructor(event) {
    this._element = null;
    this._event = event;
  }

  _getTemplate() {
    return createTripEventTemplate(this._event);
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

