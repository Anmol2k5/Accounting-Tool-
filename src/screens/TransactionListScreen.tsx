import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {C, Spacing, FontSize, SharedStyles} from '../theme';
import {formatCurrency} from '../utils/financial';

export function TransactionListScreen({navigation}: any) {
  const {transactions, deleteTransaction, clearAllData} = useApp();

  const handleDelete = (index: number) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transactions[index].description}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(index),
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete ALL transactions. This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: clearAllData,
        },
      ],
    );
  };

  if (transactions.length === 0) {
    return (
      <View style={[SharedStyles.screenContainer, SharedStyles.emptyState]}>
        <Text style={{fontSize: 48}}>📭</Text>
        <Text style={SharedStyles.emptyStateText}>No Transactions Yet</Text>
        <Text style={SharedStyles.emptyStateSubtext}>
          Start logging your financial transactions to see them here.
        </Text>
        <TouchableOpacity
          style={SharedStyles.primaryButton}
          onPress={() => navigation.navigate('Add Transaction')}>
          <Text style={SharedStyles.primaryButtonText}>
            + Add First Transaction
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={SharedStyles.screenContainer}
      contentContainerStyle={SharedStyles.screenPadding}>
      <View style={styles.header}>
        <Text style={SharedStyles.sectionTitle}>
          📊 Transactions ({transactions.length})
        </Text>
        <TouchableOpacity
          style={SharedStyles.primaryButton}
          onPress={() => navigation.navigate('Add Transaction')}>
          <Text style={SharedStyles.primaryButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {transactions.map((txn, idx) => {
        const totalImpact = txn.accounts.reduce(
          (sum, a) => sum + a.amount,
          0,
        );
        const assetAccs = txn.accounts.filter(a => a.type === 'Asset');
        const liabAccs = txn.accounts.filter(a => a.type === 'Liability');
        const eqAccs = txn.accounts.filter(a => a.type === 'Equity');

        return (
          <View key={txn.id} style={SharedStyles.card}>
            <View style={styles.txnHeader}>
              <View style={styles.txnTitleRow}>
                <View style={styles.indexBadge}>
                  <Text style={styles.indexText}>{idx + 1}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.txnTitle}>{txn.description}</Text>
                  <Text style={styles.txnDate}>
                    {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.txnActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    navigation.navigate('Add Transaction', {editIndex: idx})
                  }>
                  <Text style={styles.editBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => handleDelete(idx)}>
                  <Text style={styles.delBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={SharedStyles.divider} />

            {/* Account entries */}
            {txn.accounts.map((acc, aIdx) => (
              <View key={aIdx} style={styles.accRow}>
                <View
                  style={[
                    styles.typeDot,
                    {
                      backgroundColor:
                        acc.type === 'Asset'
                          ? C.success
                          : acc.type === 'Liability'
                            ? C.danger
                            : C.gold,
                    },
                  ]}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.accName}>{acc.name}</Text>
                  <Text style={styles.accMeta}>
                    {acc.type} → {acc.sub}
                    {acc.line_item !== 'Not Applicable'
                      ? ` → ${acc.line_item}`
                      : ''}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.accAmount,
                    {color: acc.amount >= 0 ? C.success : C.danger},
                  ]}>
                  {formatCurrency(acc.amount)}
                </Text>
              </View>
            ))}

            {/* Balance indicator */}
            <View
              style={[
                styles.balanceBadge,
                {
                  backgroundColor:
                    totalImpact === 0 ? C.successBg : C.warningBg,
                  borderColor: totalImpact === 0 ? C.success : C.warning,
                },
              ]}>
              <Text
                style={[
                  styles.balanceText,
                  {color: totalImpact === 0 ? C.success : C.warning},
                ]}>
                {totalImpact === 0
                  ? '✅ Balanced'
                  : `Net: ${formatCurrency(totalImpact)}`}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Clear All */}
      <TouchableOpacity
        style={SharedStyles.dangerButton}
        onPress={handleClearAll}>
        <Text style={SharedStyles.dangerButtonText}>
          🗑️ Clear All Ledger Data
        </Text>
      </TouchableOpacity>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  txnTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  indexBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: C.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: C.gold,
  },
  txnTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: C.textPrimary,
  },
  txnDate: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    marginTop: 2,
  },
  txnActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  editBtnText: {fontSize: 16},
  delBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: C.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.danger,
  },
  delBtnText: {fontSize: 16},
  accRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: C.textPrimary,
  },
  accMeta: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    marginTop: 1,
  },
  accAmount: {
    fontSize: FontSize.md,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  balanceBadge: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  balanceText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
