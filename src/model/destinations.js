import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();

    this._notify();
  }

  getDestinations() {
    return this._destinations;
  }

  static adaptDestinationToClient(destination) {
    const adaptedDestination = destination.name;

    return adaptedDestination;
  }
}
