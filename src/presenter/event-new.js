import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {ActionType, UpdateType} from '../const.js';
import {generateId} from '../mock/trip-event.js';

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._tripEventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._tripEventEditComponent !== null) {
      return;
    }

    this._tripEventEditComponent = new TripEventEditView();

    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._tripEventEditComponent, RenderPosition.BEFOREBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEventEditComponent === null) {
      return;
    }

    remove(this._tripEventEditComponent);
    this._tripEventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.destroy();
    }
  }

  _handleFormSubmit(update) {
    this._changeData(
        ActionType.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, update)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
