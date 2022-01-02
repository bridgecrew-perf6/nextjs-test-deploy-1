import type { Location } from './types';

export const LOCATIONS: Record<string, Location> = {
  singapore: {
    key: 'singapore',
    lat: 1.285194,
    lng: 103.8522982,
  },
  london: {
    key: 'london',
    lat: 51.5049375,
    lng: -0.0964509
  },
};

export const DEFAULT_OFFICE = LOCATIONS.singapore.key;

export const MIN_DRIVERS_COUNT = 5;
export const DRIVERS_MIN_ZOOM = 11;
export const DRIVERS_MAX_ZOOM = 20;

export const MAX_DRIVERS_ZOOM = 16;

export const ZOOM_TO_MAX_DRIVERS_MAP: Record<number, number> = {
  [DRIVERS_MIN_ZOOM]: MIN_DRIVERS_COUNT,
  12: 7,
  13: 10,
  14: 20,
  15: 40,
  [MAX_DRIVERS_ZOOM]: 50,
  17: 30,
  18: 20,
  19: 10,
  [DRIVERS_MAX_ZOOM]: MIN_DRIVERS_COUNT,
};
