import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, fontSize, fontWeight } from '../../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: Props) {
  const bg =
    variant === 'primary' ? colors.primary :
    variant === 'danger' ? colors.danger : colors.surfaceAlt;
  const fg = variant === 'primary' ? colors.primaryText : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <Text style={[styles.text, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  text: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});