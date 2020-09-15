import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, replace} from '../utils/render.js';

export default class Event {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    this._tripEventComponent = new TripEventView(event);

    this._tripEventComponent.setRollupClickHandler(this._handleRollupClick);
    render(this._eventListContainer, this._tripEventComponent);
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
    if (!this._tripEventEditComponent) {
      this._tripEventEditComponent = new TripEventEditView(this._event);
    }
    this._replaceEventToForm();
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
  }

  _handleFormSubmit() {
    this._replaceFormToEvent();
  }
}
