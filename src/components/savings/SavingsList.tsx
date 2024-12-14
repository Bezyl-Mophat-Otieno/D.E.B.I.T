import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';
import { formatCurrency } from '../../utils/formatters';

interface SavingsListProps {
  savingsList: any[];
  onAddContribution: (goalId: string, amount: number) => void;
  selectedGoal: string | null;
  onSelectGoal: (id: string) => void;
}

export default function SavingsList({
  savingsList,
  onAddContribution,
  selectedGoal,
  onSelectGoal
}: SavingsListProps) {
  const { state: { darkMode } } = useFinance();

  const handleContribution = (goalId: string, value: number) => {
    if (value > 0) {
      onAddContribution(goalId, value);
    }
  };

  return (
    <div className={`rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
    } p-6 shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Savings List
      </h3>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={`${
              darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80'
            }`}>
              <th className="text-left py-4 px-4 rounded-tl-lg">Saving For</th>
              <th className="text-left py-4 px-4">Savings Goal</th>
              <th className="text-left py-4 px-4">Start Date</th>
              <th className="text-left py-4 px-4">End Date</th>
              <th className="text-left py-4 px-4">Contribution</th>
              <th className="text-left py-4 px-4">Remaining</th>
              <th className="text-left py-4 px-4 rounded-tr-lg">Add Amount</th>
            </tr>
          </thead>
          <tbody>
            {savingsList.map((saving, index) => {
              const total = saving.contributions.reduce((sum: number, c: any) => sum + c.amount, 0);
              const remaining = saving.targetAmount - total;
              const isLast = index === savingsList.length - 1;
              
              return (
                <tr
                  key={saving.id}
                  onClick={() => onSelectGoal(saving.id)}
                  className={`group transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-700/30 text-gray-200' 
                      : 'hover:bg-emerald-100/30 text-gray-700'
                  } ${selectedGoal === saving.id ? (darkMode ? 'bg-gray-700/20' : 'bg-emerald-100/20') : ''}`}
                >
                  <td className={`py-4 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>{saving.goal}</td>
                  <td className="py-4 px-4 font-medium">{formatCurrency(saving.targetAmount)}</td>
                  <td className="py-4 px-4">{saving.startDate}</td>
                  <td className="py-4 px-4">{saving.endDate}</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">
                    {formatCurrency(total)}
                  </td>
                  <td className="py-4 px-4 text-rose-600 dark:text-rose-400 font-medium">
                    {formatCurrency(remaining)}
                  </td>
                  <td className={`py-4 px-4 ${isLast ? 'rounded-br-lg' : ''}`}>
                    <FormattedNumberInput
                      value={0}
                      onChange={(value) => handleContribution(saving.id, value)}
                      className="w-32"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          const value = parseFloat(target.value.replace(/,/g, ''));
                          if (value > 0) {
                            handleContribution(saving.id, value);
                            target.value = '';
                          }
                        }
                      }}
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