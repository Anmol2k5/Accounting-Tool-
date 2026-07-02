import type {FinancialMetrics} from './financial';
import type {Transaction} from '../types';

export function analyzeBasicQuestions(
  metrics: FinancialMetrics,
  transactions: Transaction[],
  prompt: string,
): string {
  const q = prompt.toLowerCase();
  const response: string[] = [];
  const fmt = (v: number) =>
    `₹${v.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;

  if (q.includes('cash') || q.includes('money') || q.includes('liquidity')) {
    response.push(`💰 Current Cash Position: ${fmt(metrics.cash)}`);
    if (metrics.cash < 0) {
      response.push(
        '⚠️ Warning: Negative cash balance detected. Immediate liquidity injection required.',
      );
    } else if (metrics.cash < metrics.currentLiabilities) {
      response.push(
        '⚠️ Warning: Cash reserves are lower than current liabilities. Potential cash crunch in 30-90 days.',
      );
    } else {
      response.push(
        '✅ Healthy: Cash balance is healthy relative to short-term obligations.',
      );
    }
  }

  if (
    q.includes('profit') ||
    q.includes('income') ||
    q.includes('earnings') ||
    q.includes('loss')
  ) {
    response.push(`📈 Net Income (Profit After Tax): ${fmt(metrics.netIncome)}`);
    if (metrics.netIncome < 0) {
      response.push(
        '⚠️ Warning: Business is operating at a net loss. Evaluate cost optimization.',
      );
    } else {
      const margin =
        metrics.totalRevenue !== 0
          ? (metrics.netIncome / metrics.totalRevenue) * 100
          : 0;
      response.push(`📊 Net Profit Margin: ${margin.toFixed(1)}%`);
      if (margin < 10) {
        response.push(
          'ℹ️ Margin is tight. Consider unit economics optimization.',
        );
      } else {
        response.push('✅ Excellent: Healthy profit margin.');
      }
    }
  }

  if (
    q.includes('debt') ||
    q.includes('loan') ||
    q.includes('borrowing') ||
    q.includes('leverage')
  ) {
    response.push(`💳 Total Liabilities: ${fmt(metrics.totalLiabilities)}`);
    const debtRatio =
      metrics.totalAssets !== 0
        ? metrics.totalLiabilities / metrics.totalAssets
        : 0;
    response.push(`📊 Debt Ratio: ${(debtRatio * 100).toFixed(1)}%`);
    if (debtRatio > 0.7) {
      response.push(
        '⚠️ High debt warning: Debt funds >70% of assets. Consider equity injection.',
      );
    } else {
      response.push(
        '✅ Safe leverage: Debt levels are manageable for expansion.',
      );
    }
  }

  if (q.includes('asset')) {
    response.push(`🏢 Total Assets: ${fmt(metrics.totalAssets)}`);
    response.push(`  • Current Assets: ${fmt(metrics.currentAssets)}`);
    response.push(`  • Non-Current Assets: ${fmt(metrics.nonCurrentAssets)}`);
  }

  if (
    q.includes('revenue') ||
    q.includes('sales') ||
    q.includes('income stream')
  ) {
    response.push(`📊 Total Revenue: ${fmt(metrics.totalRevenue)}`);
    let found = false;
    transactions.forEach(txn => {
      txn.accounts.forEach(acc => {
        if (acc.sub === 'Incomes') {
          response.push(
            `  • ${txn.description}: ${fmt(acc.amount)}`,
          );
          found = true;
        }
      });
    });
    if (!found) {
      response.push('  • No income transactions registered.');
    }
  }

  if (
    q.includes('expense') ||
    q.includes('cost') ||
    q.includes('spend')
  ) {
    response.push(`💸 Total Expenses: ${fmt(metrics.totalExpenses)}`);
    let found = false;
    transactions.forEach(txn => {
      txn.accounts.forEach(acc => {
        if (acc.sub === 'Expenses') {
          response.push(
            `  • ${txn.description}: ${fmt(Math.abs(acc.amount))}`,
          );
          found = true;
        }
      });
    });
    if (!found) {
      response.push('  • No expense transactions registered.');
    }
  }

  if (
    q.includes('ratio') ||
    q.includes('health') ||
    q.includes('solvency')
  ) {
    response.push(
      `📊 Current Ratio: ${metrics.currentRatio.toFixed(2)}`,
    );
    response.push(
      `📊 Debt to Equity: ${metrics.debtToEquityRatio.toFixed(2)}`,
    );
    if (metrics.currentRatio < 1) {
      response.push(
        '⚠️ Current Ratio below 1.0 — working capital deficit.',
      );
    } else if (metrics.currentRatio >= 1.5) {
      response.push('✅ Healthy liquidity with excellent asset coverage.');
    }
  }

  return response.join('\n\n');
}

export function getSimulatedAiAnalysis(metrics: FinancialMetrics): string {
  return `📊 Financial Health Diagnostic

Based on your ledger (Assets: ₹${metrics.totalAssets.toFixed(2)}, Liabilities: ₹${metrics.totalLiabilities.toFixed(2)}, Equity: ₹${metrics.totalEquity.toFixed(2)}):

1. Liquidity: Current Ratio is ${metrics.currentRatio.toFixed(2)}. ${
    metrics.currentRatio >= 1.5
      ? 'Excellent working capital buffers.'
      : metrics.currentRatio >= 1.0
        ? 'Moderate — consider improving cash reserves.'
        : 'CRITICAL — working capital deficit detected.'
  }

2. Profitability: Net Profit of ₹${metrics.netIncome.toFixed(2)} on Revenue of ₹${metrics.totalRevenue.toFixed(2)}. Conversion efficiency: ${
    metrics.totalRevenue !== 0
      ? ((metrics.netIncome / metrics.totalRevenue) * 100).toFixed(1)
      : '0'
  }%.

3. Recommendations:
   • Maintain 3-month cash buffer for fixed overhead
   • ${
     metrics.debtToEquityRatio <= 0.6
       ? 'Low leverage — capacity for debt financing exists'
       : 'Elevated leverage — prioritize equity over debt'
   }
   • Asset Turnover: ₹${metrics.assetTurnover.toFixed(2)} revenue per ₹1 of assets`;
}

export function getFundingAnalysis(metrics: FinancialMetrics): string {
  return `💰 Capital Structure & Funding Strategy

Debt-to-Equity: ${metrics.debtToEquityRatio.toFixed(2)}

1. Borrowing Capacity: ${
    metrics.debtToEquityRatio <= 0.6
      ? 'Low leverage suggests significant capacity for debt financing. Banks will view balanced books favorably.'
      : 'Elevated leverage ratio. Equity financing strongly recommended over additional debt.'
  }

2. Recommended Channels:
   • Working Capital Loans — ideal for receivables financing
   • ${
     metrics.roe > 0.1
       ? `Angel/Venture Equity — ROE of ${(metrics.roe * 100).toFixed(1)}% makes you attractive to investors`
       : 'Trade Credit — negotiate longer payment cycles with suppliers'
   }
   • Government SME grants and subsidies`;
}

export function getGrowthAnalysis(metrics: FinancialMetrics): string {
  return `📈 Growth & Asset Optimization

Total Asset Base: ₹${metrics.totalAssets.toFixed(2)}
Asset Turnover: ${metrics.assetTurnover.toFixed(2)}

1. Asset Strategy: ${
    metrics.nonCurrentAssets > metrics.currentAssets
      ? 'Significant fixed assets — focus on increasing utilization or lease options.'
      : 'Liquid asset base — maximum agility for expansion and hiring.'
  }

2. Growth Tactics:
   • Leverage profitable margins for digital growth channels
   • Optimize variable costs and vendor pricing
   • ${
     metrics.netIncome > 0
       ? 'Reinvest surplus cash into R&D or market expansion'
       : 'Priority: achieve breakeven before expansion'
   }`;
}
