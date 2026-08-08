import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Modal, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { SavingsGoal } from '../types';
import { Ring } from '../components/Ring';
import { P, fmt, pct } from '../data/constants';

const PRESETS = [
  { emoji: '🏠', label: 'House',       color: '#6366F1', colorLight: '#EEF2FF', colorDark: '#3730A3' },
  { emoji: '🚗', label: 'Car',         color: '#F59E0B', colorLight: '#FFFBEB', colorDark: '#92400E' },
  { emoji: '✈️', label: 'Travel',      color: '#06B6D4', colorLight: '#ECFEFF', colorDark: '#0E7490' },
  { emoji: '📱', label: 'Tech',        color: '#8B5CF6', colorLight: '#EDE9FE', colorDark: '#4C1D95' },
  { emoji: '🎓', label: 'Education',   color: '#10B981', colorLight: '#ECFDF5', colorDark: '#065F46' },
  { emoji: '🏋️', label: 'Health',     color: '#EF4444', colorLight: '#FEF2F2', colorDark: '#7F1D1D' },
  { emoji: '💍', label: 'Wedding',     color: '#EC4899', colorLight: '#FDF2F8', colorDark: '#831843' },
  { emoji: '🎯', label: 'Custom goal', color: '#7B5CF5', colorLight: '#EDE9FE', colorDark: '#4C1D95' },
];

