import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaComponent } from '../../../components/shared/SafeAreaComponent';
import { AppButton } from '../../../components/shared/AppButton';
import {
  FormInput,
  FormPassword,
} from '../../../components/shared/FormComponents';
import { Theme, useTheme } from '../../../contexts/ThemeContext';
import { useMemo } from 'react';
import { EMAIL_RULE } from '../../../utils/rules';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../../navigation/types';
import { signInWithEmail } from '../../../services/auth';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<AuthStackNavigationProp>();

  const onSubmit = async (data: LoginFormData) => {
    const { loggedIn, message } = await signInWithEmail(data);
    if (loggedIn) {
      // Navigate to your main app screen after successful login
      // navigation.navigate('MainApp');
      Alert.alert('Logged In', message);
    } else {
      Alert.alert('Unable to Login', message);
    }
  };

  return (
    <SafeAreaComponent>
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
          <View style={styles.form}>
            <FormInput
              name="email"
              control={control}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              rules={EMAIL_RULE}
            />
            <FormPassword
              name="password"
              control={control}
              placeholder="Enter your password"
              error={errors.password?.message}
            />
            <AppButton
              title="Sign In"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    form: {
      gap: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    signupLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
};
