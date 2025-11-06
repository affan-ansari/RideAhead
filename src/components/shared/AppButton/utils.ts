import { Theme } from '../../../contexts/ThemeContext';
import { ButtonSize, ButtonVariant } from './types';

// Get variant colors
export const getVariantStyles = (variant: ButtonVariant, theme: Theme) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.primary,
        textColor: theme.colors.buttonText,
        borderColor: 'transparent',
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.secondary,
        textColor: theme.colors.text,
        borderColor: 'transparent',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        textColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        textColor: theme.colors.primary,
        borderColor: 'transparent',
      };
    case 'danger':
      return {
        backgroundColor: theme.colors.error,
        textColor: theme.colors.buttonText,
        borderColor: 'transparent',
      };
    case 'success':
      return {
        backgroundColor: theme.colors.success,
        textColor: theme.colors.buttonText,
        borderColor: 'transparent',
      };
    default:
      return {
        backgroundColor: theme.colors.primary,
        textColor: theme.colors.buttonText,
        borderColor: 'transparent',
      };
  }
};

// Get size styles
export const getSizeStyles = (size: ButtonSize, theme: Theme) => {
  switch (size) {
    case 'small':
      return {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        minHeight: 36,
        fontSize: theme.fontSize.sm,
        borderRadius: theme.borderRadius.sm,
      };
    case 'medium':
      return {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 44,
        fontSize: theme.fontSize.md,
        borderRadius: theme.borderRadius.md,
      };
    case 'large':
      return {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 58,
        fontSize: theme.fontSize.lg,
        borderRadius: theme.borderRadius.lg,
      };
    default:
      return {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 44,
        fontSize: theme.fontSize.md,
        borderRadius: theme.borderRadius.md,
      };
  }
};
