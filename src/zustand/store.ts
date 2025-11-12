import { create } from 'zustand';
import { createMapSlice, MapSlice } from './mapSlice';

// Combine all slice types
type StoreState = MapSlice; // & OtherSlice...

export const useStore = create<StoreState>()((...a) => ({
  ...createMapSlice(...a),
}));
