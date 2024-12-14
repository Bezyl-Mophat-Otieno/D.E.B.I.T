import React from 'react';
import { useFinance } from '../context/FinanceContext';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  const { state: { darkMode } } = useFinance();
  
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2 rounded-lg border ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        } focus:ring-2 focus:ring-indigo-500 ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}