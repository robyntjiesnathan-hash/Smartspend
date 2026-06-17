import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { BudgetsScreen } from '../screens/BudgetsScreen';
import { AddScreen } from '../screens/AddScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WeeklyScreen } from '../screens/WeeklyScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { useApp, AppTab } from '../context/AppContext';
import { THEMES, P } from '../data/constants';

const NAV_TABS = [
  { id: 'home' as AppTab,     icon: '🏠', label: 'Home' },
  { id: 'budgets' as AppTab,  icon: '📊', label: 'Budgets' },
  { id: 'progress' as AppTab, icon: '🏆', label: 'Levels' },
  { id: 'profile' as AppTab,  icon: '👤', label: 'Profile' },
];

function TabBar() {
  const { tab, go, isPro, theme } = useApp();
  const th = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <View style={s.tabBar}>
      {NAV_TABS.slice(0, 2).map(t => <TabBtn key={t.id} t={t} active={tab === t.id} th={th} />)}
      {/* Center Log button */}
      <TouchableOpacity style={s.addWrap} onPress={() => go('add')} activeOpacity={0.8}>
        <View style={[s.addBtn, { backgroundColor: th.primary }]}>
          {/* View-drawn plus — always crisp, no font rendering */}
          <View style={s.plusH} />
          <View style={s.plusV} />
        </View>
        <Text style={[s.addLabel, tab === 'add' && { color: th.primary }]}>Log</Text>
      </TouchableOpacity>
      {NAV_TABS.slice(2).map(t => <TabBtn key={t.id} t={t} active={tab === t.id} th={th} locked={!isPro} />)}
    </View>
  );
}

function TabBtn({ t, active, th, locked }: {
  t: { id: AppTab; icon: string; label: string };
  active: boolean; th: any; locked?: boolean;
}) {
  const { go } = useApp();
  return (
    <TouchableOpacity style={s.tabBtn} onPress={() => go(t.id)} activeOpacity={0.7}>
      <View style={[s.iconWrap, active && { backgroundColor: th.primary }]}>
        <Text style={{ fontSize: 20 }}>{t.icon}</Text>
        {locked && (
          <View style={s.proTag}><Text style={s.proTagTxt}>Pro</Text></View>
        )}
      </View>
      <Text style={[s.tabLabel, active && { color: th.primary }]}>{t.label}</Text>
    </TouchableOpacity>
  );
}

const SCREENS: Record<AppTab, React.ReactNode> = {
  home:         <HomeScreen />,
  budgets:      <BudgetsScreen />,
  add:          <AddScreen />,
  progress:     <ProgressScreen />,
  profile:      <ProfileScreen />,
  weekly:       <WeeklyScreen />,
  transactions: <TransactionsScreen />,
};

const HIDE_NAV: AppTab[] = ['add', 'weekly', 'transactions'];

export function AppNavigator() {
  const { tab } = useApp();
  const showNav = !HIDE_NAV.includes(tab);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {SCREENS[tab] || SCREENS.home}
      </View>
      {showNav && <TabBar />}
    </View>
  );
}

const s = StyleSheet.create({
  tabBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 4, paddingTop: 10, paddingBottom: 16,
  },
  tabBtn: { flex: 1, alignItems: 'center', gap: 4 },
  iconWrap: { width: 46, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tabLabel: { fontSize: 11, fontWeight: '800', color: P.muted },
  proTag: {
    position: 'absolute', top: -3, right: -4,
    backgroundColor: P.yellow, borderRadius: 99,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  proTagTxt: { fontSize: 8, fontWeight: '900', color: P.dark },
  addWrap: { flex: 1, alignItems: 'center', paddingBottom: 2 },
  addBtn: {
    width: 62, height: 62, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: -20, marginTop: -20,
    // layered shadow for depth
    shadowColor: '#1B6E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 14,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  // View-drawn plus bars
  plusH: { position: 'absolute', width: 26, height: 3.5, backgroundColor: '#fff', borderRadius: 2 },
  plusV: { position: 'absolute', width: 3.5, height: 26, backgroundColor: '#fff', borderRadius: 2 },
  addLabel: { fontSize: 12, fontWeight: '900', color: P.muted, marginTop: 6, letterSpacing: 0.3 },
});
