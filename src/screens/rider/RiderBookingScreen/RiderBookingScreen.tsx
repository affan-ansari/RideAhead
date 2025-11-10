import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaComponent } from '../../../components/shared/SafeAreaComponent';
import { Theme, useTheme } from '../../../contexts/ThemeContext';
import { useMemo } from 'react';
import { AppButton } from '../../../components/shared/AppButton';
import { signOut } from '../../../services/auth';

export const RiderBookingScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaComponent>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>RIDER Bookings</Text>
        </View>
        <AppButton variant="danger" title="Sign Out" onPress={signOut} />
      </ScrollView>
    </SafeAreaComponent>
  );
};

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 30,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });
};
