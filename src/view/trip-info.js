export const createTripInfoTemplate = (allEvents) => {
  const destinationsWithRepeating = allEvents.map((tripEvent) => tripEvent.destination);
  const destinations = Array.from(new Set(destinationsWithRepeating));

  const createTripRoute = () => {
    return (destinations.length > 3) ?
      `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}` :
      destinations.join(` &mdash; `);
  };

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createTripRoute()}</h1>

      <p class="trip-info__dates">${allEvents[0].time.start}&nbsp;&mdash;&nbsp;${allEvents[allEvents.length - 1].time.end}</p>
    </div>`
  );
};
