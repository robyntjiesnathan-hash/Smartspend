import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionItem } from '../components/TransactionItem';
import { colors } from '../theme/colors';

export const DashboardScreen = () => {
  const { transactions, deleteTransaction } = useApp();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>Here's your financial summary</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={[styles.balanceAmount, { color: balance >= 0 ? '#FFFFFF' : '#FFCDD2' }]}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard title="Income" amount={totalIncome} type="income" />
        <View style={styles.cardGap} />
        <SummaryCard title="Expenses" amount={totalExpense} type="expense" />
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {recent.length === 0 ? (
        <Text style={styles.empty}>No transactions yet. Add one!</Text>
      ) : (
        recent.map(t => (
          <TransactionItem key={t.id} transaction={t} onDelete={deleteTransaction} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  greeting: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginTop: 6 },
  summaryRow: { flexDirection: 'row', marginBottom: 20 },
  cardGap: { width: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 },
});
