import React, { useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
} from 'react-native-actions-sheet';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { useStore } from '../../zustand/store';
import {
  fetchPlaceDetails,
  fetchPlaceFromCoordinates,
  fetchPlaceSuggestions,
} from '../../services/googleMaps';
import { formatSuggestions } from './utils';
import { LabeledAutocomplete } from '../../components/shared/LabeledAutoComplete';
import { AppButton } from '../../components/shared/AppButton';

export function LocationPickerSheet() {
  const sheetRef = useRef<ActionSheetRef>(null);
  const setPickupLocation = useStore(state => state.setPickupLocation);
  const setDropoffLocation = useStore(state => state.setDropoffLocation);
  const setIsSelectingPickupFromMap = useStore(
    state => state.setIsSelectingPickupFromMap,
  );
  const isSelectingPickupFromMap = useStore(
    state => state.isSelectingPickupFromMap,
  );
  const setIsSelectingDropoffFromMap = useStore(
    state => state.setIsSelectingDropoffFromMap,
  );
  const isSelectingDropoffFromMap = useStore(
    state => state.isSelectingDropoffFromMap,
  );
  const pickupLocation = useStore(state => state.pickupLocation);
  const dropoffLocation = useStore(state => state.dropoffLocation);
  const pickupMarkerCoordinate = useStore(
    state => state.pickupMarkerCoordinate,
  );
  const setPickupMarkerCoordinate = useStore(
    state => state.setPickupMarkerCoordinate,
  );
  const dropoffMarkerCoordinate = useStore(
    state => state.dropoffMarkerCoordinate,
  );
  const setDropoffMakrerCoordinate = useStore(
    state => state.setDropoffMarkerCoordinate,
  );

  const handleChangeText = useCallback(async (query: string) => {
    const data = await fetchPlaceSuggestions(query);
    return formatSuggestions(data);
  }, []);

  const handlePickupSelectItem = useCallback(
    async (item: AutocompleteDropdownItem | null) => {
      if (!item) {
        return;
      }

      if (item.id === 'choose_from_map') {
        setIsSelectingPickupFromMap(true);
        SheetManager.hide('location-picker-sheet');
        return;
      }

      // Fetch coordinates for the selected place
      const coordinates = await fetchPlaceDetails(item.id);

      // Update the store with the selected location
      setPickupLocation({
        placeId: item.id,
        description: item.title || '',
        coordinates,
      });
      setPickupMarkerCoordinate(coordinates);

      // Snap back down after selection
      sheetRef.current?.snapToIndex(0);
    },
    [setPickupLocation, setPickupMarkerCoordinate, setIsSelectingPickupFromMap],
  );

  const handleDropoffSelectItem = useCallback(
    async (item: AutocompleteDropdownItem | null) => {
      if (!item) {
        return;
      }

      if (item.id === 'choose_from_map') {
        setIsSelectingDropoffFromMap(true);
        SheetManager.hide('location-picker-sheet');
        return;
      }
      // Fetch coordinates for the selected place
      const coordinates = await fetchPlaceDetails(item.id);
      setDropoffMakrerCoordinate(coordinates);

      // Update the store with the selected location
      setDropoffLocation({
        placeId: item.id,
        description: item.title || '',
        coordinates,
      });

      // Snap back down after selection
      sheetRef.current?.snapToIndex(0);
    },
    [
      setDropoffLocation,
      setDropoffMakrerCoordinate,
      setIsSelectingDropoffFromMap,
    ],
  );

  const handlePickupClear = useCallback(() => {
    setPickupLocation(undefined);
    setPickupMarkerCoordinate(null);
  }, [setPickupLocation, setPickupMarkerCoordinate]);

  const handleDropoffClear = useCallback(() => {
    setDropoffLocation(undefined);
    setDropoffMakrerCoordinate(null);
  }, [setDropoffLocation, setDropoffMakrerCoordinate]);

  const handleFocus = () => {
    sheetRef.current?.snapToIndex(1);
  };

  const initialPickupValue = useMemo(() => {
    if (pickupLocation?.placeId) {
      return { id: pickupLocation.placeId, title: pickupLocation.description };
    }
  }, [pickupLocation]);

  const initialDropoffValue = useMemo(() => {
    if (dropoffLocation?.placeId) {
      return {
        id: dropoffLocation.placeId,
        title: dropoffLocation.description,
      };
    }
  }, [dropoffLocation]);

  const handleLocationFromMarker = async () => {
    if (isSelectingPickupFromMap && pickupMarkerCoordinate) {
      const result = await fetchPlaceFromCoordinates(pickupMarkerCoordinate);
      if (result) setPickupLocation(result);
      setIsSelectingPickupFromMap(false);
    } else if (isSelectingDropoffFromMap && dropoffMarkerCoordinate) {
      const result = await fetchPlaceFromCoordinates(dropoffMarkerCoordinate);
      if (result) setDropoffLocation(result);
      setIsSelectingDropoffFromMap(false);
    }
  };

  return (
    <ActionSheet
      ref={sheetRef}
      isModal={false}
      backgroundInteractionEnabled
      snapPoints={[30, 80]}
      gestureEnabled
      closable={!isSelectingPickupFromMap}
      disableDragBeyondMinimumSnapPoint
    >
      <View style={styles.container}>
        <LabeledAutocomplete
          label="From"
          value={pickupLocation?.description}
          placeholder="Search pickup location..."
          initialValue={initialPickupValue}
          onChangeText={handleChangeText}
          onSelectItem={handlePickupSelectItem}
          onClear={handlePickupClear}
          onFocus={handleFocus}
          initialSuggestions={
            isSelectingPickupFromMap
              ? null
              : [
                  {
                    id: 'choose_from_map',
                    title: 'Choose From Map',
                  },
                ]
          }
          emptyResultText="No locations found"
          disabled={isSelectingPickupFromMap || isSelectingDropoffFromMap}
          showClear={!isSelectingPickupFromMap && !isSelectingDropoffFromMap}
          showChevron={!isSelectingPickupFromMap && !isSelectingDropoffFromMap}
        />

        <LabeledAutocomplete
          label="To"
          value={dropoffLocation?.description}
          placeholder="Search dropoff location..."
          initialValue={initialDropoffValue}
          onChangeText={handleChangeText}
          onSelectItem={handleDropoffSelectItem}
          onClear={handleDropoffClear}
          onFocus={handleFocus}
          initialSuggestions={
            isSelectingPickupFromMap
              ? null
              : [
                  {
                    id: 'choose_from_map',
                    title: 'Choose From Map',
                  },
                ]
          }
          emptyResultText="No locations found"
          disabled={isSelectingPickupFromMap || isSelectingDropoffFromMap}
          showClear={!isSelectingPickupFromMap && !isSelectingDropoffFromMap}
          showChevron={!isSelectingPickupFromMap && !isSelectingDropoffFromMap}
        />

        {(isSelectingPickupFromMap || isSelectingDropoffFromMap) && (
          <AppButton
            fullWidth
            title={
              isSelectingPickupFromMap ? 'Confirm Pickup' : 'Confirm Drop off'
            }
            onPress={handleLocationFromMarker}
          />
        )}
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
    justifyContent: 'flex-start',
    gap: 15,
  },
});
