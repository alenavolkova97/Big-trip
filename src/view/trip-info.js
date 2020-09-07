import {createElement} from '../utils.js';

export default class TripInfo {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    const destinationsWithRepeating = this._events.map((tripEvent) => tripEvent.destination);
    const destinations = Array.from(new Set(destinationsWithRepeating));

    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">
          ${(destinations.length > 3) ? `${destinations[0]} &mdash; ... &mdash;
          ${destinations[destinations.length - 1]}` : destinations.join(` &mdash; `)}
        </h1>

        <p class="trip-info__dates">
          ${this._events[0].time.start}&nbsp;&mdash;&nbsp;
          ${this._events[this._events.length - 1].time.end}
        </p>
      </div>`
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

