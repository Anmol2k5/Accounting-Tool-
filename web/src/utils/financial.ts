import type { Transaction } from '../types';

export interface FinancialMetrics {
  currentAssets: number;
  nonCurrentAssets: number;
  currentLiabilities: number;
  nonCurrentLiabilities: number;
  capital: number;
  retainedEarnings: number;
  totalRevenue: number;
  totalExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  cash: number;
  netIncome: number;
  currentRatio: number;
  debtToEquityRatio: number;
  roa: number;
  roe: number;
  assetTurnover: number;
}

export interface PLStatement {
  revOps: number;
  otherInc: number;
  totalRevenue: number;
  matExp: number;
  empExp: number;
  depExp: number;
  finExp: number;
  othExp: number;
  totalExpenses: number;
  profitBeforeTax: number;
  taxExp: number;
  netIncome: number;
}

export interface BSItems {
  CurrentAssets: Record<string, number>;
  NonCurrentAssets: Record<string, number>;
  CurrentLiabilities: Record<string, number>;
  NonCurrentLiabilities: Record<string, number>;
  Capital: Record<string, number>;
  RetainedEarnings: Record<string, number>;
}

export function calculatePL(transactions: Transaction[]): PLStatement {
  const plMap: Record<string, number> = {
    'Revenue from Operations': 0,
    'Other Incomes': 0,
    'Material related Expenses': 0,
    'Employee Compensation Expenses': 0,
    'Depreciation & Amortization': 0,
    'Finance Costs': 0,
    'Other Expenses': 0,
    'Tax Expenses': 0,
  };

  transactions.forEach(txn => {
    txn.accounts.forEach(acc => {
      if (
        (acc.sub === 'Incomes' || acc.sub === 'Expenses') &&
        acc.line_item in plMap
      ) {
        plMap[acc.line_item] += acc.amount;
      }
    });
  });

  const revOps = plMap['Revenue from Operations'];
  const otherInc = plMap['Other Incomes'];
  const totalRevenue = revOps + otherInc;

  const matExp = Math.abs(plMap['Material related Expenses']);
  const empExp = Math.abs(plMap['Employee Compensation Expenses']);
  const depExp = Math.abs(plMap['Depreciation & Amortization']);
  const finExp = Math.abs(plMap['Finance Costs']);
  const othExp = Math.abs(plMap['Other Expenses']);
  const totalExpenses = matExp + empExp + depExp + finExp + othExp;

  const profitBeforeTax = totalRevenue - totalExpenses;
  const taxExp = Math.abs(plMap['Tax Expenses']);
  const netIncome = profitBeforeTax - taxExp;

  return {
    revOps,
    otherInc,
    totalRevenue,
    matExp,
    empExp,
    depExp,
    finExp,
    othExp,
    totalExpenses,
    profitBeforeTax,
    taxExp,
    netIncome,
  };
}

export function calculateBS(
  transactions: Transaction[],
  netIncome: number,
): BSItems {
  const bs: BSItems = {
    CurrentAssets: {},
    NonCurrentAssets: {},
    CurrentLiabilities: {},
    NonCurrentLiabilities: {},
    Capital: {},
    RetainedEarnings: {},
  };

  transactions.forEach(txn => {
    txn.accounts.forEach(acc => {
      const amt = acc.amount;
      if (acc.type === 'Asset') {
        const cat =
          acc.sub === 'Current Assets' ? 'CurrentAssets' : 'NonCurrentAssets';
        bs[cat][acc.line_item] = (bs[cat][acc.line_item] || 0) + amt;
      } else if (acc.type === 'Liability') {
        const cat =
          acc.sub === 'Current Liabilities'
            ? 'CurrentLiabilities'
            : 'NonCurrentLiabilities';
        bs[cat][acc.line_item] = (bs[cat][acc.line_item] || 0) + amt;
      } else if (acc.type === 'Equity') {
        if (acc.sub === 'Capital') {
          bs.Capital[acc.name] = (bs.Capital[acc.name] || 0) + amt;
        } else if (acc.sub === 'Retained Earnings') {
          bs.RetainedEarnings[acc.name] =
            (bs.RetainedEarnings[acc.name] || 0) + amt;
        }
      }
    });
  });

  bs.RetainedEarnings['Profit for the Year'] = netIncome;
  return bs;
}

export function sumGroup(group: Record<string, number>): number {
  return Object.values(group).reduce((s, v) => s + v, 0);
}

export function calculateMetrics(
  transactions: Transaction[],
): FinancialMetrics {
  let currentAssets = 0;
  let nonCurrentAssets = 0;
  let currentLiabilities = 0;
  let nonCurrentLiabilities = 0;
  let capitalVal = 0;
  let retainedEarningsVal = 0;
  let totalRevenue = 0;
  let totalExpenses = 0;
  let cash = 0;

  transactions.forEach(txn => {
    txn.accounts.forEach(acc => {
      const amt = acc.amount;
      if (acc.type === 'Asset') {
        if (acc.sub === 'Current Assets') {
          currentAssets += amt;
        } else {
          nonCurrentAssets += amt;
        }
      } else if (acc.type === 'Liability') {
        if (acc.sub === 'Current Liabilities') {
          currentLiabilities += amt;
        } else {
          nonCurrentLiabilities += amt;
        }
      } else if (acc.type === 'Equity') {
        if (acc.sub === 'Capital') {
          capitalVal += amt;
        } else if (acc.sub === 'Retained Earnings') {
          retainedEarningsVal += amt;
        }
      }
      if (acc.sub === 'Incomes') {
        totalRevenue += amt;
      } else if (acc.sub === 'Expenses') {
        totalExpenses += Math.abs(amt);
      }
      if (acc.line_item === 'Cash and Cash Equivalents') {
        cash += amt;
      }
    });
  });

  const pl = calculatePL(transactions);
  const netIncome = pl.netIncome;

  const totalAssets = currentAssets + nonCurrentAssets;
  const totalLiabilities = currentLiabilities + nonCurrentLiabilities;
  const totalEquity = capitalVal + retainedEarningsVal + netIncome;

  const currentRatio =
    currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
  const debtToEquityRatio =
    totalEquity !== 0 ? totalLiabilities / totalEquity : 0;
  const roa = totalAssets !== 0 ? netIncome / totalAssets : 0;
  const roe = totalEquity !== 0 ? netIncome / totalEquity : 0;
  const assetTurnover = totalAssets !== 0 ? totalRevenue / totalAssets : 0;

  return {
    currentAssets,
    nonCurrentAssets,
    currentLiabilities,
    nonCurrentLiabilities,
    capital: capitalVal,
    retainedEarnings: retainedEarningsVal,
    totalRevenue,
    totalExpenses,
    totalAssets,
    totalLiabilities,
    totalEquity,
    cash,
    netIncome,
    currentRatio,
    debtToEquityRatio,
    roa,
    roe,
    assetTurnover,
  };
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
