import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';

interface AddIncomeFormProps {
  onClose: () => void;
  onSubmit: (income: any) => void;
}

export default function AddIncomeForm({ onClose, onSubmit }: AddIncomeFormProps) {
  const { state: { darkMode } } = useFinance();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    source: '',
    amount: 0,
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      source: '',
      amount: 0,
      date: ''
    });
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      className={`relative rounded-xl ${
        darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
      } p-6 shadow-lg backdrop-blur-sm`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Source
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

      <div className="mt-4">
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Amount Earned
        </label>
        <FormattedNumberInput
          name="amount"
          required
          value={formData.amount}
          onChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
          className="w-full"
        />
      </div>

      <div className="mt-4">
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Date Earned
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className={`w-full px-3 py-2 rounded-lg border ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600 text-white'
              : 'bg-white/50 border-emerald-200'
          } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          required
        />
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
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          Add Income
        </button>
      </div>
    </form>
  );
}