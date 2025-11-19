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
  mapRegion: MapRegion | null;

  // Pickup and Dropoff locations (with place details)
  pickupLocation: Location | null;
  dropoffLocation: Location | null;

  // Route data
  routeCoordinates: Coordinate[];
  distance: string | null; // e.g., "5.2 km"
  duration: string | null; // e.g., "15 mins"

  // Map selection mode
  isSelectingPickupFromMap: boolean;
  pickupMarkerCoordinate: Coordinate | null;
  isSelectingDropoffFromMap: boolean;
  dropoffMarkerCoordinate: Coordinate | null;

  // Actions
  setUserLocation: (location: Coordinate | null) => void;
  setMapRegion: (region: MapRegion | null) => void;
  setPickupLocation: (location: Location | null) => void;
  setDropoffLocation: (location: Location | null) => void;
  setRouteCoordinates: (coordinates: Coordinate[]) => void;
  setRouteInfo: (distance: string | null, duration: string | null) => void;
  setIsSelectingPickupFromMap: (isSelecting: boolean) => void;
  setPickupMarkerCoordinate: (coordinate: Coordinate | null) => void;
  setIsSelectingDropoffFromMap: (isSelecting: boolean) => void;
  setDropoffMarkerCoordinate: (coordinate: Coordinate | null) => void;

  // Helper to clear ride-related state
  clearRideData: () => void;

  // Helper to reset all map state
  resetMapState: () => void;
}

export const createMapSlice: StateCreator<MapSlice> = set => ({
  // Initial state
  userLocation: null,
  mapRegion: null,
  pickupLocation: null,
  dropoffLocation: null,
  routeCoordinates: [],
  distance: null,
  duration: null,
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

  setRouteInfo: (distance, duration) => set({ distance, duration }),

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
      pickupLocation: null,
      dropoffLocation: null,
      routeCoordinates: [],
      distance: null,
      duration: null,
    }),

  // Reset everything
  resetMapState: () =>
    set({
      userLocation: null,
      mapRegion: null,
      pickupLocation: null,
      dropoffLocation: null,
      routeCoordinates: [],
      distance: null,
      duration: null,
    }),
});
