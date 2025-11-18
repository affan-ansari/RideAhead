import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { DEFAULT_REGION } from '../../../utils/constants';
import { SafeAreaComponent } from '../../../components/shared/SafeAreaComponent';
import { useStore } from '../../../zustand/store';
import { SheetManager } from 'react-native-actions-sheet';
import { requestLocationPermission } from './utils';

export const RiderHomeScreen = () => {
  // Get state and actions from Zustand store
  const mapRegion = useStore(state => state.mapRegion);

  useEffect(() => {
    requestLocationPermission();
    SheetManager.show('location-picker-sheet');
  }, []);

  const handleMapPress = () => {
    SheetManager.show('location-picker-sheet');
  };
  const handlePanDrag = () => {
    SheetManager.hide('location-picker-sheet');
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
          onPanDrag={handlePanDrag}
        />
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
