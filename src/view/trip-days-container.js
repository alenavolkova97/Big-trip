import AbstractView from './abstract-element.js';

export default class TripDaysContainer extends AbstractView {
  getTemplate() {
    return (
      `<ul class="trip-days"></ul>`
    );
  }
}
