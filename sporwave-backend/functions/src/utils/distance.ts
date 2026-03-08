export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// District center coordinates for approximate distance calculation
export const DISTRICT_COORDS: Record<string, [number, number]> = {
  Kadıköy: [40.9903, 29.0301],
  Beşiktaş: [41.0422, 29.0082],
  Şişli: [41.0602, 28.9877],
  Ümraniye: [41.0169, 29.1171],
  Üsküdar: [41.0231, 29.0145],
  Çankaya: [39.9208, 32.8541],
  Keçiören: [39.9893, 32.8543],
  Mamak: [39.9271, 32.9052],
  Konak: [38.4189, 27.1287],
  Bornova: [38.4676, 27.2206],
  Karşıyaka: [38.4606, 27.1123],
};
