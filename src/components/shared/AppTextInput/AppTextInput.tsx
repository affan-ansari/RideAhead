import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

interface AppTextInputProps extends TextInputProps {
  hasError?: boolean;
}

export const AppTextInput = React.forwardRef<TextInput, AppTextInputProps>(
  ({ hasError, style, ...textInputProps }, ref) => {
    const { theme } = useTheme();

    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: hasError ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...textInputProps}
      />
    );
  },
);

AppTextInput.displayName = 'AppTextInput';

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
