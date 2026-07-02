import { useApp } from '../context/AppContext';
import { calculateMetrics, formatCurrency } from '../utils/financial';
import { useNavigate } from 'react-router-dom';
import { C } from '../theme';

export function HomePage() {
  const { transactions } = useApp();
  const navigate = useNavigate();
  const metrics = calculateMetrics(transactions);
  const hasData = transactions.length > 0;

  return (
    <div className="page">
      {/* Hero Header */}
      <div className="hero">
        <div className="logo-row">
          <div className="logo-badge">₹</div>
          <div>
            <div className="hero-title">IIMU Ledger</div>
            <div className="hero-subtitle">Accounting &amp; Financial Advisor</div>
          </div>
        </div>
        <p className="hero-description">
          Premium double-entry bookkeeping engine with real-time analytics and
          AI-powered business advisory.
        </p>
      </div>

      {/* Quick Stats */}
      {hasData && (
        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: C.success }}>
            <div className="stat-label">Total Assets</div>
            <div className="stat-value" style={{ color: C.success }}>
              {formatCurrency(metrics.totalAssets)}
            </div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: C.danger }}>
            <div className="stat-label">Liabilities</div>
            <div className="stat-value" style={{ color: C.danger }}>
              {formatCurrency(metrics.totalLiabilities)}
            </div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: C.gold }}>
            <div className="stat-label">Net Income</div>
            <div
              className="stat-value"
              style={{ color: metrics.netIncome >= 0 ? C.success : C.danger }}>
              {formatCurrency(metrics.netIncome)}
            </div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: C.info }}>
            <div className="stat-label">Current Ratio</div>
            <div className="stat-value" style={{ color: C.info }}>
              {metrics.currentRatio.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      <div className="card-elevated">
        <div className="section-title">🚀 Getting Started</div>
        <div className="section-subtitle">
          Follow these steps to analyze your firm's performance
        </div>

        <div className="step-card">
          <div className="step-number">1</div>
          <div>
            <div className="step-title">Enter Transactions 📊</div>
            <div className="step-desc">
              Log account flows with double-entry validation ensuring your
              equation stays balanced.
            </div>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div>
            <div className="step-title">Review Statements 📄</div>
            <div className="step-desc">
              Generate Income Statements and Balance Sheets instantly with
              real-time equation checks.
            </div>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div>
            <div className="step-title">Consult AI Advisor 🤖</div>
            <div className="step-desc">
              Analyze financial health, review leverage, and get strategic
              expansion tips.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="section-title">⚡ Quick Actions</div>
        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={() => navigate('/add-transaction')}>
          + New Transaction
        </button>
        <div style={{ height: 12 }} />
        <button
          className="btn-secondary"
          style={{ width: '100%' }}
          onClick={() => navigate('/reports')}>
          📈 View Financial Reports
        </button>
      </div>

      {/* Sample Transaction */}
      <div className="card">
        <div className="section-title">💡 Sample Transaction</div>
        <p className="sample-text">
          Try logging an initial capital contribution:
        </p>
        <div className="sample-item">
          <span className="sample-bullet">•</span>
          <span className="sample-item-text">
            <strong>Description:</strong> "Initial Owner Funding"
          </span>
        </div>
        <div className="sample-item">
          <span className="sample-bullet">•</span>
          <span className="sample-item-text">
            <strong>Account 1:</strong> Cash (Asset → Current Assets) +₹1,00,000
          </span>
        </div>
        <div className="sample-item">
          <span className="sample-bullet">•</span>
          <span className="sample-item-text">
            <strong>Account 2:</strong> Owner's Capital (Equity → Capital) +₹1,00,000
          </span>
        </div>
      </div>
    </div>
  );
}
