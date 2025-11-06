import React from 'react';
import { StyleSheet, Text, View, TextInputProps } from 'react-native';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useTheme } from '../../../../contexts/ThemeContext';
import { AppTextInput } from '../../AppTextInput';

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  error,
  placeholder,
  rules,
  ...textInputProps
}: FormInputProps<T>) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
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
            hasError={!!error}
            {...textInputProps}
          />
        )}
      />
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
