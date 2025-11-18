import { GOOGLE_PLACES_API_KEY } from '@env';

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
