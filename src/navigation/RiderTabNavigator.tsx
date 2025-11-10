import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import RiderHomeStackNavigator from './RiderHomeStackNavigator';
import { CarTaxiFront, House } from 'lucide-react-native';
import { RiderHomeTabParamList } from './types';
import RiderBookingStackNavigator from './RiderBookingStackNavigator';

const Tab = createBottomTabNavigator<RiderHomeTabParamList>();

interface TabIconProps {
  color: string;
  size: number;
}

const HouseIcon = ({ color, size }: TabIconProps) => (
  <House color={color} size={size} />
);
const CarIcon = ({ color, size }: TabIconProps) => (
  <CarTaxiFront color={color} size={size} />
);

export default function RiderTabNavigator(): React.JSX.Element {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tab.Screen
        name="RiderHomeTab"
        component={RiderHomeStackNavigator}
        options={{
          tabBarIcon: HouseIcon,
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="RiderBookingsTab"
        component={RiderBookingStackNavigator}
        options={{
          tabBarIcon: CarIcon,
          headerShown: false,
          tabBarLabel: 'Bookings',
        }}
      />
    </Tab.Navigator>
  );
}
