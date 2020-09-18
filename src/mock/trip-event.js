import {getRandomInteger} from '../utils/common.js';
import {ARRIVALS} from '../const.js';
import {MOVEMENTS} from '../const.js';

export const DESTINATIONS = [`Amsterdam`, `Chamonix`, `Geneva`, `Paris`, `Barselona`,
  `Berlin`, `Minsk`, `Kiev`, `Helsinki`];

const DESTINATION_DESCRIPTION_PARTS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

export const OFFERS = [
  {
    type: `flight`,
    key: `luggage`,
    title: `Add luggage`,
    price: 30,
    isChecked: true
  },
  {
    type: `flight`,
    key: `comfort`,
    title: `Switch to comfort class`,
    price: 100,
    isChecked: true
  },
  {
    type: `flight`,
    key: `meal`,
    title: `Add meal`,
    price: 15,
    isChecked: false
  },
  {
    type: `flight`,
    key: `seats`,
    title: `Choose seats`,
    price: 5,
    isChecked: false
  },
  {
    type: `flight`,
    key: `train`,
    title: `Travel by train`,
    price: 40,
    isChecked: false
  }
];

const generateId = () => {
  return Date.now() + parseInt(Math.random() * 10000, 10);
};

const generateEventType = () => {
  const types = ARRIVALS.concat(MOVEMENTS);

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateEventDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const timeGeneratorCreator = (minDelta, maxDelta) => {
  let startTime = Date.now();

  let delta = null;

  if (!maxDelta) {
    delta = minDelta;
  } else {
    delta = getRandomInteger(minDelta, maxDelta);
  }

  return function () {
    startTime += delta;

    return startTime; // было new Date(startTime)
  };
};

const generateEventTime = timeGeneratorCreator(1 * 60 * 60 * 1000, 2 * 60 * 60 * 1000);

const generateDayTime = timeGeneratorCreator(24 * 60 * 60 * 1000);

const generateEventDestinationDescription = () => {
  const ChosenDestinationDescriptionParts = new Array(getRandomInteger(1, 5))
    .fill()
    .map(() => DESTINATION_DESCRIPTION_PARTS[getRandomInteger(0, DESTINATION_DESCRIPTION_PARTS.length - 1)]);

  return ChosenDestinationDescriptionParts.join(` `);
};

const generateEventPhotos = () => {
  const photos = new Array(getRandomInteger(1, 10))
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return photos;
};

export const generateTripEvent = () => {
  return {
    id: generateId(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: generateEventType(),
    destination: generateEventDestination(),
    time: {
      start: generateEventTime(),
      end: generateEventTime() + getRandomInteger(0, 1 * 60 * 60 * 1000) // ?
    },
    price: getRandomInteger(1, 1000),
    offers: OFFERS.map((offer) => Object.assign({}, offer)),
    description: generateEventDestinationDescription(),
    photos: generateEventPhotos()
  };
};

export const generateTripDay = () => {
  return {
    date: generateDayTime(),
    tripEvents: new Array(getRandomInteger(1, 10)).fill().map(generateTripEvent)
  };
};
