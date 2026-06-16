import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { P, THEMES, fmt } from '../data/constants';

type Filter = 'all' | 'income' | 'expense';

const CAT_ICON: Record<string, string> = {
  Groceries: '🛒', Transport: '🚗', Entertainment: '🎬',
  'Dining Out': '🍽️', Health: '❤️', Shopping: '🛍️',
  Bills: '📄', Other: '📝', Income: '💰',
};

function fmtDate(d: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (d === today) return 'Today';
  if (d === yest) return 'Yesterday';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export function TransactionsScreen() {
  const { transactions, deleteTransaction, go, theme } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];
  const [filter, setFilter] = useState<Filter>('all');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filtered = [...transactions]
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => {
      const diff = new Date(b.date + 'T00:00:00').getTime() - new Date(a.date + 'T00:00:00').getTime();
      return diff !== 0 ? diff : b.id.localeCompare(a.id);
    });

  const groups: { label: string; items: typeof filtered }[] = [];
  filtered.forEach(t => {
    const label = fmtDate(t.date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(t);
    else groups.push({ label, items: [t] });
  });

  const confirmDelete = (id: string, note: string) => {
    Alert.alert(
      'Delete transaction',
      `Remove "${note}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: th.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => go('home')}>
          <Text style={s.backTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Transactions</Text>
        <View style={s.summaryRow}>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Income</Text>
            <Text style={[s.summaryVal, { color: P.lime }]}>+{fmt(totalIncome)}</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Expenses</Text>
            <Text style={[s.summaryVal, { color: P.coral }]}>-{fmt(totalExpense)}</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Net</Text>
            <Text style={[s.summaryVal, { color: balance >= 0 ? '#fff' : P.coral }]}>
              {balance >= 0 ? '' : '-'}{fmt(Math.abs(balance))}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={s.filterBar}>
        {(['all', 'income', 'expense'] as Filter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterBtn, filter === f && { backgroundColor: th.primary }]}
            onPress={() => setFilter(f)}>
            <Text style={[s.filterTxt, filter === f && { color: '#fff' }]}>
              {f === 'all' ? 'All' : f === 'income' ? '↑ Income' : '↓ Expenses'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ padding: 16, paddingBottom: 40 }}>
        {groups.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 42, marginBottom: 12 }}>📭</Text>
            <Text style={s.emptyTitle}>No transactions yet</Text>
            <Text style={s.emptySub}>Tap the + button to log your first one</Text>
            <TouchableOpacity style={[s.emptyBtn, { backgroundColor: th.primary }]} onPress={() => go('add')}>
              <Text style={s.emptyBtnTxt}>+ Log transaction</Text>
            </TouchableOpacity>
          </View>
        ) : groups.map(g => (
          <View key={g.label}>
            <Text style={s.groupLabel}>{g.label}</Text>
            {g.items.map(tx => (
              <View key={tx.id} style={s.txnCard}>
                <View style={[s.txnIcon, { backgroundColor: tx.type === 'income' ? '#DCF5E7' : '#F5F5F5' }]}>
                  <Text style={{ fontSize: 20 }}>{CAT_ICON[tx.category] || '📝'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.txnNote} numberOfLines={1}>{tx.note}</Text>
                  <Text style={s.txnCat}>{tx.category}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={[s.txnAmt, { color: tx.type === 'income' ? P.greenDeep : P.dark }]}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </Text>
                  <TouchableOpacity
                    style={s.deleteBtn}
                    onPress={() => confirmDelete(tx.id, tx.note)}>
                    <Text style={s.deleteTxt}>✕ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 20 },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 7, alignSelf: 'flex-start', marginBottom: 14,
  },
  backTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryBox: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 14, padding: 11, alignItems: 'center',
  },
  summaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  summaryVal: { fontSize: 14, fontWeight: '900' },
  filterBar: { flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 4 },
  filterBtn: { flex: 1, borderRadius: 12, paddingVertical: 9, alignItems: 'center', backgroundColor: '#E4EDE4' },
  filterTxt: { fontSize: 12, fontWeight: '800', color: P.muted },
  groupLabel: {
    fontSize: 11, fontWeight: '800', color: P.muted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 10,
  },
  txnCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14, paddingHorizontal: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  txnIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  txnNote: { fontWeight: '800', fontSize: 13, color: P.dark, marginBottom: 2 },
  txnCat: { fontSize: 11, fontWeight: '600', color: P.muted },
  txnAmt: { fontSize: 14, fontWeight: '900' },
  deleteBtn: { backgroundColor: '#FFF0F0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  deleteTxt: { color: P.coral, fontSize: 10, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: P.dark, marginBottom: 6 },
  emptySub: { fontSize: 13, color: P.muted, fontWeight: '600', marginBottom: 24 },
  emptyBtn: { borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '900' },
});
