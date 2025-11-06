import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { ButtonProps } from './types';
import { getSizeStyles, getVariantStyles } from './utils';

export const AppButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, theme);
  const sizeStyles = getSizeStyles(size, theme);

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      minHeight: sizeStyles.minHeight,
      borderRadius: sizeStyles.borderRadius,
    },
    fullWidth ? styles.fullWidth : styles.fitContent,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: variantStyles.textColor,
      fontSize: sizeStyles.fontSize,
      lineHeight: sizeStyles.fontSize * 1.4, // Add proper line height
    },
    isDisabled && { color: theme.colors.textSecondary },
    textStyle,
  ];

  const spinnerColor =
    variant === 'outline' || variant === 'ghost'
      ? theme.colors.primary
      : theme.colors.buttonText;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={spinnerColor}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <View style={[styles.icon, { marginRight: theme.spacing.xs }]}>
              {leftIcon}
            </View>
          )}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && (
            <View style={[styles.icon, { marginLeft: theme.spacing.xs }]}>
              {rightIcon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  fitContent: {
    alignSelf: 'flex-start',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppButton;
