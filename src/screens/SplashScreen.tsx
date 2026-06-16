import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Sprout } from '../components/Sprout';
import { useApp } from '../context/AppContext';

export function SplashScreen() {
  const { setScreen, setTab } = useApp();
  return (
    <SafeAreaView style={s.container}>
      <View style={s.top}>
        <Text style={s.welcome}>Welcome to</Text>
        <Text style={s.title}>SmartSpend</Text>
      </View>
      <View style={s.mid}>
        <Sprout lvl={1} size={180} mood="happy" acc="hat" />
        <Text style={s.tagline}>Grow Strong{'\n'}Habits Every Day</Text>
      </View>
      <View style={s.bottom}>
        <TouchableOpacity style={s.btn} onPress={() => setScreen('paywall')} activeOpacity={0.85}>
          <Text style={s.btnText}>Get started →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setScreen('app'); setTab('home'); }}>
          <Text style={s.link}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#3DBA6A',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 28, paddingVertical: 40,
  },
  top: { alignItems: 'center' },
  welcome: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700' },
  title: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1.5 },
  mid: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  tagline: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1, lineHeight: 34, textAlign: 'center' },
  bottom: { width: '100%', alignItems: 'center', gap: 14 },
  btn: {
    width: '100%', backgroundColor: '#111C11', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  link: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
});
