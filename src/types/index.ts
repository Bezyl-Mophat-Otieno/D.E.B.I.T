import { Currency } from './currency';

export type { Currency };

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense' | 'savings' | 'debt';
}

export interface SubCategory {
  name: string;
  amount: number;
}

export interface Budget {
  id: string;
  category: string;
  subCategories: SubCategory[];
  classification: Classification;
}

export type Classification = 'needs' | 'wants' | 'savings';

export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface MonthlyIncome {
  monthKey: string;
  monthName: string;
  totalIncome: number;
  incomes: Income[];
}

export interface Debt {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  interestType: 'monthly' | 'annual';
  months: number;
  totalAmount: number;
  minimumPayment: number;
  payments: Payment[];
  dateAdded: string;
}

export interface CompletedDebt {
  id: string;
  name: string;
  principal: number;
  amountPaid: number;
  dateCleared: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}