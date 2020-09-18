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
}
