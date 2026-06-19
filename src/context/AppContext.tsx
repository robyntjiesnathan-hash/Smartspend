import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { getLvl } from '../data/constants';
import { Transaction, SavingsGoal, UserProfile, Budget, Challenge, LibraryChallenge } from '../types';
import { getTransactions, saveTransactions, getSettings, saveSettings, getSavingsGoals, saveSavingsGoals, getUserProfile, saveUserProfile, getBudgets, saveBudgets, getChallenges, saveChallenges } from '../storage';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type AppScreen = 'splash' | 'auth' | 'paywall' | 'app';
export type AppTab = 'home' | 'budgets' | 'progress' | 'profile' | 'add' | 'weekly' | 'transactions' | 'savings';

export type { Challenge, LibraryChallenge };

type AppContextType = {
  isReady: boolean;
  screen: AppScreen;
  prevScreen: AppScreen;
  setScreen: (s: AppScreen) => void;
  navToPaywall: () => void;
  onboardingStep: number;
  setOnboardingStep: (n: number) => void;
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
  joinChallenge: (lib: LibraryChallenge) => void;
  leaveChallenge: (id: string) => void;
  markChallenge: (id: string) => void;
  toggles: boolean[];
  setToggles: (fn: (t: boolean[]) => boolean[]) => void;
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
  doAdd: () => void;
  go: (t: AppTab) => void;
  // Auth
  userProfile: UserProfile | null;
  signInUser: (email: string, password: string) => Promise<string | null>;
  signUpUser: (email: string, password: string, displayName: string) => Promise<string | null>;
  signOutUser: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  // Savings goals
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteSavingsGoal: (id: string) => void;
  updateSavingsGoalAmount: (id: string, addAmount: number) => void;
  // Budgets
  budgets: Budget[];
  saveBudget: (category: string, limit: number) => void;
  deleteBudget: (category: string) => void;
  // Walkthrough
  walkthroughDone: boolean;
  completeWalkthrough: () => void;
};

