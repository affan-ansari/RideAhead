import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AuthNavigator from './AuthNavigator';
import RiderTabNavigator from './RiderTabNavigator';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

export default function AppNavigator(): React.JSX.Element {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Return appropriate navigator based on auth status
  return isAuthenticated ? <RiderTabNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
