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
import {
  EMAIL_RULE,
  FULL_NAME_RULE,
  PASSOWRD_RULE,
  PHONE_NUMBER_RULE,
} from '../../../utils/rules';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../../navigation/types';
import { signUpWithEmail } from '../../../services/auth';

interface SignupFormData {
  displayName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const SignupScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    defaultValues: {
      displayName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<AuthStackNavigationProp>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    const { success, message } = await signUpWithEmail({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber,
    });

    if (success) {
      Alert.alert(
        'Success',
        'Account created successfully! Please Login to continue',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } else {
      Alert.alert('Unable to Sign Up', message);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>
          <View style={styles.form}>
            <FormInput
              name="displayName"
              control={control}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={errors.displayName?.message}
              rules={FULL_NAME_RULE}
            />
            <FormInput
              name="email"
              control={control}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              rules={EMAIL_RULE}
            />
            <FormInput
              name="phoneNumber"
              control={control}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.phoneNumber?.message}
              rules={PHONE_NUMBER_RULE}
            />
            <FormPassword
              name="password"
              control={control}
              placeholder="Enter your password"
              error={errors.password?.message}
              rules={PASSOWRD_RULE}
            />
            <FormPassword
              name="confirmPassword"
              control={control}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              rules={{
                required: 'Please confirm your password',
                validate: (value: string) =>
                  value === password || 'Passwords do not match',
              }}
            />
            <AppButton
              title="Sign Up"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
      paddingTop: 40,
      paddingBottom: 40,
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
    loginLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
};
