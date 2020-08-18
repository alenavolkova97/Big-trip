export const createTripInfoTemplate = (allEvents) => {
  const destinationsWithRepeating = allEvents.map((tripEvent) => tripEvent.destination);
  const destinations = Array.from(new Set(destinationsWithRepeating));

  const createTripRoute = () => {
    return (destinations.length > 3) ?
      `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}` :
      destinations.join(` &mdash; `);
  };

  return ( // date ?
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createTripRoute()}</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>`
  );
};
