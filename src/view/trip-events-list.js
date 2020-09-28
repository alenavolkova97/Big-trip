import AbstractView from './abstract-element.js';

export default class TripEventsList extends AbstractView {
  getTemplate() {
    return (
      `<ul class="trip-events__list"></ul>`
    );
  }
}
