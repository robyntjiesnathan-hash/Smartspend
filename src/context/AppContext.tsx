import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { INIT_CHALLENGES, getLvl } from '../data/constants';
import { Transaction } from '../types';
import { getTransactions, saveTransactions } from '../storage';

export type AppScreen = 'splash' | 'paywall' | 'app';
export type AppTab = 'home' | 'budgets' | 'progress' | 'profile' | 'add' | 'weekly';

export type Challenge = {
  title: string; desc: string; days: number; done: number;
  xp: number; col: string; colL: string; colD: string;
};

type AppContextType = {
  screen: AppScreen;
  setScreen: (s: AppScreen) => void;
  tab: AppTab;
  setTab: (t: AppTab) => void;
  isPro: boolean;
  activatePro: () => void;
  plan: 'yearly' | 'monthly';
  setPlan: (p: 'yearly' | 'monthly') => void;
  xp: number;
  streak: number;
  mood: 'happy' | 'excited' | 'sad';
  setMood: (m: 'happy' | 'excited' | 'sad') => void;
  msg: string;
  setMsg: (m: string) => void;
  confetti: boolean;
  setConfetti: (v: boolean) => void;
  levelUp: { lvl: number; name: string } | null;
  setLevelUp: (v: { lvl: number; name: string } | null) => void;
  chModal: Challenge | null;
  setChModal: (v: Challenge | null) => void;
  addType: 'expense' | 'income';
  setAddType: (t: 'expense' | 'income') => void;
  addAmt: string;
  setAddAmt: (v: string) => void;
  addLabel: string;
  setAddLabel: (v: string) => void;
  addCat: string;
  setAddCat: (v: string) => void;
  addDone: boolean;
  selBudget: string | null;
  setSelBudget: (v: string | null) => void;
  theme: string;
  setTheme: (v: string) => void;
  acc: string;
  setAcc: (v: string) => void;
  tipIdx: number;
  setTipIdx: (fn: (i: number) => number) => void;
  rewardTab: 'themes' | 'accessories';
  setRewardTab: (v: 'themes' | 'accessories') => void;
  profTab: 'rewards' | 'settings';
  setProfTab: (v: 'rewards' | 'settings') => void;
  challenges: Challenge[];
  markChallenge: (idx: number) => void;
  toggles: boolean[];
  setToggles: (fn: (t: boolean[]) => boolean[]) => void;
  transactions: Transaction[];
  doAdd: () => void;
  go: (t: AppTab) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const SEED_TXNS: Transaction[] = [
  { id: 's1', type: 'income',  amount: 7125, category: 'Income',        note: 'Salary',             date: daysAgo(0) },
  { id: 's2', type: 'expense', amount: 86,   category: 'Groceries',     note: 'Whole Foods Market', date: daysAgo(0) },
  { id: 's3', type: 'expense', amount: 18,   category: 'Entertainment', note: 'Netflix',            date: daysAgo(1) },
  { id: 's4', type: 'expense', amount: 65,   category: 'Transport',     note: 'Gas Station',        date: daysAgo(1) },
  { id: 's5', type: 'income',  amount: 1125, category: 'Income',        note: 'Freelance',          date: daysAgo(2) },
  { id: 's6', type: 'expense', amount: 280,  category: 'Health',        note: 'Health Insurance',   date: daysAgo(2) },
  { id: 's7', type: 'expense', amount: 45,   category: 'Dining Out',    note: 'Restaurant',         date: daysAgo(3) },
  { id: 's8', type: 'expense', amount: 120,  category: 'Groceries',     note: 'Trader Joes',        date: daysAgo(5) },
  { id: 's9', type: 'expense', amount: 145,  category: 'Transport',     note: 'Monthly Transit',    date: daysAgo(5) },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [tab, setTab] = useState<AppTab>('home');
  const [isPro, setIsPro] = useState(false);
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [xp, setXp] = useState(720);
  const [streak, setStreak] = useState(14);
  const [mood, setMood] = useState<'happy' | 'excited' | 'sad'>('happy');
  const [msg, setMsg] = useState('Every dollar tracked grows your money tree! 🌱');
  const [confetti, setConfetti] = useState(false);
  const [levelUp, setLevelUp] = useState<{ lvl: number; name: string } | null>(null);
  const [chModal, setChModal] = useState<Challenge | null>(null);
  const [addType, setAddType] = useState<'expense' | 'income'>('expense');
  const [addAmt, setAddAmt] = useState('');
  const [addLabel, setAddLabel] = useState('');
  const [addCat, setAddCat] = useState('Groceries');
  const [addDone, setAddDone] = useState(false);
  const [selBudget, setSelBudget] = useState<string | null>(null);
  const [theme, setTheme] = useState('forest');
  const [acc, setAcc] = useState('hat');
  const [tipIdx, setTipIdx] = useState(0);
  const [rewardTab, setRewardTab] = useState<'themes' | 'accessories'>('themes');
  const [profTab, setProfTab] = useState<'rewards' | 'settings'>('rewards');
  const [challenges, setChallenges] = useState<Challenge[]>(INIT_CHALLENGES);
  const [toggles, setToggles] = useState([true, true, true, true]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then(saved => {
      setTransactions(saved.length > 0 ? saved : SEED_TXNS);
    });
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      saveTransactions(transactions).catch(() => {});
    }
  }, [transactions]);

  const PRO_TABS: AppTab[] = ['progress', 'profile', 'weekly'];

  const go = useCallback((t: AppTab) => {
    if (!isPro && PRO_TABS.includes(t)) { setScreen('paywall'); return; }
    setTab(t); setScreen('app');
  }, [isPro]);

  const doAdd = useCallback(() => {
    if (!addAmt || !addLabel) return;
    const amount = parseFloat(addAmt);
    if (isNaN(amount) || amount <= 0) return;

    const newTxn: Transaction = {
      id: Date.now().toString(),
      type: addType,
      amount,
      category: addType === 'income' ? 'Income' : addCat,
      note: addLabel,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTxn, ...prev]);

    const prev_xp = xp, next_xp = prev_xp + 25;
    const wasL = getLvl(prev_xp).c.lvl;
    const nowC = getLvl(next_xp).c;
    setXp(next_xp);
    setStreak(s => Math.min(s + 1, 99));
    setMood('excited');
    if (nowC.lvl > wasL) {
      setLevelUp(nowC);
      setConfetti(true);
      setMsg("Level up! You're becoming a financial pro! 🏆");
      setTimeout(() => setConfetti(false), 2600);
    } else {
      setMsg('Every dollar tracked grows your money tree! 🌱');
    }
    setAddDone(true);
    setTimeout(() => {
      setAddDone(false); setAddAmt(''); setAddLabel(''); setMood('happy');
    }, 2400);
  }, [xp, addAmt, addLabel, addType, addCat]);

  const markChallenge = useCallback((idx: number) => {
    setChallenges(prev => prev.map((ch, i) => {
      if (i !== idx) return ch;
      const done = Math.min(ch.days, ch.done + 1);
      if (done === ch.days) {
        setChModal(ch);
        setXp(x => x + ch.xp);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2800);
      }
      return { ...ch, done };
    }));
  }, []);

  const activatePro = useCallback(() => {
    setIsPro(true);
    setScreen('app');
    setTab('home');
    setMsg('Welcome to Pro! Every feature is now unlocked 🚀');
    setMood('excited');
    setTimeout(() => setMood('happy'), 3000);
  }, []);

  return (
    <AppContext.Provider value={{
      screen, setScreen, tab, setTab, isPro, activatePro, plan, setPlan,
      xp, streak, mood, setMood, msg, setMsg, confetti, setConfetti,
      levelUp, setLevelUp, chModal, setChModal,
      addType, setAddType, addAmt, setAddAmt, addLabel, setAddLabel,
      addCat, setAddCat, addDone, selBudget, setSelBudget,
      theme, setTheme, acc, setAcc, tipIdx, setTipIdx,
      rewardTab, setRewardTab, profTab, setProfTab,
      challenges, markChallenge, toggles, setToggles,
      transactions,
      doAdd, go,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
