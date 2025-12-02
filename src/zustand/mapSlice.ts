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

export type Location = {
  placeId: string;
  description: string;
  coordinates?: Coordinate;
};

export interface MapSlice {
  // User's current location
  userLocation: Coordinate | null;

  // Map region/viewport
  mapRegion: MapRegion | undefined;

  // Pickup and Dropoff locations (with place details)
  pickupLocation: Location | undefined;
  dropoffLocation: Location | undefined;

  // Route data
  routeCoordinates: Coordinate[];

  // Map selection mode
  isSelectingPickupFromMap: boolean;
  pickupMarkerCoordinate: Coordinate | null;
  isSelectingDropoffFromMap: boolean;
  dropoffMarkerCoordinate: Coordinate | null;

  // Actions
  setUserLocation: (location: Coordinate | null) => void;
  setMapRegion: (region: MapRegion | undefined) => void;
  setPickupLocation: (location: Location | undefined) => void;
  setDropoffLocation: (location: Location | undefined) => void;
  setRouteCoordinates: (coordinates: Coordinate[]) => void;
  setIsSelectingPickupFromMap: (isSelecting: boolean) => void;
  setPickupMarkerCoordinate: (
    coordinate: Coordinate | null | undefined,
  ) => void;
  setIsSelectingDropoffFromMap: (isSelecting: boolean) => void;
  setDropoffMarkerCoordinate: (
    coordinate: Coordinate | null | undefined,
  ) => void;

  // Helper to clear ride-related state
  clearRideData: () => void;

  // Helper to reset all map state
  resetMapState: () => void;
}

export const createMapSlice: StateCreator<MapSlice> = set => ({
  // Initial state
  userLocation: null,
  mapRegion: undefined,
  pickupLocation: undefined,
  dropoffLocation: undefined,
  routeCoordinates: [],
  isSelectingPickupFromMap: false,
  pickupMarkerCoordinate: null,
  isSelectingDropoffFromMap: false,
  dropoffMarkerCoordinate: null,

  // Actions
  setUserLocation: location => set({ userLocation: location }),

  setMapRegion: region => set({ mapRegion: region }),

  setPickupLocation: location => set({ pickupLocation: location }),

  setDropoffLocation: location => set({ dropoffLocation: location }),

  setRouteCoordinates: coordinates => set({ routeCoordinates: coordinates }),

  setIsSelectingPickupFromMap: isSelecting =>
    set({ isSelectingPickupFromMap: isSelecting }),

  setPickupMarkerCoordinate: coordinate =>
    set({ pickupMarkerCoordinate: coordinate }),

  setIsSelectingDropoffFromMap: isSelecting =>
    set({ isSelectingDropoffFromMap: isSelecting }),

  setDropoffMarkerCoordinate: coordinate =>
    set({ dropoffMarkerCoordinate: coordinate }),

  // Clear only ride-related data (keep user location and map region)
  clearRideData: () =>
    set({
      pickupLocation: undefined,
      dropoffLocation: undefined,
      routeCoordinates: [],
    }),

  // Reset everything
  resetMapState: () =>
    set({
      userLocation: null,
      mapRegion: undefined,
      pickupLocation: undefined,
      dropoffLocation: undefined,
      routeCoordinates: [],
    }),
});
