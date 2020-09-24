import TripEventsSortingView from '../view/trip-events-sorting.js';
import TripDaysContainerView from '../view/trip-days-container.js';
import TripDayView from '../view/trip-day.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripEventsContainerAfterSortingView from '../view/trip-events-container-after-sorting.js';
import NoEventsView from '../view/no-events.js';
import LoadingView from "../view/loading.js";
import {render, remove} from '../utils/render.js';
import {SortType} from '../const.js';
import {sortEventsByTime, sortEventsByPrice} from '../utils/event.js';
import EventPresenter from './event.js';
import EventNewPresenter from './event-new.js';
import {ActionType, UpdateType} from "../const.js";
import {filter} from '../utils/filter.js';
import {tripEventsContainerElement} from '../main.js';

export default class Trip {
  constructor(tripEventsContainer, daysModel, filterModel, destinationsModel) {
    this._daysModel = daysModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortingType = SortType.DEFAULT;
    this._tripDays = [];
    this._eventPresenters = {};
    this._isLoading = true;

    this._tripDaysContainerComponent = new TripDaysContainerView();
    this._loadingComponent = new LoadingView();

    this._tripEventsSortingComponent = null;
    this._noEventsComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._tripDaysContainerComponent, this._handleViewAction);
  }

  init() {
    this.destroy();
    this._renderTrip();

    this._daysModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearTrip({resetSortingType: true, removeSortingComponent: true});

    remove(this._tripDaysContainerComponent);

    this._daysModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    this._handleModeChange();
    this._eventNewPresenter.init(callback);
  }

  _getDays() { // return days with checked filter
    const filterType = this._filterModel.getFilter();
    let days = this._daysModel.getDays();

    days = days.map((day) => {
      return Object.assign(
          {},
          day,
          {
            tripEvents: filter[filterType](day.tripEvents)
          }
      );
    });

    return days;
  }

  _getEvents() { // return all events with checked filter (sorted, if necessary)
    const filterType = this._filterModel.getFilter();
    const events = this._daysModel.getAllEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortingType) {
      case SortType.TIME:
        return filtredEvents.sort(sortEventsByTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortEventsByPrice);
    }

    return filtredEvents;
  }

  _renderNoEvents() {
    if (this._noEventsComponent !== null) {
      this._noEventsComponent = null;
    }

    this._noEventsComponent = new NoEventsView();

    render(this._tripEventsContainer, this._noEventsComponent);
  }

  _renderLoading() {
    render(tripEventsContainerElement, this._loadingComponent);
  }

  _setDaySortingElementText(textContent) {
    this._tripEventsSortingComponent.getElement().querySelector(`.trip-sort__item--day`)
        .textContent = textContent;
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortingType) {
      return;
    }

    this._currentSortingType = sortType;
    this._clearTrip({removeSortingComponent: false});
    this._renderTrip();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case ActionType.UPDATE_EVENT:
        this._daysModel.updateEvent(updateType, update);
        break;
      case ActionType.ADD_EVENT:
        this._daysModel.addEvent(updateType, update);
        break;
      case ActionType.DELETE_EVENT:
        this._daysModel.deleteEvent(updateType, update);
        break;
    }
    // ОБНОВИТЬ МОДЕЛЬ
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortingType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
    // ОБНОВИТЬ ПРЕДСТАВЛЕНИЕ
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSorting() {
    if (this._tripEventsSortingComponent !== null) {
      this._tripEventsSortingComponent = null;
    }

    this._tripEventsSortingComponent = new TripEventsSortingView(this._currentSortingType);
    this._tripEventsSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._tripEventsSortingComponent);
  }

  _renderDaysContainer() {
    render(this._tripEventsContainer, this._tripDaysContainerComponent);
  }

  _renderDays() {
    this._getDays().forEach((day, index) => {
      if (day.tripEvents.length > 0) {
        this._renderDay(day, index);
      }
    });
  }

  _renderDay(day, index) {
    const tripDayComponent = new TripDayView(day, index);

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

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._destinationsModel, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _clearTrip({resetSortingType = false, removeSortingComponent = true} = {}) {
    this._tripDays.forEach((day) => remove(day));
    this._tripDays = [];

    this._eventNewPresenter.destroy();

    if (this._tripEventsContainerAfterSortingComponent) {
      remove(this._tripEventsContainerAfterSortingComponent);
    }

    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenters = {};

    remove(this._noEventsComponent);
    remove(this._loadingComponent);

    if (removeSortingComponent) {
      remove(this._tripEventsSortingComponent);
      this._tripEventsSortingComponent = null;
    }

    if (resetSortingType) {
      this._currentSortingType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const eventsCount = this._getEvents().length;

    if (eventsCount === 0) {
      this._renderNoEvents();
      return;
    }

    if (this._tripEventsSortingComponent === null) {
      this._renderSorting();
    }

    this._renderDaysContainer();

    if (this._currentSortingType === SortType.DEFAULT) {
      this._renderDays();
      this._setDaySortingElementText(`Day`);
    } else {
      this._renderEventsAfterSorting();
      this._setDaySortingElementText(``);
    }
  }
}

