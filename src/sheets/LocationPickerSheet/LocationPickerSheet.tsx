import React, { useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { useStore } from '../../zustand/store';
import {
  fetchPlaceDetails,
  fetchPlaceSuggestions,
} from '../../services/googleMaps';
import { formatSuggestions } from './utils';
import { LabeledAutocomplete } from '../../components/shared/LabeledAutoComplete';

export function LocationPickerSheet() {
  const sheetRef = useRef<ActionSheetRef>(null);
  const setPickupLocation = useStore(state => state.setPickupLocation);
  const setDropoffLocation = useStore(state => state.setDropoffLocation);
  const pickupLocation = useStore(state => state.pickupLocation);
  const dropoffLocation = useStore(state => state.dropoffLocation);

  const handleChangeText = useCallback(async (query: string) => {
    const data = await fetchPlaceSuggestions(query);
    return formatSuggestions(data);
  }, []);

  const handlePickupSelectItem = useCallback(
    async (item: AutocompleteDropdownItem | null) => {
      if (!item) {
        setPickupLocation(null);
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

      // Snap back down after selection
      sheetRef.current?.snapToIndex(0);
    },
    [setPickupLocation],
  );

  const handleDropoffSelectItem = useCallback(
    async (item: AutocompleteDropdownItem | null) => {
      if (!item) {
        setDropoffLocation(null);
        return;
      }
      // Fetch coordinates for the selected place
      const coordinates = await fetchPlaceDetails(item.id);

      // Update the store with the selected location
      setDropoffLocation({
        placeId: item.id,
        description: item.title || '',
        coordinates,
      });

      // Snap back down after selection
      sheetRef.current?.snapToIndex(0);
    },
    [setDropoffLocation],
  );

  const handlePickupClear = useCallback(() => {
    setPickupLocation(null);
  }, [setPickupLocation]);

  const handleDropoffClear = useCallback(() => {
    setDropoffLocation(null);
  }, [setDropoffLocation]);

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

  return (
    <ActionSheet
      ref={sheetRef}
      isModal={false}
      backgroundInteractionEnabled
      snapPoints={[30, 80]}
      // initialSnapIndex={0}
      gestureEnabled
      closable={false}
      disableDragBeyondMinimumSnapPoint
    >
      <View style={styles.container}>
        <LabeledAutocomplete
          label="From"
          placeholder="Search pickup location..."
          initialValue={initialPickupValue}
          onChangeText={handleChangeText}
          onSelectItem={handlePickupSelectItem}
          onClear={handlePickupClear}
          onFocus={handleFocus}
          initialSuggestions={[
            { id: 'choose_from_map', title: 'Choose From Map' },
          ]}
          emptyResultText="No locations found"
        />

        <LabeledAutocomplete
          label="To"
          placeholder="Search dropoff location..."
          initialValue={initialDropoffValue}
          onChangeText={handleChangeText}
          onSelectItem={handleDropoffSelectItem}
          onClear={handleDropoffClear}
          onFocus={handleFocus}
          initialSuggestions={[
            { id: 'choose_from_map', title: 'Choose From Map' },
          ]}
          emptyResultText="No locations found"
        />
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
