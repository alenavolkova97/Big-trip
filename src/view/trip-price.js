import AbstractView from './abstract.js';

export default class TripPrice extends AbstractView {
  getTemplate() {
    return (
      `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>`
    );
  }
}
