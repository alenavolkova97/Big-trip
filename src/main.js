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
import {generateTripEvent} from './mock/trip-event.js';
import {arrivals} from './mock/trip-event.js';

const TRIP_EVENT_COUNT = 15;
const tripEvents = new Array(TRIP_EVENT_COUNT).fill().map(generateTripEvent);
console.log(tripEvents);

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

render(headerContainerElement, createTripInfoContainerTemplate(), `afterbegin`);

const tripInfoContainerElement = headerContainerElement.querySelector(`.trip-info`);

render(tripInfoContainerElement, createTripInfoTemplate(), `beforeend`);
render(tripInfoContainerElement, createTripPriceTemplate(), `beforeend`);
render(siteMenuHeaderElement, createSiteMenuTemplate(), `afterend`);
render(tripEventsFilterHeaderElement, createTripEventsFilterTemplate(), `afterend`);
render(tripEventsContainerElement, createTripEventsSorting(), `beforeend`);
render(tripEventsContainerElement, createTripDaysContainerTemplate(), `beforeend`);

const tripDaysContainerElement = tripEventsContainerElement.querySelector(`.trip-days`);

render(tripDaysContainerElement, createTripDayTemplate(), `beforeend`);

const tripsEventsList = tripDaysContainerElement.querySelector(`.trip-events__list`);

render(tripsEventsList, createTripEventEditTemplate(), `beforeend`);

for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
  render(tripsEventsList, createTripEventTemplate(tripEvents[i]), `beforeend`);
}

