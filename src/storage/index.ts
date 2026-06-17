import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget, SavingsGoal, UserProfile } from '../types';

const TRANSACTIONS_KEY  = '@smartspend_transactions';
const BUDGETS_KEY       = '@smartspend_budgets';
const SETTINGS_KEY      = '@smartspend_settings';
const SAVINGS_GOALS_KEY = '@smartspend_savings_goals';
const USER_PROFILE_KEY  = '@smartspend_user_profile';

export type SavedSettings = {
  isPro: boolean;
  toggles: boolean[];
  theme: string;
  acc: string;
  xp: number;
  streak: number;
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
