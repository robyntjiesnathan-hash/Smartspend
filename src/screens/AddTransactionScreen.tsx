import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { colors } from '../theme/colors';
import { Transaction } from '../types';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'];

export const AddTransactionScreen = () => {
  const { addTransaction } = useApp();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: num,
      category,
      note: note.trim(),
      date: new Date(date).toISOString(),
    };
    await addTransaction(transaction);
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    Alert.alert('Success', 'Transaction added successfully!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>Income</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.border}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={styles.categoryOption}>
              <View style={[styles.categoryWrap, category === cat && styles.categorySelected]}>
                <CategoryBadge category={cat} size="sm" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note (optional)"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: type === 'income' ? colors.income : colors.error }]} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add {type === 'income' ? 'Income' : 'Expense'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  typeRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, padding: 4, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  typeBtnActiveExpense: { backgroundColor: colors.error },
  typeBtnActiveIncome: { backgroundColor: colors.income },
  typeBtnText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  typeBtnTextActive: { color: '#FFFFFF' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 28, fontWeight: '700', color: colors.text, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '700', color: colors.text },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryOption: {},
  categoryWrap: { borderRadius: 14, borderWidth: 2, borderColor: 'transparent', padding: 2 },
  categorySelected: { borderColor: colors.primary },
  input: { fontSize: 15, color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8 },
  submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  submitText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
