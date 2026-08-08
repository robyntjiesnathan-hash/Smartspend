import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
  Platform, Modal, Linking, SafeAreaView, TextInput,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { useApp } from '../context/AppContext';
import { THEMES, ACCESSORIES, CURRENCIES, P, getLvl } from '../data/constants';
import {
  requestNotifPermission,
  scheduleDailyReminder,
  scheduleWeeklySummary,
  scheduleStreakAlert,
  scheduleMascotTip,
  cancelNotif,
} from '../utils/notifications';
import { getNotifIds, saveNotifIds } from '../storage';

const LEGAL: Record<'tos' | 'privacy', { title: string; body: string }> = {
  tos: {
    title: 'Terms of Service',
    body: `Last updated: June 2026

1. ACCEPTANCE
By downloading or using SmartSpend you agree to these Terms of Service. If you do not agree, do not use the app.

2. DESCRIPTION OF SERVICE
SmartSpend is a personal finance tracking tool that helps you log expenses, set budgets, and build healthy money habits. It is provided for informational and personal organisational purposes only.

3. NO FINANCIAL ADVICE
Nothing in SmartSpend constitutes financial, investment, tax, or legal advice. Always consult a qualified professional before making financial decisions.

4. YOUR DATA
Guest users store all data locally on their device. Users who create an account have their data securely synced to our cloud database (Supabase) to enable access across devices. You may delete your account and all associated data at any time by contacting us.

5. SUBSCRIPTIONS
SmartSpend offers a free tier and may offer a Pro subscription in future. Any subscription terms will be displayed clearly before purchase. Subscriptions automatically renew unless cancelled at least 24 hours before the renewal date through your App Store account settings.

6. REFUNDS
Refund requests are handled by Apple in accordance with their refund policy.

7. ACCEPTABLE USE
You agree not to reverse-engineer, copy, modify, or distribute any part of the app.

8. LIMITATION OF LIABILITY
To the fullest extent permitted by law, SmartSpend and its developers are not liable for any indirect, incidental, special, or consequential damages arising from your use of the app.

9. CHANGES TO TERMS
We may update these terms at any time. Continued use of the app after changes constitutes your acceptance of the updated terms.

10. CONTACT
questions@smartspend.app`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `Last updated: June 2026

1. OVERVIEW
SmartSpend is designed with privacy first. We collect only what is necessary to provide the service.

2. DATA WE COLLECT

Guest users (no account):
• All data is stored locally on your device using AsyncStorage only.
• Nothing is transmitted to our servers.

Users with an account:
• Your email address, used to identify your account.
• Financial data you enter: transactions, budgets, and savings goals.
• App preferences: theme, settings, XP and streak progress.
• This data is stored securely in our cloud database (Supabase) to enable sync across devices.

3. HOW WE USE YOUR DATA
We use your data solely to provide the SmartSpend service. We do not sell, share, or use your data for advertising or analytics.

4. DATA STORAGE & SECURITY
Account data is stored in Supabase, a secure cloud database with row-level security ensuring you can only access your own data. All data is transmitted over HTTPS.

5. DATA DELETION
You can delete your account and all associated data at any time by contacting privacy@smartspend.app. Guest data can be deleted by clearing app data in your device settings or uninstalling the app.

6. PUSH NOTIFICATIONS
Reminders are scheduled locally on your device. No notification data is sent to external servers.

7. ANALYTICS & ADVERTISING
SmartSpend contains no third-party analytics SDKs, advertising networks, or tracking pixels.

8. CHILDREN
SmartSpend is not directed at children under the age of 13. We do not knowingly collect personal information from children.

9. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. The date at the top of this document reflects the latest revision.

10. CONTACT
privacy@smartspend.app`,
  },
};

