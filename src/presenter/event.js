import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, replace, remove} from '../utils/render.js';
import {ActionType, UpdateType} from '../const.js';
import {isDateEqual} from '../utils/event.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Event {
  constructor(eventListContainer, destinationsModel, offersModel, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
    this._handleDestinationsUpdate = this._handleDestinationsUpdate.bind(this);
    this._handleOffersUpdate = this._handleOffersUpdate.bind(this);

    this._destinationsModel.addObserver(this._handleDestinationsUpdate);
    this._offersModel.addObserver(this._handleOffersUpdate);
  }

  init(event) {
    this._event = event;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(this._event);
    this._tripEventEditComponent = new TripEventEditView(this._event, this._destinationsModel.getDestinations(), this._offersModel.getOffers());

    this._tripEventComponent.setRollupClickHandler(this._handleRollupClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._tripEventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._tripEventEditComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._eventListContainer, this._tripEventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventComponent, prevTripEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevTripEventComponent);
    remove(prevTripEventEditComponent);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._tripEventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripEventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._tripEventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._tripEventComponent.shake(resetFormState);
        this._tripEventEditComponent.shake(resetFormState);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _handleOffersUpdate() {
    this._tripEventEditComponent.setOffers(this._offersModel.getOffers());
  }

  _handleDestinationsUpdate() {
    if (this._tripEventEditComponent) {
      this._tripEventEditComponent.setDestinations(this._destinationsModel.getDestinations());
    }
  }

  _replaceEventToForm() {
    this._changeMode();
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._tripEventEditComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleRollupClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(update) {
    const isPatchUpdate =
      this._event.price === update.price &&
      isDateEqual(update.time.start, this._event.time.start) &&
      isDateEqual(update.time.end, this._event.time.end);

    this._changeData(
        ActionType.UPDATE_EVENT,
        isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR,
        update
    );
  }

  _handleRollupButtonClick() {
    this._tripEventEditComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
        ActionType.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleDeleteClick(update) {
    this._changeData(
        ActionType.DELETE_EVENT,
        UpdateType.MINOR,
        update);
  }
}
