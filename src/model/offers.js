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

  // static adaptOfferToClient(offer) {
  //   const adaptedOffer = {
  //     type: offer.type,
  //     offers: offer.offers
  //     key: `luggage`, // ???
  //     title: `Add luggage`,
  //     price: 30
  //   };

  //   return adaptedOffer;
  // }
}
