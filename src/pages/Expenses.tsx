import React, { useState } from 'react';
import Header from '../components/Header';
import FormInput from '../components/FormInput';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types';

export default function Expenses() {
  const { state: { transactions, budgets, darkMode }, dispatch } = useFinance();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const expenses = transactions.filter((t) => t.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Transaction = {
      id: crypto.randomUUID(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      type: 'expense',
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: expense });
    
    // Update budget spent amount
    const budget = budgets.find((b) => b.category === expense.category);
    if (budget) {
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: { ...budget, spent: budget.spent + expense.amount },
      });
    }

    setNewExpense({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddingExpense(false);
  };

  return (
    <div>
      <Header title="Expenses Manager" />
      
      <div className="mb-6 flex justify-between items-center">
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Expense Transactions
        </h3>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          Add Expense
        </button>
      </div>

      {isAddingExpense && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 rounded-lg bg-gradient-to-r from-rose-500/10 to-pink-500/10">
          <FormInput
            label="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            required
          />
          <FormInput
            label="Amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          <FormInput
            label="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            required
            list="categories"
          />
          <datalist id="categories">
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.category} />
            ))}
          </datalist>
          <FormInput
            label="Date"
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Save Expense
            </button>
            <button
              type="button"
              onClick={() => setIsAddingExpense(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {expense.description}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {expense.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-rose-500 font-semibold">
                  -${expense.amount.toFixed(2)}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}