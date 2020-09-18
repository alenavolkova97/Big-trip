import SiteMenuView from './view/site-menu.js';
import TripEventsFilterView from './view/trip-events-filter.js';
import {generateTripDay} from './mock/trip-event.js';
import {getRandomInteger} from './utils/common.js';
import {RenderPosition, render} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import InfoPresenter from './presenter/info.js';
import DaysModel from './model/days.js';
import OffersModel from './model/offers.js';

export const tripDays = new Array(getRandomInteger(1, 6)).fill().map(generateTripDay);

const headerElement = document.querySelector(`.page-header`);
const headerContainerElement = headerElement.querySelector(`.trip-main`);
const tripControlsContainerElement = headerContainerElement.querySelector(`.trip-controls`);
const siteMenuHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(1)`);
const tripEventsFilterHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(2)`);
const mainElement = document.querySelector(`main`);
const tripEventsContainerElement = mainElement.querySelector(`.trip-events`);

const daysModel = new DaysModel();
daysModel.setDays(tripDays);

const offersModel = new OffersModel(); // куда ее передавать и как в саму модель передать оферы ?

const tripPresenter = new TripPresenter(tripEventsContainerElement, daysModel);
const infoPresenter = new InfoPresenter(headerContainerElement, daysModel);

render(siteMenuHeaderElement, new SiteMenuView(), RenderPosition.AFTEREND);
render(tripEventsFilterHeaderElement, new TripEventsFilterView(), RenderPosition.AFTEREND);


infoPresenter.init();
tripPresenter.init();

// для проверки правильности работы поиска индекса нужного события - УДАЛИТЬ
// console.log(tripDays);

// const update = tripDays[0].tripEvents[0];

// let dayContainUpdateEvent;
// let updateEventIndex;

// for (let dayIndex = 0; dayIndex < tripDays.length; dayIndex++) {
//   const day = tripDays[dayIndex];
//   const eventIndex = day.tripEvents.findIndex((event) => update.id === event.id);
//   if (eventIndex !== -1) {
//     dayContainUpdateEvent = day;
//     updateEventIndex = eventIndex;
//     break;
//   }
// }

// console.log(dayContainUpdateEvent, updateEventIndex);

