import { Income, MonthlyIncome } from '../types';

export const calculateTotalIncome = (incomes: Income[]): number => {
  return incomes.reduce((sum, income) => sum + income.amount, 0);
};

export const organizeIncomeByMonth = (incomes: Income[]): MonthlyIncome[] => {
  const monthlyMap = new Map<string, MonthlyIncome>();

  incomes.forEach(income => {
    const date = new Date(income.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (monthlyMap.has(monthKey)) {
      const monthData = monthlyMap.get(monthKey)!;
      monthData.incomes.push(income);
      monthData.totalIncome += income.amount;
    } else {
      monthlyMap.set(monthKey, {
        monthKey,
        monthName,
        totalIncome: income.amount,
        incomes: [income]
      });
    }
  });

  return Array.from(monthlyMap.values()).sort((a, b) => {
    const [yearA, monthA] = a.monthKey.split('-');
    const [yearB, monthB] = b.monthKey.split('-');
    return Number(yearB) - Number(yearA) || Number(monthB) - Number(monthA);
  });
};

export const isCurrentMonth = (date: string): boolean => {
  const incomeDate = new Date(date);
  const currentDate = new Date();
  return incomeDate.getMonth() === currentDate.getMonth() &&
         incomeDate.getFullYear() === currentDate.getFullYear();
};