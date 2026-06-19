import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Sprout } from '../components/Sprout';
import { Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { P, getLvl } from '../data/constants';

export function ProgressScreen() {
  const { xp, streak, mood, acc, challenges, markChallenge, transactions, savingsGoals, budgets } = useApp();
  const { c, n, p, inn, inn2 } = getLvl(xp);

  const monthStr = new Date().toISOString().slice(0, 7);

  const health = useMemo(() => {
    const monthTxns = transactions.filter(t => t.date.startsWith(monthStr));
    const logScore = monthTxns.length === 0 ? 0 : monthTxns.length < 4 ? 15 : monthTxns.length < 11 ? 28 : 40;
    const streakScore = Math.min(streak * 2, 15);
    const savingsScore = savingsGoals.length > 0 ? 20 : 0;
    let budgetScore = 0;
    if (budgets.length > 0) {
      const spent: Record<string, number> = {};
      monthTxns.filter(t => t.type === 'expense').forEach(t => { spent[t.category] = (spent[t.category] || 0) + t.amount; });
      const over = budgets.filter(b => (spent[b.category] || 0) > b.limit).length;
      budgetScore = Math.max(0, 25 - over * 8);
    }
    return Math.min(100, logScore + streakScore + savingsScore + budgetScore);
  }, [transactions, streak, savingsGoals, budgets, monthStr]);

  const healthBars = useMemo(() => {
    const monthTxns = transactions.filter(t => t.date.startsWith(monthStr));
    const expenseTxns = monthTxns.filter(t => t.type === 'expense');
    const incomeTxns = monthTxns.filter(t => t.type === 'income');

    // Tracking habits: unique days logged this month (out of last 30 days)
    const loggedDays = new Set(monthTxns.map(t => t.date)).size;
    const daysInMonth = new Date().getDate();
    const trackingScore = daysInMonth === 0 ? 0 : Math.min(100, Math.round((loggedDays / daysInMonth) * 100));

    // Budget consistency: % of set budgets within limit
    let budgetConsistency = 0;
    if (budgets.length > 0) {
      const spent: Record<string, number> = {};
      expenseTxns.forEach(t => { spent[t.category] = (spent[t.category] || 0) + t.amount; });
      const withinBudget = budgets.filter(b => (spent[b.category] || 0) <= b.limit).length;
      budgetConsistency = Math.round((withinBudget / budgets.length) * 100);
    }

    // Spending patterns: income vs expense ratio (100% means spending < 90% of income)
    const totalIncome = incomeTxns.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenseTxns.reduce((s, t) => s + t.amount, 0);
    let spendingScore = 0;
    if (totalIncome > 0) {
      const ratio = totalExpense / totalIncome;
      spendingScore = Math.max(0, Math.min(100, Math.round((1 - ratio) * 100 + 50)));
    }

    // Goal progress: average completion %
    const goalScore = savingsGoals.length === 0 ? 0
      : Math.round(savingsGoals.reduce((s, g) => s + Math.min(100, (g.savedAmount / g.targetAmount) * 100), 0) / savingsGoals.length);

    // Saving behaviour: has goals + making progress
    const savingScore = savingsGoals.length === 0 ? 0
      : savingsGoals.some(g => g.savedAmount > 0) ? 75 : 40;

    return [
      { l: 'Tracking habits',    s: trackingScore,    c: P.green },
      { l: 'Budget consistency', s: budgetConsistency, c: P.teal },
      { l: 'Spending patterns',  s: spendingScore,    c: P.purple },
      { l: 'Saving behaviour',   s: savingScore,      c: P.yellow },
      { l: 'Goal progress',      s: goalScore,        c: P.green },
    ];
  }, [transactions, budgets, savingsGoals, monthStr]);

  const achievements = useMemo(() => {
    const monthTxns = transactions.filter(t => t.date.startsWith(monthStr));
    const hasNoSpendDay = (() => {
      const dates = [...new Set(transactions.map(t => t.date))];
      return dates.some(d => !transactions.some(t => t.date === d && t.type === 'expense'));
    })();

    return [
      { icon: '🏆', title: 'First Budget',  desc: 'Created first budget',   xp: 50,  done: budgets.length > 0 },
      { icon: '💰', title: 'Saving Streak', desc: 'Saved 7 days running',   xp: 100, done: streak >= 7 },
      { icon: '🔥', title: 'Habit Builder', desc: '30-day tracking streak', xp: 200, done: streak >= 30 },
      { icon: '🎯', title: 'Goal Achiever', desc: 'Complete a savings goal', xp: 150, done: savingsGoals.some(g => g.savedAmount >= g.targetAmount) },
      { icon: '🛡️', title: 'No-Spend Day', desc: 'Zero spend day',          xp: 75,  done: hasNoSpendDay },
      { icon: '🌟', title: 'Goal Setter',   desc: 'Set first savings goal',  xp: 50,  done: savingsGoals.length > 0 },
      { icon: '📅', title: 'Week Warrior',  desc: 'Track 7 days straight',  xp: 100, done: streak >= 7 },
      { icon: '💎', title: 'Budget Expert', desc: 'All budgets under limit', xp: 300, done: budgets.length > 0 && monthTxns.length > 0 && healthBars[1].s === 100 },
    ];
  }, [transactions, budgets, savingsGoals, streak, monthStr, healthBars]);

  const streakSub = streak === 0 ? 'Log today to start your streak!'
    : streak < 3 ? 'Keep going — you\'re just getting started!'
    : streak < 7 ? 'You\'re building a great habit!'
    : streak < 14 ? 'A full week of logging — impressive!'
    : streak < 30 ? 'Over two weeks — you\'re on fire!'
    : 'A whole month — absolutely incredible!';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: P.greenDeep }]}>
        <Text style={s.headerSub}>FINANCIAL JOURNEY</Text>
        <Text style={s.headerTitle}>Your progress</Text>
        <View style={{ alignItems: 'center', marginBottom: -6 }}>
          <Sprout lvl={c.lvl} size={138} mood={mood} acc={acc} />
        </View>
      </View>

      {/* XP card */}
      <View style={s.xpCard}>
        <Text style={s.xpLvl}>Level {c.lvl} · {c.name}</Text>
        <Text style={s.xpTotal}>{xp}<Text style={{ fontSize: 15 }}> total XP</Text></Text>
        <View style={s.xpRow}>
          <Text style={s.xpSub}>{inn} / {inn2} XP</Text>
          <Text style={s.xpSub}>{p}%</Text>
        </View>
        <View style={s.xpBg}>
          <View style={[s.xpFill, { width: `${p}%` }]} />
        </View>
        <Text style={s.xpNext}>Next: {n.name}</Text>
      </View>

      <View style={{ padding: 16, paddingBottom: 32 }}>
        {/* Challenges */}
        <Text style={s.sectionLabel}>ACTIVE CHALLENGES</Text>
        {challenges.map((ch, i) => (
          <View key={ch.title} style={s.challengeCard}>
            <View style={s.chHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.chTitle}>{ch.title}</Text>
                <Text style={s.chDesc}>{ch.desc}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: ch.colL }]}>
                <Text style={[s.badgeTxt, { color: ch.colD }]}>+{ch.xp} XP</Text>
              </View>
            </View>
            <View style={s.dayDots}>
              {Array.from({ length: ch.days }).map((_, j) => (
                <View key={j} style={[s.dot, { backgroundColor: j < ch.done ? ch.col : '#E8EDE8' }]} />
              ))}
            </View>
            <View style={s.chFooter}>
              <Text style={s.chDayTxt}>Day {ch.done}/{ch.days}</Text>
              {ch.done < ch.days
                ? <TouchableOpacity style={[s.markBtn, { backgroundColor: ch.col }]} onPress={() => markChallenge(i)}>
                    <Text style={s.markTxt}>Mark today</Text>
                  </TouchableOpacity>
                : <View style={[s.badge, { backgroundColor: ch.colL }]}>
                    <Text style={[s.badgeTxt, { color: ch.colD }]}>Complete!</Text>
                  </View>
              }
            </View>
          </View>
        ))}

        {/* Streak */}
        <View style={[s.streakCard, { backgroundColor: streak > 0 ? P.yellow : '#E8EDE8' }]}>
          <Text style={{ fontSize: 44 }}>{streak > 0 ? '🔥' : '💤'}</Text>
          <View>
            <Text style={s.streakLabel}>CURRENT STREAK</Text>
            <Text style={s.streakNum}>{streak} days</Text>
            <Text style={s.streakSub}>{streakSub}</Text>
          </View>
        </View>

        {/* Financial health */}
        <View style={s.healthCard}>
          <View style={s.healthTop}>
            <Ring pct={health} sz={68} sw={7} col={P.green} bg="#DCF5E7">
              <Text style={s.healthScore}>{health}</Text>
            </Ring>
            <View>
              <Text style={s.healthTitle}>Financial health</Text>
              {health === 0
                ? <View style={[s.badge, { backgroundColor: '#F0F0F0' }]}>
                    <Text style={[s.badgeTxt, { color: '#888' }]}>Start logging to score</Text>
                  </View>
                : <View style={[s.badge, { backgroundColor: '#DCF5E7' }]}>
                    <Text style={[s.badgeTxt, { color: P.greenDeep }]}>
                      {health >= 75 ? 'Great' : health >= 50 ? 'Good' : 'Building'} — keep going!
                    </Text>
                  </View>
              }
            </View>
          </View>
          {healthBars.map(x => (
            <View key={x.l} style={{ marginBottom: 9 }}>
              <View style={s.hbRow}>
                <Text style={s.hbLabel}>{x.l}</Text>
                <Text style={[s.hbScore, { color: x.s > 0 ? x.c : '#ccc' }]}>{x.s}%</Text>
              </View>
              <View style={s.hbBg}>
                <View style={[s.hbFill, { width: `${x.s}%`, backgroundColor: x.c }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <Text style={s.sectionLabel}>ACHIEVEMENTS</Text>
        <View style={s.achGrid}>
          {achievements.map(a => (
            <View key={a.title} style={[s.achCard, !a.done && s.achLocked]}>
              <Text style={{ fontSize: 26, marginBottom: 5 }}>{a.done ? a.icon : '🔒'}</Text>
              <Text style={s.achTitle}>{a.title}</Text>
              <Text style={s.achDesc}>{a.desc}</Text>
              <View style={[s.badge, { backgroundColor: a.done ? '#DCF5E7' : '#EEE', marginTop: 6 }]}>
                <Text style={[s.badgeTxt, { color: a.done ? P.greenDeep : '#888' }]}>
                  {a.done ? `+${a.xp} XP` : 'Locked'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { padding: 24, paddingBottom: 0, alignItems: 'center' },
  headerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: -0.8, marginBottom: 14 },
  xpCard: { backgroundColor: '#C6F135', padding: 16, paddingHorizontal: 20 },
  xpLvl: { color: P.limeDark, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2, textAlign: 'center' },
  xpTotal: { color: P.dark, fontSize: 30, fontWeight: '900', lineHeight: 34, textAlign: 'center', marginBottom: 4 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  xpSub: { color: P.limeDark, fontSize: 11, fontWeight: '800' },
  xpBg: { height: 10, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 99, overflow: 'hidden', marginBottom: 5 },
  xpFill: { height: '100%', backgroundColor: P.greenDeep, borderRadius: 99 },
  xpNext: { color: P.limeDark, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },
  challengeCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 14, paddingHorizontal: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  chHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  chTitle: { fontWeight: '900', fontSize: 14, color: P.dark, marginBottom: 2 },
  chDesc: { color: '#6B8F6B', fontSize: 11, fontWeight: '700' },
  badge: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3 },
  badgeTxt: { fontSize: 10, fontWeight: '800' },
  dayDots: { flexDirection: 'row', gap: 5, marginBottom: 8 },
  dot: { flex: 1, height: 7, borderRadius: 99 },
  chFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chDayTxt: { color: '#6B8F6B', fontSize: 11, fontWeight: '700' },
  markBtn: { borderRadius: 10, paddingHorizontal: 13, paddingVertical: 6 },
  markTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  streakCard: {
    borderRadius: 24, padding: 18, marginBottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  streakLabel: { color: P.mid, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  streakNum: { color: P.dark, fontWeight: '900', fontSize: 30, lineHeight: 34, marginBottom: 2 },
  streakSub: { color: P.mid, fontSize: 12, fontWeight: '700' },
  healthCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  healthTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  healthTitle: { fontWeight: '900', fontSize: 14, color: P.dark, marginBottom: 4 },
  healthScore: { fontWeight: '900', fontSize: 16, color: P.greenDeep },
  hbRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  hbLabel: { fontSize: 12, color: '#6B8F6B', fontWeight: '700' },
  hbScore: { fontSize: 12, fontWeight: '900' },
  hbBg: { height: 5, backgroundColor: '#E8EDE8', borderRadius: 99, overflow: 'hidden' },
  hbFill: { height: '100%', borderRadius: 99 },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 18, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  achLocked: { opacity: 0.45 },
  achTitle: { fontWeight: '900', fontSize: 11, color: P.dark, marginBottom: 2, textAlign: 'center' },
  achDesc: { color: '#6B8F6B', fontSize: 10, fontWeight: '600', lineHeight: 14, textAlign: 'center' },
});
