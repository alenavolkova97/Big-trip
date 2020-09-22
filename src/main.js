import SiteMenuView from './view/site-menu.js';
import {generateTripDay} from './mock/trip-event.js';
import {getRandomInteger} from './utils/common.js';
import {RenderPosition, render} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import InfoPresenter from './presenter/info.js';
import FilterPresenter from './presenter/filter.js';
import DaysModel from './model/days.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import {MenuItem} from "./const.js";

export const tripDays = new Array(getRandomInteger(1, 6)).fill().map(generateTripDay);

const headerElement = document.querySelector(`.page-header`);
const headerContainerElement = headerElement.querySelector(`.trip-main`);
const tripControlsContainerElement = headerContainerElement.querySelector(`.trip-controls`);
const siteMenuHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(1)`);
const tripEventsFilterHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(2)`);
const mainElement = document.querySelector(`main`);
const tripEventsContainerElement = mainElement.querySelector(`.trip-events`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const daysModel = new DaysModel();
daysModel.setDays(tripDays);

const offersModel = new OffersModel(); // куда ее передавать и как в саму модель передать оферы ?
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(tripEventsFilterHeaderElement, filterModel);
const tripPresenter = new TripPresenter(tripEventsContainerElement, daysModel, filterModel);
const infoPresenter = new InfoPresenter(headerContainerElement, daysModel);

const menuComponent = new SiteMenuView();

render(siteMenuHeaderElement, menuComponent, RenderPosition.AFTEREND);

const handleEventNewFormOpen = () => {
  newEventButton.disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      console.log(`table`);
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATS:
      console.log(`stats`);
      // Скрыть доску
      // Показать статистику
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
infoPresenter.init();
tripPresenter.init();

newEventButton.addEventListener(`click`, (evt) => {
  evt.target.disabled = true;
  tripPresenter.createEvent(handleEventNewFormOpen);
});


