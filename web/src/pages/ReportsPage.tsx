import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { C } from '../theme';
import {
  calculatePL,
  calculateBS,
  sumGroup,
  formatCurrency,
  calculateMetrics,
} from '../utils/financial';

/* ─── SVG Gauge Component ───────────────────────────── */
function RatioGauge({
  title,
  value,
  max,
  color,
  unit = '',
  description,
}: {
  title: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
  description: string;
}) {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const displayVal = Math.max(0, value);
  const percentage = Math.min(100, (displayVal / max) * 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="gauge-card">
      <div className="gauge-title">{title}</div>
      <div className="gauge-svg-container">
        <svg
          width={100}
          height={100}
          style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={50}
            cy={50}
            r={radius}
            fill="transparent"
            stroke={C.surfaceElevated}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={50}
            cy={50}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="gauge-value-overlay">
          <span className="gauge-value-text">
            {unit === '%'
              ? `${(value * 100).toFixed(1)}%`
              : value.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="gauge-description">{description}</div>
    </div>
  );
}

/* ─── Statement Row ─────────────────────────────────── */
function StatementRow({
  label,
  value,
  bold = false,
  indent = false,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  indent?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`statement-row ${bold ? 'bold' : ''} ${indent ? 'indent' : ''}`}>
      <span className="statement-row-label" style={color ? { color } : undefined}>
        {label}
      </span>
      <span className="statement-row-value" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

/* ─── Main Reports Page ─────────────────────────────── */
export function ReportsPage() {
  const { transactions } = useApp();
  const navigate = useNavigate();

  if (transactions.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No Records Found</div>
          <div className="empty-state-text">
            Log at least one transaction to see financial statements.
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/add-transaction')}>
            + Add Transaction
          </button>
        </div>
      </div>
    );
  }

  const pl = calculatePL(transactions);
  const bs = calculateBS(transactions, pl.netIncome);
  const metrics = calculateMetrics(transactions);

  const totalCurrentAssets = sumGroup(bs.CurrentAssets);
  const totalNonCurrentAssets = sumGroup(bs.NonCurrentAssets);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiab = sumGroup(bs.CurrentLiabilities);
  const totalNonCurrentLiab = sumGroup(bs.NonCurrentLiabilities);
  const totalLiabilities = totalCurrentLiab + totalNonCurrentLiab;

  const totalCapital = sumGroup(bs.Capital);
  const totalRetained = sumGroup(bs.RetainedEarnings);
  const totalEquity = totalCapital + totalRetained;
  const totalLiabEquity = totalLiabilities + totalEquity;

  const equationBalanced = Math.abs(totalAssets - totalLiabEquity) < 0.01;

  return (
    <div className="page">
      {/* ─── Income Statement ─── */}
      <div className="card-elevated">
        <div className="section-title">📄 Income Statement (P&amp;L)</div>

        <div className="group-title">INCOMES</div>
        <StatementRow
          label="Revenue from Operations (A)"
          value={formatCurrency(pl.revOps)}
          indent
        />
        <StatementRow
          label="Other Incomes (B)"
          value={formatCurrency(pl.otherInc)}
          indent
        />
        <StatementRow
          label="Total Revenue (C = A + B)"
          value={formatCurrency(pl.totalRevenue)}
          bold
        />

        <div className="group-title" style={{ marginTop: 16 }}>
          EXPENSES
        </div>
        <StatementRow
          label="Material related Expenses (D)"
          value={formatCurrency(pl.matExp)}
          indent
        />
        <StatementRow
          label="Employee Compensation (E)"
          value={formatCurrency(pl.empExp)}
          indent
        />
        <StatementRow
          label="Depreciation & Amortization (F)"
          value={formatCurrency(pl.depExp)}
          indent
        />
        <StatementRow
          label="Finance Costs (G)"
          value={formatCurrency(pl.finExp)}
          indent
        />
        <StatementRow
          label="Other Expenses (H)"
          value={formatCurrency(pl.othExp)}
          indent
        />
        <StatementRow
          label="Total Expenses (I)"
          value={formatCurrency(pl.totalExpenses)}
          bold
        />

        <div className="divider" />

        <StatementRow
          label="Profit Before Tax (J = C - I)"
          value={formatCurrency(pl.profitBeforeTax)}
          bold
        />
        <StatementRow
          label="Tax Expenses (K)"
          value={formatCurrency(pl.taxExp)}
          indent
        />
        <StatementRow
          label="Profit After Tax (L = J - K)"
          value={formatCurrency(pl.netIncome)}
          bold
          color={pl.netIncome >= 0 ? C.success : C.danger}
        />
      </div>

      {/* ─── Balance Sheet ─── */}
      <div className="card-elevated">
        <div className="section-title">📄 Balance Sheet</div>

        <div className="group-title">ASSETS</div>
        {Object.keys(bs.CurrentAssets).length > 0 && (
          <>
            <div className="sub-group-title">Current Assets</div>
            {Object.entries(bs.CurrentAssets).map(([item, amt]) => (
              <StatementRow
                key={item}
                label={item}
                value={formatCurrency(amt)}
                indent
              />
            ))}
            <StatementRow
              label="Total Current Assets"
              value={formatCurrency(totalCurrentAssets)}
              bold
            />
          </>
        )}
        {Object.keys(bs.NonCurrentAssets).length > 0 && (
          <>
            <div className="sub-group-title">Non-Current Assets</div>
            {Object.entries(bs.NonCurrentAssets).map(([item, amt]) => (
              <StatementRow
                key={item}
                label={item}
                value={formatCurrency(amt)}
                indent
              />
            ))}
            <StatementRow
              label="Total Non-Current Assets"
              value={formatCurrency(totalNonCurrentAssets)}
              bold
            />
          </>
        )}
        <StatementRow
          label="TOTAL ASSETS"
          value={formatCurrency(totalAssets)}
          bold
          color={C.gold}
        />

        <div className="divider" />

        <div className="group-title">LIABILITIES &amp; EQUITY</div>

        {Object.keys(bs.CurrentLiabilities).length > 0 && (
          <>
            <div className="sub-group-title">Current Liabilities</div>
            {Object.entries(bs.CurrentLiabilities).map(([item, amt]) => (
              <StatementRow
                key={item}
                label={item}
                value={formatCurrency(amt)}
                indent
              />
            ))}
          </>
        )}
        {Object.keys(bs.NonCurrentLiabilities).length > 0 && (
          <>
            <div className="sub-group-title">Non-Current Liabilities</div>
            {Object.entries(bs.NonCurrentLiabilities).map(([item, amt]) => (
              <StatementRow
                key={item}
                label={item}
                value={formatCurrency(amt)}
                indent
              />
            ))}
          </>
        )}
        {Object.keys(bs.Capital).length > 0 && (
          <>
            <div className="sub-group-title">Capital</div>
            {Object.entries(bs.Capital).map(([item, amt]) => (
              <StatementRow
                key={item}
                label={item}
                value={formatCurrency(amt)}
                indent
              />
            ))}
          </>
        )}
        {Object.keys(bs.RetainedEarnings).length > 0 && (
          <>
            <div className="sub-group-title">Retained Earnings</div>
            {Object.entries(bs.RetainedEarnings).map(([item, amt]) => (
              <StatementRow
                key={item}
                label={item}
                value={formatCurrency(amt)}
                indent
              />
            ))}
          </>
        )}
        <StatementRow
          label="TOTAL LIABILITIES & EQUITY"
          value={formatCurrency(totalLiabEquity)}
          bold
          color={C.gold}
        />

        <div
          className="equation-badge"
          style={{
            backgroundColor: equationBalanced ? C.successBg : C.dangerBg,
            borderColor: equationBalanced ? C.success : C.danger,
            color: equationBalanced ? C.success : C.danger,
          }}>
          {equationBalanced
            ? `✅ Equation Balanced: Assets = L + E = ${formatCurrency(totalAssets)}`
            : `⚠️ Mismatch: Assets ${formatCurrency(totalAssets)} ≠ L+E ${formatCurrency(totalLiabEquity)}`}
        </div>
      </div>

      {/* ─── Financial Ratios ─── */}
      <div className="section-title">📈 Key Financial Ratios</div>
      <div className="section-subtitle">
        Visual indicators of business health, liquidity, and performance
      </div>

      <div className="gauge-grid">
        <RatioGauge
          title="Current Ratio"
          value={metrics.currentRatio}
          max={3}
          color={
            metrics.currentRatio >= 1.5
              ? C.success
              : metrics.currentRatio >= 1.0
                ? C.warning
                : C.danger
          }
          description="Short-term debt coverage. Target: 1.5–2.0"
        />
        <RatioGauge
          title="Debt to Equity"
          value={metrics.debtToEquityRatio}
          max={2}
          color={
            metrics.debtToEquityRatio <= 0.6
              ? C.success
              : metrics.debtToEquityRatio <= 1.2
                ? C.warning
                : C.danger
          }
          description="Financial leverage. Lower = less risk"
        />
      </div>
      <div className="gauge-grid mt-12">
        <RatioGauge
          title="ROA"
          value={metrics.roa}
          max={0.25}
          unit="%"
          color={
            metrics.roa > 0.1
              ? C.success
              : metrics.roa >= 0
                ? C.warning
                : C.danger
          }
          description="Profit per asset dollar. Target: >5%"
        />
        <RatioGauge
          title="ROE"
          value={metrics.roe}
          max={0.3}
          unit="%"
          color={
            metrics.roe > 0.15
              ? C.success
              : metrics.roe >= 0
                ? C.warning
                : C.danger
          }
          description="Return on shareholder equity. Target: >10%"
        />
      </div>

      {/* ─── Health Analysis ─── */}
      <div className="mt-24">
        <div className="section-title">🏥 Health Analysis</div>

        <div className="card">
          <div className="health-row">
            <div
              className="health-icon"
              style={{
                backgroundColor:
                  metrics.currentRatio >= 1.5 ? C.successBg : C.warningBg,
              }}>
              {metrics.currentRatio >= 1.5 ? '🛡️' : '⚠️'}
            </div>
            <div>
              <div className="health-title">Liquidity &amp; Solvency</div>
              <div className="health-desc">
                Current Ratio: {metrics.currentRatio.toFixed(2)}.{' '}
                {metrics.currentRatio >= 1.5
                  ? 'Excellent working capital buffers.'
                  : metrics.currentRatio >= 1
                    ? 'Moderate — consider improving cash reserves.'
                    : 'Critical — working capital deficit.'}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="health-row">
            <div
              className="health-icon"
              style={{
                backgroundColor:
                  metrics.debtToEquityRatio <= 0.6
                    ? C.successBg
                    : C.dangerBg,
              }}>
              {metrics.debtToEquityRatio <= 0.6 ? '🛡️' : '⚠️'}
            </div>
            <div>
              <div className="health-title">Leverage &amp; Debt Burden</div>
              <div className="health-desc">
                D/E Ratio: {metrics.debtToEquityRatio.toFixed(2)}.{' '}
                {metrics.debtToEquityRatio <= 0.6
                  ? 'Conservative, safe capital structure.'
                  : 'Elevated leverage — consider reducing debt.'}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="health-row">
            <div
              className="health-icon"
              style={{ backgroundColor: C.infoBg }}>
              📊
            </div>
            <div>
              <div className="health-title">
                Asset Turnover &amp; Efficiency
              </div>
              <div className="health-desc">
                Turnover: {metrics.assetTurnover.toFixed(2)} — generating ₹
                {metrics.assetTurnover.toFixed(2)} revenue per ₹1 of assets.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
