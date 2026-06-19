import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { P } from '../data/constants';

// ── Step Illustrations ────────────────────────────────────────────────────────

function IllustDashboard() {
  return (
    <View style={il.wrap}>
      <View style={il.balCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={il.balLabel}>Total Balance</Text>
            <Text style={il.balAmt}>$6,831.00</Text>
          </View>
          <View style={il.lvlBadge}>
            <Text style={il.lvlTxt}>Lv.7</Text>
          </View>
        </View>
        <View style={il.xpBarBg}>
          <View style={[il.xpBarFill, { width: '72%' }]} />
        </View>
        <Text style={il.balSub}>720 XP · 280 to next level</Text>
      </View>
      <View style={il.statRow}>
        {[
          { e: '🔥', v: '14', l: 'Day Streak' },
          { e: '❤️', v: '85', l: 'Health' },
          { e: '💸', v: '$380', l: 'Spent' },
        ].map(c => (
          <View key={c.l} style={il.statCard}>
            <Text style={{ fontSize: 18, marginBottom: 2 }}>{c.e}</Text>
            <Text style={il.statVal}>{c.v}</Text>
            <Text style={il.statLbl}>{c.l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function IllustAdd() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.45, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={il.wrap}>
      {[
        { e: '☕', name: 'Morning Coffee', cat: 'Dining Out', amt: '-$4.50', color: P.coral },
        { e: '💰', name: 'Freelance Pay', cat: 'Income', amt: '+$500.00', color: P.green },
      ].map(tx => (
        <View key={tx.name} style={il.txnCard}>
          <Text style={{ fontSize: 22 }}>{tx.e}</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={il.txnName}>{tx.name}</Text>
            <Text style={il.txnCat}>{tx.cat}</Text>
          </View>
          <Text style={[il.txnAmt, { color: tx.color }]}>{tx.amt}</Text>
        </View>
      ))}
      <View style={{ alignItems: 'center', marginTop: 14 }}>
        <Animated.View style={[il.pulseRing, { transform: [{ scale: pulse }] }]} />
        <View style={il.fabBtn}>
          <Text style={il.fabTxt}>+</Text>
        </View>
        <Text style={il.hint}>Tap to record any transaction</Text>
      </View>
    </View>
  );
}

function IllustBudgets() {
  const bars = [
    { e: '🛒', n: 'Groceries', pct: 70, c: P.green },
    { e: '🍽️', n: 'Dining Out', pct: 92, c: P.coral },
    { e: '🚗', n: 'Transport', pct: 22, c: '#FFD84D' },
  ];
  return (
    <View style={il.wrap}>
      {bars.map(b => (
        <View key={b.n} style={il.budgetRow}>
          <View style={il.budgetHead}>
            <Text style={{ fontSize: 14 }}>{b.e}</Text>
            <Text style={il.budgetName}>{b.n}</Text>
            <Text style={[il.budgetPct, b.pct > 85 ? { color: P.coral } : { color: '#fff' }]}>
              {b.pct}%
            </Text>
          </View>
          <View style={il.barBg}>
            <View style={{ height: '100%', borderRadius: 4, width: `${b.pct}%` as any, backgroundColor: b.c }} />
          </View>
        </View>
      ))}
    </View>
  );
}

function IllustSavings() {
  const goals = [
    { e: '🏖️', name: 'Holiday Fund', pct: 65, saved: '$650', target: '$1,000', c: P.purple },
    { e: '🚗', name: 'New Car Fund', pct: 28, saved: '$2,800', target: '$10,000', c: P.green },
  ];
  return (
    <View style={il.wrap}>
      {goals.map(g => (
        <View key={g.name} style={il.goalCard}>
          <Text style={{ fontSize: 28 }}>{g.e}</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={il.goalName}>{g.name}</Text>
            <Text style={il.goalSub}>{g.saved} of {g.target}</Text>
            <View style={[il.barBg, { marginTop: 6 }]}>
              <View style={{ height: '100%', borderRadius: 3, width: `${g.pct}%` as any, backgroundColor: g.c }} />
            </View>
          </View>
          <View style={[il.goalPctBadge, { backgroundColor: g.c }]}>
            <Text style={il.goalPctTxt}>{g.pct}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function IllustXP() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 1000, delay: 200, useNativeDriver: false }).start();
  }, []);
  return (
    <View style={il.wrap}>
      <View style={il.xpCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={il.xpLevel}>Level 7</Text>
            <Text style={il.xpLevelName}>Money Mover 🌿</Text>
          </View>
          <Text style={{ fontSize: 28 }}>🌳</Text>
        </View>
        <View style={[il.barBg, { marginTop: 10, height: 12, width: 210 }]}>
          <Animated.View style={{
            height: '100%', borderRadius: 6,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 210 * 0.72] }),
            backgroundColor: P.lime,
          }} />
        </View>
        <Text style={il.xpSub}>720 / 1,000 XP to Level 8</Text>
      </View>
      <View style={il.streakRow}>
        {[1, 2, 3, 4, 5, 6, 7].map(d => (
          <View key={d} style={[il.streakDot, d <= 5 ? il.streakActive : il.streakInactive]}>
            <Text style={{ fontSize: d <= 5 ? 16 : 11 }}>{d <= 5 ? '🔥' : '–'}</Text>
          </View>
        ))}
      </View>
      <Text style={il.streakLbl}>14-day streak — you're on fire!</Text>
    </View>
  );
}

function IllustReady() {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -14, duration: 600, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <View style={[il.wrap, { alignItems: 'center', justifyContent: 'center' }]}>
      <Animated.Text style={{ fontSize: 68, transform: [{ translateY: bounce }] }}>🌱</Animated.Text>
      <Text style={il.readyTag}>Your Sprout is ready to grow!</Text>
      <View style={il.pillRow}>
        {['📊 Track', '🎯 Budget', '💰 Save', '🔥 Streak'].map(t => (
          <View key={t} style={il.pill}>
            <Text style={il.pillTxt}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    key: 'dashboard',
    title: 'Your Financial Command Centre',
    body: 'See your total balance, daily streak, and health score at a glance — everything in one place.',
    Illust: IllustDashboard,
  },
  {
    key: 'add',
    title: 'Log Transactions in Seconds',
    body: 'Tap the + button to record any expense or income. Every entry earns XP and builds your habit!',
    Illust: IllustAdd,
  },
  {
    key: 'budgets',
    title: 'Stay on Budget Every Month',
    body: 'Set a spending limit for each category. The bar fills as you spend — you\'ll know before you overshoot.',
    Illust: IllustBudgets,
  },
  {
    key: 'savings',
    title: 'Save for What Matters',
    body: 'Create savings goals with a target amount and deadline. Watch your progress fill up as you save!',
    Illust: IllustSavings,
  },
  {
    key: 'xp',
    title: 'Level Up Your Money Habits',
    body: 'Every transaction earns XP. Log daily to grow your streak, level up your Sprout, and unlock rewards.',
    Illust: IllustXP,
  },
  {
    key: 'ready',
    title: "You're All Set — Let's Grow!",
    body: 'Start by logging your first transaction. The sooner you begin, the sooner your Sprout flourishes!',
    Illust: IllustReady,
  },
] as const;

// ── Main component ────────────────────────────────────────────────────────────

export function AppWalkthrough() {
  const { walkthroughDone, completeWalkthrough, go } = useApp();
  const [step, setStep] = useState(0);

  const slideUp = useRef(new Animated.Value(600)).current;
  const bgFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideUp, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
      Animated.timing(bgFade, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  if (walkthroughDone) return null;

  const { title, body, Illust } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const goToStep = (next: number) => {
    Animated.timing(contentFade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(contentFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleNext = () => {
    if (isLast) {
      completeWalkthrough();
      go('add');
      return;
    }
    goToStep(step + 1);
  };

  const handleSkip = () => {
    completeWalkthrough();
  };

  return (
    <Animated.View style={[s.overlay, { opacity: bgFade }]}>
      <Animated.View style={[s.sheet, { transform: [{ translateY: slideUp }] }]}>

        {/* Header row */}
        <View style={s.headerRow}>
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={s.skipTxt}>Skip</Text>
          </TouchableOpacity>
          <Text style={s.stepCount}>{step + 1} / {STEPS.length}</Text>
        </View>

        {/* Illustration panel */}
        <Animated.View style={[s.illustPanel, { opacity: contentFade }]}>
          <Illust />
        </Animated.View>

        {/* Text */}
        <Animated.View style={{ opacity: contentFade }}>
          <Text style={s.title}>{title}</Text>
          <Text style={s.body}>{body}</Text>
        </Animated.View>

        {/* Dots + button */}
        <View style={s.footer}>
          <View style={s.dots}>
            {STEPS.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => goToStep(i)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <View style={[s.dot, i === step ? s.dotOn : s.dotOff]} />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={s.nextTxt}>{isLast ? "Let's Go! 🌱" : 'Next  →'}</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Animated.View>
  );
}

// ── Illustration styles ───────────────────────────────────────────────────────

const il = StyleSheet.create({
  wrap: { gap: 8 },

  // Dashboard
  balCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14, padding: 14,
  },
  balLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  balAmt: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.8 },
  balSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600', marginTop: 4 },
  lvlBadge: { backgroundColor: P.lime, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  lvlTxt: { color: P.limeDark, fontSize: 11, fontWeight: '900' },
  xpBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: P.lime, borderRadius: 3 },
  statRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12, padding: 10, alignItems: 'center',
  },
  statVal: { color: '#fff', fontSize: 15, fontWeight: '900', marginTop: 2 },
  statLbl: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600', marginTop: 1 },

  // Add transaction
  txnCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12, padding: 10,
  },
  txnName: { color: '#fff', fontSize: 13, fontWeight: '800' },
  txnCat: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },
  txnAmt: { fontSize: 14, fontWeight: '900' },
  pulseRing: {
    position: 'absolute',
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 3, borderColor: 'rgba(198,241,53,0.5)',
  },
  fabBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: P.lime, alignItems: 'center', justifyContent: 'center',
  },
  fabTxt: { color: P.greenDeep, fontSize: 28, fontWeight: '900', lineHeight: 32 },
  hint: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', marginTop: 8 },

  // Budgets
  budgetRow: { gap: 5 },
  budgetHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  budgetName: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '800' },
  budgetPct: { fontSize: 11, fontWeight: '900' },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },

  // Savings
  goalCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14, padding: 12,
  },
  goalName: { color: '#fff', fontSize: 13, fontWeight: '800' },
  goalSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', marginTop: 1 },
  goalPctBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, marginLeft: 8 },
  goalPctTxt: { color: '#fff', fontSize: 12, fontWeight: '900' },

  // XP / streak
  xpCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14, padding: 14,
  },
  xpLevel: { color: P.lime, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  xpLevelName: { color: '#fff', fontSize: 16, fontWeight: '900', marginTop: 2 },
  xpSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600', marginTop: 6 },
  barFill: { height: '100%', borderRadius: 6 },
  streakRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 4 },
  streakDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  streakActive: { backgroundColor: 'rgba(255,255,255,0.15)' },
  streakInactive: { backgroundColor: 'rgba(255,255,255,0.06)' },
  streakLbl: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700', textAlign: 'center' },

  // Ready
  readyTag: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 10, textAlign: 'center' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 10 },
  pill: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pillTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
});

// ── Sheet styles ──────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: P.greenDeep,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 36,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipTxt: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '700' },
  stepCount: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '700' },
  illustPanel: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    padding: 16,
    minHeight: 170,
    justifyContent: 'center',
  },
  title: {
    color: '#fff', fontSize: 22, fontWeight: '900',
    letterSpacing: -0.6, lineHeight: 28,
  },
  body: {
    color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '600',
    lineHeight: 20, marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOn: { backgroundColor: P.lime, width: 20 },
  dotOff: { backgroundColor: 'rgba(255,255,255,0.3)' },
  nextBtn: {
    backgroundColor: P.lime,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  nextTxt: { color: P.greenDeep, fontSize: 14, fontWeight: '900' },
});
