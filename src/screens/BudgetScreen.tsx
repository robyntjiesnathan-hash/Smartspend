import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { useApp } from '../context/AppContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { colors, categoryColors } from '../theme/colors';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'];

export const BudgetScreen = () => {
  const { transactions, budgets, setBudget } = useApp();
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [limitInput, setLimitInput] = useState('');

  const now = new Date();
  const currentMonthExpenses = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const getSpent = (category: string) =>
    currentMonthExpenses.filter(t => t.category === category).reduce((s, t) => s + t.amount, 0);

  const getBudget = (category: string) => budgets.find(b => b.category === category);

  const handleSave = async () => {
    if (!editCategory) return;
    const num = parseFloat(limitInput);
    if (!isNaN(num) && num > 0) {
      await setBudget({ category: editCategory, limit: num });
    }
    setEditCategory(null);
    setLimitInput('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Monthly Budget</Text>
      <Text style={styles.subtitle}>Track your spending limits per category</Text>

      {CATEGORIES.map(cat => {
        const budget = getBudget(cat);
        const spent = getSpent(cat);
        const limit = budget?.limit ?? 0;
        const progress = limit > 0 ? Math.min(spent / limit, 1) : 0;
        const over = limit > 0 && spent > limit;
        const color = categoryColors[cat] || colors.primary;

        return (
          <View key={cat} style={styles.card}>
            <View style={styles.cardHeader}>
              <CategoryBadge category={cat} />
              <TouchableOpacity onPress={() => { setEditCategory(cat); setLimitInput(limit ? limit.toString() : ''); }}>
                <Text style={styles.editBtn}>{limit ? 'Edit' : 'Set Limit'}</Text>
              </TouchableOpacity>
            </View>
            {limit > 0 ? (
              <>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: over ? colors.error : color }]} />
                </View>
                <View style={styles.statsRow}>
                  <Text style={[styles.spent, { color: over ? colors.error : colors.text }]}>
                    ${spent.toFixed(2)} spent
                  </Text>
                  <Text style={styles.limit}>of ${limit.toFixed(2)}</Text>
                </View>
                {over && <Text style={styles.overBudget}>Over budget by ${(spent - limit).toFixed(2)}</Text>}
              </>
            ) : (
              <Text style={styles.noLimit}>No budget set. Tap "Set Limit" to add one.</Text>
            )}
          </View>
        );
      })}

      <Modal visible={!!editCategory} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget for {editCategory}</Text>
            <TextInput
              style={styles.modalInput}
              value={limitInput}
              onChangeText={setLimitInput}
              keyboardType="decimal-pad"
              placeholder="Monthly limit"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditCategory(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 16, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editBtn: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  progressBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  spent: { fontSize: 14, fontWeight: '600' },
  limit: { fontSize: 14, color: colors.textSecondary },
  overBudget: { color: colors.error, fontSize: 12, marginTop: 4, fontWeight: '500' },
  noLimit: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14, fontSize: 16, color: colors.text, marginBottom: 16 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelText: { color: colors.textSecondary, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});
