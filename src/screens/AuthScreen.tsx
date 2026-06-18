import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Sprout } from '../components/Sprout';
import { useApp } from '../context/AppContext';

export function AuthScreen() {
  const { setScreen, setTab, setOnboardingStep, signInUser, signUpUser } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const continueAsGuest = () => {
    setOnboardingStep(0);
    setScreen('app');
    setTab('home');
  };

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m);
    setErrorMsg('');
    setInfoMsg('');
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setInfoMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const result = await signUpUser(
          trimmedEmail,
          password,
          trimmedName || trimmedEmail.split('@')[0],
        );
        if (result === 'CONFIRM_EMAIL') {
          setInfoMsg('Account created! Check your email for a confirmation link, then sign in.');
          switchMode('signin');
          return;
        }
        if (result) {
          setErrorMsg(result);
          return;
        }
        setScreen('app');
        setTab('home');
        setOnboardingStep(0);
      } else {
        const result = await signInUser(trimmedEmail, password);
        if (result) {
          if (result.toLowerCase().includes('confirm') || result.toLowerCase().includes('verified')) {
            setErrorMsg('Please confirm your email first. Check your inbox for the confirmation link.');
          } else {
            setErrorMsg(result);
          }
          return;
        }
        setScreen('app');
        setTab('home');
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={s.hero}>
            <Sprout lvl={3} size={90} mood="happy" acc="hat" />
            <Text style={s.brand}>SmartSpend</Text>
            <Text style={s.sub}>
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </Text>
          </View>

          {/* Mode toggle */}
          <View style={s.toggle}>
            <TouchableOpacity
              style={[s.toggleBtn, mode === 'signup' && s.toggleActive]}
              onPress={() => switchMode('signup')}>
              <Text style={[s.toggleTxt, mode === 'signup' && s.toggleTxtActive]}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, mode === 'signin' && s.toggleActive]}
              onPress={() => switchMode('signin')}>
              <Text style={[s.toggleTxt, mode === 'signin' && s.toggleTxtActive]}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={s.form}>
            {mode === 'signup' && (
              <View style={s.field}>
                <Text style={s.label}>YOUR NAME</Text>
                <TextInput
                  style={s.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Alex Johnson"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            )}

            <View style={s.field}>
              <Text style={s.label}>EMAIL</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>PASSWORD</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor="rgba(255,255,255,0.35)"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>
          </View>

          {/* Inline error / info messages */}
          {errorMsg ? (
            <View style={s.errorBox}>
              <Text style={s.errorTxt}>⚠ {errorMsg}</Text>
            </View>
          ) : null}
          {infoMsg ? (
            <View style={s.infoBox}>
              <Text style={s.infoTxt}>✓ {infoMsg}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[s.cta, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}>
            {loading
              ? <ActivityIndicator color="#1B6E3A" />
              : <Text style={s.ctaTxt}>
                  {mode === 'signup' ? 'Create account →' : 'Sign in →'}
                </Text>}
          </TouchableOpacity>

          <TouchableOpacity style={s.guestBtn} onPress={continueAsGuest}>
            <Text style={s.guestTxt}>Continue as guest</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.backBtn} onPress={() => { setOnboardingStep(2); setScreen('splash'); }}>
            <Text style={s.backTxt}>← Back</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1B6E3A' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, gap: 20 },

  hero: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  brand: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  sub: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '600' },

  toggle: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16, padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 13 },
  toggleActive: { backgroundColor: '#fff' },
  toggleTxt: { fontSize: 14, fontWeight: '800', color: 'rgba(255,255,255,0.65)' },
  toggleTxtActive: { color: '#1B6E3A' },

  form: { gap: 12 },
  field: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18,
    padding: 16, paddingHorizontal: 18,
  },
  label: {
    fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6,
  },
  input: { fontSize: 16, fontWeight: '700', color: '#fff' },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
  },
  errorTxt: { color: '#FCA5A5', fontSize: 13, fontWeight: '700', lineHeight: 18 },

  infoBox: {
    backgroundColor: 'rgba(198,241,53,0.15)', borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(198,241,53,0.3)',
  },
  infoTxt: { color: '#C6F135', fontSize: 13, fontWeight: '700', lineHeight: 18 },

  cta: {
    backgroundColor: '#C6F135', borderRadius: 18, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center', minHeight: 58,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  ctaTxt: { color: '#145229', fontSize: 17, fontWeight: '900' },

  guestBtn: { alignItems: 'center', paddingVertical: 6 },
  guestTxt: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },

  backBtn: { alignItems: 'center', paddingVertical: 4 },
  backTxt: { color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: '600' },
});
