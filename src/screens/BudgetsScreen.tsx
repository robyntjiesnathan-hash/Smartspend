import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { BUDGETS_DATA, THEMES, P, fmt, pct } from '../data/constants';

export function BudgetsScreen() {
  const { theme, selBudget, setSelBudget, transactions } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const spend: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.type !== 'expense') return;
    const d = new Date(t.date + 'T00:00:00');
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      spend[t.category] = (spend[t.category] || 0) + t.amount;
    }
  });

  const budgets = BUDGETS_DATA.map(b => ({ ...b, spent: spend[b.cat] || 0 }));
  const tot = budgets.reduce((a, b) => a + b.spent, 0);
  const lim = budgets.reduce((a, b) => a + b.limit, 0);
  const ov = pct(tot, lim);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: th.primary }]}>
        <Text style={s.headerSub}>{dateLabel}</Text>
        <Text style={s.headerTitle}>Budget overview</Text>
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
      </View>

      <View style={{ padding: 16, paddingBottom: 32 }}>
        <Text style={s.sectionLabel}>CATEGORIES</Text>
        {budgets.map(b => {
          const pc = pct(b.spent, b.limit);
          const over = b.spent > b.limit;
          const sel = selBudget === b.cat;
          return (
            <TouchableOpacity
              key={b.cat}
              style={[s.card, { borderColor: sel ? b.col : 'transparent' }]}
              onPress={() => setSelBudget(sel ? null : b.cat)}
              activeOpacity={0.85}>
              <View style={s.cardTop}>
                <View style={[s.catIcon, { backgroundColor: b.col + '22' }]}>
                  <Text style={{ fontSize: 18 }}>{b.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.catHeader}>
                    <Text style={s.catName}>{b.cat}</Text>
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
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 24 },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1, marginBottom: 16 },
  ringWrap: { alignItems: 'center', marginBottom: 14 },
  ringPct: { color: '#fff', fontWeight: '900', fontSize: 26, lineHeight: 28 },
  ringLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '700', marginTop: 2 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 16, padding: 12, alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  summaryVal: { fontSize: 17, fontWeight: '900' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 },
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
  progressBg: { height: 9, backgroundColor: '#EDF0ED', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  detail: { marginTop: 10, borderRadius: 12, padding: 10, paddingHorizontal: 12 },
});