function GoalCard({ goal, onAdd }: { goal: SavingsGoal; onAdd: (g: SavingsGoal) => void }) {
  const { deleteSavingsGoal, currencySymbol } = useApp();
  const pc = pct(goal.savedAmount, goal.targetAmount);

  return (
    <View style={[s.goalCard, { borderLeftColor: goal.color, borderLeftWidth: 4 }]}>
      <View style={s.goalTop}>
        <Ring pct={pc} sz={50} sw={5} col={goal.color} bg={goal.colorLight}>
          <Text style={{ fontSize: 16 }}>{goal.emoji}</Text>
        </Ring>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={s.goalTitleRow}>
            <Text style={s.goalTitle}>{goal.title}</Text>
            <TouchableOpacity onPress={() => deleteSavingsGoal(goal.id)} hitSlop={10}>
              <Text style={{ color: '#ccc', fontSize: 16 }}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={[s.goalAmt, { color: goal.colorDark }]}>
            {fmt(goal.savedAmount, currencySymbol)} <Text style={{ color: P.muted }}>/ {fmt(goal.targetAmount, currencySymbol)}</Text>
          </Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${pc}%`, backgroundColor: goal.color }]} />
          </View>
          {pc >= 100 && <Text style={[s.done, { color: goal.color }]}>🎉 Goal reached!</Text>}
        </View>
      </View>
      {pc < 100 && (
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: goal.colorLight }]}
          onPress={() => onAdd(goal)}
          activeOpacity={0.8}>
          <Text style={[s.addBtnTxt, { color: goal.colorDark }]}>+ Add funds</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AddFundsModal({ goal, onClose }: { goal: SavingsGoal; onClose: () => void }) {
  const { updateSavingsGoalAmount, currencySymbol } = useApp();
  const [amt, setAmt] = useState('');

  const submit = () => {
    const n = parseFloat(amt);
    if (!isNaN(n) && n > 0) {
      updateSavingsGoalAmount(goal.id, n);
      onClose();
    }
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={m.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={m.sheet}>
            <Text style={m.emoji}>{goal.emoji}</Text>
            <Text style={m.title}>Add to {goal.title}</Text>
            <Text style={m.sub}>Currently saved: {fmt(goal.savedAmount, currencySymbol)}</Text>
            <TextInput
              style={m.input}
              value={amt}
              onChangeText={setAmt}
              placeholder={`${currencySymbol} 0.00`}
              placeholderTextColor="#C0D0C0"
              keyboardType="decimal-pad"
              autoFocus
            />
            <TouchableOpacity
              style={[m.cta, { backgroundColor: goal.color }]}
              onPress={submit}
              activeOpacity={0.85}>
              <Text style={m.ctaTxt}>Add funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={m.cancel} onPress={onClose}>
              <Text style={m.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function NewGoalModal({ onClose }: { onClose: () => void }) {
  const { addSavingsGoal, currencySymbol } = useApp();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [preset, setPreset] = useState(PRESETS[7]);

  const submit = () => {
    const n = parseFloat(target);
    if (!title.trim() || isNaN(n) || n <= 0) return;
    addSavingsGoal({
      title: title.trim(),
      emoji: preset.emoji,
      targetAmount: n,
      savedAmount: 0,
      color: preset.color,
      colorLight: preset.colorLight,
      colorDark: preset.colorDark,
    });
    onClose();
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={m.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={m.sheet}>
              <Text style={m.title}>New savings goal</Text>

              <Text style={m.fieldLabel}>CATEGORY</Text>
              <View style={m.presetGrid}>
                {PRESETS.map(p => (
                  <TouchableOpacity
                    key={p.label}
                    style={[m.preset, preset.label === p.label && { backgroundColor: p.color }]}
                    onPress={() => { setPreset(p); if (p.label !== 'Custom goal') setTitle(p.label); }}>
                    <Text style={{ fontSize: 20 }}>{p.emoji}</Text>
                    <Text style={[m.presetTxt, preset.label === p.label && { color: '#fff' }]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={m.fieldLabel}>GOAL NAME</Text>
              <TextInput
                style={m.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Dream vacation"
                placeholderTextColor="#C0D0C0"
              />

              <Text style={m.fieldLabel}>TARGET AMOUNT</Text>
              <TextInput
                style={m.input}
                value={target}
                onChangeText={setTarget}
                placeholder={`${currencySymbol} 0.00`}
                placeholderTextColor="#C0D0C0"
                keyboardType="decimal-pad"
              />

              <TouchableOpacity
                style={[m.cta, { backgroundColor: preset.color, opacity: (!title.trim() || !target) ? 0.4 : 1 }]}
                onPress={submit}
                disabled={!title.trim() || !target}
                activeOpacity={0.85}>
                <Text style={m.ctaTxt}>Create goal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={m.cancel} onPress={onClose}>
                <Text style={m.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export function SavingsScreen() {
  const { savingsGoals, go, currencySymbol } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [fundGoal, setFundGoal] = useState<SavingsGoal | null>(null);

  const total = savingsGoals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: P.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => go('home')}>
          <Text style={s.backTxt}>← Home</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Savings Goals</Text>
        <TouchableOpacity style={s.newBtn} onPress={() => setShowNew(true)}>
          <Text style={s.newBtnTxt}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      {savingsGoals.length > 0 && (
        <View style={s.summary}>
          <View style={s.summaryItem}>
            <Text style={s.summaryLabel}>TOTAL SAVED</Text>
            <Text style={s.summaryVal}>{fmt(total, currencySymbol)}</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryLabel}>TOTAL GOALS</Text>
            <Text style={s.summaryVal}>{fmt(totalTarget, currencySymbol)}</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryLabel}>PROGRESS</Text>
            <Text style={s.summaryVal}>{pct(total, totalTarget)}%</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {savingsGoals.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎯</Text>
            <Text style={s.emptyTitle}>No goals yet</Text>
            <Text style={s.emptySub}>Create your first savings goal to start building toward what matters most.</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => setShowNew(true)}>
              <Text style={s.emptyBtnTxt}>Create first goal →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          savingsGoals.map(g => (
            <GoalCard key={g.id} goal={g} onAdd={setFundGoal} />
          ))
        )}
      </ScrollView>

      {showNew && <NewGoalModal onClose={() => setShowNew(false)} />}
      {fundGoal && <AddFundsModal goal={fundGoal} onClose={() => setFundGoal(null)} />}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: '#1B6E3A', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 18, paddingBottom: 14,
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 7 },
  backTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  newBtn: { backgroundColor: '#C6F135', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 },
  newBtnTxt: { color: '#145229', fontSize: 13, fontWeight: '900' },

  summary: {
    flexDirection: 'row', backgroundColor: '#fff', margin: 16, borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 9, fontWeight: '800', color: P.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 },
  summaryVal: { fontSize: 16, fontWeight: '900', color: '#111C11' },

  list: { padding: 16, paddingBottom: 40 },
  goalCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  goalTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  goalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  goalTitle: { fontWeight: '900', fontSize: 15, color: '#111C11', flex: 1 },
  goalAmt: { fontSize: 14, fontWeight: '800', marginBottom: 6 },
  progressBg: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  done: { fontSize: 11, fontWeight: '800', marginTop: 4 },
  addBtn: { borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  addBtnTxt: { fontSize: 13, fontWeight: '800' },

  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#111C11', marginBottom: 8 },
  emptySub: { fontSize: 13, color: P.muted, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { backgroundColor: '#1B6E3A', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '900' },
});

const m = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40, gap: 14,
  },
  emoji: { fontSize: 40, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#111C11', textAlign: 'center' },
  sub: { fontSize: 13, color: P.muted, textAlign: 'center' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#6B8F6B', letterSpacing: 0.5, textTransform: 'uppercase' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preset: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  presetTxt: { fontSize: 12, fontWeight: '800', color: '#374151' },
  input: {
    backgroundColor: '#F3F4F6', borderRadius: 14, padding: 14,
    fontSize: 18, fontWeight: '800', color: '#111C11',
  },
  cta: {
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },
  cancel: { alignItems: 'center', paddingVertical: 4 },
  cancelTxt: { color: P.muted, fontSize: 14, fontWeight: '700' },
});
