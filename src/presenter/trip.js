import TripEventsSortingView from '../view/trip-events-sorting.js';
import TripDaysContainerView from '../view/trip-days-container.js';
import TripDayView from '../view/trip-day.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripEventsContainerAfterSortingView from '../view/trip-events-container-after-sorting.js';
import NoEventsView from '../view/no-events.js';
import {render} from '../utils/render.js';
import {SortType} from '../const.js';
import {sortEventsByTime, sortEventsByPrice} from '../utils/event.js';
import EventPresenter from './event.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SortType.DEFAULT;

    this._tripDaysContainerComponent = new TripDaysContainerView();
    this._tripEventsSortingComponent = new TripEventsSortingView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripDays, tripEvents) {
    this.tripDays = tripDays;
    this._tripEvents = tripEvents;
    this._sourcedTripEvents = this._tripEvents;
    this._renderTrip();
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView();
    render(this._tripEventsContainer, this._noEventsComponent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._tripEvents.sort(sortEventsByTime);
        break;
      case SortType.PRICE:
        this._tripEvents.sort(sortEventsByPrice);
        break;
      default:
        this._tripEvents = this._sourcedTripEvents;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEvents();

    if (sortType !== SortType.DEFAULT) {
      this._renderEventsAfterSorting();
      this._tripEventsSortingComponent.getElement().querySelector(`.trip-sort__item--day`)
        .textContent = ``;
    } else {
      this._renderDays();
      this._tripEventsSortingComponent.getElement().querySelector(`.trip-sort__item--day`)
        .textContent = `Day`;
    }
  }

  _renderSorting() {
    render(this._tripEventsContainer, this._tripEventsSortingComponent);
    this._tripEventsSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderDaysContainer() {
    render(this._tripEventsContainer, this._tripDaysContainerComponent);
  }

  _renderDays() {
    this.tripDays.forEach((day) => {
      this._renderDay(day);
    });
  }

  _renderDay(day) {
    const tripDayComponent = new TripDayView(day);
    render(this._tripDaysContainerComponent, tripDayComponent);
    this._renderEventsList(day.tripEvents, tripDayComponent);
  }

  _renderEventsList(events, container) {
    const tripEventsListComponent = new TripEventsListView();
    render(container, tripEventsListComponent);
    this._renderEvents(events, tripEventsListComponent);
  }

  _renderEvents(events, eventsContainer) {
    events.forEach((tripEvent) => {
      this._renderEvent(eventsContainer, tripEvent);
    });
  }

  _renderEventsContainerAfterSorting(eventsContainer) {
    render(this._tripDaysContainerComponent, eventsContainer);
  }

  _renderEventsAfterSorting() {
    const tripEventsContainerAfterSortingComponent = new TripEventsContainerAfterSortingView();

    this._renderEventsContainerAfterSorting(tripEventsContainerAfterSortingComponent);
    this._renderEventsList(this._tripEvents, tripEventsContainerAfterSortingComponent);
  }

  _clearEvents() {
    this._tripDaysContainerComponent.getElement().innerHTML = ``;
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container);
    eventPresenter.init(event);
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
