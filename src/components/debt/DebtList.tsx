import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Debt } from '../../types';
import { getTableStyles } from '../../utils/tableStyles';
import FormattedNumberInput from '../FormattedNumberInput';
import { formatCurrency } from '../../utils/formatters';

interface DebtListProps {
  debts: Debt[];
  selectedDebtId: string | null;
  onSelectDebt: (id: string) => void;
  onAddPayment: (debtId: string, amount: number) => void;
}

export default function DebtList({ 
  debts, 
  selectedDebtId, 
  onSelectDebt, 
  onAddPayment 
}: DebtListProps) {
  const { state: { darkMode } } = useFinance();
  const styles = getTableStyles(darkMode);
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});

  const sortedDebts = [...debts].sort((a, b) => a.totalAmount - b.totalAmount);

  const getTotalPaid = (debt: Debt) => {
    return debt.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getBalance = (debt: Debt) => {
    return debt.totalAmount - getTotalPaid(debt);
  };

  const handlePaymentSubmit = (debtId: string) => {
    const amount = inputValues[debtId] || 0;
    if (amount > 0) {
      onAddPayment(debtId, amount);
      // Reset the input value for this debt
      setInputValues(prev => ({ ...prev, [debtId]: 0 }));
      // Clear the input field
      const input = document.querySelector(`input[data-debt-id="${debtId}"]`) as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Debt List</h3>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={styles.tableHeader}>
              <th className="text-left py-4 px-4 rounded-tl-lg">Name</th>
              <th className="text-left py-4 px-4">Principal</th>
              <th className="text-left py-4 px-4">Amount</th>
              <th className="text-left py-4 px-4">Total Paid</th>
              <th className="text-left py-4 px-4">Balance</th>
              <th className="text-left py-4 px-4">Interest Rate</th>
              <th className="text-left py-4 px-4">Min Payment</th>
              <th className="text-left py-4 px-4 rounded-tr-lg">Add Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedDebts.map((debt, index) => {
              const totalPaid = getTotalPaid(debt);
              const balance = getBalance(debt);
              const isLast = index === sortedDebts.length - 1;

              return (
                <tr
                  key={debt.id}
                  onClick={() => onSelectDebt(debt.id)}
                  className={`${styles.row} ${selectedDebtId === debt.id ? (darkMode ? 'bg-gray-700/20' : 'bg-emerald-100/20') : ''}`}
                >
                  <td className={`py-4 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>{debt.name}</td>
                  <td className="py-4 px-4">{formatCurrency(debt.principal)}</td>
                  <td className="py-4 px-4">{formatCurrency(debt.totalAmount)}</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalPaid)}
                  </td>
                  <td className="py-4 px-4 text-rose-600 dark:text-rose-400">
                    {formatCurrency(balance)}
                  </td>
                  <td className="py-4 px-4">
                    {debt.interestRate}% {debt.interestType === 'monthly' ? 'monthly' : 'annual'}
                  </td>
                  <td className="py-4 px-4">{formatCurrency(debt.minimumPayment)}</td>
                  <td className={`py-4 px-4 ${isLast ? 'rounded-br-lg' : ''}`}>
                    <FormattedNumberInput
                      value={inputValues[debt.id] || 0}
                      onChange={(value) => setInputValues(prev => ({ ...prev, [debt.id]: value }))}
                      className="w-28"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handlePaymentSubmit(debt.id);
                        }
                      }}
                      data-debt-id={debt.id}
                      placeholder="Enter amount"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}