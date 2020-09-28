import AbstractView from './abstract-element.js';

export default class Loading extends AbstractView {
  getTemplate() {
    return (
      `<p class="trip-events__msg">
        Loading...
      </p>`
    );
  }
}
