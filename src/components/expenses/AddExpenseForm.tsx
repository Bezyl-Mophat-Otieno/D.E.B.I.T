import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';

interface AddExpenseFormProps {
  onClose: () => void;
  onSubmit: (expense: any) => void;
  categories: string[];
}

export default function AddExpenseForm({ onClose, onSubmit, categories }: AddExpenseFormProps) {
  const { state: { darkMode } } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative rounded-xl ${
        darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-rose-50 to-pink-50'
      } p-6 shadow-lg backdrop-blur-sm`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Description
          </label>
          <input
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700/50 border-gray-600 text-white'
                : 'bg-white/50 border-rose-200'
            } focus:outline-none focus:ring-2 focus:ring-rose-500`}
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
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700/50 border-gray-600 text-white'
                : 'bg-white/50 border-rose-200'
            } focus:outline-none focus:ring-2 focus:ring-rose-500`}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700/50 border-gray-600 text-white'
                : 'bg-white/50 border-rose-200'
            } focus:outline-none focus:ring-2 focus:ring-rose-500`}
            required
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}