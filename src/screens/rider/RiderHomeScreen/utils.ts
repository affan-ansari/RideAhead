import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { Location, MapRegion } from '../../../zustand/mapSlice';

export const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') return;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'This app needs access to your location so it can show your position on the map.',
        buttonPositive: 'OK',
      },
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
export const getRegion = (
  pickupLocation: Location | undefined,
  dropoffLocation: Location | undefined,
): MapRegion | undefined => {
  // If neither location is present
  if (!pickupLocation && !dropoffLocation) {
    return undefined;
  }

  // If only pickup location is present
  if (pickupLocation?.coordinates && !dropoffLocation) {
    return {
      latitude: pickupLocation.coordinates.latitude,
      longitude: pickupLocation.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  // If only dropoff location is present
  if (dropoffLocation?.coordinates && !pickupLocation) {
    return {
      latitude: dropoffLocation.coordinates.latitude,
      longitude: dropoffLocation.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  // If both locations are present
  if (pickupLocation?.coordinates && dropoffLocation?.coordinates) {
    const minLat = Math.min(
      pickupLocation.coordinates.latitude,
      dropoffLocation.coordinates.latitude,
    );
    const maxLat = Math.max(
      pickupLocation.coordinates.latitude,
      dropoffLocation.coordinates.latitude,
    );
    const minLng = Math.min(
      pickupLocation.coordinates.longitude,
      dropoffLocation.coordinates.longitude,
    );
    const maxLng = Math.max(
      pickupLocation.coordinates.longitude,
      dropoffLocation.coordinates.longitude,
    );

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.5; // 1.5 adds padding
    const lngDelta = (maxLng - minLng) * 1.5;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  }

  return undefined;
};
