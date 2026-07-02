import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useApp} from '../context/AppContext';
import {C, Spacing, FontSize, SharedStyles} from '../theme';
import {calculateMetrics, formatCurrency} from '../utils/financial';

export function HomeScreen({navigation}: any) {
  const {transactions} = useApp();
  const metrics = calculateMetrics(transactions);
  const hasData = transactions.length > 0;

  return (
    <ScrollView
      style={SharedStyles.screenContainer}
      contentContainerStyle={SharedStyles.screenPadding}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>₹</Text>
          </View>
          <View>
            <Text style={styles.heroTitle}>IIMU Ledger</Text>
            <Text style={styles.heroSubtitle}>
              Accounting & Financial Advisor
            </Text>
          </View>
        </View>
        <Text style={styles.heroDescription}>
          Premium double-entry bookkeeping engine with real-time analytics and
          AI-powered business advisory.
        </Text>
      </View>

      {/* Quick Stats */}
      {hasData && (
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, {borderLeftColor: C.success}]}>
            <Text style={styles.statLabel}>Total Assets</Text>
            <Text style={[styles.statValue, {color: C.success}]}>
              {formatCurrency(metrics.totalAssets)}
            </Text>
          </View>
          <View style={[styles.statCard, {borderLeftColor: C.danger}]}>
            <Text style={styles.statLabel}>Liabilities</Text>
            <Text style={[styles.statValue, {color: C.danger}]}>
              {formatCurrency(metrics.totalLiabilities)}
            </Text>
          </View>
          <View style={[styles.statCard, {borderLeftColor: C.gold}]}>
            <Text style={styles.statLabel}>Net Income</Text>
            <Text
              style={[
                styles.statValue,
                {color: metrics.netIncome >= 0 ? C.success : C.danger},
              ]}>
              {formatCurrency(metrics.netIncome)}
            </Text>
          </View>
          <View style={[styles.statCard, {borderLeftColor: C.info}]}>
            <Text style={styles.statLabel}>Current Ratio</Text>
            <Text style={[styles.statValue, {color: C.info}]}>
              {metrics.currentRatio.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Getting Started */}
      <View style={SharedStyles.cardElevated}>
        <Text style={SharedStyles.sectionTitle}>🚀 Getting Started</Text>
        <Text style={SharedStyles.sectionSubtitle}>
          Follow these steps to analyze your firm's performance
        </Text>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>1</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Enter Transactions 📊</Text>
            <Text style={styles.stepDesc}>
              Log account flows with double-entry validation ensuring your
              equation stays balanced.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>2</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review Statements 📄</Text>
            <Text style={styles.stepDesc}>
              Generate Income Statements and Balance Sheets instantly with
              real-time equation checks.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>3</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Consult AI Advisor 🤖</Text>
            <Text style={styles.stepDesc}>
              Analyze financial health, review leverage, and get strategic
              expansion tips.
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={SharedStyles.card}>
        <Text style={SharedStyles.sectionTitle}>⚡ Quick Actions</Text>
        <TouchableOpacity
          style={SharedStyles.primaryButton}
          onPress={() => navigation.navigate('Add Transaction')}>
          <Text style={SharedStyles.primaryButtonText}>
            + New Transaction
          </Text>
        </TouchableOpacity>

        <View style={{height: Spacing.md}} />

        <TouchableOpacity
          style={SharedStyles.secondaryButton}
          onPress={() => navigation.navigate('Reports')}>
          <Text style={SharedStyles.secondaryButtonText}>
            📈 View Financial Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sample Transaction */}
      <View style={SharedStyles.card}>
        <Text style={SharedStyles.sectionTitle}>💡 Sample Transaction</Text>
        <Text style={styles.sampleText}>Try logging an initial capital contribution:</Text>
        <View style={styles.sampleItem}>
          <Text style={styles.sampleBullet}>•</Text>
          <Text style={styles.sampleItemText}>
            <Text style={{fontWeight: '700'}}>Description:</Text> "Initial Owner Funding"
          </Text>
        </View>
        <View style={styles.sampleItem}>
          <Text style={styles.sampleBullet}>•</Text>
          <Text style={styles.sampleItemText}>
            <Text style={{fontWeight: '700'}}>Account 1:</Text> Cash (Asset → Current Assets) +₹1,00,000
          </Text>
        </View>
        <View style={styles.sampleItem}>
          <Text style={styles.sampleBullet}>•</Text>
          <Text style={styles.sampleItemText}>
            <Text style={{fontWeight: '700'}}>Account 2:</Text> Owner's Capital (Equity → Capital) +₹1,00,000
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: Spacing.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.gold,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  heroTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroDescription: {
    fontSize: FontSize.md,
    color: C.textSecondary,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 3,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.goldLight,
    color: C.gold,
    fontSize: FontSize.md,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    overflow: 'hidden',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
    lineHeight: 18,
  },
  sampleText: {
    fontSize: FontSize.md,
    color: C.textSecondary,
    marginBottom: Spacing.md,
  },
  sampleItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sampleBullet: {
    color: C.gold,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  sampleItemText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: C.textPrimary,
    lineHeight: 18,
  },
});
