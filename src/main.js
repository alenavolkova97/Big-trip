import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import {generateTripDay} from './mock/trip-event.js';
import {getRandomInteger} from './utils/common.js';
import {RenderPosition, render, remove} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import InfoPresenter from './presenter/info.js';
import FilterPresenter from './presenter/filter.js';
import DaysModel from './model/days.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType, FilterType} from './const.js';
import Api from './api.js';

export const tripDays = new Array(getRandomInteger(1, 1)).fill().map(generateTripDay);
// временно 1 день
const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const headerElement = document.querySelector(`.page-header`);
const headerContainerElement = headerElement.querySelector(`.trip-main`);
const tripControlsContainerElement = headerContainerElement.querySelector(`.trip-controls`);
const siteMenuHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(1)`);
const tripEventsFilterHeaderElement = tripControlsContainerElement.querySelector(`h2:nth-child(2)`);
const mainElement = document.querySelector(`main`);
const pageContainerElement = mainElement.querySelector(`.page-body__container`);
const tripEventsContainerElement = mainElement.querySelector(`.trip-events`);
const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

const api = new Api(END_POINT, AUTHORIZATION);

api.getEvents().then((events) => {
  console.log(events);
});

const daysModel = new DaysModel();
daysModel.setDays(tripDays);

const offersModel = new OffersModel(); // куда ее передавать и как в саму модель передать оферы ?
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(tripEventsFilterHeaderElement, filterModel);
const tripPresenter = new TripPresenter(tripEventsContainerElement, daysModel, filterModel);
const infoPresenter = new InfoPresenter(headerContainerElement, daysModel);

const menuComponent = new SiteMenuView(MenuItem.TABLE);

render(siteMenuHeaderElement, menuComponent, RenderPosition.AFTEREND);

const handleEventNewFormOpen = () => {
  newEventButtonElement.disabled = false;
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);

      tripPresenter.init();

      pageContainerElement.classList.add(`page-body__container`);

      break;

    case MenuItem.STATS:
      tripPresenter.destroy();

      remove(statisticsComponent);
      statisticsComponent = new StatisticsView(daysModel.getAllEvents());

      render(pageContainerElement, statisticsComponent);

      pageContainerElement.classList.remove(`page-body__container`);

      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
infoPresenter.init();
tripPresenter.init();

newEventButtonElement.addEventListener(`click`, (evt) => {
  evt.target.disabled = true;

  remove(statisticsComponent);
  tripPresenter.destroy();

  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING); // сброс сортировки ?

  if (!pageContainerElement.classList.contains(`page-body__container`)) {
    pageContainerElement.classList.add(`page-body__container`);
  }

  tripPresenter.init();
  tripPresenter.createEvent(handleEventNewFormOpen);
});


