import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { TIPS, THEMES, P, getLvl, fmt, pct, CAT_ICON, fmtDate } from '../data/constants';

export function HomeScreen() {
  const { isPro, xp, streak, mood, msg, acc, theme, setScreen, tipIdx, setTipIdx, go, setAddType, transactions, userProfile, savingsGoals, budgets } = useApp();
  const th = useMemo(() => THEMES.find(t => t.id === theme) || THEMES[0], [theme]);
  const { c, p: lvlPct, inn, inn2 } = useMemo(() => getLvl(xp), [xp]);
  const personalizedTips = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const weekExpenses = transactions.filter(t => t.type === 'expense' && t.date >= weekAgo);
    const weekTotal = weekExpenses.reduce((s, t) => s + t.amount, 0);
    const byCat: Record<string, number> = {};
    weekExpenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const tips: { icon: string; text: string }[] = [];
    if (streak >= 7) tips.push({ icon: '🔥', text: `${streak}-day streak! You're building a real habit — don't break it.` });
    if (topCat && weekTotal > 0) tips.push({ icon: CAT_ICON[topCat[0]] || '📊', text: `${topCat[0]} is your top spend this week at $${Math.round(topCat[1])}. Any room to trim?` });
    if (weekTotal > 0) tips.push({ icon: '💡', text: `You've spent $${Math.round(weekTotal)} in the last 7 days. Tap Weekly for the full picture.` });
    if (budgets.length === 0 && transactions.length >= 3) tips.push({ icon: '🎯', text: 'You have transactions but no budget set. Lock in a limit — takes 30 seconds.' });
    if (savingsGoals.length === 0) tips.push({ icon: '✈️', text: 'Start a savings goal and watch the progress ring fill up every time you add funds.' });
    if (transactions.length === 0) tips.push({ icon: '📝', text: 'Log your first expense today to start building your financial picture.' });
    return tips.length > 0 ? tips : TIPS;
  }, [transactions, streak, budgets, savingsGoals]);

  const tip = personalizedTips[tipIdx % personalizedTips.length];

  const noSpendInfo = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const monthStr = today.slice(0, 7);
    const isNoSpendToday = !transactions.some(t => t.type === 'expense' && t.date === today);
    const expenseDays = new Set(
      transactions.filter(t => t.type === 'expense' && t.date.startsWith(monthStr)).map(t => t.date),
    );
    const daysElapsed = new Date().getDate();
    const noSpendCount = Math.max(0, daysElapsed - expenseDays.size);
    return { isNoSpendToday, noSpendCount, daysElapsed };
  }, [transactions]);

  const health = useMemo(() => {
    const monthStr = new Date().toISOString().slice(0, 7);
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
  }, [transactions, streak, savingsGoals, budgets]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const balance = useMemo(
    () => transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0),
    [transactions],
  );
  const balanceFmt = (balance < 0 ? '-' : '') + fmt(Math.abs(balance));

  const strip = useMemo(() => {
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return [-2, -1, 0, 1, 2, 3].map(off => {
      const d = new Date(today); d.setDate(today.getDate() + off);
      return { d: DAY_NAMES[d.getDay()], n: d.getDate(), t: off === 0 };
    });
  }, []);

  const qaItems = [
    { label: 'Log expense', sub: 'Track a spend',       icon: '📝', bg: th.primary,  tc: '#fff',         a: 'log' },
    { label: 'Add income',  sub: 'Record earnings',     icon: '💰', bg: th.accent,   tc: P.limeDark,     a: 'income' },
    { label: 'New goal',    sub: 'Start a quest',       icon: '🎯', bg: P.purple,    tc: '#fff',         a: 'goal' },
    {
      label: isPro ? 'Rewards' : 'Go Pro',
      sub: isPro ? 'Unlock themes' : 'Unlock all features',
      icon: isPro ? '🎁' : '⭐',
      bg: isPro ? P.yellow : P.dark,
      tc: isPro ? P.dark : '#C6F135',
      a: isPro ? 'rewards' : 'gopro',
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: th.primary }]}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerSub}>{greeting}{userProfile ? `, ${userProfile.displayName.split(' ')[0]}` : ''}</Text>
            <Text style={s.headerTitle}>SmartSpend</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 5 }}>
            <View style={s.lvlBox}>
              <Text style={s.lvlLabel}>Level</Text>
              <Text style={s.lvlNum}>{c.lvl}</Text>
            </View>
            {isPro
              ? <View style={s.proBadge}><Text style={s.proBadgeTxt}>PRO</Text></View>
              : <TouchableOpacity style={s.upgradBtn} onPress={() => setScreen('paywall')}>
                  <Text style={s.upgradTxt}>Upgrade</Text>
                </TouchableOpacity>
            }
          </View>
        </View>

        {/* XP bar */}
        <View style={s.xpRow}>
          <Text style={s.xpName}>{c.name}</Text>
          <Text style={s.xpNum}>{inn}/{inn2} XP · {lvlPct}%</Text>
        </View>
        <View style={s.xpBg}>
          <View style={[s.xpFill, { width: `${lvlPct}%`, backgroundColor: th.accent }]} />
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[{ l: 'Balance', v: balanceFmt }, { l: 'Streak', v: `🔥 ${streak}d` }, { l: 'Health', v: `${health}/100` }].map(stat => (
            <View key={stat.l} style={s.statBox}>
              <Text style={s.statLabel}>{stat.l}</Text>
              <Text style={s.statVal}>{stat.v}</Text>
            </View>
          ))}
        </View>

        {/* Date strip */}
        <View style={s.dateStrip}>
          {strip.map((d, i) => (
            <View key={i} style={s.dateItem}>
              <Text style={[s.dayName, d.t && { color: P.dark }]}>{d.d}</Text>
              <View style={[s.dayNum, d.t && { backgroundColor: th.accent }]}>
                <Text style={[s.dayNumTxt, d.t && { color: P.dark }]}>{d.n}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Sprout message */}
      <View style={[s.sproutBar, { backgroundColor: th.accent }]}>
        <Sprout lvl={c.lvl} size={100} mood={mood} acc={acc} />
        <View style={{ flex: 1 }}>
          <Text style={[s.sproutLabel, { color: P.limeDark }]}>Sprout says</Text>
          <Text style={[s.sproutMsg, { color: P.dark }]}>{msg}</Text>
        </View>
      </View>

      {/* No-Spend Day tracker */}
      <View style={[s.noSpendCard, noSpendInfo.isNoSpendToday && s.noSpendCardActive]}>
        <Text style={{ fontSize: 22 }}>{noSpendInfo.isNoSpendToday ? '🛡️' : '💸'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.noSpendTitle}>
            {noSpendInfo.isNoSpendToday ? 'No-Spend Day in progress!' : 'You spent money today'}
          </Text>
          <Text style={s.noSpendSub}>
            {noSpendInfo.noSpendCount} no-spend day{noSpendInfo.noSpendCount !== 1 ? 's' : ''} this month
          </Text>
        </View>
        <View style={[s.noSpendBadge, noSpendInfo.isNoSpendToday && s.noSpendBadgeActive]}>
          <Text style={[s.noSpendBadgeTxt, noSpendInfo.isNoSpendToday && { color: P.greenDeep }]}>
            {noSpendInfo.noSpendCount}/{noSpendInfo.daysElapsed}d
          </Text>
        </View>
      </View>

      {/* Tip bar */}
      <View style={s.tipBar}>
        <Text style={{ fontSize: 18 }}>{tip.icon}</Text>
        <Text style={s.tipText}>{tip.text}</Text>
        <TouchableOpacity style={s.tipNext} onPress={() => setTipIdx(i => i + 1)}>
          <Text style={s.tipNextTxt}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16, paddingBottom: 32 }}>
        {/* Quick actions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionLabel}>QUICK ACTIONS</Text>
          <TouchableOpacity style={s.weeklyBtn} onPress={() => go('weekly')}>
            <Text style={s.weeklyTxt}>Weekly</Text>
          </TouchableOpacity>
        </View>
        <View style={s.qaGrid}>
          {qaItems.map(q => (
            <TouchableOpacity
              key={q.label}
              style={[s.qaCard, { backgroundColor: q.bg }]}
              activeOpacity={0.8}
              onPress={() => {
                if (q.a === 'rewards') { go('profile'); return; }
                if (q.a === 'gopro') { setScreen('paywall'); return; }
                if (q.a === 'goal') { go('savings'); return; }
                if (q.a === 'income') { setAddType('income'); go('add'); return; }
                go('add');
              }}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{q.icon}</Text>
              <Text style={[s.qaLabel, { color: q.tc }]}>{q.label}</Text>
              <Text style={[s.qaSub, { color: q.tc + 'AA' }]}>{q.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Savings Goals */}
        <View style={[s.sectionHeader, { marginTop: 6 }]}>
          <Text style={s.sectionLabel}>SAVINGS GOALS</Text>
          <TouchableOpacity style={s.weeklyBtn} onPress={() => go('savings')}>
            <Text style={s.weeklyTxt}>{savingsGoals.length ? 'View all' : 'Add goal'}</Text>
          </TouchableOpacity>
        </View>
        {savingsGoals.length === 0 ? (
          <TouchableOpacity style={s.emptyGoals} onPress={() => go('savings')} activeOpacity={0.8}>
            <Text style={{ fontSize: 24, marginBottom: 6 }}>🎯</Text>
            <Text style={s.emptyGoalsTxt}>Create your first savings goal</Text>
          </TouchableOpacity>
        ) : savingsGoals.slice(0, 3).map(q => {
          const pc = pct(q.savedAmount, q.targetAmount);
          return (
            <View key={q.id} style={s.questCard}>
              <Ring pct={pc} sz={50} sw={5} col={q.color} bg={q.colorLight}>
                <Text style={{ fontSize: 16 }}>{q.emoji}</Text>
              </Ring>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={s.questTitleRow}>
                  <Text style={s.questTitle}>{q.title}</Text>
                  <View style={[s.badge, { backgroundColor: q.colorLight }]}>
                    <Text style={[s.badgeTxt, { color: q.colorDark }]}>{pc}%</Text>
                  </View>
                </View>
                <Text style={s.questAmt}>{fmt(q.savedAmount)} / {fmt(q.targetAmount)}</Text>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${pc}%`, backgroundColor: q.color }]} />
                </View>
                {pc >= 70 && pc < 100 && <Text style={[s.questAlmost, { color: q.color }]}>{pc}% done — almost there!</Text>}
                {pc >= 100 && <Text style={[s.questAlmost, { color: q.color }]}>🎉 Goal reached!</Text>}
              </View>
            </View>
          );
        })}

        {/* Recent transactions */}
        <View style={[s.sectionHeader, { marginTop: 14, marginBottom: 10 }]}>
          <Text style={s.sectionLabel}>RECENT TRANSACTIONS</Text>
          <TouchableOpacity style={s.weeklyBtn} onPress={() => go('transactions')}>
            <Text style={s.weeklyTxt}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={s.txnCard}>
          {transactions.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📝</Text>
              <Text style={{ color: P.muted, fontSize: 13, fontWeight: '700' }}>No transactions yet</Text>
              <Text style={{ color: P.muted, fontSize: 11, marginTop: 3 }}>Tap Log to add your first one</Text>
            </View>
          ) : transactions.slice(0, 5).map((tx, i) => (
            <View key={tx.id} style={[s.txnRow, i < Math.min(4, transactions.length - 1) && s.txnBorder]}>
              <View style={[s.txnIcon, { backgroundColor: tx.type === 'income' ? '#DCF5E7' : '#F5F5F5' }]}>
                <Text style={{ fontSize: 16 }}>{CAT_ICON[tx.category] || '📝'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.txnLabel} numberOfLines={1}>{tx.note}</Text>
                <Text style={s.txnSub}>{tx.category} · {fmtDate(tx.date, 'short')}</Text>
              </View>
              <Text style={[s.txnAmt, { color: tx.type === 'income' ? P.greenDeep : P.dark }]}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { padding: 18, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', marginBottom: 1 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  lvlBox: { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: 6, paddingHorizontal: 12, alignItems: 'center' },
  lvlLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  lvlNum: { color: '#fff', fontSize: 16, fontWeight: '900' },
  proBadge: { backgroundColor: '#C6F135', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 2 },
  proBadgeTxt: { fontSize: 9, fontWeight: '900', color: '#145229' },
  upgradBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  upgradTxt: { color: '#fff', fontSize: 9, fontWeight: '800' },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  xpName: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700' },
  xpNum: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  xpBg: { height: 11, backgroundColor: 'rgba(0,0,0,0.16)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 },
  xpFill: { height: '100%', borderRadius: 99 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  statVal: { color: '#fff', fontWeight: '900', fontSize: 14 },
  dateStrip: { flexDirection: 'row', paddingBottom: 10 },
  dateItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 },
  dayName: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.55)' },
  dayNum: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dayNumTxt: { fontSize: 13, fontWeight: '900', color: '#fff' },
  sproutBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  sproutLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  sproutMsg: { fontSize: 13, fontWeight: '700', lineHeight: 19 },
  noSpendCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18,
    padding: 13, paddingHorizontal: 16,
    marginHorizontal: 16, marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  noSpendCardActive: { backgroundColor: '#DCF5E7', borderColor: '#3DBA6A' },
  noSpendTitle: { fontWeight: '900', fontSize: 13, color: '#111C11', marginBottom: 1 },
  noSpendSub: { color: '#6B8F6B', fontSize: 11, fontWeight: '600' },
  noSpendBadge: { backgroundColor: '#F0F4F0', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  noSpendBadgeActive: { backgroundColor: '#C6F135' },
  noSpendBadgeTxt: { fontSize: 12, fontWeight: '900', color: '#6B8F6B' },
  tipBar: {
    backgroundColor: P.greenDark, flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 4, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 13, gap: 10,
  },
  tipText: { flex: 1, color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: '700', lineHeight: 18 },
  tipNext: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tipNextTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase' },
  weeklyBtn: { backgroundColor: '#1B6E3A', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  weeklyTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  qaCard: { width: '47%', borderRadius: 22, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 9, elevation: 5 },
  qaLabel: { fontSize: 14, fontWeight: '900', marginBottom: 2 },
  qaSub: { fontSize: 11, fontWeight: '600' },
  questCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 13, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  questTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  questTitle: { fontWeight: '900', fontSize: 13, color: '#111C11', flex: 1, marginRight: 8 },
  badge: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3 },
  badgeTxt: { fontSize: 10, fontWeight: '800' },
  questAmt: { color: '#6B8F6B', fontSize: 11, fontWeight: '700', marginBottom: 5 },
  progressBg: { height: 7, backgroundColor: '#E8F0E8', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  questAlmost: { fontSize: 10, fontWeight: '800', marginTop: 3 },
  emptyGoals: {
    backgroundColor: '#fff', borderRadius: 18, padding: 20,
    alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  emptyGoalsTxt: { color: P.muted, fontSize: 13, fontWeight: '700' },
  txnCard: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, paddingHorizontal: 14 },
  txnBorder: { borderBottomWidth: 1, borderBottomColor: '#EBF3EC' },
  txnIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txnLabel: { fontWeight: '800', fontSize: 13, color: '#111C11' },
  txnSub: { color: '#6B8F6B', fontSize: 11, fontWeight: '600' },
  txnAmt: { fontWeight: '900', fontSize: 14 },
});
