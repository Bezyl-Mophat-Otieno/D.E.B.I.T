import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, generateUniqueId } from '../utils/formatters';
import { getTableStyles } from '../utils/tableStyles';

interface SavingsGoal {
  id: string;
  goal: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  contributions: Array<{
    id: string;
    amount: number;
    date: string;
  }>;
}

interface CompletedSaving {
  id: string;
  goal: string;
  targetAmount: number;
  dateCompleted: string;
}

export default function Savings() {
  const { state: { darkMode } } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [savingsList, setSavingsList] = useState<SavingsGoal[]>([]);
  const [completedSavings, setCompletedSavings] = useState<CompletedSaving[]>([]);
  const styles = getTableStyles(darkMode);

  const getContributionTotal = (contributions: Array<{ amount: number }>) => {
    return contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
  };

  const handleAddContribution = (goalId: string, value: string) => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) return;

    setSavingsList(prevList => {
      const updatedList = prevList.map(saving => {
        if (saving.id === goalId) {
          const newContributions = [
            ...saving.contributions,
            {
              id: generateUniqueId('contribution'),
              amount,
              date: new Date().toISOString().split('T')[0]
            }
          ];
          
          const total = getContributionTotal(newContributions);
          
          // Check if goal is completed
          if (total >= saving.targetAmount) {
            const completedSaving = {
              id: saving.id,
              goal: saving.goal,
              targetAmount: saving.targetAmount,
              dateCompleted: new Date().toISOString().split('T')[0]
            };

            setCompletedSavings(prev => {
              // Check if this saving is already in completed savings
              const exists = prev.some(s => s.id === saving.id);
              if (!exists) {
                return [...prev, completedSaving];
              }
              return prev;
            });
            
            // Remove from active list by not including it in the return
            return null;
          }
          
          return {
            ...saving,
            contributions: newContributions
          };
        }
        return saving;
      });
      
      // Filter out completed goals (null values)
      return updatedList.filter((saving): saving is SavingsGoal => saving !== null);
    });
  };

  const handleAddSavingsGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newGoal: SavingsGoal = {
      id: generateUniqueId('goal'),
      goal: formData.get('goal') as string,
      targetAmount: parseFloat(formData.get('amount') as string),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      contributions: []
    };
    
    setSavingsList(prev => [...prev, newGoal]);
    setShowAddForm(false);
  };

  const handleDeleteContribution = (goalId: string, contributionId: string) => {
    setSavingsList(prevList => 
      prevList.map(saving => {
        if (saving.id === goalId) {
          return {
            ...saving,
            contributions: saving.contributions.filter(c => c.id !== contributionId)
          };
        }
        return saving;
      })
    );
  };

  const handleDeleteCompletedSaving = (id: string) => {
    setCompletedSavings(prev => prev.filter(saving => saving.id !== id));
  };

  const handleClearHistory = () => {
    setCompletedSavings([]);
  };

  const selectedSaving = selectedGoal ? savingsList.find(s => s.id === selectedGoal) : null;
  const selectedTotal = selectedSaving ? getContributionTotal(selectedSaving.contributions) : 0;
  const selectedPercentage = selectedSaving ? (selectedTotal / selectedSaving.targetAmount) * 100 : 0;

  return (
    <div className="space-y-8">
      <Header title="Savings Manager" />

      {/* Add Savings Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Savings Goal
        </button>
      </div>

      {/* Add Savings Form */}
      {showAddForm && (
        <form onSubmit={handleAddSavingsGoal} className={styles.container}>
          <div className="grid gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Saving For
              </label>
              <input
                name="goal"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white/50 border-blue-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Savings Goal
              </label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white/50 border-blue-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Start Date
              </label>
              <input
                name="startDate"
                type="date"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white/50 border-blue-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                End Date
              </label>
              <input
                name="endDate"
                type="date"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-white/50 border-blue-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Savings Goal
            </button>
          </div>
        </form>
      )}

      {/* Savings List */}
      <div className={styles.container}>
        <h3 className={styles.header}>
          Savings List
        </h3>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full">
            <thead>
              <tr className={styles.tableHeader}>
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
                const total = getContributionTotal(saving.contributions);
                const remaining = saving.targetAmount - total;
                const isLast = index === savingsList.length - 1;
                
                return (
                  <tr
                    key={saving.id}
                    onClick={() => setSelectedGoal(saving.id)}
                    className={`group transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-gray-700/30 text-gray-200' 
                        : 'hover:bg-emerald-100/30 text-gray-700'
                    } ${selectedGoal === saving.id ? (darkMode ? 'bg-gray-700/20' : 'bg-emerald-100/20') : ''}`}
                  >
                    <td className={`py-4 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>{saving.goal}</td>
                    <td className="py-4 px-4 font-medium">{formatCurrency(saving.targetAmount)}</td>
                    <td className="py-4 px-4">{formatDate(saving.startDate)}</td>
                    <td className="py-4 px-4">{formatDate(saving.endDate)}</td>
                    <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatCurrency(total)}
                    </td>
                    <td className="py-4 px-4 text-rose-600 dark:text-rose-400 font-medium">
                      {formatCurrency(remaining)}
                    </td>
                    <td className={`py-4 px-4 ${isLast ? 'rounded-br-lg' : ''}`}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-28 px-3 py-2 rounded-lg border transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
                            : 'bg-white/50 border-emerald-200 focus:bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            handleAddContribution(saving.id, input.value);
                            input.value = '';
                          }
                        }}
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

      {/* Savings Overview */}
      {selectedSaving && (
        <div className={styles.container}>
          <h3 className={styles.header}>
            Savings Overview
          </h3>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-lg`}>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Saving For</h4>
              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedSaving.goal}
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-lg`}>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Saving Goal</h4>
              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatCurrency(selectedSaving.targetAmount)}
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-lg`}>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contributions</h4>
              <p className={`text-2xl font-bold mt-1 text-emerald-600`}>
                {formatCurrency(selectedTotal)}
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-lg`}>
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remaining</h4>
              <p className={`text-2xl font-bold mt-1 text-rose-600`}>
                {formatCurrency(selectedSaving.targetAmount - selectedTotal)}
              </p>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                />
                <circle
                  className="text-blue-600 progress-ring stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 * (1 - selectedPercentage / 100)}`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                  }}
                />
                <text
                  x="50"
                  y="50"
                  className={`${darkMode ? 'fill-white' : 'fill-gray-800'} text-lg font-bold`}
                  dominantBaseline="middle"
                  textAnchor="middle"
                >
                  {selectedPercentage.toFixed(1)}%
                </text>
              </svg>
            </div>
          </div>

          {/* Contribution History */}
          <div className={`rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6`}>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Contribution History
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-right py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSaving.contributions.map((contribution) => (
                    <tr
                      key={contribution.id}
                      className={`group ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      <td className="py-2">{formatDate(contribution.date)}</td>
                      <td className="py-2">{formatCurrency(contribution.amount)}</td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => handleDeleteContribution(selectedSaving.id, contribution.id)}
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
          </div>
        </div>
      )}

      {/* Savings History */}
      <div className={styles.container}>
        <h3 className={styles.header}>
          Savings History
        </h3>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="text-left py-4 px-4 rounded-tl-lg">Saving For</th>
                <th className="text-left py-4 px-4">Saving Goal</th>
                <th className="text-left py-4 px-4">Date Completed</th>
                <th className="text-right py-4 px-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {completedSavings.map((saving, index) => {
                const isLast = index === completedSavings.length - 1;
                const uniqueKey = `${saving.id}-${saving.dateCompleted}`;
                
                return (
                  <tr
                    key={uniqueKey}
                    className={styles.row}
                  >
                    <td className={`py-4 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>{saving.goal}</td>
                    <td className="py-4 px-4 font-medium">{formatCurrency(saving.targetAmount)}</td>
                    <td className="py-4 px-4">{formatDate(saving.dateCompleted)}</td>
                    <td className={`py-4 px-4 text-right ${isLast ? 'rounded-br-lg' : ''}`}>
                      <button
                        onClick={() => handleDeleteCompletedSaving(saving.id)}
                        className={styles.deleteButton}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {completedSavings.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleClearHistory}
              className={styles.clearAllButton}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}