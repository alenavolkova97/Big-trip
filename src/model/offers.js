import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();

    this._notify();
  }

  getOffers() {
    return this._offers;
  }

  static adaptOfferToClient(offerFromApi) {
    const adaptedOffer = {
      type: offerFromApi.type,
      offers: offerFromApi.offers.map((offer) => ({
        // key: `${offer.title.toLowerCase().replace(/ /g, `_`)}_${generateId(5)}`, ???
        title: offer.title,
        price: offer.price
      })),
    };

    return adaptedOffer;
  }
}
