import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { categoryColors } from '../theme/colors';

type Props = { category: string; size?: 'sm' | 'md' };

export const CategoryBadge = ({ category, size = 'md' }: Props) => {
  const color = categoryColors[category] || '#78909C';
  const isSmall = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }, isSmall && styles.badgeSm]}>
      <Text style={[styles.text, { color }, isSmall && styles.textSm]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  text: { fontSize: 13, fontWeight: '600' },
  textSm: { fontSize: 11 },
});
