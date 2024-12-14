import React from 'react';
import { Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Income } from '../../types';
import { getTableStyles } from '../../utils/tableStyles';

interface CurrentMonthIncomeProps {
  incomes: Income[];
  onDeleteIncome?: (id: string) => void;
}

export default function CurrentMonthIncome({ incomes, onDeleteIncome }: CurrentMonthIncomeProps) {
  const { state: { darkMode } } = useFinance();
  const styles = getTableStyles(darkMode);
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Income for {currentMonth}</h3>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={styles.tableHeader}>
              <th className="text-left py-4 px-4 rounded-tl-lg">Source</th>
              <th className="text-left py-4 px-4">Date</th>
              <th className="text-left py-4 px-4">Amount</th>
              {onDeleteIncome && <th className="text-right py-4 px-4 rounded-tr-lg">Action</th>}
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr
                key={income.id}
                className={styles.row}
              >
                <td className="py-4 px-4">{income.source}</td>
                <td className="py-4 px-4">{formatDate(income.date)}</td>
                <td className="py-4 px-4">{formatCurrency(income.amount)}</td>
                {onDeleteIncome && (
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onDeleteIncome(income.id)}
                      className="text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <td colSpan={2} className="py-4 px-4 text-right">Total Income:</td>
              <td colSpan={onDeleteIncome ? 2 : 1} className="py-4 px-4">
                {formatCurrency(totalIncome)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}