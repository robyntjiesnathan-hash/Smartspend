import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView,
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { AppWalkthrough } from './src/components/AppWalkthrough';
import { ConfettiEffect } from './src/components/ConfettiEffect';
import { P } from './src/data/constants';

function LevelUpModal() {
  const { levelUp, setLevelUp } = useApp();
  if (!levelUp) return null;
  return (
    <View style={modal.overlay}>
      <View style={modal.box}>
        <Text style={{ fontSize: 56, marginBottom: 4 }}>🌳</Text>
        <Text style={modal.eyebrow}>Level up!</Text>
        <Text style={modal.title}>{levelUp.name}</Text>
        <View style={modal.badge}>
          <Text style={modal.badgeTxt}>Level {levelUp.lvl} unlocked!</Text>
        </View>
        <Text style={modal.body}>You're building incredible financial habits!</Text>
        <TouchableOpacity style={modal.btn} onPress={() => setLevelUp(null)}>
          <Text style={modal.btnTxt}>Awesome! Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ChallengeModal() {
  const { chModal, setChModal } = useApp();
  if (!chModal) return null;
  return (
    <View style={modal.overlay}>
      <View style={[modal.box, { backgroundColor: chModal.col }]}>
        <Text style={{ fontSize: 58, marginBottom: 8 }}>🏅</Text>
        <Text style={modal.eyebrow}>Challenge complete!</Text>
        <Text style={modal.title}>{chModal.title}</Text>
        <View style={[modal.badge, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
          <Text style={[modal.badgeTxt, { color: '#fff' }]}>+{chModal.xp} XP earned!</Text>
        </View>
        <Text style={modal.body}>You crushed it! A new challenge awaits.</Text>
        <TouchableOpacity style={[modal.btn, { backgroundColor: '#fff' }]} onPress={() => setChModal(null)}>
          <Text style={[modal.btnTxt, { color: chModal.colD }]}>Claim reward</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: P.green, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>🌱</Text>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 }}>SmartSpend</Text>
    </View>
  );
}

function Root() {
  const { isReady, screen } = useApp();
  if (!isReady) return <LoadingScreen />;
  if (screen === 'splash') return <SplashScreen />;
  if (screen === 'auth') return <AuthScreen />;
  if (screen === 'paywall') return <PaywallScreen />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: P.bg, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 390 }}>
        <AppNavigator />
        <LevelUpModal />
        <ChallengeModal />
        <ConfettiEffect />
        <AppWalkthrough />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" />
      <Root />
    </AppProvider>
  );
}

const modal = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 995,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  box: {
    backgroundColor: P.green, borderRadius: 28, padding: 32,
    paddingHorizontal: 24, alignItems: 'center', width: '100%', maxWidth: 320,
  },
  eyebrow: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 4, letterSpacing: -0.8 },
  badge: { backgroundColor: P.lime, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10, marginVertical: 12 },
  badgeTxt: { color: P.limeDark, fontSize: 14, fontWeight: '900' },
  body: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', marginBottom: 20, lineHeight: 20, textAlign: 'center' },
  btn: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 24, width: '100%', alignItems: 'center' },
  btnTxt: { color: P.greenDeep, fontSize: 15, fontWeight: '900' },
});
