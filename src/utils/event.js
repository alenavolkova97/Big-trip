import moment from "moment";
import Mode from '../presenter/event.js';

const MillisecondsInTimePeriod = {
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000
};

export const sortEventsByTime = (eventA, eventB) => {
  const eventADuration = eventA.time.end - eventA.time.start;
  const eventBDuration = eventB.time.end - eventB.time.start;

  return eventBDuration - eventADuration;
};

export const sortEventsByPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};

export const formatEventDate = (date, mode) => {
  if (mode === Mode.DEFAULT) {
    return moment(date).format(`HH:mm`);
  } else if (mode === Mode.EDITING) {
    return moment(date).format(`DD/MM/YYYY HH:mm`); // ?
  } else {
    return ``;
  }
};

export const formatDate = (date) => {
  return moment(date).format(`MMM DD`);
};

export const formatEventDuration = (startDate, endDate) => {
  const startEventDate = moment(startDate);
  const endEventDate = moment(endDate); // ?
  // const startEventDate = moment(`Sat Sep 19 2020 07:40:33 GMT+0300 (Москва, стандартное время)`);
  // const endEventDate = moment(`Sat Sep 19 2020 07:40:33 GMT+0300 (Москва, стандартное время)`);
  const differenceInMilliseconds = endEventDate.diff(startEventDate, `milliseconds`);

  // return moment.utc(endEventDate.diff(startEventDate)).format(`DD[d] HH[h] mm[m]`);

  if (differenceInMilliseconds < MillisecondsInTimePeriod.HOUR) {
    return moment.utc(endEventDate.diff(startEventDate)).format(`mm[m]`);
  } else if (differenceInMilliseconds < MillisecondsInTimePeriod.DAY) {
    return moment.utc(endEventDate.diff(startEventDate)).format(`HH[h] mm[m]`);
  } else if (differenceInMilliseconds >= MillisecondsInTimePeriod.DAY) {
    return moment.utc(endEventDate.diff(startEventDate)).format(`DD[d] HH[h] mm[m]`);
  } else {
    return ``;
  }
};
