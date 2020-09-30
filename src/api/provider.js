import {nanoid} from 'nanoid';
import DaysModel from '../model/days.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.events);
};

const createStoreStructure = (items, keyName) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current[keyName]]: current,
    });
  }, {});
};

const createEventsStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storeEvents, storeOffers, storeDestinations) {
    this._api = api;
    this._storeEvents = storeEvents;
    this._storeOffers = storeOffers;
    this._storeDestinations = storeDestinations;
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers, `type`);
          this._storeOffers.setItems(items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._storeOffers.getItems());

    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations, `name`);
          this._storeDestinations.setItems(items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._storeDestinations.getItems());

    return Promise.resolve(storeDestinations);
  }

  getEvents() {
    if (Provider.isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createEventsStoreStructure(events.map(DaysModel.adaptEventToServer));
          this._storeEvents.setItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._storeEvents.getItems());

    return Promise.resolve(storeEvents.map(DaysModel.adaptEventToClient));
  }

  updateEvent(event) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._storeEvents.setItem(updatedEvent.id, DaysModel.adaptEventToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._storeEvents.setItem(event.id, DaysModel.adaptEventToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (Provider.isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._storeEvents.setItem(newEvent.id, DaysModel.adaptEventToServer(newEvent));
          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._storeEvents.setItem(localNewEvent.id, DaysModel.adaptEventToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._storeEvents.removeItem(event.id));
    }

    this._storeEvents.removeItem(event.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeEvents = Object.values(this._storeEvents.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._storeEvents.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
