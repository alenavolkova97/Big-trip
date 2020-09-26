import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {ActionType, UpdateType} from '../const.js';

export default class NewEvent {
  constructor(eventListContainer, destinationsModel, offersModel, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._tripEventEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleDestinationsUpdate = this._handleDestinationsUpdate.bind(this);
    this._handleOffersUpdate = this._handleOffersUpdate.bind(this);

    this._destinationsModel.addObserver(this._handleDestinationsUpdate);
    this._offersModel.addObserver(this._handleOffersUpdate);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._tripEventEditComponent !== null) {
      return;
    }

    this._tripEventEditComponent = new TripEventEditView(undefined, this._destinationsModel.getDestinations(), this._offersModel.getOffers());

    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._tripEventEditComponent.setRollupButtonClickHandler(this._handleRollupClick);

    render(this._eventListContainer, this._tripEventEditComponent, RenderPosition.BEFOREBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
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

  _handleRollupClick() {
    this.destroy();
  }

  _handleDestinationsUpdate() {
    if (this._tripEventEditComponent) {
      this._tripEventEditComponent.setDestinations(this._destinationsModel.getDestinations());
    }
  }

  _handleOffersUpdate() {
    if (this._tripEventEditComponent) {
      this._tripEventEditComponent.setOffers(this._offersModel.getOffers());
    }
  }

  _handleFormSubmit(update) {
    this._changeData(
        ActionType.ADD_EVENT,
        UpdateType.MINOR,
        update
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
