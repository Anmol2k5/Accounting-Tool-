import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { C } from '../theme';
import type { Account, AccountType } from '../types';
import { SUB_CLASSIFICATION_OPTIONS, LINE_ITEM_OPTIONS } from '../types';

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

export function TransactionEntryPage() {
  const { addTransaction, updateTransaction, getKnownAccounts, transactions } =
    useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const editIndex: number | null =
    (location.state as any)?.editIndex ?? null;
  const isEditing = editIndex !== null;

  const knownAccounts = getKnownAccounts();
  const knownNames = Object.keys(knownAccounts).sort();

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
    if (accounts.length <= 1) return;
    setAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const updateAccount = (index: number, fields: Partial<Account>) => {
    setAccounts(prev =>
      prev.map((acc, i) => {
        if (i !== index) return acc;
        const updated = { ...acc, ...fields };

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
      alert('Please enter a transaction description.');
      return;
    }
    const invalid = accounts.some(a => !a.name.trim() || a.amount === 0);
    if (invalid) {
      alert('All accounts must have a name and non-zero amount.');
      return;
    }

    if (isEditing) {
      updateTransaction(editIndex!, description, accounts);
    } else {
      addTransaction(description, accounts);
    }
    navigate(-1);
  };

  const totalNet = accounts.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="page">
      {/* Header */}
      <div className="form-header">
        <div className="section-title">
          {isEditing ? '✏️ Edit Transaction' : '📝 New Transaction'}
        </div>
        {isEditing && (
          <div className="badge">
            <span className="badge-text">Editing #{editIndex! + 1}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="card">
        <div className="label">Transaction Description</div>
        <input
          className="input"
          placeholder="e.g. Initial Capital, Purchased Equipment..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* Accounts */}
      <div className="form-header">
        <div className="section-title">Accounts Involved</div>
        <button className="btn-secondary" onClick={addAccount}>
          + Add Account
        </button>
      </div>

      {accounts.map((acc, idx) => {
        const isNew = acc.selected_account === 'Other (New Account)';
        const selectOptions = [...knownNames, 'Other (New Account)'];

        return (
          <div key={idx} className="card">
            <div className="form-header">
              <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>
                Account {idx + 1}
              </span>
              {accounts.length > 1 && (
                <button
                  className="icon-btn danger"
                  onClick={() => removeAccount(idx)}>
                  🗑️
                </button>
              )}
            </div>

            {/* Select Account */}
            <div className="form-group">
              <div className="label">Select Account</div>
              <div className="chip-picker">
                {selectOptions.map(item => (
                  <button
                    key={item}
                    className={`chip ${acc.selected_account === item ? 'active' : ''}`}
                    onClick={() =>
                      updateAccount(idx, { selected_account: item })
                    }>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {isNew && (
              <div className="form-group">
                <div className="label">Account Name</div>
                <input
                  className="input"
                  placeholder="Enter account name"
                  value={acc.name}
                  onChange={e =>
                    updateAccount(idx, { name: e.target.value })
                  }
                />
              </div>
            )}

            {/* Account Type */}
            <div className="form-group">
              <div className="label">Account Type</div>
              <div className="chip-picker">
                {(['Asset', 'Liability', 'Equity'] as AccountType[]).map(
                  t => (
                    <button
                      key={t}
                      className={`chip ${acc.type === t ? 'active' : ''} ${!isNew ? 'disabled' : ''}`}
                      onClick={() => updateAccount(idx, { type: t })}>
                      {t}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Sub-Classification */}
            <div className="form-group">
              <div className="label">Sub-Classification</div>
              <div className="chip-picker">
                {SUB_CLASSIFICATION_OPTIONS[acc.type].map(s => (
                  <button
                    key={s}
                    className={`chip ${acc.sub === s ? 'active' : ''} ${!isNew ? 'disabled' : ''}`}
                    onClick={() => updateAccount(idx, { sub: s })}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Item */}
            <div className="form-group">
              <div className="label">Line Item Type</div>
              {acc.sub === 'Capital' || acc.sub === 'Retained Earnings' ? (
                <div className="input" style={{ opacity: 0.5 }}>
                  Not Applicable
                </div>
              ) : (
                <div className="chip-picker">
                  {(LINE_ITEM_OPTIONS[acc.sub] || []).map(l => (
                    <button
                      key={l}
                      className={`chip ${acc.line_item === l ? 'active' : ''} ${!isNew ? 'disabled' : ''}`}
                      onClick={() =>
                        updateAccount(idx, { line_item: l })
                      }>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="form-group">
              <div className="label">Amount (₹)</div>
              <input
                className="input"
                type="number"
                placeholder="0.00"
                value={acc.amount === 0 ? '' : acc.amount}
                onChange={e =>
                  updateAccount(idx, {
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <div
                className="amount-hint"
                style={{
                  color:
                    acc.amount > 0
                      ? C.success
                      : acc.amount < 0
                        ? C.danger
                        : C.textMuted,
                }}>
                {acc.amount > 0
                  ? 'Increase (+)'
                  : acc.amount < 0
                    ? 'Decrease (-)'
                    : 'Enter value'}
              </div>
            </div>
          </div>
        );
      })}

      {/* Net Impact Banner */}
      <div
        className="net-banner"
        style={{
          borderColor: totalNet === 0 ? C.success : C.warning,
        }}>
        <div className="net-label">Net Impact on Equation:</div>
        <div
          className="net-value"
          style={{ color: totalNet === 0 ? C.success : C.warning }}>
          ₹{totalNet.toFixed(2)}
        </div>
        <div className="net-status">
          {totalNet === 0
            ? '✅ Balanced (Double-entry conforms)'
            : 'ℹ️ Adjusting net balance'}
        </div>
      </div>

      {/* Submit */}
      <button
        className="btn-primary"
        style={{ width: '100%' }}
        onClick={handleSubmit}>
        {isEditing ? '💾 Update Transaction' : '💾 Submit Transaction'}
      </button>

      <div style={{ height: 40 }} />
    </div>
  );
}
