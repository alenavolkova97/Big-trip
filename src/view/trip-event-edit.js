import {ARRIVALS, MOVEMENTS} from '../const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import moment from "moment";

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  isFavorite: false,
  type: `flight`,
  destination: ``,
  time: {
    start: new Date(),
    end: new Date()
  },
  price: 0,
  offers: [],
  description: ``,
  photos: []
};

export default class TripEventEdit extends SmartView {
  constructor(event = BLANK_EVENT, destinations, offers) {
    super();

    this._data = TripEventEdit.parseEventToData(event);

    this._destinations = destinations;
    this._offers = offers;
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    const {
      isFavorite,
      type,
      destination,
      time,
      price,
      offers,
      isDisabled,
      isSaving,
      isDeleting
    } = this._data;

    return (
      `<form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17"
                src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox"
            ${isDisabled ? `disabled` : ``}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${MOVEMENTS.map((movementType) => `<div class="event__type-item">
                    <input id="event-type-${movementType.toLowerCase()}" class="event__type-input
                      visually-hidden" type="radio" name="event-type" value="${movementType}"
                      ${type === movementType ? `checked` : ``}>
                    <label class="event__type-label  event__type-label--${movementType.toLowerCase()}"
                      for="event-type-${movementType.toLowerCase()}">
                      ${movementType}
                    </label>
                  </div>`).join(``)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${ARRIVALS.map((arrivalType) => `<div class="event__type-item">
                  <input id="event-type-${arrivalType.toLowerCase()}" class="event__type-input
                    visually-hidden" type="radio" name="event-type" value="${arrivalType}"
                    ${type === arrivalType ? `checked` : ``}>
                  <label class="event__type-label  event__type-label--${arrivalType.toLowerCase()}"
                    for="event-type-${arrivalType.toLowerCase()}">${arrivalType}</label>
                </div>`).join(``)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination">
              ${type[0].toUpperCase() + type.slice(1)}
              ${ARRIVALS.includes(type) ? `in` : `to`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination"
              type="text" name="event-destination" value="${destination}" list="destination-list"
              pattern="${this._hasDestinations() ? this._destinations.map((it) => it.name).join(`|`) : ``}"
              ${isDisabled ? `disabled` : ``} required>
            <datalist id="destination-list">
              ${this._hasDestinations() ? this._destinations.map((it) => `<option value="${it.name}"></option>`).join(``) : ``}
            </datalist>
          </div>

          ${this._createTripEventTimeTemplate(time, isDisabled)}

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price" type="number" min="0" step="1"
              name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>
            ${isSaving ? `Saving...` : `Save`}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
            ${isDeleting ? `Deleting...` : `Delete`}
          </button>

          <input id="event-favorite" class="event__favorite-checkbox  visually-hidden" type="checkbox"
          name="event-favorite"
            ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
          <label class="event__favorite-btn" for="event-favorite">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
            <span class="visually-hidden">Open event</span>
          </button>

        </header>

        <section class="event__details">
          ${this._createTripEventOffersSectionTemplate(offers, type, isDisabled)}
          ${this._createTripEventDestinationSectionTemplate(destination)}
        </section>
      </form>`
    );
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  reset(event) {
    this.updateData(event);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();

    this.setFormSubmitHandler();
    this.setDeleteClickHandler();
    this.setRollupButtonClickHandler();
  }

  setDestinations(destinations) {
    this._destinations = destinations;

    this.updateElement();
  }

  setOffers(offers) {
    this._offers = offers;

    this.updateElement();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback || this._callback.formSubmit;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback || this._callback.deleteClick;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteClickHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback || this._callback.rollupButtonClick;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupButtonClickHandler);
  }

  _createTripEventTimeTemplate(time, isDisabled) {
    return (
      `<div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time"
          type="text" name="event-start-time" value="${moment(time.start).format(`DD/MM/YYYY HH:mm`)}"
          ${isDisabled ? `disabled` : ``}>
        &mdash;
        <label class="visually-hidden" for="event-end-time">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time"
          type="text" name="event-end-time" value="${moment(time.end).format(`DD/MM/YYYY HH:mm`)}"
          ${isDisabled ? `disabled` : ``}>
      </div>`
    );
  }

