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

export type AppState = {
  transactions: Transaction[];
  budgets: Budget[];
};
