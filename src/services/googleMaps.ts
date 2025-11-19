import { GOOGLE_PLACES_API_KEY } from '@env';
import { Coordinate, Location } from '../zustand/mapSlice';

export const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`,
    );

    const data = await response.json();

    if (data.result?.geometry?.location) {
      return {
        latitude: data.result.geometry.location.lat,
        longitude: data.result.geometry.location.lng,
      };
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
  return undefined;
};

export const fetchPlaceSuggestions = async (query: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_PLACES_API_KEY}&components=country:pk`, // Adjust country code as needed
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching place predictions:', error);
  }
  return undefined;
};

export const fetchPlaceFromCoordinates = async (
  coordinate: Coordinate,
): Promise<Location | undefined> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${GOOGLE_PLACES_API_KEY}`,
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      return {
        placeId: place.place_id,
        description: place.formatted_address,
        coordinates: place.geometry
          ? {
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }
          : undefined,
      };
    }
  } catch (error) {
    console.error('Error fetching place from coordinates:', error);
  }
  return undefined;
};
