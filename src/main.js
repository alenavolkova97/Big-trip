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
import NoEventsView from './view/no-events.js';
import {generateTripDay} from './mock/trip-event.js';
import {getRandomInteger, RenderPosition, render} from './utils.js';

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
  let allEvents = [];

  days.forEach((day) => {
    allEvents = [...allEvents, ...day.tripEvents];
  });

  return allEvents;
};

const renderTripEvent = (tripListElement, event) => {
  const tripEventComponent = new TripEventView(event);
  let tripEventEditComponent;

  const replaceEventToForm = () => {
    tripListElement.replaceChild(tripEventEditComponent.getElement(), tripEventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    tripListElement.replaceChild(tripEventComponent.getElement(), tripEventEditComponent.getElement());
  };

  const onEscPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscPress);
    }
  };

  tripEventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    if (!tripEventEditComponent) {
      tripEventEditComponent = new TripEventEditView(event); // create component when click happen
    }
    replaceEventToForm();
    document.addEventListener(`keydown`, onEscPress);

    tripEventEditComponent.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
    });
  });

  render(tripListElement, tripEventComponent.getElement());
};

const allEvents = getAllEvents(tripDays);

render(siteMenuHeaderElement, new SiteMenuView().getElement(), RenderPosition.AFTEREND);
render(tripEventsFilterHeaderElement, new TripEventsFilterView().getElement(), RenderPosition.AFTEREND);
render(headerContainerElement, new TripInfoContainerView().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoContainerElement = headerContainerElement.querySelector(`.trip-info`);

render(tripInfoContainerElement, new TripPriceView().getElement());
// цена должна быть = 0 при пустом массиве allEvents

if (allEvents.length === 0) {
  render(tripEventsContainerElement, new NoEventsView().getElement());
} else {
  const tripDaysContainerComponent = new TripDaysContainerView();

  render(tripInfoContainerElement, new TripInfoView(allEvents).getElement(), RenderPosition.AFTERBEGIN);
  render(tripEventsContainerElement, new TripEventsSortingView().getElement());
  render(tripEventsContainerElement, tripDaysContainerComponent.getElement());

  tripDays.sort((a, b) => a.date - b.date).forEach((day, index) => {
    // render days and events in each day
    render(tripDaysContainerComponent.getElement(), new TripDayView(day).getElement());

    const tripDayElement = tripDaysContainerComponent.getElement().querySelector(`.day:nth-child(${index + 1})`);
    const tripEventsList = tripDayElement.querySelector(`.trip-events__list`);

    day.tripEvents.sort((a, b) => a.time.start - b.time.start).forEach((tripEvent) => {
      renderTripEvent(tripEventsList, tripEvent);
    });
  });
}
