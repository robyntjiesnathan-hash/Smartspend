import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { colors } from '../theme/colors';

type Props = {
  transaction: Transaction;
  onDelete?: (id: string) => void;
};

export const TransactionItem = ({ transaction, onDelete }: Props) => {
  const isIncome = transaction.type === 'income';
  const date = new Date(transaction.date);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <CategoryBadge category={transaction.category} size="sm" />
        <Text style={styles.note} numberOfLines={1}>{transaction.note || transaction.category}</Text>
        <Text style={styles.date}>{dateStr}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(transaction.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  left: { flex: 1, marginRight: 12 },
  note: { fontSize: 14, color: colors.text, marginTop: 4, fontWeight: '500' },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '700' },
  deleteBtn: { marginTop: 4, padding: 2 },
  deleteText: { color: colors.error, fontSize: 12 },
});
