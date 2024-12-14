import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ExpenseListProps {
  expenses: any[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const { state: { darkMode } } = useFinance();

  return (
    <div className={`rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-rose-50 to-pink-50'
    } p-6 shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Expense List
      </h3>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={`${
              darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-rose-100/80 to-pink-100/80'
            }`}>
              <th className="text-left py-4 px-4 rounded-tl-lg">Description</th>
              <th className="text-left py-4 px-4">Category</th>
              <th className="text-left py-4 px-4">Amount</th>
              <th className="text-left py-4 px-4 rounded-tr-lg">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => {
              const isLast = index === expenses.length - 1;
              
              return (
                <tr
                  key={expense.id}
                  className={`group transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-700/30 text-gray-200' 
                      : 'hover:bg-rose-100/30 text-gray-700'
                  }`}
                >
                  <td className={`py-4 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>
                    {expense.description}
                  </td>
                  <td className="py-4 px-4">{expense.category}</td>
                  <td className="py-4 px-4 text-rose-600 dark:text-rose-400">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className={`py-4 px-4 ${isLast ? 'rounded-br-lg' : ''}`}>
                    {formatDate(expense.date)}
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