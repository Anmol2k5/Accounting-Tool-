import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useApp} from '../context/AppContext';
import {C, Spacing, FontSize, SharedStyles} from '../theme';
import {
  calculatePL,
  calculateBS,
  sumGroup,
  formatCurrency,
  calculateMetrics,
} from '../utils/financial';
import Svg, {Circle} from 'react-native-svg';

// ─── SVG Gauge Component ───────────────────────────────
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
    <View style={gaugeStyles.card}>
      <Text style={gaugeStyles.title}>{title}</Text>
      <View style={gaugeStyles.svgContainer}>
        <Svg width={100} height={100} style={{transform: [{rotate: '-90deg'}]}}>
          <Circle
            cx={50}
            cy={50}
            r={radius}
            fill="transparent"
            stroke={C.surfaceElevated}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={50}
            cy={50}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={gaugeStyles.valueOverlay}>
          <Text style={gaugeStyles.valueText}>
            {unit === '%'
              ? `${(value * 100).toFixed(1)}%`
              : value.toFixed(2)}
          </Text>
        </View>
      </View>
      <Text style={gaugeStyles.description}>{description}</Text>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  svgContainer: {
    width: 100,
    height: 100,
    marginBottom: Spacing.sm,
  },
  valueOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: C.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  description: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
});

// ─── Statement Row ─────────────────────────────────────
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
    <View style={[rowStyles.row, indent && rowStyles.indent]}>
      <Text
        style={[
          rowStyles.label,
          bold && rowStyles.bold,
          color ? {color} : null,
        ]}>
        {label}
      </Text>
      <Text
        style={[
          rowStyles.value,
          bold && rowStyles.bold,
          color ? {color} : null,
        ]}>
        {value}
      </Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  indent: {
    paddingLeft: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: FontSize.sm,
    color: C.textPrimary,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  bold: {
    fontWeight: '800',
    color: C.textPrimary,
    fontSize: FontSize.md,
  },
});

