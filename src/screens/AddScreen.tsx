import React, { useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { THEMES, P, CAT_ICON } from '../data/constants';

const CATS = ['Groceries', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Bills', 'Other'];

const CAT_COLOR: Record<string, string> = {
  Groceries: '#3DBA6A', Transport: '#00C4A7', Entertainment: '#FF5C5C',
  'Dining Out': '#FFD84D', Health: '#7B5CF5', Shopping: '#F59E0B',
  Bills: '#6366F1', Other: '#9CA3AF',
};

function formatAmt(raw: string): string {
  if (!raw) return '';
  const [int, dec] = raw.split('.');
  const intFormatted = parseInt(int || '0', 10).toLocaleString('en-US');
  return dec !== undefined ? `${intFormatted}.${dec}` : intFormatted;
}

export function AddScreen() {
  const {
    addType, setAddType, addAmt, setAddAmt, addLabel, setAddLabel,
    addCat, setAddCat, addDone, streak, theme, doAdd, go,
  } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];

  const displayAmt = useMemo(() => formatAmt(addAmt), [addAmt]);

  const handleAmtChange = (text: string) => {
    const raw = text.replace(/,/g, '');
    const parts = raw.split('.');
    const cleaned = parts.length > 1
      ? `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}`
      : parts[0];
    if (cleaned === '' || /^\d*\.?\d{0,2}$/.test(cleaned)) setAddAmt(cleaned);
  };

  // Auto-navigate home 2 s after a successful log
  useEffect(() => {
    if (!addDone) return;
    const timer = setTimeout(() => go('home'), 2000);
    return () => clearTimeout(timer);
  }, [addDone]);

  if (addDone) {
    const catIcon = addType === 'income' ? '💰' : (CAT_ICON[addCat] || '📝');
    const sign = addType === 'income' ? '+' : '−';
    const amtDisplay = addAmt ? `$${formatAmt(addAmt)}` : '';
    return (
      <View style={[s.doneContainer, { backgroundColor: th.primary }]}>
        <Text style={{ fontSize: 64, marginBottom: 12 }}>✅</Text>
        <Text style={s.doneTitle}>Logged!</Text>
        <View style={s.doneSummary}>
          <Text style={s.doneSummaryAmt}>{sign}{amtDisplay}</Text>
          <View style={s.doneSummaryRow}>
            <Text style={s.doneSummaryIcon}>{catIcon}</Text>
            <Text style={s.doneSummaryCat}>{addType === 'income' ? 'Income' : addCat}</Text>
          </View>
          {addLabel ? <Text style={s.doneSummaryLabel} numberOfLines={1}>{addLabel}</Text> : null}
        </View>
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
          <View style={s.headerTitleRow}>
            <Text style={s.headerTitle}>Log transaction</Text>
            <View style={[s.typePill, { backgroundColor: addType === 'income' ? 'rgba(198,241,53,0.25)' : 'rgba(255,255,255,0.18)' }]}>
              <Text style={[s.typePillTxt, { color: addType === 'income' ? P.lime : 'rgba(255,255,255,0.85)' }]}>
                {addType === 'income' ? '↑ Income' : '↓ Expense'}
              </Text>
            </View>
          </View>
        </View>

        {/* Form body */}
        <View style={s.body}>
          <View style={s.field}>
            <Text style={s.fieldLabel}>AMOUNT</Text>
            <View style={s.amtRow}>
              <Text style={s.amtPrefix}>$</Text>
              <TextInput
                style={s.amtInput}
                value={displayAmt}
                onChangeText={handleAmtChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#C0D0C0"
                returnKeyType="done"
                autoFocus
              />
            </View>
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
                {CATS.map(cat => {
                  const active = addCat === cat;
                  const col = CAT_COLOR[cat] || '#9CA3AF';
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[s.catChip, active && { backgroundColor: col, borderColor: col }]}
                      onPress={() => setAddCat(cat)}>
                      <Text style={{ fontSize: 14 }}>{CAT_ICON[cat] || '📝'}</Text>
                      <Text style={[s.catChipTxt, active && { color: '#fff' }]}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Type toggle — at the bottom where thumbs already are */}
          <View style={s.typeToggle}>
            <TouchableOpacity
              style={[s.typeBtn, addType === 'expense' && s.typeBtnActive]}
              onPress={() => setAddType('expense')}>
              <Text style={[s.typeTxt, addType === 'expense' ? s.typeTxtActiveExpense : s.typeTxtInactive]}>
                ↓ Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.typeBtn, addType === 'income' && s.typeBtnActive]}
              onPress={() => setAddType('income')}>
              <Text style={[s.typeTxt, addType === 'income' ? s.typeTxtActiveIncome : s.typeTxtInactive]}>
                ↑ Income
              </Text>
            </TouchableOpacity>
          </View>

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
  doneTitle: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 12 },
  doneSummary: {
    backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 20, padding: 18, paddingHorizontal: 24,
    alignItems: 'center', marginBottom: 16, minWidth: 200,
  },
  doneSummaryAmt: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -1, marginBottom: 6 },
  doneSummaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  doneSummaryIcon: { fontSize: 16 },
  doneSummaryCat: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '800' },
  doneSummaryLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  doneSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '700', marginBottom: 16 },
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
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  typePill: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  typePillTxt: { fontSize: 12, fontWeight: '800' },
  // Bottom type toggle
  typeToggle: {
    flexDirection: 'row', backgroundColor: '#E8EDE8', borderRadius: 16, padding: 4, marginBottom: 12,
  },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 13 },
  typeBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  typeTxt: { fontSize: 14, fontWeight: '800' },
  typeTxtActiveExpense: { color: '#8B1A1A' },
  typeTxtActiveIncome: { color: '#1B6E3A' },
  typeTxtInactive: { color: '#6B8F6B' },
  // Form
  body: { padding: 16, paddingBottom: 40 },
  field: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' },
  amtRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  amtPrefix: { fontSize: 28, fontWeight: '900', color: '#C0D0C0' },
  amtInput: { flex: 1, fontSize: 28, fontWeight: '900', color: '#111C11' },
  descInput: { fontSize: 16, fontWeight: '700', color: '#111C11' },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    backgroundColor: '#EDF0ED', borderWidth: 2, borderColor: 'transparent',
  },
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
