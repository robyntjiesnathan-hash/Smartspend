import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget, SavingsGoal, UserProfile, Challenge } from '../types';

const TRANSACTIONS_KEY  = '@smartspend_transactions';
const BUDGETS_KEY       = '@smartspend_budgets';
const SETTINGS_KEY      = '@smartspend_settings';
const SAVINGS_GOALS_KEY = '@smartspend_savings_goals';
const USER_PROFILE_KEY  = '@smartspend_user_profile';
const CHALLENGES_KEY    = '@smartspend_challenges';
const NOTIF_IDS_KEY     = '@smartspend_notif_ids';

export type SavedSettings = {
  isPro: boolean;
  toggles: boolean[];
  theme: string;
  acc: string;
  xp: number;
  streak: number;
  hasOnboarded: boolean;
  walkthroughDone: boolean;
  lastLogged?: string;
};

export const getSettings = async (): Promise<Partial<SavedSettings>> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveSettings = async (settings: SavedSettings): Promise<void> => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getBudgets = async (): Promise<Budget[]> => {
  try {
    const data = await AsyncStorage.getItem(BUDGETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveBudgets = async (budgets: Budget[]): Promise<void> => {
  await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
};

export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  try {
    const data = await AsyncStorage.getItem(SAVINGS_GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSavingsGoals = async (goals: SavingsGoal[]): Promise<void> => {
  await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(goals));
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveUserProfile = async (profile: UserProfile | null): Promise<void> => {
  if (profile === null) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } else {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  }
};

export const getChallenges = async (): Promise<Challenge[]> => {
  try {
    const data = await AsyncStorage.getItem(CHALLENGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveChallenges = async (challenges: Challenge[]): Promise<void> => {
  await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
};

export const getNotifIds = async (): Promise<(string | null)[]> => {
  try {
    const data = await AsyncStorage.getItem(NOTIF_IDS_KEY);
    return data ? JSON.parse(data) : [null, null, null, null];
  } catch {
    return [null, null, null, null];
  }
};

export const saveNotifIds = async (ids: (string | null)[]): Promise<void> => {
  await AsyncStorage.setItem(NOTIF_IDS_KEY, JSON.stringify(ids));
};
