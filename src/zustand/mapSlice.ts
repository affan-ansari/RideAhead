import { StateCreator } from 'zustand';

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export interface MapSlice {
  userLocation: Coordinate | null;
  startLocation: Coordinate | null;
  endLocation: Coordinate | null;
  routeCoordinates: Coordinate[];
  mapRegion: MapRegion | null;

  setUserLocation: (location: Coordinate | null) => void;
  setStartLocation: (location: Coordinate | null) => void;
  setEndLocation: (location: Coordinate | null) => void;
  setRouteCoordinates: (coordinates: Coordinate[]) => void;
  setMapRegion: (region: MapRegion | null) => void;

  // Optional: Helper to clear all map state
  resetMapState: () => void;
}

export const createMapSlice: StateCreator<MapSlice> = set => ({
  userLocation: null,
  startLocation: null,
  endLocation: null,
  routeCoordinates: [],
  mapRegion: null,

  setUserLocation: location => set({ userLocation: location }),
  setStartLocation: location => set({ startLocation: location }),
  setEndLocation: location => set({ endLocation: location }),
  setRouteCoordinates: coordinates => set({ routeCoordinates: coordinates }),
  setMapRegion: region => set({ mapRegion: region }),

  resetMapState: () =>
    set({
      startLocation: null,
      endLocation: null,
      routeCoordinates: [],
      mapRegion: null,
    }),
});
