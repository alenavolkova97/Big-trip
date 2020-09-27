import TripEventEditView from '../view/trip-event-edit.js';
import {tripPresenter} from '../main.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {ActionType, UpdateType} from '../const.js';
import {tripEventsContainerElement} from '../main.js';

export default class NewEvent {
  constructor(eventListContainer, daysModel, destinationsModel, offersModel, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._daysModel = daysModel;

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

    document.addEventListener(`keydown`, this._escKeyDownHandler);

    if (!this._daysModel.getAllEvents().length) {
      tripPresenter.deleteNoEventComponent();
      render(tripEventsContainerElement, this._tripEventEditComponent);
      return;
    }

    render(this._eventListContainer, this._tripEventEditComponent, RenderPosition.BEFOREBEGIN);
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

  setSaving() {
    this._tripEventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._tripEventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._tripEventEditComponent.shake(resetFormState);
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
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
