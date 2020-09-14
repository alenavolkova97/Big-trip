import AbstractView from './abstract.js';

export default class TripEventsContainerAfterSorting extends AbstractView {
  getTemplate() {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info"></div>
      </li>`
    );
  }
}
