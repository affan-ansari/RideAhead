import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useTheme } from '../../../../contexts/ThemeContext';
import { AppTextInput } from '../../AppTextInput';

interface FormPasswordProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
}

export function FormPassword<T extends FieldValues>({
  name,
  control,
  label,
  error,
  placeholder,
  rules,
  ...textInputProps
}: FormPasswordProps<T>) {
  const { theme } = useTheme();
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              secureTextEntry={isSecure}
              hasError={!!error}
              style={styles.passwordInput}
              {...textInputProps}
            />
          )}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsSecure(!isSecure)}
        >
          <Text style={[styles.eyeText, { color: theme.colors.textSecondary }]}>
            {isSecure ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
