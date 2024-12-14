import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import BudgetCategory from './BudgetCategory';
import { Budget } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { calculateCategoryTotal, calculatePercentage, sortBudgetsByAmount } from '../../utils/budget';

interface BudgetClassificationProps {
  classification: 'needs' | 'wants' | 'savings';
  budgets: Budget[];
  totalBudget: number;
}

export default function BudgetClassification({ 
  classification, 
  budgets,
  totalBudget 
}: BudgetClassificationProps) {
  const { darkMode } = useTheme();
  const { dispatch } = useFinance();
  
  const classificationBudgets = budgets.filter(b => b.classification === classification);
  const sortedBudgets = sortBudgetsByAmount(classificationBudgets);
  
  const classificationTotal = classificationBudgets.reduce((sum, budget) => 
    sum + calculateCategoryTotal(budget), 
  0);
  
  // Calculate percentage based on total available income
  const classificationPercentage = totalBudget > 0 ? (classificationTotal / totalBudget) * 100 : 0;

  // Get top 2 and bottom 1 budgets
  const topBudgets = sortedBudgets.slice(0, 2);
  const bottomBudget = sortedBudgets[sortedBudgets.length - 1];
  const remainingBudgets = sortedBudgets.slice(2, -1);

  const handleUpdateBudget = (updatedBudget: Budget) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: updatedBudget });
  };

  const handleDeleteBudget = (budgetId: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: budgetId });
  };

  return (
    <div className={`rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
    } p-6 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {classification.charAt(0).toUpperCase() + classification.slice(1)}
        </h3>
        
        <div className="flex items-center gap-6">
          {/* Total Budget Card */}
          <div className={`p-4 rounded-lg bg-gradient-to-r ${
            classification === 'needs' ? 'from-blue-400 to-blue-500' :
            classification === 'wants' ? 'from-purple-400 to-purple-500' :
            'from-violet-400 to-violet-500'
          } shadow-lg`}>
            <h4 className="text-sm font-medium text-white/90">
              Total Budget
            </h4>
            <p className="text-2xl font-bold mt-1 text-white">
              ${classificationTotal.toFixed(2)}
            </p>
          </div>

          {/* Percentage Ring */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="none"
              />
              <circle
                className={`stroke-current ${
                  classification === 'needs' ? 'text-blue-500' :
                  classification === 'wants' ? 'text-purple-500' :
                  'text-violet-500'
                }`}
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                style={{
                  strokeDasharray: `${2 * Math.PI * 40}`,
                  strokeDashoffset: `${2 * Math.PI * 40 * (1 - classificationPercentage / 100)}`,
                }}
              />
              <text
                x="50"
                y="50"
                className="text-lg font-bold fill-current"
                dominantBaseline="middle"
                textAnchor="middle"
                transform="rotate(90 50 50)"
              >
                {classificationPercentage.toFixed(1)}%
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {/* Top 2 Categories */}
        {topBudgets.map((budget, index) => (
          <BudgetCategory
            key={budget.id}
            budget={budget}
            totalBudget={totalBudget}
            index={index}
            onUpdate={handleUpdateBudget}
            onDelete={handleDeleteBudget}
          />
        ))}

        {/* Remaining Categories */}
        {remainingBudgets.map((budget, index) => (
          <BudgetCategory
            key={budget.id}
            budget={budget}
            totalBudget={totalBudget}
            index={index + 2}
            onUpdate={handleUpdateBudget}
            onDelete={handleDeleteBudget}
          />
        ))}

        {/* Bottom Category */}
        {bottomBudget && bottomBudget !== topBudgets[topBudgets.length - 1] && (
          <BudgetCategory
            budget={bottomBudget}
            totalBudget={totalBudget}
            index={sortedBudgets.length - 1}
            onUpdate={handleUpdateBudget}
            onDelete={handleDeleteBudget}
          />
        )}
      </div>
    </div>
  );
}