  _createTripEventOffersSectionTemplate(checkedOffers, needType, isDisabled) {
    if (!this._offers) {
      return ``;
    }

    const availableOffers = this._offers.find((offers) => offers.type === needType);

    return Array.isArray(availableOffers.offers) && availableOffers.offers.length ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${this._createTripEventOffersTemplate(checkedOffers, availableOffers, isDisabled)}
        </div>
      </section>` : ``;
  }

  _createTripEventOffersTemplate(checkedOffers, availableOffers, isDisabled) {
    return availableOffers.offers.map((offer) =>
      `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}"
              type="checkbox" name="event-offer-${offer.title}" value="${offer.title}"
              ${checkedOffers.find((checkedOffer) => checkedOffer.title === offer.title) ? `checked` : ``}
              ${isDisabled ? `disabled` : ``}>
            <label class="event__offer-label" for="event-offer-${offer.title}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`).join(``);
  }

  _createTripEventDestinationSectionTemplate(destination) {
    if (!this._destinations) {
      return ``;
    }

    const appropriateDestination = this._destinations.find((it) => it.name === destination);

    return appropriateDestination ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${this._createTripEventDescription(appropriateDestination)}
      </p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${this._createTripEventPtotosTemplate(appropriateDestination)}
        </div>
      </div>
    </section>` : ``;
  }

  _createTripEventDescription(appropriateDestination) {
    if (appropriateDestination) {
      const appropriateDescription = appropriateDestination.description;
      return appropriateDescription;
    }

    return ``;
  }

  _createTripEventPtotosTemplate(appropriateDestination) {
    if (appropriateDestination) {
      return appropriateDestination.photos.map((photo) => `<img class="event__photo" src="${photo.src}"
      alt="Event photo">`).join(``);
    }

    return ``;
  }

  _hasDestinations() {
    return Array.isArray(this._destinations) && this._destinations.length;
  }

  _setDatePicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time`),
        {
          enableTime: true,
          dateFormat: `d/m/Y H:i`,
          defaultDate: this._data.time.start,
          onClose: this._startDateChangeHandler
        }
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time`),
        {
          enableTime: true,
          dateFormat: `d/m/Y H:i`,
          minDate: this._data.time.start,
          defaultDate: this._data.time.end,
          onClose: this._endDateChangeHandler
        }
    );
  }

  _setInnerHandlers() {
    const availableDescriptionContainer = this.getElement().querySelector(`.event__input--destination`);
    const availableOffersContainer = this.getElement().querySelector(`.event__available-offers`);
    const favoriteElement = this.getElement().querySelector(`.event__favorite-icon`);

    this
      .getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventTypeChangeHandler);

    if (availableDescriptionContainer) {
      availableDescriptionContainer.addEventListener(`change`, this._destinationInputHandler);
    }

    this
      .getElement()
      .querySelector(`.event__field-group--price`)
      .addEventListener(`input`, this._priceInputHandler);

    if (availableOffersContainer) {
      availableOffersContainer.addEventListener(`change`, this._offersChangeHandler);
    }

    if (favoriteElement) {
      favoriteElement.addEventListener(`click`, this._favoriteClickHandler);
    }
  }

  _eventTypeChangeHandler(evt) {
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _destinationInputHandler(evt) {
    const destination = this._destinations.find((it) => it.name === evt.target.value);

    this.updateData({
      destination: destination.name,
      photos: destination.photos.map((picture) => picture.src),
      description: destination.description,
    });
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      time: {
        start: userDate.getTime(),
        end: this._data.time.end
      }
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      time: {
        start: this._data.time.start,
        end: userDate.getTime()
      }
    });
  }

  _priceInputHandler(evt) {
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _favoriteClickHandler() {
    this.updateData({
      isFavorite: !this._data.isFavorite,
    });
  }

  _offersChangeHandler(evt) {
    const currentOfferTitle = evt.target.value;
    const checkedOffer = this._data.offers.find((offer) => offer.title === currentOfferTitle);

    if (checkedOffer) {
      this.updateData({
        offers: this._data.offers.filter((offer) => offer.title !== checkedOffer.title)
      });
    } else {
      const foundOfferWithTitle = this._offers
        .find((offers) => offers.type === this._data.type)
        .offers
        .find((offer) => offer.title === currentOfferTitle);

      if (foundOfferWithTitle) {
        this.updateData({
          offers: [...this._data.offers, foundOfferWithTitle],
        });
      }
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripEventEdit.parseDataToEvent(this._data));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripEventEdit.parseDataToEvent(this._data));
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
