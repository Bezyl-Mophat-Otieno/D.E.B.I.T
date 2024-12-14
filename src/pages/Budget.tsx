import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import AddBudgetForm from '../components/budget/AddBudgetForm';
import BudgetClassification from '../components/budget/BudgetClassification';
import IncomeOverview from '../components/budget/IncomeOverview';
import { useFinance } from '../context/FinanceContext';
import { Budget } from '../types';

export default function BudgetPage() {
  const { state: { darkMode, debts, currentMonthIncomes, budgets }, dispatch } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);

  const monthlyIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const spendableIncome = monthlyIncome - totalMinimumPayments;

  const handleAddBudget = (budgetData: any) => {
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      ...budgetData
    };
    dispatch({ type: 'ADD_BUDGET', payload: newBudget });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      <Header title="Budget Manager" />

      {/* Add Budget Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {/* Income Overview */}
      <IncomeOverview
        monthlyIncome={monthlyIncome}
        debts={debts}
      />

      {/* Add Budget Form */}
      {showAddForm && (
        <AddBudgetForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddBudget}
        />
      )}

      {/* Budget Classifications */}
      <div className="grid gap-8">
        {(['needs', 'wants', 'savings'] as const).map((classification) => (
          <BudgetClassification
            key={classification}
            classification={classification}
            budgets={budgets}
            totalBudget={spendableIncome}
          />
        ))}
      </div>
    </div>
  );
}