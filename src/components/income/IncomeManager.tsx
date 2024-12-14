import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';
import { formatCurrency } from '../../utils/formatters';

interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  lastUpdated: string;
}

export default function IncomeManager() {
  const { state: { darkMode } } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: 0,
    frequency: 'monthly' as const
  });
  const [incomes, setIncomes] = useState<Income[]>([]);

  const handleAddIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newIncome: Income = {
      id: crypto.randomUUID(),
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setIncomes(prev => [...prev, newIncome]);
    setFormData({
      source: '',
      amount: 0,
      frequency: 'monthly'
    });
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  const calculateMonthlyTotal = () => {
    return incomes.reduce((total, income) => {
      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52) / 12;
        case 'bi-weekly':
          return total + (income.amount * 26) / 12;
        case 'monthly':
          return total + income.amount;
        case 'annually':
          return total + income.amount / 12;
        default:
          return total;
      }
    }, 0);
  };

  return (
    <div className={`rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
    } p-6 shadow-lg backdrop-blur-sm mb-6`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Income Sources
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          Add Income
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddIncome} className="mb-6 p-6 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Income Source
              </label>
              <input
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white/50 border-emerald-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Amount
              </label>
              <FormattedNumberInput
                value={formData.amount}
                onChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white/50 border-emerald-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                required
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              Add Income
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${
              darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80'
            }`}>
              <th className="text-left py-3 px-4 rounded-tl-lg">Source</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Frequency</th>
              <th className="text-left py-3 px-4">Monthly Equivalent</th>
              <th className="text-right py-3 px-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income, index) => {
              const isLast = index === incomes.length - 1;
              let monthlyAmount = income.amount;
              
              switch (income.frequency) {
                case 'weekly':
                  monthlyAmount = (income.amount * 52) / 12;
                  break;
                case 'bi-weekly':
                  monthlyAmount = (income.amount * 26) / 12;
                  break;
                case 'annually':
                  monthlyAmount = income.amount / 12;
                  break;
              }

              return (
                <tr
                  key={income.id}
                  className={`group transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-700/30 text-gray-200' 
                      : 'hover:bg-emerald-100/30 text-gray-700'
                  }`}
                >
                  <td className={`py-3 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>{income.source}</td>
                  <td className="py-3 px-4">{formatCurrency(income.amount)}</td>
                  <td className="py-3 px-4">{income.frequency}</td>
                  <td className="py-3 px-4">{formatCurrency(monthlyAmount)}</td>
                  <td className={`py-3 px-4 text-right ${isLast ? 'rounded-br-lg' : ''}`}>
                    <button
                      onClick={() => handleDeleteIncome(income.id)}
                      className="text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <td colSpan={3} className="py-3 px-4 text-right">Total Monthly Income:</td>
              <td colSpan={2} className="py-3 px-4">{formatCurrency(calculateMonthlyTotal())}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}