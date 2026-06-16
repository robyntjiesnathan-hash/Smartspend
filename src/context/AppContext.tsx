import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Transaction, Budget } from '../types';
import { getTransactions, saveTransactions, getBudgets, saveBudgets } from '../storage';

const SEED_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 3500, category: 'Salary', note: 'Monthly salary', date: new Date(Date.now() - 25 * 86400000).toISOString() },
  { id: '2', type: 'expense', amount: 120, category: 'Food', note: 'Grocery shopping', date: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: '3', type: 'expense', amount: 45, category: 'Transport', note: 'Uber rides', date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '4', type: 'expense', amount: 200, category: 'Shopping', note: 'Clothing', date: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '5', type: 'expense', amount: 80, category: 'Bills', note: 'Electricity bill', date: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: '6', type: 'expense', amount: 35, category: 'Entertainment', note: 'Netflix + Spotify', date: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: '7', type: 'income', amount: 250, category: 'Other', note: 'Freelance work', date: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: '8', type: 'expense', amount: 60, category: 'Health', note: 'Pharmacy', date: new Date(Date.now() - 4 * 86400000).toISOString() },
];

const SEED_BUDGETS: Budget[] = [
  { category: 'Food', limit: 400 },
  { category: 'Transport', limit: 150 },
  { category: 'Shopping', limit: 300 },
  { category: 'Bills', limit: 200 },
  { category: 'Entertainment', limit: 100 },
  { category: 'Health', limit: 150 },
];

type AppContextType = {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (t: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setBudget: (budget: Budget) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const load = async () => {
      let txns = await getTransactions();
      let bdgts = await getBudgets();
      if (txns.length === 0) {
        txns = SEED_TRANSACTIONS;
        await saveTransactions(txns);
      }
      if (bdgts.length === 0) {
        bdgts = SEED_BUDGETS;
        await saveBudgets(bdgts);
      }
      setTransactions(txns);
      setBudgets(bdgts);
    };
    load();
  }, []);

  const addTransaction = async (t: Transaction) => {
    const updated = [t, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const setBudget = async (budget: Budget) => {
    const updated = budgets.some(b => b.category === budget.category)
      ? budgets.map(b => b.category === budget.category ? budget : b)
      : [...budgets, budget];
    setBudgets(updated);
    await saveBudgets(updated);
  };

  return (
    <AppContext.Provider value={{ transactions, budgets, addTransaction, deleteTransaction, setBudget }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
