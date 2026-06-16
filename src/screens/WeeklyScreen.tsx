import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { WEEKLY, P, fmt } from '../data/constants';

const highlights = [
  { icon: '✅', text: 'Stayed under grocery budget by $180', col: P.greenDeep, bg: '#DCF5E7' },
  { icon: '🔥', text: '14-day expense logging streak!',     col: '#7A5F00',    bg: P.yellow + '66' },
  { icon: '📈', text: 'Saved $300 more than last week',     col: P.purpleDark, bg: P.purpleLight },
  { icon: '⚠️', text: 'Entertainment is 19% over budget',  col: P.coralDark,  bg: P.coralLight },
];

export function WeeklyScreen() {
  const { go } = useApp();

  const totInc = WEEKLY.reduce((a, w) => a + w.income, 0);
  const totExp = WEEKLY.reduce((a, w) => a + w.expense, 0);
  const maxVal = Math.max(...WEEKLY.map(w => Math.max(w.income, w.expense)), 1);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => go('home')}>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerSub}>This week</Text>
        <Text style={s.headerTitle}>Weekly summary</Text>
        <View style={s.summaryRow}>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Total income</Text>
            <Text style={[s.summaryVal, { color: P.lime }]}>+{fmt(totInc)}</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Total spent</Text>
            <Text style={[s.summaryVal, { color: P.coral }]}>-{fmt(totExp)}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 16, paddingBottom: 32 }}>
        <Text style={s.sectionLabel}>DAILY BREAKDOWN</Text>
        <View style={s.chartCard}>
          {/* Bar chart */}
          <View style={s.barsRow}>
            {WEEKLY.map(w => {
              const ih = w.income > 0 ? Math.round((w.income / maxVal) * 100) : 0;
              const eh = w.expense > 0 ? Math.round((w.expense / maxVal) * 100) : 0;
              return (
                <View key={w.day} style={s.barCol}>
                  {w.income > 0 && <View style={[s.bar, { height: ih, backgroundColor: P.green }]} />}
                  {w.expense > 0 && <View style={[s.bar, { height: eh, backgroundColor: P.coral, borderRadius: 3 }]} />}
                </View>
              );
            })}
          </View>
          <View style={s.dayLabels}>
            {WEEKLY.map(w => (
              <View key={w.day} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={s.dayLabel}>{w.day}</Text>
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
        </View>

        <Text style={[s.sectionLabel, { marginTop: 4 }]}>THIS WEEK'S HIGHLIGHTS</Text>
        {highlights.map((h, i) => (
          <View key={i} style={[s.highlight, { backgroundColor: h.bg }]}>
            <Text style={{ fontSize: 18 }}>{h.icon}</Text>
            <Text style={[s.highlightTxt, { color: h.col }]}>{h.text}</Text>
          </View>
        ))}
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
