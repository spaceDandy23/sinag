import { Text, type TextProps } from 'react-native';
import { colors, typography } from '@/constants/theme';

export function SinagText({ variant = 'body', style, ...props }: TextProps & { variant?: keyof typeof typography }) {
  return <Text style={[typography[variant], { color: colors.textPrimary }, style]} {...props} />;
}
