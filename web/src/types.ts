export type AccountType = 'Asset' | 'Liability' | 'Equity';

export interface Account {
  name: string;
  type: AccountType;
  sub: string;
  line_item: string;
  amount: number;
  selected_account?: string;
}

export interface Transaction {
  id: string;
  description: string;
  accounts: Account[];
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const SUB_CLASSIFICATION_OPTIONS: Record<AccountType, string[]> = {
  Asset: ['Non-Current Assets', 'Current Assets'],
  Liability: ['Non-Current Liabilities', 'Current Liabilities'],
  Equity: ['Capital', 'Retained Earnings', 'Incomes', 'Expenses'],
};

export const LINE_ITEM_OPTIONS: Record<string, string[]> = {
  'Non-Current Assets': [
    'Property, Plant & Equipment',
    'Intangible Assets',
    'Long Term Investments',
    'Other Non Current Assets',
  ],
  'Current Assets': [
    'Inventory',
    'Trade Receivables',
    'Cash and Cash Equivalents',
    'Other Current Assets',
  ],
  'Current Liabilities': [
    'Trade Payables',
    'Short Term Borrowings',
    'Outstanding Expenses',
    'Short Term Provisions',
    'Advance from Customers',
    'Other Current Liabilities',
  ],
  'Non-Current Liabilities': [
    'Borrowings',
    'Long Term Provisions',
    'Other Non Current Liabilities',
  ],
  Capital: ['Not Applicable'],
  'Retained Earnings': ['Not Applicable'],
  Incomes: ['Revenue from Operations', 'Other Incomes'],
  Expenses: [
    'Material related Expenses',
    'Employee Compensation Expenses',
    'Depreciation & Amortization',
    'Finance Costs',
    'Other Expenses',
    'Tax Expenses',
  ],
};
