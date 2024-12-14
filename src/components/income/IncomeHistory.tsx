import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MonthlyIncome } from '../../types';

interface IncomeHistoryProps {
  monthlyIncomes: MonthlyIncome[];
  onDeleteMonth: (monthKey: string) => void;
  onDeleteIncome: (monthKey: string, incomeId: string) => void;
  onClearAll: () => void;
}

export default function IncomeHistory({ 
  monthlyIncomes, 
  onDeleteMonth, 
  onDeleteIncome,
  onClearAll 
}: IncomeHistoryProps) {
  const { state: { darkMode } } = useFinance();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const toggleMonth = (monthKey: string) => {
    setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
  };

  return (
    <div className={`rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
    } p-6 shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Income History
      </h3>
      <div className="space-y-4">
        {monthlyIncomes.map((monthData) => (
          <div key={monthData.monthKey} className="rounded-lg overflow-hidden">
            <div
              onClick={() => toggleMonth(monthData.monthKey)}
              className={`flex items-center justify-between p-4 cursor-pointer ${
                darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80'
              }`}
            >
              <div className="flex items-center space-x-2">
                {expandedMonth === monthData.monthKey ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                <span>{monthData.monthName}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>{formatCurrency(monthData.totalIncome)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMonth(monthData.monthKey);
                  }}
                  className="text-rose-500 hover:text-rose-600 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {expandedMonth === monthData.monthKey && (
              <div className={`${
                darkMode ? 'bg-gray-800/30' : 'bg-white/80'
              }`}>
                <table className="w-full">
                  <thead>
                    <tr className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Source</th>
                      <th className="text-right py-2 px-4">Amount</th>
                      <th className="text-right py-2 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.incomes.map((income) => (
                      <tr
                        key={income.id}
                        className={`group ${
                          darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        <td className="py-2 px-4">{formatDate(income.date)}</td>
                        <td className="py-2 px-4">{income.source}</td>
                        <td className="py-2 px-4 text-right">
                          {formatCurrency(income.amount)}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => onDeleteIncome(monthData.monthKey, income.id)}
                            className="text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      {monthlyIncomes.length > 0 && (
        <div className="mt-6">
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
}