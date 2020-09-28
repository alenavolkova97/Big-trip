import AbstractView from './abstract-element.js';

export default class TripInfoContainer extends AbstractView {
  getTemplate() {
    return (
      `<section class="trip-main__trip-info  trip-info"></section>`
    );
  }
}
