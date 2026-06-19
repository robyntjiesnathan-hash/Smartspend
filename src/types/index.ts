export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type Budget = {
  category: string;
  limit: number;
};

export type SavingsGoal = {
  id: string;
  title: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  color: string;
  colorLight: string;
  colorDark: string;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
};

export type AppState = {
  transactions: Transaction[];
  budgets: Budget[];
};

export type LibraryChallenge = {
  id: string;
  emoji: string;
  cat: string;
  title: string;
  desc: string;
  days: number;
  xp: number;
  col: string;
  colL: string;
  colD: string;
};

export type Challenge = LibraryChallenge & { done: number };
