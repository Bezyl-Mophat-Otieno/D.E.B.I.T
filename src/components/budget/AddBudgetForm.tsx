import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import FormattedNumberInput from '../FormattedNumberInput';

interface SubCategory {
  name: string;
  amount: number;
}

interface BudgetFormData {
  category: string;
  subCategories: SubCategory[];
  classification: 'needs' | 'wants' | 'savings' | '';
}

interface AddBudgetFormProps {
  onClose: () => void;
  onSubmit: (budget: BudgetFormData) => void;
}

const initialFormState: BudgetFormData = {
  category: '',
  subCategories: [],
  classification: '',
};

export default function AddBudgetForm({ onClose, onSubmit }: AddBudgetFormProps) {
  const { state: { darkMode } } = useFinance();
  const formRef = useRef<HTMLFormElement>(null);
  const subCategoryInputRef = useRef<HTMLInputElement>(null);
  const [currentAmountIndex, setCurrentAmountIndex] = useState<number | null>(null);
  const [isEnteringAmounts, setIsEnteringAmounts] = useState(false);

  const [budgetData, setBudgetData] = useState<BudgetFormData>(initialFormState);
  const [newSubCategory, setNewSubCategory] = useState('');

  useEffect(() => {
    if (currentAmountIndex !== null) {
      const inputs = document.querySelectorAll('.amount-input');
      const currentInput = inputs[currentAmountIndex] as HTMLInputElement;
      if (currentInput) {
        currentInput.focus();
      }
    }
  }, [currentAmountIndex]);

  const handleAddSubCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSubCategory.trim()) {
      e.preventDefault();
      setBudgetData(prev => ({
        ...prev,
        subCategories: [...prev.subCategories, { name: newSubCategory.trim(), amount: 0 }]
      }));
      setNewSubCategory('');
      subCategoryInputRef.current?.focus();
    }
  };

  const handleAmountKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEnteringAmounts(true);
      
      if (index < budgetData.subCategories.length - 1) {
        setCurrentAmountIndex(index + 1);
      } else {
        setCurrentAmountIndex(null);
        setIsEnteringAmounts(false);
        subCategoryInputRef.current?.focus();
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(budgetData);
    setNewSubCategory('');
  };

  return (
    <form ref={formRef} className={`relative rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
    } p-6 shadow-lg backdrop-blur-sm`}>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Category
            </label>
            <input
              value={budgetData.category}
              onChange={(e) => setBudgetData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700/50 border-gray-600 text-white'
                  : 'bg-white/50 border-emerald-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Subcategory
            </label>
            <input
              ref={subCategoryInputRef}
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              onKeyDown={handleAddSubCategory}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700/50 border-gray-600 text-white'
                  : 'bg-white/50 border-emerald-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Press Enter to add subcategory"
            />
          </div>
        </div>

        {/* Right Section */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Classification
          </label>
          <select
            value={budgetData.classification}
            onChange={(e) => setBudgetData(prev => ({ 
              ...prev, 
              classification: e.target.value as 'needs' | 'wants' | 'savings' 
            }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700/50 border-gray-600 text-white'
                : 'bg-white/50 border-emerald-200'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          >
            <option value="">Select classification</option>
            <option value="needs">Needs</option>
            <option value="wants">Wants</option>
            <option value="savings">Savings</option>
          </select>
        </div>
      </div>

      {/* Subcategories Table */}
      {budgetData.subCategories.length > 0 && (
        <div className="mt-6">
          <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {budgetData.category}
          </h4>
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <th className="text-left py-2">Subcategory</th>
                <th className="text-left py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {budgetData.subCategories.map((sub, index) => (
                <tr key={index} className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                  <td className="py-2">{sub.name}</td>
                  <td className="py-2">
                    <FormattedNumberInput
                      value={sub.amount}
                      onChange={(value) => {
                        setBudgetData(prev => ({
                          ...prev,
                          subCategories: prev.subCategories.map((s, i) => 
                            i === index ? { ...s, amount: value } : s
                          )
                        }));
                      }}
                      onKeyPress={(e) => handleAmountKeyPress(e, index)}
                      className={`w-32 amount-input`}
                      autoFocus={currentAmountIndex === index && isEnteringAmounts}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          Add Budget
        </button>
      </div>
    </form>
  );
}