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
import {getRandomInteger, RenderPosition, renderTemplate, renderElement} from './utils.js';

export const tripDays = new Array(getRandomInteger(1, 6)).fill().map(generateTripDay);
// may be from 1 to 6 days (mock number)

const headerElement = document.querySelector(`.page-header`);
const headerContainerElement = headerElement.querySelector(`.trip-main`);
const tripControlsContainerElement = headerContainerElement.querySelector(`.trip-controls`);
const siteMenuHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(1)`);
const tripEventsFilterHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(2)`);
const mainElement = document.querySelector(`main`);
const tripEventsContainerElement = mainElement.querySelector(`.trip-events`);

const getAllEvents = (days) => {
  let allEvents = []; // не могу объявить как const, так как он меняется в цикле forEach

  days.forEach((day) => {
    allEvents = [...allEvents, ...day.tripEvents];
  });

  return allEvents;
};

renderTemplate(headerContainerElement, createTripInfoContainerTemplate(), RenderPosition.AFTERBEGIN);

const tripInfoContainerElement = headerContainerElement.querySelector(`.trip-info`);
const allEvents = getAllEvents(tripDays);

renderTemplate(tripInfoContainerElement, createTripInfoTemplate(allEvents));
renderTemplate(tripInfoContainerElement, createTripPriceTemplate());
renderTemplate(siteMenuHeaderElement, createSiteMenuTemplate(), `afterend`); // ?
renderTemplate(tripEventsFilterHeaderElement, createTripEventsFilterTemplate(), `afterend`); // ?
renderTemplate(tripEventsContainerElement, createTripEventsSorting());
renderTemplate(tripEventsContainerElement, createTripDaysContainerTemplate());

const tripDaysContainerElement = tripEventsContainerElement.querySelector(`.trip-days`);

tripDays.sort((a, b) => a.date - b.date).forEach((day, index) => {
  // render days and events in each day
  renderTemplate(tripDaysContainerElement, createTripDayTemplate(day));

  const tripDay = tripDaysContainerElement.querySelector(`.day:nth-child(${index + 1})`);
  const tripEventsList = tripDay.querySelector(`.trip-events__list`);

  day.tripEvents.sort((a, b) => a.time.start - b.time.start).forEach((tripEvent) => {
    renderTemplate(tripEventsList, createTripEventTemplate(tripEvent));
  });
});

const theFirstTripDay = tripDaysContainerElement.querySelector(`.day:nth-child(1)`);
const theFirstDayTripEventsList = theFirstTripDay.querySelector(`.trip-events__list`);

renderTemplate(theFirstDayTripEventsList, createTripEventEditTemplate(allEvents[0]), RenderPosition.AFTERBEGIN);
