import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
  ActivityIndicator, Alert,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { useApp } from '../context/AppContext';
import { PRO_FEATURES, FREE_VS_PRO, P } from '../data/constants';
import { activatePurchase, restorePurchases } from '../utils/purchases';

export function PaywallScreen() {
  const { setScreen, setTab, prevScreen, activatePro, plan, setPlan } = useApp();
  const [loading, setLoading] = useState<'buy' | 'restore' | null>(null);

  const priceLabel  = plan === 'yearly' ? '$4.99' : '$11.99';
  const totalLabel  = plan === 'yearly' ? 'Billed $59.99/yr' : 'Billed monthly';
  const trialLabel  = plan === 'yearly'
    ? 'Cancel anytime · 7-day free trial included'
    : 'Cancel anytime · No contracts';
  const badgeLabel  = plan === 'yearly' ? 'Best value — save 58%' : null;
  const ctaLabel    = plan === 'yearly' ? 'Start free trial' : 'Subscribe now';

  const handleBuy = async () => {
    setLoading('buy');
    try {
      const result = await activatePurchase(plan);
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

  const isBusy = loading !== null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: P.bg }}>
      <View style={{ flex: 1, maxWidth: 390, width: '100%', alignSelf: 'center' }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => { setScreen(prevScreen); if (prevScreen === 'app') setTab('home'); }}
          disabled={isBusy}>
          <Text style={s.backTxt}>← Back</Text>
        </TouchableOpacity>
        <View style={s.headerRow}>
          <Sprout lvl={5} size={84} mood="excited" acc="crown" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={s.proBadge}>
              <Text style={s.proBadgeTxt}>SMARTSPEND PRO</Text>
            </View>
            <Text style={s.headerTitle}>Unlock your full{'\n'}financial potential</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Plan toggle */}
        <View style={s.toggle}>
          {(['yearly', 'monthly'] as const).map(p => (
            <TouchableOpacity
              key={p}
              style={[s.toggleBtn, plan === p && s.toggleBtnActive]}
              onPress={() => setPlan(p)}
              disabled={isBusy}>
              <Text style={[s.toggleTxt, plan === p && s.toggleTxtActive]}>
                {p === 'yearly' ? 'Yearly' : 'Monthly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pricing card */}
        <View style={s.priceCard}>
          {badgeLabel && (
            <View style={s.saveBadge}>
              <Text style={s.saveTxt}>{badgeLabel}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
            <Text style={s.price}>{priceLabel}</Text>
            <Text style={s.perMo}>/mo</Text>
          </View>
          <Text style={s.billed}>{totalLabel}</Text>
        </View>
        <Text style={s.trial}>{trialLabel}</Text>

        {/* CTA */}
        <TouchableOpacity
          style={[s.cta, isBusy && { opacity: 0.7 }]}
          onPress={handleBuy}
          activeOpacity={0.85}
          disabled={isBusy}>
          {loading === 'buy' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.ctaTxt}>{ctaLabel} →</Text>
          )}
        </TouchableOpacity>

        {/* Restore + skip */}
        <View style={s.belowCtaRow}>
          <TouchableOpacity onPress={handleRestore} disabled={isBusy}>
            {loading === 'restore' ? (
              <ActivityIndicator color={P.muted} size="small" />
            ) : (
              <Text style={s.restoreTxt}>Restore purchase</Text>
            )}
          </TouchableOpacity>
          <Text style={s.dot}>·</Text>
          <TouchableOpacity onPress={() => { setScreen('app'); setTab('home'); }} disabled={isBusy}>
            <Text style={s.freeTxt}>Continue free</Text>
          </TouchableOpacity>
        </View>

        {/* Pro features */}
        <Text style={s.sectionLabel}>WHAT YOU GET WITH PRO</Text>
        {PRO_FEATURES.map(f => (
          <View key={f.title} style={s.featureRow}>
            <View style={s.featureIcon}>
              <Text style={{ fontSize: 18 }}>{f.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.featureTitle}>{f.title}</Text>
              <Text style={s.featureDesc}>{f.desc}</Text>
            </View>
            <Text style={{ color: P.green, fontSize: 16, fontWeight: '900' }}>✓</Text>
          </View>
        ))}

        {/* Free vs Pro */}
        <Text style={[s.sectionLabel, { marginTop: 8 }]}>FREE PLAN INCLUDES</Text>
        <View style={s.table}>
          {FREE_VS_PRO.map((row, i) => (
            <View key={row.feat} style={[s.tableRow, i < FREE_VS_PRO.length - 1 && s.tableRowBorder]}>
              <Text style={{ fontSize: 15, marginRight: 10, color: row.free ? P.green : P.coral }}>
                {row.free ? '✓' : '✗'}
              </Text>
              <Text style={s.tableFeat}>{row.feat}</Text>
              <Text style={[s.tableNote, { color: row.free ? P.muted : P.coral }]}>{row.note}</Text>
            </View>
          ))}
        </View>

        {/* Trust badges */}
        <View style={s.trustRow}>
          {[
            { icon: '🔒', label: 'Bank-level\nsecurity' },
            { icon: '🚫', label: 'No ads\never' },
            { icon: '↩️', label: 'Cancel\nanytime' },
          ].map(t => (
            <View key={t.label} style={s.trustCard}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</Text>
              <Text style={s.trustLabel}>{t.label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.legal}>
          Payment processed securely by Apple / Google. By subscribing you agree to our
          Terms of Service and Privacy Policy. Subscription auto-renews unless cancelled.
        </Text>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, backgroundColor: '#1B6E3A' },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99,
    paddingHorizontal: 18, paddingVertical: 9, alignSelf: 'flex-start', marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  backTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  proBadge: {
    backgroundColor: '#C6F135', borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6,
  },
  proBadgeTxt: { fontSize: 10, fontWeight: '900', color: '#145229', letterSpacing: 0.5 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.8, lineHeight: 28 },
  body: { padding: 16, paddingBottom: 40 },
  toggle: {
    flexDirection: 'row', backgroundColor: '#E4EDE4', borderRadius: 14,
    padding: 4, marginBottom: 16,
  },
  toggleBtn: { flex: 1, borderRadius: 11, paddingVertical: 10, alignItems: 'center' },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 4, elevation: 3,
  },
  toggleTxt: { fontSize: 13, fontWeight: '800', color: '#6B8F6B' },
  toggleTxtActive: { color: '#1B6E3A' },
  priceCard: { borderRadius: 22, padding: 20, marginBottom: 6, backgroundColor: '#1B6E3A' },
  saveBadge: {
    backgroundColor: '#C6F135', borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10,
  },
  saveTxt: { fontSize: 11, fontWeight: '900', color: '#145229' },
  price: { color: '#fff', fontSize: 42, fontWeight: '900', lineHeight: 44 },
  perMo: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '700', paddingBottom: 6 },
  billed: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '700' },
  trial: { textAlign: 'center', color: '#6B8F6B', fontSize: 11, fontWeight: '700', marginBottom: 16 },
  cta: {
    backgroundColor: '#111C11', borderRadius: 18, paddingVertical: 17,
    alignItems: 'center', marginBottom: 12, minHeight: 56, justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 6,
  },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },
  belowCtaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 28,
  },
  restoreTxt: { color: '#6B8F6B', fontSize: 12, fontWeight: '700' },
  dot: { color: '#6B8F6B', fontSize: 12 },
  freeTxt: { color: '#6B8F6B', fontSize: 12, fontWeight: '700' },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: '#6B8F6B',
    letterSpacing: 0.6, marginBottom: 12, textTransform: 'uppercase',
  },
  featureRow: {
    backgroundColor: '#fff', borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  featureIcon: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: '#DCF5E7', alignItems: 'center', justifyContent: 'center',
  },
  featureTitle: { fontWeight: '800', fontSize: 13, color: '#111C11', marginBottom: 1 },
  featureDesc: { color: '#6B8F6B', fontSize: 11, fontWeight: '600' },
  table: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11 },
  tableRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F2FAF4' },
  tableFeat: { flex: 1, fontWeight: '700', fontSize: 13, color: '#111C11' },
  tableNote: { fontSize: 11, fontWeight: '700' },
  trustRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  trustCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  trustLabel: { fontSize: 10, fontWeight: '800', color: '#6B8F6B', textAlign: 'center', lineHeight: 14 },
  legal: { textAlign: 'center', color: '#9EB99E', fontSize: 10, fontWeight: '600', lineHeight: 15 },
});
