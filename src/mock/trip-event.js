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

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

const generateEventDestinationDescription = () => {
  // вариант 2 с циклом
  // const randomQuantity = getRandomInteger(1, 5);
  // const ChosenDestinationDescriptionParts = [];

  // for (let i = 0; i < randomQuantity; i++) {
  //   const randomIndex = getRandomInteger(0, DESTINATION_DESCRIPTION_PARTS.length - 1);
  //   ChosenDestinationDescriptionParts.push(DESTINATION_DESCRIPTION_PARTS[randomIndex]);
  // }

  const ChosenDestinationDescriptionParts = new Array(getRandomInteger(1, 5))
    .fill()
    .map(() => DESTINATION_DESCRIPTION_PARTS[getRandomInteger(0, DESTINATION_DESCRIPTION_PARTS.length - 1)]);

  return ChosenDestinationDescriptionParts.join(` `);
};

const generateEventPhotos = () => {
  const photos = new Array(getRandomInteger(1, 10)) //  кол-во фото? возврат массива?
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return photos;
};

export const generateTripEvent = () => {
  return {
    type: generateEventType(),
    destination: generateEventDestination(),
    price: getRandomInteger(1, 1000), // ограничения?
    // options:
    description: generateEventDestinationDescription(),
    photos: generateEventPhotos()
  };
};
