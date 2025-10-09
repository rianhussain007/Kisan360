type Coords = {
  lat: number;
  lon: number;
};

export function haversineDistance(coords1: Coords, coords2: Coords): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
  const dLon = (coords2.lon - coords1.lon) * Math.PI / 180;
  
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos(coords1.lat * Math.PI / 180) *
      Math.cos(coords2.lat * Math.PI / 180) *
      (1 - Math.cos(dLon))) /
      2;

  return R * 2 * Math.asin(Math.sqrt(a));
}
