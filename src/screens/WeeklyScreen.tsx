import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { P, fmt } from '../data/constants';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeeklyScreen() {
  const { go, transactions, streak, budgets, currencySymbol } = useApp();

  const weekly = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayTxns = transactions.filter(t => t.date === dateStr);
      return {
        day: DAY_NAMES[d.getDay()],
        income: dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        isToday: i === 6,
      };
    });
  }, [transactions]);

  const totInc = useMemo(() => weekly.reduce((a, w) => a + w.income, 0), [weekly]);
  const totExp = useMemo(() => weekly.reduce((a, w) => a + w.expense, 0), [weekly]);
  const maxVal = useMemo(() => Math.max(...weekly.map(w => Math.max(w.income, w.expense)), 1), [weekly]);
  const hasData = totInc > 0 || totExp > 0;

  const highlights = useMemo(() => {
    const out: { icon: string; text: string; col: string; bg: string }[] = [];

    if (streak >= 7) {
      out.push({ icon: '🔥', text: `${streak}-day expense logging streak — keep it up!`, col: '#7A5F00', bg: P.yellow + '55' });
    } else if (streak > 0) {
      out.push({ icon: '🔥', text: `${streak}-day streak — log daily to build your habit!`, col: '#7A5F00', bg: P.yellow + '55' });
    }

    if (totInc > 0 && totExp > 0) {
      const saved = totInc - totExp;
      if (saved > 0) {
        out.push({ icon: '✅', text: `You saved ${fmt(saved, currencySymbol)} more than you spent this week!`, col: P.greenDeep, bg: '#DCF5E7' });
      } else {
        out.push({ icon: '⚠️', text: `Expenses exceeded income by ${fmt(Math.abs(saved), currencySymbol)} this week.`, col: P.coralDark, bg: P.coralLight });
      }
    }

    const monthStr = new Date().toISOString().slice(0, 7);
    const monthExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(monthStr));
    const spent: Record<string, number> = {};
    monthExpenses.forEach(t => { spent[t.category] = (spent[t.category] || 0) + t.amount; });
    const overBudget = budgets.filter(b => (spent[b.category] || 0) > b.limit);
    const underBudget = budgets.filter(b => b.limit > 0 && (spent[b.category] || 0) < b.limit * 0.8);

    if (overBudget.length > 0) {
      out.push({ icon: '⚠️', text: `${overBudget[0].category} is over budget this month.`, col: P.coralDark, bg: P.coralLight });
    }
    if (underBudget.length > 0) {
      const b = underBudget[0];
      const remaining = b.limit - (spent[b.category] || 0);
      out.push({ icon: '✅', text: `${fmt(remaining, currencySymbol)} left in your ${b.category} budget — great restraint!`, col: P.greenDeep, bg: '#DCF5E7' });
    }

    return out;
  }, [transactions, streak, budgets, totInc, totExp, currencySymbol]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => go('home')}>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerSub}>This week</Text>
        <Text style={s.headerTitle}>Weekly Summary</Text>
        <View style={s.summaryRow}>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Total income</Text>
            <Text style={[s.summaryVal, { color: P.lime }]}>+{fmt(totInc, currencySymbol)}</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Total spent</Text>
            <Text style={[s.summaryVal, { color: P.coral }]}>-{fmt(totExp, currencySymbol)}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 16, paddingBottom: 32 }}>
        <Text style={s.sectionLabel}>Daily Breakdown</Text>
        <View style={s.chartCard}>
          {hasData ? (
            <>
              <View style={s.barsRow}>
                {weekly.map(w => {
                  const ih = w.income > 0 ? Math.round((w.income / maxVal) * 100) : 0;
                  const eh = w.expense > 0 ? Math.round((w.expense / maxVal) * 100) : 0;
                  return (
                    <View key={w.day} style={[s.barCol, w.isToday && { opacity: 1 }]}>
                      {w.income > 0 && <View style={[s.bar, { height: ih, backgroundColor: P.green }]} />}
                      {w.expense > 0 && <View style={[s.bar, { height: eh, backgroundColor: P.coral }]} />}
                      {w.income === 0 && w.expense === 0 && <View style={[s.bar, { height: 4, backgroundColor: '#eee' }]} />}
                    </View>
                  );
                })}
              </View>
              <View style={s.dayLabels}>
                {weekly.map(w => (
                  <View key={w.day} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={[s.dayLabel, w.isToday && { color: P.greenDeep, fontWeight: '900' }]}>{w.day}</Text>
                  </View>
                ))}
              </View>
              <View style={s.legend}>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: P.green }]} />
                  <Text style={s.legendTxt}>Income</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: P.coral }]} />
                  <Text style={s.legendTxt}>Expense</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📊</Text>
              <Text style={{ color: P.mid, fontSize: 13, fontWeight: '700', textAlign: 'center' }}>
                No transactions this week yet.{'\n'}Start logging to see your chart!
              </Text>
            </View>
          )}
        </View>

        <Text style={[s.sectionLabel, { marginTop: 4 }]}>This Week's Highlights</Text>
        {highlights.length === 0 ? (
          <View style={[s.highlight, { backgroundColor: P.bg, borderWidth: 1.5, borderColor: '#D5EDDC', borderStyle: 'dashed' }]}>
            <Text style={{ fontSize: 18 }}>💡</Text>
            <Text style={[s.highlightTxt, { color: P.muted }]}>
              Log expenses and set budgets to see personalised insights here.
            </Text>
          </View>
        ) : (
          highlights.map((h, i) => (
            <View key={i} style={[s.highlight, { backgroundColor: h.bg }]}>
              <Text style={{ fontSize: 18 }}>{h.icon}</Text>
              <Text style={[s.highlightTxt, { color: h.col }]}>{h.text}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: P.greenDeep, padding: 20, paddingBottom: 24 },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 7, alignSelf: 'flex-start', marginBottom: 14,
  },
  backTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 13 },
  summaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  summaryVal: { fontSize: 20, fontWeight: '900' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14 },
  chartCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6, marginBottom: 10 },
  barCol: { flex: 1, justifyContent: 'flex-end', gap: 2 },
  bar: { width: '100%', borderRadius: 3, borderTopLeftRadius: 6, borderTopRightRadius: 6, minHeight: 4 },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  dayLabel: { fontSize: 10, fontWeight: '800', color: '#6B8F6B', textAlign: 'center' },
  legend: { flexDirection: 'row', gap: 14, marginTop: 12, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendTxt: { fontSize: 11, fontWeight: '700', color: '#6B8F6B' },
  highlight: { borderRadius: 14, padding: 11, paddingHorizontal: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  highlightTxt: { fontSize: 12, fontWeight: '800', lineHeight: 18, flex: 1 },
});
