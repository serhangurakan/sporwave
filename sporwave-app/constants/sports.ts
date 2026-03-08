export const SPORTS_LIST = [
  { id: 'futbol', label: 'Futbol' },
  { id: 'basketbol', label: 'Basketbol' },
  { id: 'voleybol', label: 'Voleybol' },
  { id: 'tenis', label: 'Tenis' },
  { id: 'padel', label: 'Padel' },
  { id: 'yuzme', label: 'Yüzme' },
  { id: 'kosu', label: 'Koşu' },
  { id: 'bisiklet', label: 'Bisiklet' },
] as const;

export type SportId = typeof SPORTS_LIST[number]['id'];