const PRO_TABS: AppTab[] = ['progress', 'weekly'];

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreenRaw] = useState<AppScreen>('splash');
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [prevScreen, setPrevScreen] = useState<AppScreen>('splash');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [tab, setTab] = useState<AppTab>('home');
  const [isPro, setIsPro] = useState(false);
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [toggles, setToggles] = useState([true, true, true, true]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [budgets, setBudgetsState] = useState<Budget[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [walkthroughDone, setWalkthroughDone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addDoneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Wrapped setter: automatically marks onboarding done when entering the app
  const setScreen = useCallback((s: AppScreen) => {
    if (s === 'app') setHasOnboarded(true);
    setScreenRaw(s);
  }, []);

  // ── Boot: restore local state + check Supabase session ────────────────────
  useEffect(() => {
    Promise.all([
      getTransactions(),
      getSettings(),
      getSavingsGoals(),
      getUserProfile(),
      getBudgets(),
      getChallenges(),
    ]).then(([saved, settings, goals, profile, storedBudgets, storedChallenges]) => {
      if (settings.isPro !== undefined)    setIsPro(settings.isPro);
      if (settings.toggles)               setToggles(settings.toggles);
      if (settings.theme)                 setTheme(settings.theme);
      if (settings.acc)                   setAcc(settings.acc);
      if (settings.xp !== undefined)      setXp(settings.xp);
      if (settings.streak !== undefined)  setStreak(settings.streak);
      if (settings.hasOnboarded)          setHasOnboarded(true);
      if (settings.walkthroughDone)       setWalkthroughDone(true);

      if (goals.length > 0) setSavingsGoals(goals);
      if (storedBudgets.length > 0) setBudgetsState(storedBudgets);
      if (storedChallenges.length > 0) setChallenges(storedChallenges);

      if (profile) {
        setUserProfile(profile);
        if (settings.hasOnboarded) setScreen('app');
      } else if (settings.hasOnboarded) {
        if (saved.length > 0) setTransactions(saved);
        setScreen('app');
      } else {
        // Fresh install — leave everything empty, show splash onboarding
      }

      setIsReady(true);
    });

    // Check Supabase session on startup
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        sb.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUserProfile({
              id: session.user.id,
              email: session.user.email ?? '',
              displayName: session.user.user_metadata?.display_name
                || session.user.email?.split('@')[0]
                || 'User',
            });
            loadSupabaseData(session.user.id);
          }
        });

        const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUserProfile({
              id: session.user.id,
              email: session.user.email ?? '',
              displayName: session.user.user_metadata?.display_name
                || session.user.email?.split('@')[0]
                || 'User',
            });
          } else {
            setUserProfile(null);
          }
        });
        return () => subscription.unsubscribe();
      }
    }
  }, []);

  const loadSupabaseData = async (userId: string) => {
    const sb = getSupabase();
    if (!sb) return;

    const [txnRes, profileRes, goalsRes] = await Promise.all([
      sb.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      sb.from('profiles').select('*').eq('id', userId).single(),
      sb.from('savings_goals').select('*').eq('user_id', userId),
    ]);

    if (txnRes.data?.length) {
      const txns: Transaction[] = txnRes.data.map((r: any) => ({
        id: r.id,
        type: r.type,
        amount: parseFloat(r.amount),
        category: r.category,
        note: r.note,
        date: r.date,
      }));
      setTransactions(txns);
      saveTransactions(txns).catch(() => {});
    }

    if (profileRes.data) {
      const p = profileRes.data;
      if (p.xp !== undefined)    setXp(p.xp);
      if (p.streak !== undefined) setStreak(p.streak);
      if (p.is_pro !== undefined) setIsPro(p.is_pro);
      if (p.theme)               setTheme(p.theme);
      if (p.acc)                 setAcc(p.acc);
    }

    if (goalsRes.data?.length) {
      const goals: SavingsGoal[] = goalsRes.data.map((r: any) => ({
        id: r.id,
        title: r.title,
        emoji: r.emoji,
        targetAmount: parseFloat(r.target_amount),
        savedAmount: parseFloat(r.saved_amount),
        color: r.color,
        colorLight: r.color_light,
        colorDark: r.color_dark,
      }));
      setSavingsGoals(goals);
      saveSavingsGoals(goals).catch(() => {});
    }

    setScreen('app');
  };

  // ── Persist settings locally ───────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    saveSettings({ isPro, toggles, theme, acc, xp, streak, hasOnboarded, walkthroughDone }).catch(() => {});
  }, [isPro, toggles, theme, acc, xp, streak, hasOnboarded, walkthroughDone, isReady]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const signInUser = useCallback(async (email: string, password: string): Promise<string | null> => {
    const sb = getSupabase();
    if (!sb) {
      // Offline / Supabase not configured — store locally
      const profile: UserProfile = { id: 'local', email, displayName: email.split('@')[0] };
      setUserProfile(profile);
      await saveUserProfile(profile);
      return null;
    }
    try {
      const { error, data } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message && error.message !== '{}'
          ? error.message
          : 'Sign in failed. Your Supabase project may be paused — visit supabase.com/dashboard to resume it.';
        return msg;
      }
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email ?? '',
          displayName: data.user.user_metadata?.display_name || email.split('@')[0],
        };
        setUserProfile(profile);
        await saveUserProfile(profile);
        try {
          await loadSupabaseData(data.user.id);
        } catch {
          setScreen('app');
        }
      }
      return null;
    } catch (e: any) {
      return e?.message || 'Unable to connect. Check your internet and try again.';
    }
  }, []);

  const signUpUser = useCallback(async (email: string, password: string, displayName: string): Promise<string | null> => {
    const sb = getSupabase();
    if (!sb) {
      const profile: UserProfile = { id: 'local', email, displayName };
      setUserProfile(profile);
      await saveUserProfile(profile);
      setXp(0);
      setStreak(0);
      setTransactions([]);
      return null;
    }
    try {
      const { error, data } = await sb.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) {
        const msg = (error.message && error.message !== '{}' && error.message !== 'undefined')
          ? error.message
          : 'Sign up failed — check the Supabase dashboard logs for details (Database error saving new user usually means the trigger needs fixing).';
        return msg;
      }
      if (data.user && !data.session) {
        return 'CONFIRM_EMAIL';
      }
      if (data.user && data.session) {
        const profile: UserProfile = { id: data.user.id, email: data.user.email ?? '', displayName };
        setUserProfile(profile);
        await saveUserProfile(profile);
        // Upsert profile directly — resilient even if the DB trigger failed
        void sb.from('profiles').upsert({ id: data.user.id, display_name: displayName });
        setXp(0);
        setStreak(0);
        setTransactions([]);
      }
      return null;
    } catch (e: any) {
      return e?.message || 'Unable to connect. Check your internet and try again.';
    }
  }, []);

  const signOutUser = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setUserProfile(null);
    await saveUserProfile(null);
    setTransactions([]);
    setXp(0);
    setStreak(0);
    setSavingsGoals([]);
    setBudgetsState([]);
    setChallenges([]);
    setHasOnboarded(false);
    setScreenRaw('splash');
    setOnboardingStep(0);
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    setUserProfile(prev => prev ? { ...prev, displayName: name } : null);
    const sb = getSupabase();
    if (sb) {
      await sb.auth.updateUser({ data: { display_name: name } });
      if (userProfile?.id) {
        await sb.from('profiles').update({ display_name: name }).eq('id', userProfile.id);
      }
    }
    const current = await getUserProfile();
    if (current) await saveUserProfile({ ...current, displayName: name });
  }, [userProfile]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const navToPaywall = useCallback(() => {
    setPrevScreen(screen);
    setScreen('paywall');
  }, [screen]);

  const go = useCallback((t: AppTab) => {
    if (!isPro && PRO_TABS.includes(t)) {
      setPrevScreen(screen);
      setScreen('paywall');
      return;
    }
    setTab(t); setScreen('app');
  }, [isPro, screen]);

  // ── Transactions ──────────────────────────────────────────────────────────
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

    setTransactions(prev => {
      const next = [newTxn, ...prev];
      saveTransactions(next).catch(() => {});
      return next;
    });

    // Sync to Supabase
    if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
      const sb = getSupabase();
      sb?.from('transactions').insert({
        user_id: userProfile.id,
        type: newTxn.type,
        amount: newTxn.amount,
        category: newTxn.category,
        note: newTxn.note,
        date: newTxn.date,
      }).then(({ error }) => { if (error) console.warn('Supabase insert failed', error.message); });
    }

    const prev_xp = xp, next_xp = prev_xp + 25;
    const wasL = getLvl(prev_xp).c.lvl;
    const nowC = getLvl(next_xp).c;
    const newStreak = streak + 1;
    setXp(next_xp);
    setStreak(s => Math.min(s + 1, 999));
    setMood('excited');

    // Sync XP & streak to Supabase
    if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
      const sb = getSupabase();
      sb?.from('profiles').update({ xp: next_xp, streak: newStreak, last_logged: new Date().toISOString().split('T')[0] })
        .eq('id', userProfile.id).then(() => {});
    }

    if (nowC.lvl > wasL) {
      setLevelUp(nowC);
      setConfetti(true);
      setMsg("Level up! You're becoming a financial pro! 🏆");
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = setTimeout(() => setConfetti(false), 4000);
    } else {
      setMsg('Every dollar tracked grows your money tree! 🌱');
    }
    setAddDone(true);
    if (addDoneTimerRef.current) clearTimeout(addDoneTimerRef.current);
    addDoneTimerRef.current = setTimeout(() => {
      setAddDone(false); setAddAmt(''); setAddLabel(''); setMood('happy');
    }, 2400);
  }, [xp, streak, addAmt, addLabel, addType, addCat, userProfile]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id);
      saveTransactions(next).catch(() => {});
      return next;
    });
    if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
      const sb = getSupabase();
      sb?.from('transactions').delete().eq('id', id).then(() => {});
    }
  }, [userProfile]);

  // ── Savings goals ─────────────────────────────────────────────────────────
  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = { ...goal, id: Date.now().toString() };
    setSavingsGoals(prev => {
      const next = [...prev, newGoal];
      saveSavingsGoals(next).catch(() => {});
      return next;
    });
    if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
      const sb = getSupabase();
      sb?.from('savings_goals').insert({
        user_id: userProfile.id,
        title: goal.title,
        emoji: goal.emoji,
        target_amount: goal.targetAmount,
        saved_amount: goal.savedAmount,
        color: goal.color,
        color_light: goal.colorLight,
        color_dark: goal.colorDark,
      }).then(() => {});
    }
  }, [userProfile]);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals(prev => {
      const next = prev.filter(g => g.id !== id);
      saveSavingsGoals(next).catch(() => {});
      return next;
    });
    if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
      const sb = getSupabase();
      sb?.from('savings_goals').delete().eq('id', id).then(() => {});
    }
  }, [userProfile]);

  const updateSavingsGoalAmount = useCallback((id: string, addAmount: number) => {
    setSavingsGoals(prev => {
      const next = prev.map(g => {
        if (g.id !== id) return g;
        const updated = { ...g, savedAmount: Math.min(g.savedAmount + addAmount, g.targetAmount) };
        if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
          const sb = getSupabase();
          sb?.from('savings_goals').update({ saved_amount: updated.savedAmount }).eq('id', id).then(() => {});
        }
        return updated;
      });
      saveSavingsGoals(next).catch(() => {});
      return next;
    });
  }, [userProfile]);

  // ── Budgets ───────────────────────────────────────────────────────────────
  const saveBudget = useCallback((category: string, limit: number) => {
    setBudgetsState(prev => {
      const idx = prev.findIndex(b => b.category === category);
      const next = idx >= 0
        ? prev.map((b, i) => i === idx ? { ...b, limit } : b)
        : [...prev, { category, limit }];
      saveBudgets(next).catch(() => {});
      return next;
    });
  }, []);

  const deleteBudget = useCallback((category: string) => {
    setBudgetsState(prev => {
      const next = prev.filter(b => b.category !== category);
      saveBudgets(next).catch(() => {});
      return next;
    });
  }, []);

  // ── Challenges ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    saveChallenges(challenges).catch(() => {});
  }, [challenges, isReady]);

  const joinChallenge = useCallback((lib: LibraryChallenge) => {
    setChallenges(prev => {
      if (prev.some(c => c.id === lib.id)) return prev;
      return [...prev, { ...lib, done: 0 }];
    });
  }, []);

  const leaveChallenge = useCallback((id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
  }, []);

  const markChallenge = useCallback((id: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id !== id) return ch;
      const done = Math.min(ch.days, ch.done + 1);
      if (done === ch.days) {
        setChModal(ch);
        setXp(x => x + ch.xp);
        setConfetti(true);
        if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = setTimeout(() => setConfetti(false), 4000);
      }
      return { ...ch, done };
    }));
  }, []);

  const completeWalkthrough = useCallback(() => setWalkthroughDone(true), []);

  const activatePro = useCallback(() => {
    setIsPro(true);
    setScreen('app');
    setTab('home');
    setMsg('Welcome to Pro! Every feature is now unlocked 🚀');
    setMood('excited');
    setTimeout(() => setMood('happy'), 3000);
    if (isSupabaseConfigured && userProfile?.id && userProfile.id !== 'local') {
      const sb = getSupabase();
      sb?.from('profiles').update({ is_pro: true }).eq('id', userProfile.id).then(() => {});
    }
  }, [userProfile]);

  return (
    <AppContext.Provider value={{
      isReady, screen, prevScreen, setScreen, navToPaywall, onboardingStep, setOnboardingStep, tab, setTab, isPro, activatePro, plan, setPlan,
      xp, streak, mood, setMood, msg, setMsg, confetti, setConfetti,
      levelUp, setLevelUp, chModal, setChModal,
      addType, setAddType, addAmt, setAddAmt, addLabel, setAddLabel,
      addCat, setAddCat, addDone, selBudget, setSelBudget,
      theme, setTheme, acc, setAcc, tipIdx, setTipIdx,
      rewardTab, setRewardTab, profTab, setProfTab,
      challenges, joinChallenge, leaveChallenge, markChallenge, toggles, setToggles,
      transactions, deleteTransaction,
      doAdd, go,
      userProfile, signInUser, signUpUser, signOutUser, updateDisplayName,
      savingsGoals, addSavingsGoal, deleteSavingsGoal, updateSavingsGoalAmount,
      budgets, saveBudget, deleteBudget,
      walkthroughDone, completeWalkthrough,
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
