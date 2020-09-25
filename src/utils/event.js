import moment from 'moment';
import {MillisecondsInTimePeriod} from '../const.js';

export const sortEventsByTime = (eventA, eventB) => {
  const eventADuration = eventA.time.end - eventA.time.start;
  const eventBDuration = eventB.time.end - eventB.time.start;

  return eventBDuration - eventADuration;
};

export const sortEventsByPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};

export const formatEventDate = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatEventDuration = (startDate, endDate) => {
  const msDiff = Math.abs(endDate - startDate);

  const minuteInMs = MillisecondsInTimePeriod.MINUTE;
  const hourInMs = MillisecondsInTimePeriod.HOUR;
  const dayInMs = MillisecondsInTimePeriod.DAY;

  const days = Math.floor(msDiff / dayInMs);
  const hours = Math.floor((msDiff % dayInMs) / hourInMs);
  const minutes = Math.floor((msDiff % hourInMs) / minuteInMs);

  return [
    days > 0 ? `${days}d` : undefined,
    hours > 0 ? `${hours}h` : undefined,
    minutes > 0 ? `${minutes}m` : undefined
  ].filter(Boolean).join(` `);
};

export const isDateEqual = (dateA, dateB) => {
  return moment(dateA).isSame(dateB);
};

export const isDateBefore = (dateA, dateB) => {
  return moment(dateA).isBefore(dateB);
};

export const isDateAfter = (dateA, dateB) => {
  return moment(dateA).isAfter(dateB);
};

export const groupEventsByDays = (events) => {
  const daysMap = {};

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const dayTs = moment(new Date(event.time.start).getTime()).startOf(`day`).valueOf();

    if (!daysMap[dayTs]) {
      daysMap[dayTs] = [];
    }

    daysMap[dayTs].push(event);
  }

  const sortedDaysEntries = Object.entries(daysMap).sort((a, b) => a[0] - b[0]);

  return sortedDaysEntries.map(([date, tripEvents]) => ({
    date: parseInt(date, 10),
    tripEvents,
  }));
};
