export function buildMapsUrl(restaurant, userCoords) {
  const hasRestaurantCoords =
    restaurant.latitude && restaurant.longitude;

  const destination = hasRestaurantCoords
    ? `${restaurant.latitude},${restaurant.longitude}`
    : encodeURIComponent(
        `${restaurant.name} ${restaurant.area} ${restaurant.location}`
      );

  const origin = userCoords
    ? `${userCoords.latitude},${userCoords.longitude}`
    : null;

  let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  if (origin) {
    url += `&origin=${origin}`;
  }

  return url;
}
