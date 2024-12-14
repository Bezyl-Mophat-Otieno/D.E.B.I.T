import React from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useFinance } from '../context/FinanceContext';
import { calculateTotalIncome } from '../utils/income';

export default function Dashboard() {
  const { state } = useFinance();

  // Calculate total income from current month
  const totalIncome = calculateTotalIncome(state.currentMonthIncomes);

  // Calculate total minimum payments from active debts
  const totalMinimumPayments = state.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  // Calculate spendable balance (income minus minimum payments)
  const spendableBalance = totalIncome - totalMinimumPayments;

  // Calculate total remaining debt
  const totalDebt = state.debts.reduce((sum, debt) => {
    const totalPaid = debt.payments.reduce((paidSum, payment) => paidSum + payment.amount, 0);
    return sum + (debt.totalAmount - totalPaid);
  }, 0);

  // Calculate total savings
  const totalSavings = state.savingsGoals.reduce((sum, goal) => {
    const totalContributions = goal.contributions?.reduce((contSum, cont) => contSum + cont.amount, 0) || 0;
    return sum + totalContributions;
  }, 0);

  // Calculate total expenses
  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'Spendable Balance',
      amount: spendableBalance,
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      gradient: 'from-rose-400 to-pink-500'
    },
    {
      title: 'Total Savings',
      amount: totalSavings,
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'Total Debt',
      amount: totalDebt,
      gradient: 'from-red-400 to-rose-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Header title="Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}