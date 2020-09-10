import TripInfoContainerView from '../view/trip-info-container.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Info {
  constructor(infoContainer, tripEvents) {
    this._infoContainer = infoContainer;
    this._tripEvents = tripEvents;

    this._tripInfoContainerComponent = new TripInfoContainerView();
    this._tripPriceComponent = new TripPriceView();
    this._tripInfoComponent = new TripInfoView(this._tripEvents);
  }

  init() {
    render(this._infoContainer, this._tripInfoContainerComponent, RenderPosition.AFTERBEGIN);
    this._renderAllInfo();
  }

  _renderPrice() {
    this._tripInfoContainerElement = this._infoContainer.querySelector(`.trip-info`); // ?
    render(this._tripInfoContainerElement, this._tripPriceComponent);
    // цена должна быть = 0 при пустом массиве allEvents
  }

  _renderTripInfo() {
    render(this._tripInfoContainerElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderAllInfo() {
    this._renderPrice();
    if (this._tripEvents.length !== 0) {
      this._renderTripInfo();
    }
  }
}
