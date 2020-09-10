import TripEventsSortingView from '../view/trip-events-sorting.js';
import TripDaysContainerView from '../view/trip-days-container.js';
import TripDayView from '../view/trip-day.js';
import TripEventEditView from '../view/trip-event-edit.js';
import TripEventView from '../view/trip-event.js';
import NoEventsView from '../view/no-events.js';
import {render, replace} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

    this._tripDaysContainerComponent = new TripDaysContainerView();
    this._noEventsComponent = new NoEventsView();
    this._tripEventsSortingComponent = new TripEventsSortingView();
  }

  init(tripDays, tripEvents) {
    this.tripDays = tripDays;
    this._tripEvents = tripEvents;
    this._renderTrip();
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent);
  }

  _renderSorting() {
    render(this._tripEventsContainer, this._tripEventsSortingComponent);
  }

  _renderDaysContainer() {
    render(this._tripEventsContainer, this._tripDaysContainerComponent);
  }

  _renderDays() {
    this.tripDays.sort((a, b) => a.date - b.date).forEach((day, index) => {
      // render days and events in each day
      this._renderDay(day);
      this._renderEvents(day, index);
    });
  }

  _renderDay(day) {
    const tripDayComponent = new TripDayView(day);
    render(this._tripDaysContainerComponent, tripDayComponent);
  }

  _renderEvents(day, index) {
    const tripDayElement = this._tripDaysContainerComponent.getElement().querySelector(`.day:nth-child(${index + 1})`);
    const tripEventsList = tripDayElement.querySelector(`.trip-events__list`); // ?

    day.tripEvents.sort((a, b) => a.time.start - b.time.start).forEach((tripEvent) => {
      this._renderEvent(tripEventsList, tripEvent);
    });
  }

  _renderEvent(tripListElement, event) {
    const tripEventComponent = new TripEventView(event);
    let tripEventEditComponent;

    const replaceEventToForm = () => {
      replace(tripEventEditComponent, tripEventComponent);
    };

    const replaceFormToEvent = () => {
      replace(tripEventComponent, tripEventEditComponent);
    };

    const onEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscPress);
      }
    };

    tripEventComponent.setRollupClickHandler(() => {
      if (!tripEventEditComponent) {
        tripEventEditComponent = new TripEventEditView(event); // create component when click happen
      }
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscPress);

      tripEventEditComponent.setFormSubmitHandler(() => {
        replaceFormToEvent();
      });
    });

    render(tripListElement, tripEventComponent);
  }

  _renderTrip() {
    if (this._tripEvents.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();
    this._renderDaysContainer();
    this._renderDays();
  }
}
