import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  static adaptOfferToClient(offer) {
    const adaptedOffer = Object.assign(
        {},
        offer,
        {
          'isFavorite': event.is_favorite,
          'time': {
            start: event.date_from,
            end: event.date_to
          },
          'price': event.base_price
        }
    );

    delete adaptedOffer.is_favorite;
    delete adaptedOffer.date_from;
    delete adaptedOffer.date_to;
    delete adaptedOffer.base_price;

    return adaptedOffer;
  }

  // static adaptEventToServer(event) {
  //   const adaptedEvent = Object.assign(
  //       {},
  //       event,
  //       {
  //         'is_favorite': event.isFavorite,
  //         'date_from': event.time.start,
  //         'date_to': event.time.end,
  //         'base_price': event.price
  //       }
  //   );

  //   delete adaptedEvent.isFavorite;
  //   delete adaptedEvent.time;
  //   delete adaptedEvent.price;
  //   delete adaptedEvent.description;
  //   delete adaptedEvent.photos;

  //   return adaptedEvent;
  // }
}
