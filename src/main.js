import {createTripInfoContainerTemplate} from './view/trip-info-container.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripEventsFilterTemplate} from './view/trip-events-filter.js';
import {createTripEventsSorting} from './view/trip-events-sorting.js';
import {createTripDaysContainerTemplate} from './view/trip-days-container.js';
import {createTripDayTemplate} from './view/trip-day.js';
import {createTripEventEditTemplate} from './view/trip-event-edit.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {generateTripDay} from './mock/trip-event.js';
import {getRandomInteger} from './utils.js';

export const tripDays = new Array(getRandomInteger(1, 6)).fill().map(generateTripDay);
// may be from 1 to 6 days (mock number)

const headerElement = document.querySelector(`.page-header`);
const headerContainerElement = headerElement.querySelector(`.trip-main`);
const tripControlsContainerElement = headerContainerElement.querySelector(`.trip-controls`);
const siteMenuHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(1)`);
const tripEventsFilterHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(2)`);
const mainElement = document.querySelector(`main`);
const tripEventsContainerElement = mainElement.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getAllEvents = (days) => {
  let allEvents = [];

  for (let i = 0; i < days.length; i++) {
    allEvents = [...allEvents, ...days[i].tripEvents];
  }

  return allEvents;
};

render(headerContainerElement, createTripInfoContainerTemplate(), `afterbegin`);

const tripInfoContainerElement = headerContainerElement.querySelector(`.trip-info`);

render(tripInfoContainerElement, createTripInfoTemplate(getAllEvents(tripDays)), `beforeend`);
render(tripInfoContainerElement, createTripPriceTemplate(), `beforeend`);
render(siteMenuHeaderElement, createSiteMenuTemplate(), `afterend`);
render(tripEventsFilterHeaderElement, createTripEventsFilterTemplate(), `afterend`);
render(tripEventsContainerElement, createTripEventsSorting(), `beforeend`);
render(tripEventsContainerElement, createTripDaysContainerTemplate(), `beforeend`);

const tripDaysContainerElement = tripEventsContainerElement.querySelector(`.trip-days`);

for (let i = 0; i < tripDays.length; i++) { // render days and events in each day
  render(tripDaysContainerElement, createTripDayTemplate(tripDays[i]), `beforeend`);

  let tripDay = tripDaysContainerElement.querySelector(`.day:nth-child(${i + 1})`);
  let tripEventsList = tripDay.querySelector(`.trip-events__list`);

  for (let j = 0; j < tripDays[i].tripEvents.length; j++) {
    render(tripEventsList, createTripEventTemplate(tripDays[i].tripEvents[j]), `beforeend`);
  }
}

const theFirstTripDay = tripDaysContainerElement.querySelector(`.day:nth-child(1)`);
const theFirstDayTripEventsList = theFirstTripDay.querySelector(`.trip-events__list`);

render(theFirstDayTripEventsList, createTripEventEditTemplate(getAllEvents(tripDays)[0]), `afterbegin`);
