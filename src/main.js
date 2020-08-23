import TripInfoContainerView from './view/trip-info-container.js';
import TripInfoView from './view/trip-info.js';
import TripPriceView from './view/trip-price.js';
import SiteMenuView from './view/site-menu.js';
import TripEventsFilterView from './view/trip-events-filter.js';
import TripEventsSortingView from './view/trip-events-sorting.js';
import TripDaysContainerView from './view/trip-days-container.js';
import TripDayView from './view/trip-day.js';
import TripEventEditView from './view/trip-event-edit.js';
import TripEventView from './view/trip-event.js';
import {generateTripDay} from './mock/trip-event.js';
import {getRandomInteger, RenderPosition, renderElement} from './utils.js';

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

renderElement(headerContainerElement, new TripInfoContainerView().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoContainerElement = headerContainerElement.querySelector(`.trip-info`);
const allEvents = getAllEvents(tripDays);

renderElement(tripInfoContainerElement, new TripInfoView(allEvents).getElement());
renderElement(tripInfoContainerElement, new TripPriceView().getElement());
renderElement(siteMenuHeaderElement, new SiteMenuView().getElement(), RenderPosition.AFTEREND);
renderElement(tripEventsFilterHeaderElement, new TripEventsFilterView().getElement(), RenderPosition.AFTEREND);
renderElement(tripEventsContainerElement, new TripEventsSortingView().getElement());

const tripDaysContainerComponent = new TripDaysContainerView();
// создать переменную tripDaysContainerElement ?

renderElement(tripEventsContainerElement, tripDaysContainerComponent.getElement());

tripDays.sort((a, b) => a.date - b.date).forEach((day, index) => {
  // render days and events in each day
  renderElement(tripDaysContainerComponent.getElement(), new TripDayView(day).getElement());

  const tripDay = tripDaysContainerComponent.getElement().querySelector(`.day:nth-child(${index + 1})`);
  const tripEventsList = tripDay.querySelector(`.trip-events__list`);

  day.tripEvents.sort((a, b) => a.time.start - b.time.start).forEach((tripEvent) => {
    renderElement(tripEventsList, new TripEventView(tripEvent).getElement());
  });
});

const theFirstTripDay = tripDaysContainerComponent.getElement().querySelector(`.day:nth-child(1)`);
const theFirstDayTripEventsList = theFirstTripDay.querySelector(`.trip-events__list`);

renderElement(theFirstDayTripEventsList, new TripEventEditView(allEvents[0]).getElement(), RenderPosition.AFTERBEGIN);
