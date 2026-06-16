import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
      {/* Center add button */}
      <TouchableOpacity style={s.addWrap} onPress={() => go('add')} activeOpacity={0.85}>
        <View style={[s.addBtn, { backgroundColor: th.primary }]}>
          <Text style={s.addIcon}>+</Text>
        </View>
        <Text style={[s.tabLabel, tab === 'add' && { color: th.primary }]}>Log</Text>
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
        <Text style={{ fontSize: 18 }}>{t.icon}</Text>
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
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.07)',
    paddingHorizontal: 4, paddingTop: 8, paddingBottom: 12,
  },
  tabBtn: { flex: 1, alignItems: 'center', gap: 3 },
  iconWrap: { width: 40, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tabLabel: { fontSize: 9, fontWeight: '800', color: P.muted },
  proTag: {
    position: 'absolute', top: -3, right: -3,
    backgroundColor: P.yellow, borderRadius: 99,
    paddingHorizontal: 4, paddingVertical: 1,
  },
  proTagTxt: { fontSize: 7, fontWeight: '900', color: P.dark },
  addWrap: { flex: 0, width: 60, alignItems: 'center', gap: 0 },
  addBtn: {
    width: 52, height: 52, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: -16, marginTop: -16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8,
  },
  addIcon: { fontSize: 28, color: '#fff', lineHeight: 32, fontWeight: '900' },
});
