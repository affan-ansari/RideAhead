import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export type RiderHomeStackParamList = {
  RiderHome: undefined;
};

export type RiderBookingStackParamList = {
  RiderBookings: undefined;
};

export type RiderHomeTabParamList = {
  RiderHomeTab: NavigatorScreenParams<RiderHomeStackParamList>;
  RiderBookingsTab: NavigatorScreenParams<RiderBookingStackParamList>;
};