export function ProfileScreen() {
  const {
    xp, streak, isPro, mood, acc, setAcc, theme, setTheme, currency, setCurrency,
    rewardTab, setRewardTab, profTab, setProfTab,
    toggles, setToggles, setScreen, userProfile, signOutUser, updateDisplayName,
  } = useApp();
  const [notifIds, setNotifIds] = useState<(string | null)[]>([null, null, null, null]);
  const [legalModal, setLegalModal] = useState<null | 'tos' | 'privacy'>(null);

  useEffect(() => { getNotifIds().then(setNotifIds); }, []);
  useEffect(() => { saveNotifIds(notifIds).catch(() => {}); }, [notifIds]);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile?.displayName || '');
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const NOTIF_SCHEDULERS = [
    scheduleDailyReminder,
    scheduleWeeklySummary,
    scheduleStreakAlert,
    scheduleMascotTip,
  ];

  const handleToggle = async (idx: number) => {
    const enabling = !toggles[idx];

    if (Platform.OS === 'web') {
      // On web just flip the preference — no native notification scheduling
      setToggles(t => { const n = [...t]; n[idx] = enabling; return n; });
      return;
    }

    if (enabling) {
      const granted = await requestNotifPermission();
      if (!granted) {
        Alert.alert(
          'Notifications blocked',
          'Enable notifications in your device Settings to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }
      const id = await NOTIF_SCHEDULERS[idx]();
      setNotifIds(prev => { const n = [...prev]; n[idx] = id; return n; });
    } else {
      if (notifIds[idx]) await cancelNotif(notifIds[idx]!);
      setNotifIds(prev => { const n = [...prev]; n[idx] = null; return n; });
    }
    setToggles(t => { const n = [...t]; n[idx] = enabling; return n; });
  };
  const { c } = getLvl(xp);

  return (
    <>
    <ScrollView style={{ flex: 1, backgroundColor: P.bg }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: P.greenDeep }]}>
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Sprout lvl={c.lvl} size={110} mood={mood} acc={acc} />
        </View>
        {editName ? (
          <View style={s.editNameRow}>
            <TextInput
              style={s.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Your name"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoFocus
              onSubmitEditing={() => {
                if (nameInput.trim()) updateDisplayName(nameInput.trim());
                setEditName(false);
              }}
            />
            <TouchableOpacity
              style={s.nameSaveBtn}
              onPress={() => {
                if (nameInput.trim()) updateDisplayName(nameInput.trim());
                setEditName(false);
              }}>
              <Text style={s.nameSaveTxt}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => { setNameInput(userProfile?.displayName || ''); setEditName(true); }}>
            <Text style={s.name}>{userProfile?.displayName || 'Your Account'} ✏️</Text>
          </TouchableOpacity>
        )}
        {userProfile?.email ? (
          <Text style={s.email}>{userProfile.email}</Text>
        ) : null}
        <Text style={s.sub}>Level {c.lvl} · {c.name} · {xp} XP</Text>
        <View style={s.badgeRow}>
          <View style={s.badge}><Text style={s.badgeTxt}>🔥 {streak}-day streak</Text></View>
          <View style={[s.badge, isPro && s.proBadge]}>
            <Text style={[s.badgeTxt, isPro && { color: P.greenDark }]}>{isPro ? 'PRO' : 'Free'}</Text>
          </View>
        </View>
      </View>

      {/* Tab bar */}
      <View style={[s.tabBar, { backgroundColor: P.lime }]}>
        {(['rewards', 'settings'] as const).map(t => (
          <TouchableOpacity key={t} style={s.tabBtn} onPress={() => setProfTab(t)}>
            <Text style={[s.tabTxt, profTab === t && s.tabTxtActive]}>
              {t === 'rewards' ? 'Rewards' : 'Settings'}
            </Text>
            <View style={[s.tabLine, profTab === t && s.tabLineActive]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ padding: 16, paddingBottom: 32 }}>
        {profTab === 'rewards' ? (
          <>
            {/* Rewards sub-tab */}
            <View style={s.subtabRow}>
              {(['themes', 'accessories'] as const).map(t => (
                <TouchableOpacity
                  key={t} style={[s.subtabBtn, rewardTab === t && s.subtabBtnActive]}
                  onPress={() => setRewardTab(t)}>
                  <Text style={[s.subtabTxt, rewardTab === t && s.subtabTxtActive]}>
                    {t === 'themes' ? 'Themes' : 'Accessories'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {rewardTab === 'themes' && THEMES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[s.themeCard, { borderColor: theme === t.id ? t.primary : 'transparent' }, t.locked && { opacity: 0.5 }]}
                onPress={() => !t.locked && setTheme(t.id)}
                activeOpacity={t.locked ? 1 : 0.8}>
                <View style={[s.themeColor, { backgroundColor: t.primary }]}>
                  <View style={[s.themeAccent, { backgroundColor: t.accent }]} />
                  {t.locked && (
                    <View style={s.lockOverlay}><Text>🔒</Text></View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.themeName}>{t.name}</Text>
                  <Text style={s.themeDesc}>{t.desc}</Text>
                </View>
                {theme === t.id && (
                  <View style={[s.badge, { backgroundColor: '#DCF5E7' }]}>
                    <Text style={[s.badgeTxt, { color: P.greenDeep }]}>Active</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {rewardTab === 'accessories' && (
              <View style={s.accGrid}>
                {ACCESSORIES.map(a => (
                  <TouchableOpacity
                    key={a.id}
                    style={[s.accCard, { borderColor: acc === a.id ? P.green : 'transparent' }, a.locked && { opacity: 0.45 }]}
                    onPress={() => !a.locked && setAcc(a.id)}
                    activeOpacity={a.locked ? 1 : 0.8}>
                    <Text style={{ fontSize: 28, marginBottom: 6 }}>{a.locked ? '🔒' : a.emoji || '✨'}</Text>
                    <Text style={s.accName}>{a.name}</Text>
                    <Text style={s.accDesc}>{a.desc}</Text>
                    {acc === a.id && (
                      <View style={[s.badge, { backgroundColor: '#DCF5E7', marginTop: 7 }]}>
                        <Text style={[s.badgeTxt, { color: P.greenDeep }]}>Wearing</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={s.sectionLabel}>CURRENCY</Text>
            <Text style={s.currencyHint}>Choose the currency used to track your transactions, budgets, and goals.</Text>
            <View style={s.currencyGrid}>
              {CURRENCIES.map(c => (
                <TouchableOpacity
                  key={c.code}
                  style={[s.currencyChip, currency === c.code && s.currencyChipActive]}
                  onPress={() => setCurrency(c.code)}
                  activeOpacity={0.8}>
                  <Text style={[s.currencySymbol, currency === c.code && s.currencyTxtActive]}>{c.symbol}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.currencyCode, currency === c.code && s.currencyTxtActive]}>{c.code}</Text>
                    <Text style={[s.currencyName, currency === c.code && s.currencyNameActive]} numberOfLines={1}>{c.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.sectionLabel, { marginTop: 6 }]}>PREFERENCES</Text>
            {[
              { l: 'Daily reminder',  s: 'Nudge to log at 8 PM',     i: '🔔' },
              { l: 'Weekly summary',  s: 'Report every Monday',       i: '📊' },
              { l: 'Streak alerts',   s: 'Warn before streak breaks', i: '🔥' },
              { l: "Mascot tips",     s: "Show Sprout's daily advice",i: '🌱' },
            ].map((item, idx) => (
              <View key={item.l} style={s.settingRow}>
                <Text style={{ fontSize: 20 }}>{item.i}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.settingTitle}>{item.l}</Text>
                  <Text style={s.settingSub}>{item.s}</Text>
                </View>
                <TouchableOpacity
                  style={[s.toggle, { backgroundColor: toggles[idx] ? P.green : '#C4CFC4' }]}
                  onPress={() => handleToggle(idx)}
                  activeOpacity={0.8}>
                  <View style={[s.toggleThumb, { left: toggles[idx] ? 24 : 3 }]} />
                </TouchableOpacity>
              </View>
            ))}

            {!isPro && (
              <TouchableOpacity style={s.upgradeBtn} onPress={() => setScreen('paywall')}>
                <Text style={s.upgradeTxt}>Upgrade to Pro — $4.99/mo</Text>
              </TouchableOpacity>
            )}

            {/* Account action — always visible */}
            {!userProfile ? (
              <TouchableOpacity style={s.signInBtn} onPress={() => setScreen('auth')}>
                <Text style={s.signInTxt}>Sign in / Create account</Text>
              </TouchableOpacity>
            ) : !confirmSignOut ? (
              <TouchableOpacity style={s.signOutBtn} onPress={() => setConfirmSignOut(true)}>
                <Text style={s.signOutTxt}>Sign out</Text>
              </TouchableOpacity>
            ) : (
              <View style={s.signOutConfirm}>
                <Text style={s.signOutConfirmTxt}>Are you sure you want to sign out?</Text>
                <View style={s.signOutConfirmRow}>
                  <TouchableOpacity style={s.signOutCancelBtn} onPress={() => setConfirmSignOut(false)}>
                    <Text style={s.signOutCancelTxt}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.signOutConfirmBtn} onPress={() => { setConfirmSignOut(false); signOutUser(); }}>
                    <Text style={s.signOutConfirmBtnTxt}>Yes, sign out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={[s.sectionLabel, { marginTop: 16 }]}>ABOUT</Text>
            {[
              {
                i: '📋', l: 'Terms of Service',
                onPress: () => setLegalModal('tos'),
              },
              {
                i: '🔒', l: 'Privacy Policy',
                onPress: () => setLegalModal('privacy'),
              },
              {
                i: '💬', l: 'Send feedback',
                onPress: () => Linking.openURL(
                  'mailto:support@smartspend.app?subject=SmartSpend%20Feedback&body=Hi%20SmartSpend%20team%2C%0A%0A'
                ).catch(() => Alert.alert('No email app found', 'Please email us at support@smartspend.app')),
              },
              {
                i: '⭐', l: 'Rate SmartSpend',
                onPress: () => {
                  const url = Platform.OS === 'ios'
                    ? 'https://apps.apple.com/app/smartspend'
                    : 'https://play.google.com/store/apps/details?id=com.smartspend.app';
                  Linking.openURL(url).catch(() =>
                    Alert.alert('Coming soon', 'Rating will be available once SmartSpend is live on the store.')
                  );
                },
              },
            ].map(m => (
              <TouchableOpacity key={m.l} style={s.aboutRow} onPress={m.onPress} activeOpacity={0.7}>
                <Text style={{ fontSize: 18 }}>{m.i}</Text>
                <Text style={s.aboutLabel}>{m.l}</Text>
                <Text style={{ color: '#6B8F6B', fontSize: 16 }}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>

    {/* ── Legal modal (ToS / Privacy Policy) ── */}
    <Modal
      visible={legalModal !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setLegalModal(null)}>
      <SafeAreaView style={m.safe}>
        {legalModal && (
          <>
            <View style={m.modalHeader}>
              <Text style={m.modalTitle}>{LEGAL[legalModal].title}</Text>
              <TouchableOpacity style={m.closeBtn} onPress={() => setLegalModal(null)} activeOpacity={0.7}>
                <Text style={m.closeTxt}>✕ Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={m.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={m.bodyTxt}>{LEGAL[legalModal].body}</Text>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </Modal>
    </>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingTop: 24, alignItems: 'center' },
  name: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 2, textAlign: 'center' },
  email: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  editNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
    color: '#fff', fontSize: 18, fontWeight: '700', minWidth: 140,
  },
  nameSaveBtn: { backgroundColor: '#C6F135', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  nameSaveTxt: { color: '#145229', fontSize: 13, fontWeight: '900' },
  sub: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '700', marginBottom: 12 },
  signInBtn: {
    backgroundColor: '#DCF5E7', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8,
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  signInTxt: { color: '#065F46', fontSize: 14, fontWeight: '800' },
  signOutBtn: {
    backgroundColor: '#FEF2F2', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8,
    borderWidth: 1, borderColor: '#FECACA',
  },
  signOutTxt: { color: '#EF4444', fontSize: 14, fontWeight: '800' },
  signOutConfirm: {
    backgroundColor: '#FEF2F2', borderRadius: 14, padding: 16, marginTop: 8,
    borderWidth: 1, borderColor: '#FECACA', gap: 12,
  },
  signOutConfirmTxt: { color: '#7F1D1D', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  signOutConfirmRow: { flexDirection: 'row', gap: 10 },
  signOutCancelBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
  signOutCancelTxt: { color: '#6B7280', fontSize: 13, fontWeight: '800' },
  signOutConfirmBtn: { flex: 1, backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  signOutConfirmBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '900' },
  badgeRow: { flexDirection: 'row', gap: 10 },
  badge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  proBadge: { backgroundColor: '#C6F135' },
  badgeTxt: { fontSize: 11, fontWeight: '800', color: '#fff' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1.5, borderBottomColor: 'rgba(0,0,0,0.08)', backgroundColor: '#fff' },
  tabBtn: { flex: 1, paddingTop: 13, paddingBottom: 0, alignItems: 'center' },
  tabTxt: { fontSize: 13, fontWeight: '800', color: P.muted, marginBottom: 10 },
  tabTxtActive: { color: P.greenDeep },
  tabLine: { height: 3, width: '70%', backgroundColor: 'transparent', borderRadius: 99 },
  tabLineActive: { backgroundColor: P.greenDeep },
  subtabRow: { flexDirection: 'row', backgroundColor: '#E8EDE8', borderRadius: 12, padding: 4, marginBottom: 16 },
  subtabBtn: { flex: 1, borderRadius: 9, paddingVertical: 8, alignItems: 'center' },
  subtabBtnActive: { backgroundColor: '#fff' },
  subtabTxt: { fontSize: 12, fontWeight: '800', color: '#6B8F6B' },
  subtabTxtActive: { color: P.greenDeep },
  themeCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  themeColor: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  themeAccent: { width: 20, height: 20, borderRadius: 6 },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  themeName: { fontWeight: '900', fontSize: 13, color: '#111C11', marginBottom: 2 },
  themeDesc: { color: '#6B8F6B', fontSize: 11, fontWeight: '700' },
  accGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  accCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 18, padding: 14, paddingHorizontal: 12,
    alignItems: 'center', borderWidth: 2.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  accName: { fontWeight: '900', fontSize: 12, color: '#111C11', marginBottom: 2 },
  accDesc: { color: '#6B8F6B', fontSize: 10, fontWeight: '700' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },
  currencyHint: { fontSize: 12, color: '#6B8F6B', fontWeight: '600', marginTop: -4, marginBottom: 12, lineHeight: 17 },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  currencyChip: {
    width: '47.5%', backgroundColor: '#fff', borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  currencyChipActive: { backgroundColor: '#1B6E3A', borderColor: '#1B6E3A' },
  currencySymbol: { fontSize: 18, fontWeight: '900', color: '#111C11', minWidth: 28 },
  currencyCode: { fontWeight: '900', fontSize: 13, color: '#111C11' },
  currencyName: { color: '#6B8F6B', fontSize: 10, fontWeight: '700' },
  currencyTxtActive: { color: '#fff' },
  currencyNameActive: { color: 'rgba(255,255,255,0.7)' },
  settingRow: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14, paddingHorizontal: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  settingTitle: { fontWeight: '800', fontSize: 13, color: '#111C11', marginBottom: 2 },
  settingSub: { color: '#6B8F6B', fontSize: 11, fontWeight: '600' },
  toggle: { width: 50, height: 28, borderRadius: 99, position: 'relative', justifyContent: 'center' },
  toggleThumb: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
    position: 'absolute', top: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 3,
  },
  upgradeBtn: {
    backgroundColor: '#111C11', borderRadius: 16, paddingVertical: 14,
    alignItems: 'center', marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  upgradeTxt: { color: '#fff', fontSize: 14, fontWeight: '900' },
  aboutRow: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, paddingHorizontal: 16, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  aboutLabel: { flex: 1, fontWeight: '800', fontSize: 13, color: '#111C11' },
});

const m = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2FAF4' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.07)',
    backgroundColor: '#fff',
  },
  modalTitle: { fontSize: 17, fontWeight: '900', color: '#111C11' },
  closeBtn: {
    backgroundColor: '#F2FAF4', borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  closeTxt: { fontSize: 13, fontWeight: '800', color: '#1B6E3A' },
  modalBody: { padding: 22, paddingBottom: 48 },
  bodyTxt: { fontSize: 14, fontWeight: '500', color: '#2B4A2B', lineHeight: 22 },
});
