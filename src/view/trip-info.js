import AbstractView from './abstract.js';
import {formatDate} from '../utils/trip.js';

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    const destinationsWithRepeating = this._events
      .map((tripEvent) => tripEvent.destination);
    const destinations = Array.from(new Set(destinationsWithRepeating));

    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">
          ${(destinations.length > 3) ? `${destinations[0]} &mdash; ... &mdash;
          ${destinations[destinations.length - 1]}` : destinations.join(` &mdash; `)}
        </h1>

        <p class="trip-info__dates">
          ${formatDate(this._events[0].time.start)}&nbsp;&mdash;&nbsp;
          ${formatDate(this._events[this._events.length - 1].time.end)}
        </p>
      </div>`
    );
  }
}

