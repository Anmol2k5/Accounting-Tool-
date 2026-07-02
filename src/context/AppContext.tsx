import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type {Transaction, Account, AccountType} from '../types';
import {StorageService} from '../services/storage';

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (description: string, accounts: Account[]) => void;
  updateTransaction: (
    index: number,
    description: string,
    accounts: Account[],
  ) => void;
  deleteTransaction: (index: number) => void;
  clearAllData: () => void;
  getKnownAccounts: () => Record<
    string,
    {type: AccountType; sub: string; line_item: string}
  >;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    StorageService.getTransactions().then(setTransactions);
  }, []);

  const persist = useCallback(async (txns: Transaction[]) => {
    setTransactions(txns);
    await StorageService.saveTransactions(txns);
  }, []);

  const addTransaction = useCallback(
    (description: string, accounts: Account[]) => {
      const newTxn: Transaction = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        description,
        accounts: accounts.map(a => ({...a})),
        timestamp: new Date().toISOString(),
      };
      const updated = [...transactions, newTxn];
      persist(updated);
    },
    [transactions, persist],
  );

  const updateTransaction = useCallback(
    (index: number, description: string, accounts: Account[]) => {
      const updated = [...transactions];
      updated[index] = {
        ...updated[index],
        description,
        accounts: accounts.map(a => ({...a})),
      };
      persist(updated);
    },
    [transactions, persist],
  );

  const deleteTransaction = useCallback(
    (index: number) => {
      const updated = transactions.filter((_, i) => i !== index);
      persist(updated);
    },
    [transactions, persist],
  );

  const clearAllData = useCallback(() => {
    persist([]);
    StorageService.clearAll();
  }, [persist]);

  const getKnownAccounts = useCallback((): Record<
    string,
    {type: AccountType; sub: string; line_item: string}
  > => {
    const accs: Record<
      string,
      {type: AccountType; sub: string; line_item: string}
    > = {};
    transactions.forEach(txn => {
      txn.accounts.forEach(acc => {
        accs[acc.name] = {
          type: acc.type,
          sub: acc.sub,
          line_item: acc.line_item,
        };
      });
    });
    return accs;
  }, [transactions]);

  return (
    <AppContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAllData,
        getKnownAccounts,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
