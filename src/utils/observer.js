export default class ObserverSubject {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((it) => it !== observer);
  }

  _notify(...args) {
    this._observers.forEach((observer) => observer(...args));
  }
}
