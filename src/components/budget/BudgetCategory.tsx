import React, { useState } from 'react';
import { Minus } from 'lucide-react';
import { Budget } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { calculateCategoryTotal, calculatePercentage } from '../../utils/budget';
import CategoryActions from './CategoryActions';
import EditableField from './EditableField';
import { formatCurrency } from '../../utils/formatters';

interface BudgetCategoryProps {
  budget: Budget;
  totalBudget: number;
  index: number;
  onUpdate: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCategory({
  budget,
  totalBudget,
  index,
  onUpdate,
  onDelete,
}: BudgetCategoryProps) {
  const { darkMode, getBackgroundColor } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState<Budget>(budget);

  const categoryTotal = calculateCategoryTotal(budget);
  const categoryPercentage = calculatePercentage(categoryTotal, totalBudget);
  const isLight = index % 2 === 0;

  const handleCategoryChange = (field: keyof Budget, value: string) => {
    setEditedBudget(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubcategoryChange = (index: number, field: string, value: string) => {
    setEditedBudget(prev => ({
      ...prev,
      subCategories: prev.subCategories.map((sub, i) => 
        i === index
          ? { ...sub, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
          : sub
      )
    }));
  };

  const handleSubcategoryDelete = (index: number) => {
    setEditedBudget(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onUpdate(editedBudget);
    setIsEditing(false);
  };

  const handleUndo = () => {
    setEditedBudget(budget);
    setIsEditing(false);
  };

  return (
    <div className={`rounded-lg ${getBackgroundColor(isLight, budget.classification)} p-4 transition-colors duration-200`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <EditableField
            value={editedBudget.category}
            isEditing={isEditing}
            onChange={(value) => handleCategoryChange('category', value)}
            className="text-xl font-bold text-gray-800 dark:text-gray-100"
          />
        </div>
        
        <CategoryActions
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onDelete={() => onDelete(budget.id)}
          onSave={handleSave}
          onUndo={handleUndo}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="text-left py-1 text-sm">Subcategory</th>
              <th className="text-left py-1 text-sm">Amount</th>
              <th className="text-right py-1 text-sm">% Allocation</th>
              {isEditing && <th className="w-8"></th>}
            </tr>
          </thead>
          <tbody>
            {editedBudget.subCategories.map((sub, idx) => {
              const subPercentage = calculatePercentage(sub.amount, totalBudget);
              
              return (
                <tr key={idx} className="text-gray-700 dark:text-gray-200">
                  <td className="py-1 text-sm">
                    <EditableField
                      value={sub.name}
                      isEditing={isEditing}
                      onChange={(value) => handleSubcategoryChange(idx, 'name', value)}
                    />
                  </td>
                  <td className="py-1 text-sm">
                    <EditableField
                      value={sub.amount}
                      isEditing={isEditing}
                      type="number"
                      onChange={(value) => handleSubcategoryChange(idx, 'amount', value)}
                    />
                  </td>
                  <td className="py-1 text-sm text-right">{subPercentage.toFixed(1)}%</td>
                  {isEditing && (
                    <td className="py-1 text-sm">
                      <button
                        onClick={() => handleSubcategoryDelete(idx)}
                        className="text-rose-500 hover:text-rose-600 transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            <tr className="font-bold border-t border-gray-200 dark:border-gray-700">
              <td className="py-2 text-sm">Total</td>
              <td className="py-2 text-sm">{formatCurrency(categoryTotal)}</td>
              <td className="py-2 text-sm text-right">{categoryPercentage.toFixed(1)}%</td>
              {isEditing && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}