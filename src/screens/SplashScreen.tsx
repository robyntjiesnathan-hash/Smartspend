import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { useApp } from '../context/AppContext';

const FEATURES = [
  { icon: '📊', title: 'Track every dollar', desc: 'Log expenses in seconds and see exactly where your money goes.' },
  { icon: '🏆', title: 'Level up your habits', desc: 'Earn XP, hit streaks, and unlock rewards for smart spending.' },
  { icon: '🔔', title: 'Stay on track daily', desc: 'Daily nudges keep your streak alive and your budget on point.' },
];

export function SplashScreen() {
  const { setScreen, setTab, setPlan, navToPaywall, onboardingStep: step, setOnboardingStep: setStep } = useApp();

  const goFree = () => { setScreen('auth'); };
  const goPro  = () => { setPlan('yearly'); setScreen('auth'); };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.inner}>

        {/* ── Step 0: Brand intro ── */}
        {step === 0 && (
          <View style={s.slide}>
            <Text style={s.welcome}>Welcome to</Text>
            <Text style={s.brand}>SmartSpend</Text>
            <View style={s.mascotWrap}>
              <Sprout lvl={1} size={190} mood="happy" acc="hat" />
            </View>
            <Text style={s.tagline}>Grow Strong{'\n'}Money Habits</Text>
          </View>
        )}

        {/* ── Step 1: Features ── */}
        {step === 1 && (
          <View style={s.slide}>
            <Text style={s.slideTitle}>Everything you need</Text>
            <Text style={s.slideSub}>Smart tools to take control of your finances.</Text>
            <View style={s.featureList}>
              {FEATURES.map(f => (
                <View key={f.title} style={s.featureRow}>
                  <View style={s.featureIcon}>
                    <Text style={{ fontSize: 22 }}>{f.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.featTitle}>{f.title}</Text>
                    <Text style={s.featDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 2: Plan chooser ── */}
        {step === 2 && (
          <View style={s.slide}>
            <Text style={s.slideTitle}>Choose your plan</Text>
            <Text style={s.slideSub}>Start free or unlock everything with Pro.</Text>
            <View style={s.planRow}>

              {/* Free card */}
              <TouchableOpacity style={s.freeCard} onPress={goFree} activeOpacity={0.85}>
                <Text style={s.cardIcon}>🌱</Text>
                <Text style={s.cardName}>Free</Text>
                <Text style={s.cardPrice}>$0</Text>
                <Text style={s.cardDesc}>Core features,{'\n'}no credit card</Text>
                <View style={s.freeBtn}><Text style={s.freeBtnTxt}>Continue →</Text></View>
              </TouchableOpacity>

              {/* Pro card */}
              <TouchableOpacity style={s.proCard} onPress={goPro} activeOpacity={0.85}>
                <View style={s.bestBadge}><Text style={s.bestBadgeTxt}>BEST VALUE</Text></View>
                <Text style={s.cardIcon}>👑</Text>
                <Text style={[s.cardName, { color: '#fff' }]}>Pro</Text>
                <Text style={[s.cardPrice, { color: '#C6F135' }]}>
                  {'$4.99'}<Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>/mo</Text>
                </Text>
                <Text style={[s.cardDesc, { color: 'rgba(255,255,255,0.8)' }]}>
                  7-day free trial,{'\n'}cancel anytime
                </Text>
                <View style={s.proBtn}><Text style={s.proBtnTxt}>Start trial →</Text></View>
              </TouchableOpacity>

            </View>
          </View>
        )}

        {/* ── Progress dots ── */}
        <View style={s.dotsRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[s.dot, i === step && s.dotActive]} />
          ))}
        </View>

        {/* ── CTA button (steps 0 & 1 only) ── */}
        {step < 2 && (
          <TouchableOpacity
            style={s.nextBtn}
            onPress={() => setStep(step + 1)}
            activeOpacity={0.85}>
            <Text style={s.nextBtnTxt}>
              {step === 0 ? 'Next →' : 'Get Started →'}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Skip / account link (hidden on plan chooser) ── */}
        {step < 2 && (
          <TouchableOpacity style={s.skipWrap} onPress={() => setScreen('auth')}>
            <Text style={s.skipTxt}>
              {step === 0 ? 'I already have an account' : 'Skip for now'}
            </Text>
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1B6E3A' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },

  slide: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Step 0 — Brand
  welcome: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '700', marginBottom: 2, textAlign: 'center' },
  brand: { color: '#fff', fontSize: 44, fontWeight: '900', letterSpacing: -1.8, marginBottom: 20, textAlign: 'center' },
  mascotWrap: { marginBottom: 20 },
  tagline: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -1, lineHeight: 36, textAlign: 'center' },

  // Steps 1 & 2 — shared
  slideTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.8, textAlign: 'center', marginBottom: 8 },
  slideSub: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 28 },

  // Step 1 — Features
  featureList: { width: '100%', gap: 12 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 16,
  },
  featureIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  featTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 3 },
  featDesc: { color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: '600', lineHeight: 18 },

  // Step 2 — Plan cards
  planRow: { flexDirection: 'row', gap: 12, width: '100%' },
  freeCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 22,
    padding: 16, alignItems: 'center',
  },
  proCard: {
    flex: 1, backgroundColor: '#145229', borderRadius: 22,
    padding: 16, alignItems: 'center',
    borderWidth: 2, borderColor: '#C6F135',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  bestBadge: {
    backgroundColor: '#C6F135', borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
  },
  bestBadgeTxt: { fontSize: 9, fontWeight: '900', color: '#145229', letterSpacing: 0.5 },
  cardIcon: { fontSize: 30, marginBottom: 6 },
  cardName: { fontSize: 17, fontWeight: '900', color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  cardPrice: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 6 },
  cardDesc: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 17, marginBottom: 14 },
  freeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, width: '100%', alignItems: 'center',
  },
  freeBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },
  proBtn: {
    backgroundColor: '#C6F135', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, width: '100%', alignItems: 'center',
  },
  proBtnTxt: { color: '#145229', fontSize: 13, fontWeight: '900' },

  // Dots
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 24, backgroundColor: '#fff', borderRadius: 4 },

  // Next button
  nextBtn: {
    backgroundColor: '#111C11', borderRadius: 18, paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8,
  },
  nextBtnTxt: { color: '#fff', fontSize: 17, fontWeight: '900' },

  // Skip link
  skipWrap: { alignItems: 'center', paddingVertical: 10 },
  skipTxt: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
});
