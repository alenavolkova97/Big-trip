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

  // static adaptOfferToClient(offer) {
  //   const adaptedOffer =

  //   return adaptedOffer;
  // }
}
