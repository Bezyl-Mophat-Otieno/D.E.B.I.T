import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatNumber } from '../../utils/formatters';

interface EditableFieldProps {
  value: string | number;
  isEditing: boolean;
  type?: 'text' | 'number';
  onChange: (value: string) => void;
  className?: string;
}

export default function EditableField({
  value,
  isEditing,
  type = 'text',
  onChange,
  className = ''
}: EditableFieldProps) {
  const { state: { darkMode } } = useFinance();
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    setDisplayValue(type === 'number' ? formatNumber(Number(value)) : value.toString());
  }, [value, type]);

  const handleNumberInput = (input: string) => {
    // Remove any non-digit characters except decimal point
    const numericValue = input.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Convert to number and format
    const number = parseFloat(sanitizedValue) || 0;
    
    // Update display value with formatting
    setDisplayValue(formatNumber(number));
    
    // Pass the actual numeric value to parent
    onChange(number.toString());
  };

  if (!isEditing) {
    return (
      <span className={className}>
        {type === 'number' ? formatNumber(Number(value)) : value}
      </span>
    );
  }

  return (
    <input
      type={type === 'number' ? 'text' : type}
      value={displayValue}
      onChange={(e) => {
        if (type === 'number') {
          handleNumberInput(e.target.value);
        } else {
          onChange(e.target.value);
        }
      }}
      className={`
        px-2 py-1 rounded text-sm
        ${type === 'text' ? 'w-40' : 'w-32'}
        ${darkMode 
          ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700' 
          : 'bg-white/50 border-gray-200 focus:bg-white'}
        focus:outline-none focus:ring-1 focus:ring-opacity-50
        ${className}
      `}
      inputMode={type === 'number' ? 'decimal' : 'text'}
    />
  );
}