import React, { useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { THEMES, P } from '../data/constants';

const CATS = ['Groceries', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Bills', 'Other'];

export function AddScreen() {
  const {
    addType, setAddType, addAmt, setAddAmt, addLabel, setAddLabel,
    addCat, setAddCat, addDone, streak, theme, doAdd, go,
  } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];

  // Auto-navigate home 2 s after a successful log
  useEffect(() => {
    if (!addDone) return;
    const timer = setTimeout(() => go('home'), 2000);
    return () => clearTimeout(timer);
  }, [addDone]);

  if (addDone) {
    return (
      <View style={[s.doneContainer, { backgroundColor: th.primary }]}>
        <Text style={{ fontSize: 72, marginBottom: 16 }}>✅</Text>
        <Text style={s.doneTitle}>Logged!</Text>
        <Text style={s.doneSub}>+25 XP added to your journey</Text>
        <View style={[s.streakBadge, { backgroundColor: th.accent }]}>
          <Text style={[s.streakTxt, { color: P.limeDark }]}>🔥 {streak}-day streak maintained!</Text>
        </View>
        <TouchableOpacity style={s.doneBackBtn} onPress={() => go('home')}>
          <Text style={s.doneBackTxt}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={[s.header, { backgroundColor: th.primary }]}>
          <View style={s.headerNav}>
            <TouchableOpacity style={s.backBtn} onPress={() => go('home')}>
              <Text style={s.backBtnTxt}>← Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.headerSub}>Every dollar earns +25 XP</Text>
          <Text style={s.headerTitle}>Log transaction</Text>
          <View style={s.typeToggle}>
            <TouchableOpacity
              style={[s.typeBtn, addType === 'expense' && s.typeBtnActive]}
              onPress={() => setAddType('expense')}>
              <Text style={[s.typeTxt, addType === 'expense' ? s.typeTxtActiveExpense : s.typeTxtInactive]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.typeBtn, addType === 'income' && s.typeBtnActive]}
              onPress={() => setAddType('income')}>
              <Text style={[s.typeTxt, addType === 'income' ? s.typeTxtActiveIncome : s.typeTxtInactive]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form body */}
        <View style={s.body}>
          <View style={s.field}>
            <Text style={s.fieldLabel}>AMOUNT</Text>
            <TextInput
              style={s.amtInput}
              value={addAmt}
              onChangeText={setAddAmt}
              keyboardType="decimal-pad"
              placeholder="$ 0.00"
              placeholderTextColor="#C0D0C0"
              returnKeyType="done"
            />
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>DESCRIPTION</Text>
            <TextInput
              style={s.descInput}
              value={addLabel}
              onChangeText={setAddLabel}
              placeholder="e.g. Whole Foods groceries"
              placeholderTextColor="#C0D0C0"
              returnKeyType="done"
            />
          </View>

          {addType === 'expense' && (
            <View style={s.field}>
              <Text style={s.fieldLabel}>CATEGORY</Text>
              <View style={s.catWrap}>
                {CATS.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[s.catChip, addCat === cat && { backgroundColor: th.primary }]}
                    onPress={() => setAddCat(cat)}>
                    <Text style={[s.catChipTxt, addCat === cat && { color: '#fff' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={[s.xpHint, { backgroundColor: th.accent }]}>
            <Text style={[s.xpHintTxt, { color: P.greenDark }]}>
              Logging earns +25 XP and keeps your {streak}-day streak alive!
            </Text>
          </View>

          <TouchableOpacity
            style={[s.submitBtn, { backgroundColor: th.primary }, (!addAmt || !addLabel) && s.submitBtnDisabled]}
            onPress={doAdd}
            activeOpacity={0.85}
            disabled={!addAmt || !addLabel}>
            <Text style={s.submitTxt}>Log transaction — +25 XP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  // Success screen
  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  doneTitle: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 8 },
  doneSub: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  streakBadge: { borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 28 },
  streakTxt: { fontSize: 14, fontWeight: '800' },
  doneBackBtn: { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 16, paddingVertical: 13, paddingHorizontal: 28 },
  doneBackTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },
  // Header
  headerNav: { marginBottom: 12 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 7, alignSelf: 'flex-start' },
  backBtnTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  header: { padding: 24, paddingBottom: 20 },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1, marginBottom: 18 },
  typeToggle: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 14, padding: 4 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11 },
  typeBtnActive: { backgroundColor: '#fff' },
  typeTxt: { fontSize: 14, fontWeight: '800' },
  typeTxtActiveExpense: { color: '#8B1A1A' },
  typeTxtActiveIncome: { color: '#1B6E3A' },
  typeTxtInactive: { color: 'rgba(255,255,255,0.7)' },
  // Form
  body: { padding: 16, paddingBottom: 40 },
  field: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' },
  amtInput: { fontSize: 28, fontWeight: '900', color: '#111C11' },
  descInput: { fontSize: 16, fontWeight: '700', color: '#111C11' },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  catChip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 99, backgroundColor: '#EDF0ED' },
  catChipTxt: { fontSize: 12, fontWeight: '800', color: '#2B4A2B' },
  xpHint: { borderRadius: 18, padding: 14, paddingHorizontal: 18, marginBottom: 16 },
  xpHintTxt: { fontSize: 13, fontWeight: '800' },
  submitBtn: {
    borderRadius: 18, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
