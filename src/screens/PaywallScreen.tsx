import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { useApp } from '../context/AppContext';
import { activatePurchase, restorePurchases } from '../utils/purchases';

const BENEFITS = [
  { icon: '📊', text: 'Unlimited budgets & categories' },
  { icon: '🏆', text: 'Full progress tracking & levels' },
  { icon: '🎨', text: 'Custom themes & accessories' },
  { icon: '🚫', text: 'No ads, ever' },
];

export function PaywallScreen() {
  const { setScreen, setTab, prevScreen, activatePro } = useApp();
  const [loading, setLoading] = useState<'buy' | 'restore' | null>(null);
  const isBusy = loading !== null;

  const handleBuy = async () => {
    setLoading('buy');
    try {
      const result = await activatePurchase('yearly');
      if (result.ok) {
        activatePro();
      } else if (!result.cancelled) {
        Alert.alert('Purchase failed', result.message);
      }
    } catch {
      Alert.alert('Something went wrong', 'Please check your connection and try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading('restore');
    try {
      const result = await restorePurchases();
      if (result.ok) {
        activatePro();
        Alert.alert('Purchase restored!', 'Welcome back to Pro 🎉');
      } else {
        Alert.alert('No purchase found', result.message);
      }
    } catch {
      Alert.alert('Something went wrong', 'Please check your connection and try again.');
    } finally {
      setLoading(null);
    }
  };

  const goBack = () => {
    setScreen(prevScreen);
    if (prevScreen === 'app') setTab('home');
  };

  return (
    <SafeAreaView style={s.safe}>

      {/* ── Back button — always visible at the top ── */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={goBack} disabled={isBusy}>
          <Text style={s.backTxt}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable hero + benefits ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}>

        <View style={s.hero}>
          <Sprout lvl={5} size={100} mood="excited" acc="crown" />
          <View style={s.proBadge}>
            <Text style={s.proBadgeTxt}>SMARTSPEND PRO</Text>
          </View>
          <Text style={s.headline}>Unlock every feature</Text>
          <Text style={s.subline}>
            <Text style={s.price}>$4.99</Text>
            <Text style={s.priceUnit}>/mo</Text>
            {'  ·  '}
            <Text style={s.trial}>7-day free trial</Text>
          </Text>
          <Text style={s.billed}>Billed $59.99/yr · Cancel anytime</Text>
        </View>

        <View style={s.benefits}>
          {BENEFITS.map(b => (
            <View key={b.text} style={s.benefitRow}>
              <View style={s.benefitIcon}>
                <Text style={{ fontSize: 18 }}>{b.icon}</Text>
              </View>
              <Text style={s.benefitTxt}>{b.text}</Text>
              <Text style={s.check}>✓</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* ── Fixed footer — CTA always visible ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.cta, isBusy && { opacity: 0.7 }]}
          onPress={handleBuy}
          activeOpacity={0.85}
          disabled={isBusy}>
          {loading === 'buy'
            ? <ActivityIndicator color="#1B6E3A" />
            : <Text style={s.ctaTxt}>Start Free Trial →</Text>}
        </TouchableOpacity>

        <View style={s.links}>
          <TouchableOpacity onPress={() => { setScreen('app'); setTab('home'); }} disabled={isBusy}>
            <Text style={s.linkTxt}>Continue free</Text>
          </TouchableOpacity>
          <Text style={s.dot}>·</Text>
          <TouchableOpacity onPress={handleRestore} disabled={isBusy}>
            {loading === 'restore'
              ? <ActivityIndicator color="rgba(255,255,255,0.5)" size="small" />
              : <Text style={s.linkTxt}>Restore purchase</Text>}
          </TouchableOpacity>
        </View>

        <Text style={s.legal}>
          Auto-renews yearly. Cancel anytime in your account settings.
        </Text>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1B6E3A' },

  topBar: {
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 99,
    paddingHorizontal: 18, paddingVertical: 9, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  backTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },

  scroll: {
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16,
    gap: 20,
  },

  // Hero
  hero: { alignItems: 'center', gap: 6 },
  proBadge: {
    backgroundColor: '#C6F135', borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 4, marginTop: 6,
  },
  proBadgeTxt: { fontSize: 11, fontWeight: '900', color: '#145229', letterSpacing: 0.6 },
  headline: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.8, marginTop: 2 },
  subline: { fontSize: 16, marginTop: 2 },
  price: { color: '#C6F135', fontSize: 26, fontWeight: '900' },
  priceUnit: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '700' },
  trial: { color: '#fff', fontSize: 15, fontWeight: '700' },
  billed: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '600' },

  // Benefits
  benefits: { gap: 10 },
  benefitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14,
  },
  benefitIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  benefitTxt: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
  check: { color: '#C6F135', fontSize: 18, fontWeight: '900' },

  // Fixed footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1B6E3A',
  },
  cta: {
    backgroundColor: '#C6F135', borderRadius: 18, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center', minHeight: 58,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8,
  },
  ctaTxt: { color: '#145229', fontSize: 17, fontWeight: '900' },

  links: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  linkTxt: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
  dot: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },

  legal: {
    textAlign: 'center', color: 'rgba(255,255,255,0.35)',
    fontSize: 11, fontWeight: '600', lineHeight: 16,
  },
});
