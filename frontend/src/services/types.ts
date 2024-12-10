export type Region = {
  name: string;
  type: string;
  coordinates: [number, number][][];
};

export type GeoDistance = {
  lat: number;
  lng: number;
  maxDistance: number;
  filterUserId?: boolean;
};

export type GeoPoint = {
  lat: number;
  lng: number;
};
