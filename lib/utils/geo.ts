export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 *
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180);
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const RADIUS_OPTIONS = [1, 3, 5, 10, 25, 50] as const;
export type RadiusOption = typeof RADIUS_OPTIONS[number];
