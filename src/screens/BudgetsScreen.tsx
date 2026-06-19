import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { THEMES, P, fmt, pct } from '../data/constants';
import { Budget } from '../types';

const CAT_META: Record<string, { icon: string; col: string }> = {
  Groceries:     { icon: '🛒', col: '#3DBA6A' },
  Transport:     { icon: '🚗', col: '#00C4A7' },
  Entertainment: { icon: '🎬', col: '#FF5C5C' },
  'Dining Out':  { icon: '🍽️', col: '#FFD84D' },
  Health:        { icon: '❤️', col: '#7B5CF5' },
  Shopping:      { icon: '🛍️', col: '#F59E0B' },
  Bills:         { icon: '📄', col: '#6366F1' },
  Other:         { icon: '📝', col: '#9CA3AF' },
};
const DEFAULT_COL = '#9CA3AF';
const DEFAULT_ICON = '💰';

const ALL_CATS = ['Groceries', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Bills', 'Other'];

function BudgetModal({
  budget,
  onSave,
  onClose,
}: {
  budget: Budget | null;
  onSave: (cat: string, limit: number) => void;
  onClose: () => void;
}) {
  const [cat, setCat] = useState(budget?.category || '');
  const [limit, setLimit] = useState(budget ? String(budget.limit) : '');
  const isEdit = budget !== null;

  const submit = () => {
    const n = parseFloat(limit);
    if (!cat || isNaN(n) || n <= 0) return;
    onSave(cat, n);
    onClose();
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={m.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={m.sheet}>
            <Text style={m.title}>{isEdit ? `Edit ${budget!.category}` : 'Add budget'}</Text>

            {!isEdit && (
              <>
                <Text style={m.label}>CATEGORY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {ALL_CATS.map(c => (
                      <TouchableOpacity
                        key={c}
                        style={[m.chip, cat === c && { backgroundColor: CAT_META[c]?.col || DEFAULT_COL }]}
                        onPress={() => setCat(c)}>
                        <Text style={{ fontSize: 14 }}>{CAT_META[c]?.icon || DEFAULT_ICON}</Text>
                        <Text style={[m.chipTxt, cat === c && { color: '#fff' }]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}

            <Text style={m.label}>MONTHLY LIMIT</Text>
            <TextInput
              style={m.input}
              value={limit}
              onChangeText={setLimit}
              placeholder="$ 0.00"
              placeholderTextColor="#C0D0C0"
              keyboardType="decimal-pad"
              autoFocus={isEdit}
              onSubmitEditing={submit}
            />

            <TouchableOpacity
              style={[m.cta, (!cat || !limit) && { opacity: 0.4 }]}
              onPress={submit}
              disabled={!cat || !limit}
              activeOpacity={0.85}>
              <Text style={m.ctaTxt}>{isEdit ? 'Save changes' : 'Add budget'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={m.cancel} onPress={onClose}>
              <Text style={m.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export function BudgetsScreen() {
  const { theme, selBudget, setSelBudget, transactions, budgets, saveBudget, deleteBudget } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];
  const [editBudget, setEditBudget] = useState<Budget | null | false>(false);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const spend = useMemo(() => {
    const s: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      const d = new Date(t.date + 'T00:00:00');
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        s[t.category] = (s[t.category] || 0) + t.amount;
      }
    });
    return s;
  }, [transactions]);

  const rows = useMemo(() => budgets.map(b => ({
    ...b,
    spent: spend[b.category] || 0,
    icon: CAT_META[b.category]?.icon || DEFAULT_ICON,
    col: CAT_META[b.category]?.col || DEFAULT_COL,
  })), [budgets, spend]);

  const tot = rows.reduce((a, b) => a + b.spent, 0);
  const lim = rows.reduce((a, b) => a + b.limit, 0);
  const ov = lim > 0 ? pct(tot, lim) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: P.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[s.header, { backgroundColor: th.primary }]}>
          <Text style={s.headerSub}>{dateLabel}</Text>
          <Text style={s.headerTitle}>Budget overview</Text>
          {lim > 0 ? (
            <>
              <View style={s.ringWrap}>
                <Ring pct={ov} sz={108} sw={10} col="rgba(255,255,255,0.95)" bg="rgba(255,255,255,0.2)">
                  <View style={{ alignItems: 'center' }}>
                    <Text style={s.ringPct}>{ov}%</Text>
                    <Text style={s.ringLabel}>used</Text>
                  </View>
                </Ring>
              </View>
              <View style={s.summaryRow}>
                <View style={s.summaryBox}>
                  <Text style={s.summaryLabel}>Spent</Text>
                  <Text style={[s.summaryVal, { color: P.coral }]}>{fmt(tot)}</Text>
                </View>
                <View style={s.summaryBox}>
                  <Text style={s.summaryLabel}>Budget</Text>
                  <Text style={[s.summaryVal, { color: P.lime }]}>{fmt(lim)}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={s.emptyHero}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>📊</Text>
              <Text style={s.emptyHeroTxt}>No budgets set yet</Text>
              <Text style={s.emptyHeroSub}>Tap "+ Add budget" below to set your first limit</Text>
            </View>
          )}
        </View>

        <View style={{ padding: 16, paddingBottom: 32 }}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionLabel}>CATEGORIES</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setEditBudget(null)}>
              <Text style={s.addBtnTxt}>+ Add budget</Text>
            </TouchableOpacity>
          </View>

          {rows.length === 0 && (
            <View style={s.emptyCard}>
              <Text style={{ color: P.muted, fontSize: 13, fontWeight: '700' }}>
                Add your first budget to start tracking spending limits.
              </Text>
            </View>
          )}

          {rows.map(b => {
            const pc = pct(b.spent, b.limit);
            const over = b.spent > b.limit;
            const sel = selBudget === b.category;
            return (
              <TouchableOpacity
                key={b.category}
                style={[s.card, { borderColor: sel ? b.col : 'transparent' }]}
                onPress={() => setSelBudget(sel ? null : b.category)}
                activeOpacity={0.85}>
                <View style={s.cardTop}>
                  <View style={[s.catIcon, { backgroundColor: b.col + '22' }]}>
                    <Text style={{ fontSize: 18 }}>{b.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.catHeader}>
                      <Text style={s.catName}>{b.category}</Text>
                      {over && (
                        <View style={[s.badge, { backgroundColor: P.coralLight }]}>
                          <Text style={[s.badgeTxt, { color: P.coralDark }]}>Over!</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.catAmt}>{fmt(b.spent)} of {fmt(b.limit)}</Text>
                  </View>
                  <Text style={[s.catPct, { color: over ? P.coral : b.col }]}>{pc}%</Text>
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, {
                    width: `${Math.min(100, pc)}%`,
                    backgroundColor: over ? P.coral : b.col,
                  }]} />
                </View>
                {sel && (
                  <View style={[s.detail, { backgroundColor: over ? P.coralLight : '#DCF5E7' }]}>
                    <Text style={{ fontSize: 12, color: over ? P.coralDark : P.greenDeep, fontWeight: '700' }}>
                      {over
                        ? `Over by ${fmt(b.spent - b.limit)}. Try reducing spend.`
                        : `${fmt(b.limit - b.spent)} remaining — great pacing!`
                      }
                    </Text>
                    <View style={s.detailActions}>
                      <TouchableOpacity style={s.editBtn} onPress={() => setEditBudget(b)}>
                        <Text style={s.editBtnTxt}>✏️ Edit limit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.deleteBtn} onPress={() => { setSelBudget(null); deleteBudget(b.category); }}>
                        <Text style={s.deleteBtnTxt}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {editBudget !== false && (
        <BudgetModal
          budget={editBudget}
          onSave={saveBudget}
          onClose={() => setEditBudget(false)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 24 },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1, marginBottom: 16 },
  ringWrap: { alignItems: 'center', marginBottom: 14 },
  ringPct: { color: '#fff', fontWeight: '900', fontSize: 26, lineHeight: 28 },
  ringLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '700', marginTop: 2 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.26)' },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  summaryVal: { fontSize: 17, fontWeight: '900' },
  emptyHero: { alignItems: 'center', paddingBottom: 8 },
  emptyHeroTxt: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 4 },
  emptyHeroSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase' },
  addBtn: { backgroundColor: '#1B6E3A', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnTxt: { color: '#fff', fontSize: 12, fontWeight: '900' },
  emptyCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 10,
    borderWidth: 2.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  catIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catName: { fontWeight: '900', fontSize: 14, color: '#111C11' },
  badge: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3 },
  badgeTxt: { fontSize: 10, fontWeight: '800' },
  catAmt: { color: '#6B8F6B', fontSize: 11, fontWeight: '700' },
  catPct: { fontWeight: '900', fontSize: 16 },
  progressBg: { height: 11, backgroundColor: '#EDF0ED', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  detail: { marginTop: 10, borderRadius: 12, padding: 10, paddingHorizontal: 12 },
  detailActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  editBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  editBtnTxt: { fontSize: 12, fontWeight: '800', color: '#374151' },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: '#FEF2F2' },
  deleteBtnTxt: { fontSize: 12, fontWeight: '800', color: '#EF4444' },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40, gap: 10,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#111C11', textAlign: 'center', marginBottom: 4 },
  label: { fontSize: 10, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.5, textTransform: 'uppercase' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F3F4F6',
  },
  chipTxt: { fontSize: 12, fontWeight: '800', color: '#374151' },
  input: {
    backgroundColor: '#F3F4F6', borderRadius: 14, padding: 14,
    fontSize: 20, fontWeight: '800', color: '#111C11',
  },
  cta: {
    backgroundColor: '#1B6E3A', borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },
  cancel: { alignItems: 'center', paddingVertical: 4 },
  cancelTxt: { color: P.muted, fontSize: 14, fontWeight: '700' },
});