// ─── Main Reports Screen ───────────────────────────────
export function ReportsScreen({navigation}: any) {
  const {transactions} = useApp();

  if (transactions.length === 0) {
    return (
      <View style={[SharedStyles.screenContainer, SharedStyles.emptyState]}>
        <Text style={{fontSize: 48}}>📭</Text>
        <Text style={SharedStyles.emptyStateText}>No Records Found</Text>
        <Text style={SharedStyles.emptyStateSubtext}>
          Log at least one transaction to see financial statements.
        </Text>
        <TouchableOpacity
          style={SharedStyles.primaryButton}
          onPress={() => navigation.navigate('Add Transaction')}>
          <Text style={SharedStyles.primaryButtonText}>
            + Add Transaction
          </Text>
        </TouchableOpacity>
      </View>
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
    <ScrollView
      style={SharedStyles.screenContainer}
      contentContainerStyle={SharedStyles.screenPadding}>
      {/* ─── Income Statement ─── */}
      <View style={SharedStyles.cardElevated}>
        <Text style={SharedStyles.sectionTitle}>📄 Income Statement (P&L)</Text>

        <Text style={styles.groupTitle}>INCOMES</Text>
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

        <Text style={[styles.groupTitle, {marginTop: Spacing.lg}]}>
          EXPENSES
        </Text>
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

        <View style={SharedStyles.divider} />

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
      </View>

      {/* ─── Balance Sheet ─── */}
      <View style={SharedStyles.cardElevated}>
        <Text style={SharedStyles.sectionTitle}>📄 Balance Sheet</Text>

        {/* Assets */}
        <Text style={styles.groupTitle}>ASSETS</Text>
        {Object.keys(bs.CurrentAssets).length > 0 && (
          <>
            <Text style={styles.subGroupTitle}>Current Assets</Text>
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
            <Text style={styles.subGroupTitle}>Non-Current Assets</Text>
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

        <View style={SharedStyles.divider} />

        {/* Liabilities & Equity */}
        <Text style={styles.groupTitle}>LIABILITIES & EQUITY</Text>

        {Object.keys(bs.CurrentLiabilities).length > 0 && (
          <>
            <Text style={styles.subGroupTitle}>Current Liabilities</Text>
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
            <Text style={styles.subGroupTitle}>Non-Current Liabilities</Text>
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
            <Text style={styles.subGroupTitle}>Capital</Text>
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
            <Text style={styles.subGroupTitle}>Retained Earnings</Text>
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

        {/* Equation Check */}
        <View
          style={[
            styles.equationBadge,
            {
              backgroundColor: equationBalanced ? C.successBg : C.dangerBg,
              borderColor: equationBalanced ? C.success : C.danger,
            },
          ]}>
          <Text
            style={[
              styles.equationText,
              {color: equationBalanced ? C.success : C.danger},
            ]}>
            {equationBalanced
              ? `✅ Equation Balanced: Assets = L + E = ${formatCurrency(totalAssets)}`
              : `⚠️ Mismatch: Assets ${formatCurrency(totalAssets)} ≠ L+E ${formatCurrency(totalLiabEquity)}`}
          </Text>
        </View>
      </View>

      {/* ─── Financial Ratios ─── */}
      <Text style={SharedStyles.sectionTitle}>📈 Key Financial Ratios</Text>
      <Text style={SharedStyles.sectionSubtitle}>
        Visual indicators of business health, liquidity, and performance
      </Text>

      <View style={styles.gaugeGrid}>
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
      </View>
      <View style={[styles.gaugeGrid, {marginTop: Spacing.md}]}>
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
      </View>

      {/* Health Analysis Cards */}
      <View style={{marginTop: Spacing.xxl}}>
        <Text style={SharedStyles.sectionTitle}>🏥 Health Analysis</Text>

        <View style={SharedStyles.card}>
          <View style={styles.healthRow}>
            <View
              style={[
                styles.healthIcon,
                {
                  backgroundColor:
                    metrics.currentRatio >= 1.5 ? C.successBg : C.warningBg,
                },
              ]}>
              <Text style={{fontSize: 16}}>
                {metrics.currentRatio >= 1.5 ? '🛡️' : '⚠️'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.healthTitle}>Liquidity & Solvency</Text>
              <Text style={styles.healthDesc}>
                Current Ratio: {metrics.currentRatio.toFixed(2)}.{' '}
                {metrics.currentRatio >= 1.5
                  ? 'Excellent working capital buffers.'
                  : metrics.currentRatio >= 1
                    ? 'Moderate — consider improving cash reserves.'
                    : 'Critical — working capital deficit.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={SharedStyles.card}>
          <View style={styles.healthRow}>
            <View
              style={[
                styles.healthIcon,
                {
                  backgroundColor:
                    metrics.debtToEquityRatio <= 0.6
                      ? C.successBg
                      : C.dangerBg,
                },
              ]}>
              <Text style={{fontSize: 16}}>
                {metrics.debtToEquityRatio <= 0.6 ? '🛡️' : '⚠️'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.healthTitle}>Leverage & Debt Burden</Text>
              <Text style={styles.healthDesc}>
                D/E Ratio: {metrics.debtToEquityRatio.toFixed(2)}.{' '}
                {metrics.debtToEquityRatio <= 0.6
                  ? 'Conservative, safe capital structure.'
                  : 'Elevated leverage — consider reducing debt.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={SharedStyles.card}>
          <View style={styles.healthRow}>
            <View
              style={[styles.healthIcon, {backgroundColor: C.infoBg}]}>
              <Text style={{fontSize: 16}}>📊</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.healthTitle}>
                Asset Turnover & Efficiency
              </Text>
              <Text style={styles.healthDesc}>
                Turnover: {metrics.assetTurnover.toFixed(2)} — generating ₹
                {metrics.assetTurnover.toFixed(2)} revenue per ₹1 of assets.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  subGroupTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: C.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  equationBadge: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
  },
  equationText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  gaugeGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  healthIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 2,
  },
  healthDesc: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
    lineHeight: 18,
  },
});
