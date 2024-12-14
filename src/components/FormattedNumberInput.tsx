import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useFinance } from '../context/FinanceContext';

interface FormattedNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export default function FormattedNumberInput({
  value,
  onChange,
  onKeyPress,
  className = '',
  placeholder = 'Enter amount',
  ...props
}: FormattedNumberInputProps) {
  const { state: { darkMode } } = useFinance();
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Only format if value is not 0, otherwise leave empty
    if (value > 0) {
      setDisplayValue(value.toLocaleString('en-US'));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (input: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = input.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Convert to number
    const number = parseFloat(sanitizedValue) || 0;
    
    // Format display value with commas
    setDisplayValue(number === 0 ? '' : number.toLocaleString('en-US'));
    
    // Pass the actual numeric value to parent
    onChange(number);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <input
      {...props}
      type="text"
      value={displayValue}
      onChange={(e) => handleChange(e.target.value)}
      onKeyPress={handleKeyPress}
      className={`px-3 py-2 rounded-lg border ${
        darkMode
          ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
          : 'bg-white/50 border-gray-200 focus:bg-white'
      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
      inputMode="decimal"
      placeholder={placeholder}
    />
  );
}