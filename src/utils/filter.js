import {FilterType} from '../const.js';
import {isDateBefore, isDateAfter} from './event.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter((event) => isDateAfter(event.time.start, Date.now())),
  [FilterType.PAST]: (events) => events.filter((event) => isDateBefore(event.time.end, Date.now()))
};
