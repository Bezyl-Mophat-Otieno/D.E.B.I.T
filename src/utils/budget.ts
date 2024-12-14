import { Budget } from '../types';

export const calculateCategoryTotal = (budget: Budget): number => {
  return budget.subCategories.reduce((sum, sub) => sum + sub.amount, 0);
};

export const calculatePercentage = (amount: number, total: number): number => {
  return total > 0 ? (amount / total) * 100 : 0;
};

export const sortBudgetsByAmount = (budgets: Budget[]): Budget[] => {
  return [...budgets].sort((a, b) => {
    const totalA = calculateCategoryTotal(a);
    const totalB = calculateCategoryTotal(b);
    return totalB - totalA;
  });
};