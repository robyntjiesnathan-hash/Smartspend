import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { QUESTS, TXNS, TIPS, THEMES, P, getLvl, fmt, pct } from '../data/constants';

export function HomeScreen() {
  const { isPro, xp, streak, mood, msg, acc, theme, setScreen, tipIdx, setTipIdx, go } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];
  const { c, p: lvlPct, inn, inn2 } = getLvl(xp);
  const tip = TIPS[tipIdx % TIPS.length];
  const health = 82;

  const today = new Date();
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const strip = [-2, -1, 0, 1, 2, 3].map(off => {
    const d = new Date(today); d.setDate(today.getDate() + off);
    return { d: DAY_NAMES[d.getDay()], n: d.getDate(), t: off === 0 };
  });

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
            <Text style={s.headerSub}>Good morning</Text>
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
          {[{ l: 'Balance', v: '$4,610' }, { l: 'Streak', v: `🔥 ${streak}d` }, { l: 'Health', v: `${health}/100` }].map(stat => (
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
                go('add');
              }}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{q.icon}</Text>
              <Text style={[s.qaLabel, { color: q.tc }]}>{q.label}</Text>
              <Text style={[s.qaSub, { color: q.tc + 'AA' }]}>{q.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quests */}
        <Text style={[s.sectionLabel, { marginBottom: 10, marginTop: 6 }]}>ACTIVE QUESTS</Text>
        {QUESTS.map(q => {
          const pc = pct(q.saved, q.target);
          return (
            <View key={q.id} style={s.questCard}>
              <Ring pct={pc} sz={50} sw={5} col={q.col} bg={q.colL}>
                <Text style={{ fontSize: 16 }}>{q.emoji}</Text>
              </Ring>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={s.questTitleRow}>
                  <Text style={s.questTitle}>{q.title}</Text>
                  <View style={[s.badge, { backgroundColor: q.colL }]}>
                    <Text style={[s.badgeTxt, { color: q.colD }]}>{pc}%</Text>
                  </View>
                </View>
                <Text style={s.questAmt}>{fmt(q.saved)} / {fmt(q.target)}</Text>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${pc}%`, backgroundColor: q.col }]} />
                </View>
                {pc >= 70 && <Text style={[s.questAlmost, { color: q.col }]}>{pc}% done — almost there!</Text>}
              </View>
            </View>
          );
        })}

        {/* Recent transactions */}
        <Text style={[s.sectionLabel, { marginTop: 14, marginBottom: 10 }]}>RECENT TRANSACTIONS</Text>
        <View style={s.txnCard}>
          {TXNS.slice(0, 5).map((tx, i) => (
            <View key={tx.label} style={[s.txnRow, i < 4 && s.txnBorder]}>
              <View style={[s.txnIcon, { backgroundColor: tx.amount > 0 ? '#DCF5E7' : '#F5F5F5' }]}>
                <Text style={{ fontSize: 16 }}>{tx.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.txnLabel} numberOfLines={1}>{tx.label}</Text>
                <Text style={s.txnSub}>{tx.cat} · {tx.date}</Text>
              </View>
              <Text style={[s.txnAmt, { color: tx.amount > 0 ? P.greenDeep : P.dark }]}>
                {tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}
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
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1 },
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
  xpBg: { height: 9, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 },
  xpFill: { height: '100%', borderRadius: 99 },
  statsRow: { flexDirection: 'row', gap: 7, marginBottom: 14 },
  statBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 13, paddingVertical: 8, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  statVal: { color: '#fff', fontWeight: '900', fontSize: 13 },
  dateStrip: { flexDirection: 'row', paddingBottom: 10 },
  dateItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 },
  dayName: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.55)' },
  dayNum: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dayNumTxt: { fontSize: 13, fontWeight: '900', color: '#fff' },
  sproutBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  sproutLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  sproutMsg: { fontSize: 13, fontWeight: '700', lineHeight: 19 },
  tipBar: {
    backgroundColor: '#111C11', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  tipText: { flex: 1, color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: '700', lineHeight: 18 },
  tipNext: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tipNextTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase' },
  weeklyBtn: { backgroundColor: '#1B6E3A', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  weeklyTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  qaCard: { width: '47%', borderRadius: 20, padding: 15 },
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
  progressBg: { height: 5, backgroundColor: '#E8F0E8', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  questAlmost: { fontSize: 10, fontWeight: '800', marginTop: 3 },
  txnCard: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, paddingHorizontal: 14 },
  txnBorder: { borderBottomWidth: 1.5, borderBottomColor: '#F2FAF4' },
  txnIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txnLabel: { fontWeight: '800', fontSize: 13, color: '#111C11' },
  txnSub: { color: '#6B8F6B', fontSize: 11, fontWeight: '600' },
  txnAmt: { fontWeight: '900', fontSize: 14 },
});
