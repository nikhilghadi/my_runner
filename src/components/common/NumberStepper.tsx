import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme';

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: (v: number) => string;
  unit?: string;
};

export default function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  format,
  unit = '',
}: Props) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Pressable
          style={styles.btn}
          hitSlop={8}
          onPress={() => onChange(clamp(value - step))}
          onLongPress={() => onChange(clamp(value - step * 6))}
        >
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Text style={styles.value}>
          {format ? format(value) : String(value)}
          {unit}
        </Text>
        <Pressable
          style={styles.btn}
          hitSlop={8}
          onPress={() => onChange(clamp(value + step))}
          onLongPress={() => onChange(clamp(value + step * 6))}
        >
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: { color: colors.text, fontSize: fontSize.md },
  controls: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  value: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    fontVariant: ['tabular-nums'],
    minWidth: 100,
    textAlign: 'center',
  },
});