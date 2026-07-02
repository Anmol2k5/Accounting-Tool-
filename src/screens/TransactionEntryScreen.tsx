import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {
  C,
  Spacing,
  FontSize,
  SharedStyles,
} from '../theme';
import type {Account, AccountType} from '../types';
import {SUB_CLASSIFICATION_OPTIONS, LINE_ITEM_OPTIONS} from '../types';

function makeBlankAccount(): Account {
  return {
    selected_account: 'Other (New Account)',
    name: '',
    type: 'Asset',
    sub: 'Current Assets',
    line_item: 'Cash and Cash Equivalents',
    amount: 0,
  };
}

export function TransactionEntryScreen({navigation, route}: any) {
  const {addTransaction, updateTransaction, getKnownAccounts, transactions} =
    useApp();
  const editIndex: number | null = route.params?.editIndex ?? null;
  const isEditing = editIndex !== null;

  const knownAccounts = getKnownAccounts();
  const knownNames = Object.keys(knownAccounts).sort();

  // Initialize from existing transaction if editing
  const initTxn = isEditing ? transactions[editIndex!] : null;
  const [description, setDescription] = useState(
    initTxn?.description ?? '',
  );
  const [accounts, setAccounts] = useState<Account[]>(
    initTxn
      ? initTxn.accounts.map(a => ({
          ...a,
          selected_account: knownNames.includes(a.name)
            ? a.name
            : 'Other (New Account)',
        }))
      : [makeBlankAccount()],
  );

  const addAccount = () => setAccounts(prev => [...prev, makeBlankAccount()]);

  const removeAccount = (index: number) => {
    if (accounts.length <= 1) {return;}
    setAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const updateAccount = (index: number, fields: Partial<Account>) => {
    setAccounts(prev =>
      prev.map((acc, i) => {
        if (i !== index) {return acc;}
        const updated = {...acc, ...fields};

        if (fields.selected_account !== undefined) {
          if (fields.selected_account === 'Other (New Account)') {
            updated.name = '';
            updated.type = 'Asset';
            updated.sub = 'Current Assets';
            updated.line_item = 'Cash and Cash Equivalents';
          } else {
            const name = fields.selected_account;
            updated.name = name;
            const known = knownAccounts[name];
            if (known) {
              updated.type = known.type;
              updated.sub = known.sub;
              updated.line_item = known.line_item;
            }
          }
        }

        if (fields.type !== undefined) {
          const subs = SUB_CLASSIFICATION_OPTIONS[fields.type];
          updated.sub = subs[0];
          const lines = LINE_ITEM_OPTIONS[updated.sub];
          updated.line_item = lines ? lines[0] : 'Not Applicable';
        }

        if (fields.sub !== undefined) {
          const lines = LINE_ITEM_OPTIONS[fields.sub];
          updated.line_item = lines ? lines[0] : 'Not Applicable';
        }

        return updated;
      }),
    );
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Missing Info', 'Please enter a transaction description.');
      return;
    }
    const invalid = accounts.some(a => !a.name.trim() || a.amount === 0);
    if (invalid) {
      Alert.alert(
        'Incomplete Accounts',
        'All accounts must have a name and non-zero amount.',
      );
      return;
    }

    if (isEditing) {
      updateTransaction(editIndex!, description, accounts);
    } else {
      addTransaction(description, accounts);
    }
    navigation.goBack();
  };

  const totalNet = accounts.reduce((sum, a) => sum + (a.amount || 0), 0);

  const renderPicker = (
    items: string[],
    selected: string,
    onSelect: (val: string) => void,
    disabled = false,
  ) => (
    <View style={styles.pickerContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map(item => (
          <TouchableOpacity
            key={item}
            disabled={disabled}
            onPress={() => onSelect(item)}
            style={[
              styles.pickerChip,
              selected === item && styles.pickerChipActive,
              disabled && styles.pickerChipDisabled,
            ]}>
            <Text
              style={[
                styles.pickerChipText,
                selected === item && styles.pickerChipTextActive,
              ]}
              numberOfLines={1}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView
      style={SharedStyles.screenContainer}
      contentContainerStyle={SharedStyles.screenPadding}
      keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={SharedStyles.sectionTitle}>
          {isEditing ? '✏️ Edit Transaction' : '📝 New Transaction'}
        </Text>
        {isEditing && (
          <View style={SharedStyles.badge}>
            <Text style={SharedStyles.badgeText}>
              Editing #{editIndex! + 1}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={SharedStyles.card}>
        <Text style={SharedStyles.label}>Transaction Description</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="e.g. Initial Capital, Purchased Equipment..."
          placeholderTextColor={C.textMuted}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Accounts */}
      <View style={styles.accountsHeader}>
        <Text style={SharedStyles.sectionTitle}>Accounts Involved</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addAccount}>
          <Text style={styles.addBtnText}>+ Add Account</Text>
        </TouchableOpacity>
      </View>

      {accounts.map((acc, idx) => {
        const isNew = acc.selected_account === 'Other (New Account)';
        const selectOptions = [...knownNames, 'Other (New Account)'];

        return (
          <View key={idx} style={SharedStyles.card}>
            <View style={styles.accHeader}>
              <Text style={styles.accTitle}>Account {idx + 1}</Text>
              {accounts.length > 1 && (
                <TouchableOpacity onPress={() => removeAccount(idx)}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Select Account */}
            <Text style={SharedStyles.label}>Select Account</Text>
            {renderPicker(selectOptions, acc.selected_account || '', val =>
              updateAccount(idx, {selected_account: val}),
            )}

            {isNew && (
              <>
                <Text style={[SharedStyles.label, {marginTop: Spacing.md}]}>
                  Account Name
                </Text>
                <TextInput
                  style={SharedStyles.input}
                  placeholder="Enter account name"
                  placeholderTextColor={C.textMuted}
                  value={acc.name}
                  onChangeText={text => updateAccount(idx, {name: text})}
                />
              </>
            )}

            {/* Account Type */}
            <Text style={[SharedStyles.label, {marginTop: Spacing.md}]}>
              Account Type
            </Text>
            {renderPicker(
              ['Asset', 'Liability', 'Equity'],
              acc.type,
              val => updateAccount(idx, {type: val as AccountType}),
              !isNew,
            )}

            {/* Sub-Classification */}
            <Text style={[SharedStyles.label, {marginTop: Spacing.md}]}>
              Sub-Classification
            </Text>
            {renderPicker(
              SUB_CLASSIFICATION_OPTIONS[acc.type],
              acc.sub,
              val => updateAccount(idx, {sub: val}),
              !isNew,
            )}

            {/* Line Item */}
            <Text style={[SharedStyles.label, {marginTop: Spacing.md}]}>
              Line Item Type
            </Text>
            {acc.sub === 'Capital' || acc.sub === 'Retained Earnings' ? (
              <View style={[SharedStyles.input, {opacity: 0.5}]}>
                <Text style={{color: C.textMuted}}>Not Applicable</Text>
              </View>
            ) : (
              renderPicker(
                LINE_ITEM_OPTIONS[acc.sub] || [],
                acc.line_item,
                val => updateAccount(idx, {line_item: val}),
                !isNew,
              )
            )}

            {/* Amount */}
            <Text style={[SharedStyles.label, {marginTop: Spacing.md}]}>
              Amount (₹)
            </Text>
            <TextInput
              style={SharedStyles.input}
              placeholder="0.00"
              placeholderTextColor={C.textMuted}
              keyboardType="numeric"
              value={acc.amount === 0 ? '' : acc.amount.toString()}
              onChangeText={text =>
                updateAccount(idx, {amount: parseFloat(text) || 0})
              }
            />
            <Text
              style={[
                styles.amountHint,
                {
                  color:
                    acc.amount > 0
                      ? C.success
                      : acc.amount < 0
                        ? C.danger
                        : C.textMuted,
                },
              ]}>
              {acc.amount > 0
                ? 'Increase (+)'
                : acc.amount < 0
                  ? 'Decrease (-)'
                  : 'Enter value'}
            </Text>
          </View>
        );
      })}

      {/* Net Impact Banner */}
      <View
        style={[
          styles.netBanner,
          {
            borderColor: totalNet === 0 ? C.success : C.warning,
          },
        ]}>
        <Text style={styles.netLabel}>Net Impact on Equation:</Text>
        <Text
          style={[
            styles.netValue,
            {color: totalNet === 0 ? C.success : C.warning},
          ]}>
          ₹{totalNet.toFixed(2)}
        </Text>
        <Text style={styles.netStatus}>
          {totalNet === 0
            ? '✅ Balanced (Double-entry conforms)'
            : 'ℹ️ Adjusting net balance'}
        </Text>
      </View>

      {/* Submit */}
      <View style={styles.submitRow}>
        <TouchableOpacity
          style={[SharedStyles.primaryButton, {flex: 1}]}
          onPress={handleSubmit}>
          <Text style={SharedStyles.primaryButtonText}>
            {isEditing ? '💾 Update Transaction' : '💾 Submit Transaction'}
          </Text>
        </TouchableOpacity>
      </View>

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
  accountsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addBtn: {
    backgroundColor: C.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: C.border,
  },
  addBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: C.gold,
  },
  accHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  accTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: C.gold,
  },
  deleteBtn: {
    fontSize: 20,
  },
  pickerContainer: {
    marginBottom: Spacing.xs,
  },
  pickerChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: Spacing.sm,
  },
  pickerChipActive: {
    backgroundColor: C.goldLight,
    borderColor: C.gold,
  },
  pickerChipDisabled: {
    opacity: 0.5,
  },
  pickerChipText: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
    fontWeight: '600',
  },
  pickerChipTextActive: {
    color: C.gold,
    fontWeight: '700',
  },
  amountHint: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  netBanner: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  netLabel: {
    fontSize: FontSize.sm,
    color: C.textSecondary,
    marginBottom: 2,
  },
  netValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginBottom: 4,
  },
  netStatus: {
    fontSize: FontSize.xs,
    color: C.textMuted,
  },
  submitRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
