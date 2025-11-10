import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RiderHomeStackParamList } from './types';
import { RiderHomeScreen } from '../screens/rider/RiderHomeScreen';

const Stack = createNativeStackNavigator<RiderHomeStackParamList>();

export default function RiderHomeStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RiderHome"
        component={RiderHomeScreen}
        options={{ headerShown: false }}
      />
      {/* Only Home-specific screens here */}
    </Stack.Navigator>
  );
}
