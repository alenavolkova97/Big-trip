import moment from 'moment';
import {MillisecondsInTimePeriod} from '../const.js';

export const makeItemsUniq = (items) => [...new Set(items)];

export const countMoneyForEventType = (events, type) => {
  const eventsForType = events.filter((event) => event.type === type);
  return eventsForType.reduce((counter, event) => counter + Number(event.price), 0);
};

export const countEventsByTransport = (events, transport) => {
  return events.filter((event) => event.type === transport).length;
};

export const countHoursForEventType = (events, type) => {
  const eventsForType = events.filter((event) => event.type === type);
  return eventsForType.reduce((counter, event) => counter + moment(event.time.end).diff(event.time.start), 0);
};

export const parseChartTime = (time) => time / MillisecondsInTimePeriod.HOUR;

