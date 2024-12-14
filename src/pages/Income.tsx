import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import AddIncomeForm from '../components/income/AddIncomeForm';
import CurrentMonthIncome from '../components/income/CurrentMonthIncome';
import IncomeHistory from '../components/income/IncomeHistory';
import { useFinance } from '../context/FinanceContext';
import { Income, MonthlyIncome } from '../types';
import { normalizeDate } from '../utils/formatters';

export default function IncomePage() {
  const { state: { darkMode, currentMonthIncomes, monthlyIncomes }, dispatch } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddIncome = (income: Income) => {
    const newIncome = {
      ...income,
      id: crypto.randomUUID(),
      date: normalizeDate(income.date)
    };
    
    const incomeDate = new Date(newIncome.date);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (
      incomeDate.getMonth() === currentMonth &&
      incomeDate.getFullYear() === currentYear
    ) {
      dispatch({ type: 'ADD_INCOME', payload: newIncome });
    } else {
      const monthKey = `${incomeDate.getFullYear()}-${incomeDate.getMonth()}`;
      const monthName = incomeDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      const existingMonth = monthlyIncomes.find(m => m.monthKey === monthKey);
      
      if (existingMonth) {
        const updatedMonthlyIncomes = monthlyIncomes.map(m => 
          m.monthKey === monthKey
            ? {
                ...m,
                incomes: [...m.incomes, newIncome],
                totalIncome: m.totalIncome + income.amount
              }
            : m
        );
        dispatch({ type: 'SET_MONTHLY_INCOMES', payload: updatedMonthlyIncomes });
      } else {
        const newMonthlyIncomes = [{
          monthKey,
          monthName,
          totalIncome: income.amount,
          incomes: [newIncome]
        }, ...monthlyIncomes];
        dispatch({ type: 'SET_MONTHLY_INCOMES', payload: newMonthlyIncomes });
      }
    }
    setShowAddForm(false);
  };

  const handleDeleteCurrentIncome = (id: string) => {
    dispatch({ type: 'DELETE_CURRENT_INCOME', payload: id });
  };

  const handleDeleteMonth = (monthKey: string) => {
    const updatedMonthlyIncomes = monthlyIncomes.filter(m => m.monthKey !== monthKey);
    dispatch({ type: 'SET_MONTHLY_INCOMES', payload: updatedMonthlyIncomes });
  };

  const handleDeleteIncome = (monthKey: string, incomeId: string) => {
    dispatch({ 
      type: 'DELETE_MONTHLY_INCOME', 
      payload: { monthKey, incomeId } 
    });
  };

  const handleClearAllHistory = () => {
    dispatch({ type: 'CLEAR_MONTHLY_INCOMES' });
  };

  return (
    <div className="space-y-8">
      <Header title="Income Manager" />

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Income
        </button>
      </div>

      {showAddForm && (
        <AddIncomeForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddIncome}
        />
      )}

      <CurrentMonthIncome 
        incomes={currentMonthIncomes} 
        onDeleteIncome={handleDeleteCurrentIncome}
      />

      <IncomeHistory 
        monthlyIncomes={monthlyIncomes}
        onDeleteMonth={handleDeleteMonth}
        onDeleteIncome={handleDeleteIncome}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}