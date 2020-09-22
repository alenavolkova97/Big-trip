import flatpickr from 'flatpickr';
import SmartView from './smart.js';
// import {getCurrentDate} from "../utils/task.js";

export default class Statistics extends SmartView {
  constructor() { // что передаем ?
    super();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return (
      `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
      </section>`
    );
  }

  restoreHandlers() {
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`.statistic__period-input`),
        {
          mode: `range`,
          dateFormat: `j F`,
          defaultDate: [this._data.dateFrom, this._data.dateTo],
          onChange: this._dateChangeHandler
        }
    );
  }

  _setCharts() {
    // Нужно отрисовать три графика
  }
}
