import Observer from '../utils/observer.js';

export default class Days extends Observer {
  constructor() {
    super();
    this._days = [];
  }

  setDays(days) {
    this._days = days.slice();
  }

  getDays() {
    return this._days;
  }

  getAllEvents() {
    return this._days.reduce((events, day) => [...events, ...day.tripEvents], []);
  }

  _updateDay(day, dayIndex) {
    this._days = [
      ...this._days.slice(0, dayIndex),
      day,
      ...this._days.slice(dayIndex + 1)
    ];
  }

  updateEvent(updateType, updateEvent) {
    let dayContainUpdateEvent;
    let dayContainUpdateEventIndex;
    let updateEventIndex;

    for (let dayIndex = 0; dayIndex < this._days.length; dayIndex++) {
      const day = this._days[dayIndex];
      const eventIndex = day.tripEvents.findIndex((event) => updateEvent.id === event.id);
      if (eventIndex !== -1) {
        dayContainUpdateEvent = day;
        dayContainUpdateEventIndex = dayIndex;
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

    this._updateDay(dayContainUpdateEvent, dayContainUpdateEventIndex);

    this._notify(updateType, updateEvent);
  }

  addEvent(updateType, addEvent) { // форма создания новой точки в начале списка ?
    this._days[0].tripEvents = [
      addEvent,
      ...this._days[0].tripEvents];

    this._notify(updateType, addEvent);
  }

  deleteEvent(updateType, deleteEvent) {
    let dayContainDeleteEvent;
    let dayContainDeleteEventIndex;
    let deleteEventIndex;

    for (let dayIndex = 0; dayIndex < this._days.length; dayIndex++) {
      const day = this._days[dayIndex];
      const eventIndex = day.tripEvents.findIndex((event) => deleteEvent.id === event.id);
      if (eventIndex !== -1) {
        dayContainDeleteEvent = day;
        dayContainDeleteEventIndex = dayIndex;
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

    this._updateDay(dayContainDeleteEvent, dayContainDeleteEventIndex);

    this._notify(updateType);
  }
}
