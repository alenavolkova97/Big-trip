import Observer from '../utils/observer.js';
import {groupEventsByDays} from '../utils/event.js';

export default class Days extends Observer {
  constructor() {
    super();
    this._days = [];
  }

  setDays(updateType, days) {
    this._days = days.slice();

    this._notify(updateType);
  }

  getDays() {
    return this._days;
  }

  getAllEvents() {
    return this._days.reduce((events, day) => [...events, ...day.tripEvents], []);
  }

  _updateDays(newDays) {
    this._days = newDays;
  }

  updateEvent(updateType, updateEvent) {
    let dayContainUpdateEvent;
    let updateEventIndex;

    for (let dayIndex = 0; dayIndex < this._days.length; dayIndex++) {
      const day = this._days[dayIndex];
      const eventIndex = day.tripEvents.findIndex((event) => updateEvent.id === event.id);
      if (eventIndex !== -1) {
        dayContainUpdateEvent = day;
        updateEventIndex = eventIndex;
        break;
      }
    }

    if (updateEventIndex === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    dayContainUpdateEvent.tripEvents = [
      ...dayContainUpdateEvent.tripEvents.slice(0, updateEventIndex),
      updateEvent,
      ...dayContainUpdateEvent.tripEvents.slice(updateEventIndex + 1)
    ];

    this._updateDays(groupEventsByDays(this.getAllEvents()));

    this._notify(updateType, updateEvent);
  }

  addEvent(updateType, addEvent) {
    this._days[0].tripEvents = [
      addEvent,
      ...this._days[0].tripEvents];

    this._notify(updateType, addEvent);
  }

  deleteEvent(updateType, deleteEvent) {
    let dayContainDeleteEvent;
    let deleteEventIndex;

    for (let dayIndex = 0; dayIndex < this._days.length; dayIndex++) {
      const day = this._days[dayIndex];
      const eventIndex = day.tripEvents.findIndex((event) => deleteEvent.id === event.id);
      if (eventIndex !== -1) {
        dayContainDeleteEvent = day;
        deleteEventIndex = eventIndex;
        break;
      }
    }

    if (deleteEventIndex === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    dayContainDeleteEvent.tripEvents = [
      ...dayContainDeleteEvent.tripEvents.slice(0, deleteEventIndex),
      ...dayContainDeleteEvent.tripEvents.slice(deleteEventIndex + 1)
    ];

    this._updateDays(groupEventsByDays(this.getAllEvents()));

    this._notify(updateType);
  }

  static adaptEventToClient(event) {
    const adaptedEvent = {
      id: event.id,
      destination: event.destination.name,
      description: event.destination.description,
      isFavorite: event.is_favorite,
      offers: event.offers.map((offer) => ({
        title: offer.title,
        price: offer.price
      })),
      photos: event.destination.pictures.map((picture) => picture.src),
      price: event.base_price,
      time: {
        start: new Date(event.date_from).getTime(),
        end: new Date(event.date_to).getTime()
      },
      type: event.type
    };

    return adaptedEvent;
  }

  static adaptEventToServer(event) {
    const adaptedEvent = {
      'id': event.id,
      'base_price': parseInt(event.price, 10),
      'date_from': new Date(event.time.start).toISOString(),
      'date_to': new Date(event.time.end).toISOString(),
      'destination': {
        description: event.description,
        name: event.destination,
        pictures: event.photos.map((photoSrc) => ({
          src: photoSrc,
          description: ``,
        })),
      },
      'is_favorite': event.isFavorite,
      'offers': event.offers.map((offer) => ({
        title: offer.title,
        price: offer.price,
      })),
      'type': event.type,
    };

    return adaptedEvent;
  }
}
