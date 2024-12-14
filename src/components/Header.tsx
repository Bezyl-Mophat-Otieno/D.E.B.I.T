import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Currency } from '../types';

export default function Header({ title }: { title: string }) {
  const { state: { darkMode, currency }, dispatch } = useFinance();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CURRENCY', payload: e.target.value as Currency });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !darkMode });
  };

  return (
    <div className={`flex justify-between items-center mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="flex items-center space-x-4">
        <select
          value={currency}
          onChange={handleCurrencyChange}
          className={`px-3 py-2 rounded-lg border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-200'
          }`}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${
            darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}