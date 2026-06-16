import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
};

export const SummaryCard = ({ title, amount, type }: Props) => {
  const color = type === 'income' ? colors.income : type === 'expense' ? colors.expense : colors.primary;
  const sign = type === 'income' ? '+' : type === 'expense' ? '-' : '';
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color }]}>
        {sign}${Math.abs(amount).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', marginBottom: 6 },
  amount: { fontSize: 18, fontWeight: '700' },
});
