import TripEventsSortingView from '../view/trip-events-sorting.js';
import TripDaysContainerView from '../view/trip-days-container.js';
import TripDayView from '../view/trip-day.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripEventsContainerAfterSortingView from '../view/trip-events-container-after-sorting.js';
import NoEventsView from '../view/no-events.js';
import {render, remove} from '../utils/render.js';
import {SortType} from '../const.js';
import {sortEventsByTime, sortEventsByPrice} from '../utils/event.js';
import EventPresenter from './event.js';

export default class Trip {
  constructor(tripEventsContainer, daysModel) {
    this._daysModel = daysModel;
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SortType.DEFAULT;
    this._tripDays = [];
    this._eventPresenters = {};

    this._tripDaysContainerComponent = new TripDaysContainerView();
    this._tripEventsSortingComponent = new TripEventsSortingView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    this._renderTrip();
  }

  _getDays() { // return days
    return this._daysModel.getDays();
  }

  _getEvents() { // return all events (sorted, if necessary)
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._daysModel.getAllEvents().slice().sort(sortEventsByTime);
      case SortType.PRICE:
        return this._daysModel.getAllEvents().slice().sort(sortEventsByPrice);
    }

    return this._daysModel.getAllEvents();
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView();
    render(this._tripEventsContainer, this._noEventsComponent);
  }

  _setDaySortingElementText(textContent) {
    this._tripEventsSortingComponent.getElement().querySelector(`.trip-sort__item--day`)
        .textContent = textContent;
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEvents();

    if (sortType !== SortType.DEFAULT) {
      this._renderEventsAfterSorting();
      this._setDaySortingElementText(``);
    } else {
      this._renderDays();
      this._setDaySortingElementText(`Day`);
    }
  }

  _handleEventChange(updatedEvent) {
    // здесь будем вызывать обновление модели
    this._eventPresenters[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSorting() {
    render(this._tripEventsContainer, this._tripEventsSortingComponent);
    this._tripEventsSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderDaysContainer() {
    render(this._tripEventsContainer, this._tripDaysContainerComponent);
  }

  _renderDays() {
    this._getDays().forEach((day) => {
      this._renderDay(day);
    });
  }

  _renderDay(day) {
    const tripDayComponent = new TripDayView(day);

    this._tripDays.push(tripDayComponent);
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
    this._tripEventsContainerAfterSortingComponent = new TripEventsContainerAfterSortingView();

    this._renderEventsContainerAfterSorting(this._tripEventsContainerAfterSortingComponent);
    this._renderEventsList(this._getEvents(), this._tripEventsContainerAfterSortingComponent);
  }

  _clearEvents() {
    this._tripDays.forEach((day) => remove(day));

    // if (this._tripEventsContainerAfterSortingComponent) { // сдвиг сортировки
    //   this._tripEventsContainerAfterSortingComponent.remove();
    // }

    // console.log(this._tripEventsContainerAfterSortingComponent);

    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderTrip() {
    if (this._getEvents().length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();
    this._renderDaysContainer();
    this._renderDays();
  }
}
