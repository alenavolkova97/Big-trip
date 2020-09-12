import TripInfoContainerView from '../view/trip-info-container.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Info {
  constructor(infoContainer) {
    this._infoContainer = infoContainer;

    this._tripInfoContainerComponent = new TripInfoContainerView();
    this._tripPriceComponent = new TripPriceView();
  }

  init(tripEvents) {
    this._tripEvents = tripEvents;
    this._tripInfoComponent = new TripInfoView(this._tripEvents);

    render(this._infoContainer, this._tripInfoContainerComponent, RenderPosition.AFTERBEGIN);
    this._renderAllInfo();
  }

  _renderPrice() {
    render(this._tripInfoContainerComponent, this._tripPriceComponent);
    // цена должна быть = 0 при пустом массиве allEvents
  }

  _renderTripInfo() {
    render(this._tripInfoContainerComponent, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderAllInfo() {
    this._renderPrice();
    if (this._tripEvents.length !== 0) {
      this._renderTripInfo();
    }
  }
}
