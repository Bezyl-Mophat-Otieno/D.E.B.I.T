import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';
import { formatCurrency } from '../../utils/formatters';

interface AddDebtFormProps {
  onClose: () => void;
  onSubmit: (debt: any) => void;
}

export default function AddDebtForm({ onClose, onSubmit }: AddDebtFormProps) {
  const { state: { darkMode } } = useFinance();
  const formRef = useRef<HTMLFormElement>(null);
  const [interestType, setInterestType] = React.useState<'monthly' | 'annual'>('annual');
  const [formData, setFormData] = useState({
    name: '',
    principal: 0,
    interestRate: 0,
    months: 0,
    minimumPayment: 0
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(calculateTotalAmount());
  }, [formData.principal, formData.interestRate, formData.months, interestType]);

  const calculateTotalAmount = () => {
    const monthlyRate = interestType === 'monthly' 
      ? formData.interestRate / 100 
      : (formData.interestRate / 12) / 100;
    return formData.principal * (1 + monthlyRate * formData.months);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const debt = {
      id: crypto.randomUUID(),
      ...formData,
      interestType,
      totalAmount,
      payments: [],
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onSubmit(debt);
    
    // Reset form fields but keep form open
    setFormData({
      name: '',
      principal: 0,
      interestRate: 0,
      months: 0,
      minimumPayment: 0
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

      <div className="grid gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Name of Debt
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            Principal Amount
          </label>
          <FormattedNumberInput
            value={formData.principal}
            onChange={(value) => setFormData(prev => ({ ...prev, principal: value }))}
            className="w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Interest Rate (%)
            </label>
            <FormattedNumberInput
              value={formData.interestRate}
              onChange={(value) => setFormData(prev => ({ ...prev, interestRate: value }))}
              className="w-full"
              placeholder=""
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Interest Type
            </label>
            <select
              value={interestType}
              onChange={(e) => setInterestType(e.target.value as 'monthly' | 'annual')}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700/50 border-gray-600 text-white'
                  : 'bg-white/50 border-emerald-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <option value="monthly">Per Month</option>
              <option value="annual">Per Annum</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Payment Period (Months)
          </label>
          <FormattedNumberInput
            value={formData.months}
            onChange={(value) => setFormData(prev => ({ ...prev, months: value }))}
            className="w-full"
            placeholder=""
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Amount to be Paid
          </label>
          <div className={`flex items-center px-3 py-2 rounded-lg border ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600'
              : 'bg-white/50 border-emerald-200'
          } shadow-sm`}>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Minimum Payment
          </label>
          <FormattedNumberInput
            value={formData.minimumPayment}
            onChange={(value) => setFormData(prev => ({ ...prev, minimumPayment: value }))}
            className="w-full"
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
          Add Debt
        </button>
      </div>
    </form>
  );
}