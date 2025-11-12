import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { getRoute } from '../../../services/geoApi';
import { DEFAULT_REGION } from '../../../utils/constants';
import { AppButton } from '../../../components/shared/AppButton';
import { SafeAreaComponent } from '../../../components/shared/SafeAreaComponent';
import { useStore } from '../../../zustand/store';

export const RiderHomeScreen = () => {
  // Get state and actions from Zustand store
  // const userLocation = useStore((state) => state.userLocation);
  const startLocation = useStore(state => state.startLocation);
  const endLocation = useStore(state => state.endLocation);
  const routeCoordinates = useStore(state => state.routeCoordinates);
  const mapRegion = useStore(state => state.mapRegion);

  const setUserLocation = useStore(state => state.setUserLocation);
  const setStartLocation = useStore(state => state.setStartLocation);
  const setEndLocation = useStore(state => state.setEndLocation);
  const setRouteCoordinates = useStore(state => state.setRouteCoordinates);
  const setMapRegion = useStore(state => state.setMapRegion);
  const resetMapState = useStore(state => state.resetMapState);

  // Keep local state only for UI-specific concerns
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [selectingLocation, setSelectingLocation] = useState<
    null | 'start' | 'end'
  >(null);

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', latitude, longitude);
        setUserLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      error => {
        console.error('Location error:', error);
        Alert.alert('Error', 'Could not get your location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [setUserLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      getCurrentLocation();
    }
  }, [hasLocationPermission, getCurrentLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      setHasLocationPermission(true);
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to show you on the map',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        setHasLocationPermission(true);
      } else {
        console.log('Location permission denied');
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your position on the map',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;

    if (selectingLocation === 'start') {
      setStartLocation(coordinate);
      setSelectingLocation(null);
    } else if (selectingLocation === 'end') {
      setEndLocation(coordinate);
      setSelectingLocation(null);
    }
  };

  const handleStartSelection = () => {
    setSelectingLocation('start');
  };

  const handleEndSelection = () => {
    setSelectingLocation('end');
  };

  const getMapRoute = async () => {
    if (startLocation && endLocation) {
      const { formattedCoordinates, startPoint, endPoint } = await getRoute(
        startLocation,
        endLocation,
      );
      setMapRegion({
        latitude: (startPoint.latitude + endPoint.latitude) / 2,
        longitude: (startPoint.longitude + endPoint.longitude) / 2,
        latitudeDelta: Math.abs(startPoint.latitude - endPoint.latitude) * 1.5,
        longitudeDelta:
          Math.abs(startPoint.longitude - endPoint.longitude) * 1.5,
      });
      setRouteCoordinates(formattedCoordinates);
    }
  };

  const clearRoute = () => {
    // Use the reset function from the store
    resetMapState();
    setSelectingLocation(null);
  };

  return (
    <SafeAreaComponent>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={mapRegion || DEFAULT_REGION}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          onPress={handleMapPress}
        >
          {/* Polyline for route */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#4285F4"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Start Location Marker */}
          {startLocation && (
            <Marker
              coordinate={startLocation}
              title="Start Location"
              description="Your starting point"
              pinColor="green"
            />
          )}

          {/* End Location Marker */}
          {endLocation && (
            <Marker
              coordinate={endLocation}
              title="Destination"
              description="Your destination"
              pinColor="red"
            />
          )}
        </MapView>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <View style={styles.btnContainer}>
            <AppButton
              title={startLocation ? '✓ Start Set' : 'Pick Start'}
              variant={selectingLocation === 'start' ? 'secondary' : 'primary'}
              onPress={handleStartSelection}
              fullWidth
            />
            <AppButton
              title={endLocation ? '✓ End Set' : 'Pick Destination'}
              variant={selectingLocation === 'end' ? 'secondary' : 'primary'}
              onPress={handleEndSelection}
              fullWidth
            />

            {startLocation && endLocation && (
              <AppButton fullWidth title="Get Route" onPress={getMapRoute} />
            )}

            {(startLocation || endLocation) && (
              <AppButton fullWidth title="Clear Route" onPress={clearRoute} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  btnContainer: {
    display: 'flex',
    gap: 10,
  },
});
