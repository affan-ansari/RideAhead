import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {
  FormattedCoordinate,
  getRoute,
  MapRegion,
} from '../../../services/geoApi';
import { DEFAULT_REGION } from '../../../utils/constants';
import { AppButton } from '../../../components/shared/AppButton';
import { SafeAreaComponent } from '../../../components/shared/SafeAreaComponent';

export const RiderHomeScreen = () => {
  const [_userLocation, setUserLocation] = useState<null | MapRegion>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [selectingLocation, setSelectingLocation] = useState<
    null | 'start' | 'end'
  >(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    FormattedCoordinate[]
  >([]);
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);
  // const [originLocation, setOriginLocation] = useState(null);
  // const [destinationLocation, setDestinationLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      getCurrentLocation();
    }
  }, [hasLocationPermission]);

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

  const getCurrentLocation = () => {
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
      await getRoute(startLocation, endLocation);
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
    setStartLocation(null);
    setEndLocation(null);
    setSelectingLocation(null);
    setRouteCoordinates([]);
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
          // onRegionChangeComplete={region => {
          //   console.log('Region changed:', region);
          // }}
        >
          {/* Start Location Marker */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#4285F4"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}
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
              fullWidth
              variant={selectingLocation === 'start' ? 'secondary' : 'primary'}
              onPress={handleStartSelection}
            />
            <AppButton
              title={endLocation ? '✓ End Set' : 'Pick Destinaation'}
              fullWidth
              onPress={handleEndSelection}
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
