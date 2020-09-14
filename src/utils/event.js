export const sortEventsByTime = (eventA, eventB) => {
  return (eventB.time.end - eventB.time.start) - (eventA.time.end - eventA.time.start);
};

export const sortEventsByPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};
