import {getRandomInteger} from '../utils.js';
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

const generateEventType = () => {
  const types = ARRIVALS.concat(MOVEMENTS);

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateEventDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generateTime = () => {
  const maxHoursGap = 12;
  const maxMinutesGap = 60;
  const hoursGap = getRandomInteger(0, maxHoursGap);
  const minutesGap = getRandomInteger(0, maxMinutesGap);
  const currentDate = new Date();

  currentDate.setHours(currentDate.getHours() + hoursGap);
  currentDate.setMinutes(currentDate.getMinutes() + minutesGap);

  return currentDate;
};

const generateEventTypeOffers = () => {
  const offers = new Array(getRandomInteger(0, 5))
  .fill()
  .map(() => OFFERS[getRandomInteger(0, OFFERS.length - 1)]);

  return offers;
};

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
    type: generateEventType(),
    destination: generateEventDestination(),
    time: {
      start: generateTime(),
      end: generateTime()
    },
    price: getRandomInteger(1, 1000),
    offers: generateEventTypeOffers(),
    description: generateEventDestinationDescription(),
    photos: generateEventPhotos()
  };
};

export const generateTripDay = () => {
  return {
    date: Date.now(),
    tripEvents: new Array(getRandomInteger(1, 10)).fill().map(generateTripEvent)
  };
};
