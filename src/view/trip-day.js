import {tripDays} from '../main.js';

export const createTripDayTemplate = (tripDay) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${tripDays.indexOf(tripDay) + 1}</span>
        <time class="day__date" datetime="2019-03-18">${tripDay.date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};
