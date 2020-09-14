export const sortEventsByTime = (eventA, eventB) => {
  const eventADuration = eventA.time.end - eventA.time.start;
  const eventBDuration = eventB.time.end - eventB.time.start;

  return eventBDuration - eventADuration;
};

export const sortEventsByPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};
