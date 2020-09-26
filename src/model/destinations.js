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

  static adaptDestinationToClient(destinationFromApi) {
    const adaptedDestination = {
      description: destinationFromApi.description,
      name: destinationFromApi.name,
      photos: destinationFromApi.pictures.map((picture) => ({
        src: picture.src,
        description: picture.description
      }))
    };

    return adaptedDestination;
  }
}
