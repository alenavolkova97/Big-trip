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
import {ActionType, UpdateType} from "../const.js";

export default class Trip {
  constructor(tripEventsContainer, daysModel) {
    this._daysModel = daysModel;
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortingType = SortType.DEFAULT;
    this._tripDays = [];
    this._eventPresenters = {};

    this._tripDaysContainerComponent = new TripDaysContainerView();

    this._tripEventsSortingComponent = null;
    this._noEventsComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._daysModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getDays() { // return days
    return this._daysModel.getDays();
  }

  _getEvents() { // return all events (sorted, if necessary)
    switch (this._currentSortingType) {
      case SortType.TIME:
        return this._daysModel.getAllEvents().slice().sort(sortEventsByTime);
      case SortType.PRICE:
        return this._daysModel.getAllEvents().slice().sort(sortEventsByPrice);
    }

    return this._daysModel.getAllEvents();
  }

  _renderNoEvents() {
    if (this._noEventsComponent !== null) {
      this._noEventsComponent = null;
    }

    this._noEventsComponent = new NoEventsView();

    render(this._tripEventsContainer, this._noEventsComponent);
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

    if (sortType !== SortType.DEFAULT) { // ?
      this._renderEventsAfterSorting();
      this._setDaySortingElementText(``);
    } else {
      this._renderTrip();
      this._setDaySortingElementText(`Day`);
    }
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
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip({isSortedEvents: true});
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortingType: true});
        this._renderTrip(); // ?
        break;
    }
    // ОБНОВИТЬ ПРЕДСТАВЛЕНИЕ
  }

  _handleModeChange() {
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

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _clearTrip({resetSortingType = false, removeSortingComponent = true} = {}) {
    this._tripDays.forEach((day) => remove(day));
    this._tripDays = [];

    // if (this._tripEventsContainerAfterSortingComponent) { // сдвиг сортировки
    //   this._tripEventsContainerAfterSortingComponent.remove();
    // }

    // console.log(this._tripEventsContainerAfterSortingComponent);

    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenters = {};

    remove(this._noEventsComponent);

    if (removeSortingComponent) {
      remove(this._tripEventsSortingComponent);
      this._tripEventsSortingComponent = null;
    }

    if (resetSortingType) {
      this._currentSortingType = SortType.DEFAULT;
    }
  }

  _renderTrip({isSortedEvents = false} = {}) {
    const eventsCount = this._getEvents().length;

    if (eventsCount === 0) {
      this._renderNoEvents();
      return;
    }

    if (this._tripEventsSortingComponent === null) {
      this._renderSorting();
    }

    if (isSortedEvents) {
      this._renderDaysContainer();
      this._renderEventsAfterSorting();
      this._setDaySortingElementText(``);
      return;
    }

    this._renderDaysContainer();
    this._renderDays();
  }
}
