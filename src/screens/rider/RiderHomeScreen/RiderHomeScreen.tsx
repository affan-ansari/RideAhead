import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { DEFAULT_REGION } from '../../../utils/constants';
import { SafeAreaComponent } from '../../../components/shared/SafeAreaComponent';
import { useStore } from '../../../zustand/store';
import { SheetManager } from 'react-native-actions-sheet';
import { getRegion, requestLocationPermission } from './utils';

export const RiderHomeScreen = () => {
  const mapRef = useRef<MapView>(null);
  const mapRegion = useStore(state => state.mapRegion);
  const pickupLocation = useStore(state => state.pickupLocation);
  const dropoffLocation = useStore(state => state.dropoffLocation);
  const isSelectingPickupFromMap = useStore(
    state => state.isSelectingPickupFromMap,
  );
  const pickupMarkerCoordinate = useStore(
    state => state.pickupMarkerCoordinate,
  );
  const setPickupMarkerCoordinate = useStore(
    state => state.setPickupMarkerCoordinate,
  );

  const isSelectingDropoffFromMap = useStore(
    state => state.isSelectingDropoffFromMap,
  );
  const dropoffMarkerCoordinate = useStore(
    state => state.dropoffMarkerCoordinate,
  );
  const setDropoffMarkerCoordinate = useStore(
    state => state.setDropoffMarkerCoordinate,
  );

  useEffect(() => {
    requestLocationPermission();
    SheetManager.show('location-picker-sheet');
  }, []);

  useEffect(() => {
    const region = getRegion(pickupLocation, dropoffLocation);
    if (region && mapRef.current) {
      mapRef.current.animateToRegion(region, 500); // 500ms animation duration
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupLocation?.placeId, dropoffLocation?.placeId]);

  const handlePanDragStart = () => {
    SheetManager.hide('location-picker-sheet');
  };
  const handlePanDragEnd = () => {
    SheetManager.show('location-picker-sheet');
  };

  const handleMapPress = useCallback(
    (e: any) => {
      SheetManager.show('location-picker-sheet');
      const coordinate = e.nativeEvent.coordinate;
      if (isSelectingPickupFromMap) {
        setPickupMarkerCoordinate(coordinate);
      } else if (isSelectingDropoffFromMap) {
        setDropoffMarkerCoordinate(coordinate);
      }
    },
    [
      isSelectingDropoffFromMap,
      isSelectingPickupFromMap,
      setDropoffMarkerCoordinate,
      setPickupMarkerCoordinate,
    ],
  );

  const handleMarkerDragEnd = useCallback(
    (e: any) => {
      const coordinate = e.nativeEvent.coordinate;
      if (isSelectingPickupFromMap) {
        setPickupMarkerCoordinate(coordinate);
      } else if (isSelectingDropoffFromMap) {
        setDropoffMarkerCoordinate(coordinate);
      }
    },
    [
      isSelectingDropoffFromMap,
      isSelectingPickupFromMap,
      setDropoffMarkerCoordinate,
      setPickupMarkerCoordinate,
    ],
  );

  return (
    <SafeAreaComponent>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={mapRegion || DEFAULT_REGION}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          onRegionChangeStart={handlePanDragStart}
          onRegionChangeComplete={handlePanDragEnd}
          onPress={handleMapPress}
        >
          {pickupMarkerCoordinate && (
            <Marker
              pinColor="red"
              coordinate={pickupMarkerCoordinate}
              draggable={isSelectingPickupFromMap}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
          {dropoffMarkerCoordinate && (
            <Marker
              pinColor="blue"
              coordinate={dropoffMarkerCoordinate}
              draggable={isSelectingDropoffFromMap}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </MapView>
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
});
