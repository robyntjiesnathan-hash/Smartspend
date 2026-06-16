import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget } from '../types';

const TRANSACTIONS_KEY = '@smartspend_transactions';
const BUDGETS_KEY = '@smartspend_budgets';
const SETTINGS_KEY = '@smartspend_settings';

export type SavedSettings = {
  isPro: boolean;
  toggles: boolean[];
  theme: string;
  acc: string;
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
