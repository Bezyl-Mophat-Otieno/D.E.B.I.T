import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';

interface AddSavingsFormProps {
  onClose: () => void;
  onSubmit: (savings: any) => void;
}

export default function AddSavingsForm({ onClose, onSubmit }: AddSavingsFormProps) {
  const { state: { darkMode } } = useFinance();
  const [formData, setFormData] = useState({
    goal: '',
    targetAmount: 0,
    monthlyContribution: 0,
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      goal: '',
      targetAmount: 0,
      monthlyContribution: 0,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <form
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

      <div className="grid gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Saving Goal
          </label>
          <input
            value={formData.goal}
            onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
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
            Target Amount
          </label>
          <FormattedNumberInput
            value={formData.targetAmount}
            onChange={(value) => setFormData(prev => ({ ...prev, targetAmount: value }))}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Monthly Contribution
          </label>
          <FormattedNumberInput
            value={formData.monthlyContribution}
            onChange={(value) => setFormData(prev => ({ ...prev, monthlyContribution: value }))}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
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
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700/50 border-gray-600 text-white'
                : 'bg-white/50 border-emerald-200'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          Add Savings Goal
        </button>
      </div>
    </form>
  );
}