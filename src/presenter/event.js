import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, replace, remove} from '../utils/render.js';

export default class Event {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(this._event);
    this._tripEventEditComponent = new TripEventEditView(this._event);

    this._tripEventComponent.setRollupClickHandler(this._handleRollupClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._eventListContainer, this._tripEventComponent);
      return;
    }

    if (this._eventListContainer.getElement().contains(prevTripEventComponent.getElement())) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._eventListContainer.getElement().contains(prevTripEventEditComponent.getElement())) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
    }

    remove(prevTripEventComponent);
    remove(prevTripEventEditComponent);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  _replaceEventToForm() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
  }

  _replaceFormToEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceFormToEvent();
    }
  }

  _handleRollupClick() {
    this._replaceEventToForm();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit() {
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    // this._changeData ?
  }
}
