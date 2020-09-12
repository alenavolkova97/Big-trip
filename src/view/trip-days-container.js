import AbstractView from './abstract.js';

export default class TripDaysContainer extends AbstractView {
  getTemplate() {
    return (
      `<ul class="trip-days"></ul>`
    );
  }
}
