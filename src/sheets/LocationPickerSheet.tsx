import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';

export function LocationPickerSheet(
  props: SheetProps<'location-picker-sheet'>,
) {
  console.log(props);
  return (
    <ActionSheet
      isModal={false}
      backgroundInteractionEnabled
      snapPoints={[30]}
      gestureEnabled
      closable={false}
      disableDragBeyondMinimumSnapPoint
    >
      <View style={styles.container}>
        <Text>I always stay at the bottom</Text>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '70%',
  },
});
