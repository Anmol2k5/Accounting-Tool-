import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/financial';
import { useNavigate } from 'react-router-dom';
import { C } from '../theme';

export function TransactionsPage() {
  const { transactions, deleteTransaction, clearAllData } = useApp();
  const navigate = useNavigate();

  const handleDelete = (index: number) => {
    if (window.confirm(`Delete "${transactions[index].description}"?`)) {
      deleteTransaction(index);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'This will permanently delete ALL transactions. This cannot be undone. Continue?',
      )
    ) {
      clearAllData();
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No Transactions Yet</div>
          <div className="empty-state-text">
            Start logging your financial transactions to see them here.
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/add-transaction')}>
            + Add First Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="form-header">
        <div className="section-title">
          📊 Transactions ({transactions.length})
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/add-transaction')}>
          + Add
        </button>
      </div>

      {transactions.map((txn, idx) => {
        const totalImpact = txn.accounts.reduce(
          (sum, a) => sum + a.amount,
          0,
        );

        return (
          <div key={txn.id} className="card">
            <div className="txn-header">
              <div className="txn-title-row">
                <div className="index-badge">{idx + 1}</div>
                <div>
                  <div className="txn-title">{txn.description}</div>
                  <div className="txn-date">
                    {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <div className="txn-actions">
                <button
                  className="icon-btn"
                  onClick={() =>
                    navigate('/add-transaction', {
                      state: { editIndex: idx },
                    })
                  }>
                  ✏️
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(idx)}>
                  🗑️
                </button>
              </div>
            </div>

            <div className="divider" />

            {txn.accounts.map((acc, aIdx) => (
              <div key={aIdx} className="acc-row">
                <div
                  className="type-dot"
                  style={{
                    backgroundColor:
                      acc.type === 'Asset'
                        ? C.success
                        : acc.type === 'Liability'
                          ? C.danger
                          : C.gold,
                  }}
                />
                <div className="flex-1">
                  <div className="acc-name">{acc.name}</div>
                  <div className="acc-meta">
                    {acc.type} → {acc.sub}
                    {acc.line_item !== 'Not Applicable'
                      ? ` → ${acc.line_item}`
                      : ''}
                  </div>
                </div>
                <div
                  className="acc-amount"
                  style={{ color: acc.amount >= 0 ? C.success : C.danger }}>
                  {formatCurrency(acc.amount)}
                </div>
              </div>
            ))}

            <div
              className="balance-badge"
              style={{
                backgroundColor:
                  totalImpact === 0 ? C.successBg : C.warningBg,
                borderColor: totalImpact === 0 ? C.success : C.warning,
                color: totalImpact === 0 ? C.success : C.warning,
              }}>
              {totalImpact === 0
                ? '✅ Balanced'
                : `Net: ${formatCurrency(totalImpact)}`}
            </div>
          </div>
        );
      })}

      <button
        className="btn-danger"
        style={{ width: '100%' }}
        onClick={handleClearAll}>
        🗑️ Clear All Ledger Data
      </button>
    </div>
  );
}
