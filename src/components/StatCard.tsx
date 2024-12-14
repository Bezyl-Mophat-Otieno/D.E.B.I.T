import React from 'react';
import { useFinance } from '../context/FinanceContext';

interface StatCardProps {
  title: string;
  amount: number;
  gradient: string;
  className?: string;
}

export default function StatCard({ title, amount, gradient, className = '' }: StatCardProps) {
  const { state: { currency } } = useFinance();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-6 bg-gradient-to-r ${gradient} transform transition-transform duration-200 hover:scale-105 ${className}`}
    >
      <span className="text-sm font-medium text-white/90">{title}</span>
      <h3 className="text-2xl font-bold text-white mt-2">
        {formatCurrency(amount)}
      </h3>
    </div>
  );
}