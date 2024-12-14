import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { Debt } from '../../types';

interface IncomeOverviewProps {
  monthlyIncome: number;
  debts: Debt[];
}

export default function IncomeOverview({ monthlyIncome, debts }: IncomeOverviewProps) {
  const { state: { darkMode } } = useFinance();

  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const spendableIncome = monthlyIncome - totalMinimumPayments;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className={`rounded-xl ${
        darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
      } p-6 shadow-lg backdrop-blur-sm`}>
        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Total Income Earned
        </h3>
        <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {formatCurrency(monthlyIncome)}
        </p>
      </div>

      {debts.length > 0 && (
        <div className={`rounded-xl ${
          darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
        } p-6 shadow-lg backdrop-blur-sm`}>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Spendable Income
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            After deducting minimum payments on all debts
          </p>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {formatCurrency(spendableIncome)}
          </p>
        </div>
      )}
    </div>
  );
}