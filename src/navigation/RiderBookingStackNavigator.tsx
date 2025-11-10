import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RiderBookingStackParamList } from './types';
import { RiderBookingScreen } from '../screens/rider/RiderBookingScreen';

const Stack = createNativeStackNavigator<RiderBookingStackParamList>();

export default function RiderBookingStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RiderBookings"
        component={RiderBookingScreen}
        options={{ headerShown: false }}
      />
      {/* Only Home-specific screens here */}
    </Stack.Navigator>
  );
}
