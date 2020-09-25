import AbstractView from './abstract.js';

export default class TripPrice extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }
  getTemplate() {
    const price = this._events.reduce((counter, event) => counter + event.price, 0);

    return (
      `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>`
    );
  }
}
