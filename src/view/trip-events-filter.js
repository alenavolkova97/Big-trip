import AbstractView from './abstract.js';

export default class TripEventsFilter extends AbstractView {
  constructor(filters, currentFilter) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return (
      `<form class="trip-filters" action="#" method="get">
      ${this._filters
        .map((filter) => this._createFilterItemTemplate(filter, this._currentFilter))
        .join(``)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _createFilterItemTemplate(filter, currentFilter) {
    const {type, name} = filter;

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden"
          type="radio" name="trip-filter" value="${type}" ${type === currentFilter ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
      </div>`
    );
  }

  _filterTypeChangeHandler(evt) {
    this._callback.filterTypeChange(evt.target.value);
  }
}
