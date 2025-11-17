import { registerSheet } from 'react-native-actions-sheet';
import { LocationPickerSheet } from './LocationPickerSheet';
import { Coordinate } from '../zustand/mapSlice';

registerSheet('location-picker-sheet', LocationPickerSheet);

// Export the type for TypeScript support
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'location-picker-sheet': {
      payload: {
        onOriginSelect?: (location: any) => void;
        onDestinationSelect?: (location: any) => void;
        pickUpLocation?: Coordinate | null;
      };
    };
  }
}

export {};
