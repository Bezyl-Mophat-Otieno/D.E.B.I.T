import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Budget, Debt, SavingsGoal, Income, MonthlyIncome, Currency, CompletedDebt } from '../types';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  debts: Debt[];
  completedDebts: CompletedDebt[];
  savingsGoals: SavingsGoal[];
  currentMonthIncomes: Income[];
  monthlyIncomes: MonthlyIncome[];
  currency: Currency;
  darkMode: boolean;
}

type Action =
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_DEBT'; payload: Debt }
  | { type: 'UPDATE_DEBT'; payload: Debt }
  | { type: 'DELETE_DEBT'; payload: string }
  | { type: 'ADD_COMPLETED_DEBT'; payload: CompletedDebt }
  | { type: 'DELETE_COMPLETED_DEBT'; payload: string }
  | { type: 'CLEAR_COMPLETED_DEBTS' }
  | { type: 'UPDATE_SAVINGS'; payload: SavingsGoal }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'DELETE_CURRENT_INCOME'; payload: string }
  | { type: 'SET_MONTHLY_INCOMES'; payload: MonthlyIncome[] }
  | { type: 'DELETE_MONTHLY_INCOME'; payload: { monthKey: string; incomeId: string } }
  | { type: 'CLEAR_MONTHLY_INCOMES' }
  | { type: 'SET_CURRENT_MONTH_INCOMES'; payload: Income[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'LOAD_STATE'; payload: Partial<FinanceState> };

const initialState: FinanceState = {
  transactions: [],
  budgets: [],
  debts: [],
  completedDebts: [],
  savingsGoals: [],
  currentMonthIncomes: [],
  monthlyIncomes: [],
  currency: 'USD',
  darkMode: false,
};

function financeReducer(state: FinanceState, action: Action): FinanceState {
  let newState = state;

  switch (action.type) {
    case 'SET_CURRENCY':
      newState = { ...state, currency: action.payload };
      break;

    case 'SET_DARK_MODE':
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      newState = { ...state, darkMode: action.payload };
      break;

    case 'ADD_TRANSACTION':
      newState = {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
      break;

    case 'UPDATE_BUDGET':
      newState = {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
      break;

    case 'DELETE_BUDGET':
      newState = {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload),
      };
      break;

    case 'ADD_DEBT':
      newState = {
        ...state,
        debts: [...state.debts, action.payload],
      };
      break;

    case 'UPDATE_DEBT':
      newState = {
        ...state,
        debts: state.debts.map(debt =>
          debt.id === action.payload.id ? action.payload : debt
        ),
      };
      break;

    case 'DELETE_DEBT':
      const deletedDebt = state.debts.find(debt => debt.id === action.payload);
      if (deletedDebt) {
        const totalPaid = deletedDebt.payments.reduce((sum, p) => sum + p.amount, 0);
        const completedDebt: CompletedDebt = {
          id: deletedDebt.id,
          name: deletedDebt.name,
          principal: deletedDebt.principal,
          amountPaid: totalPaid,
          dateCleared: new Date().toISOString().split('T')[0]
        };
        newState = {
          ...state,
          debts: state.debts.filter(debt => debt.id !== action.payload),
          completedDebts: [...state.completedDebts, completedDebt]
        };
      } else {
        newState = {
          ...state,
          debts: state.debts.filter(debt => debt.id !== action.payload)
        };
      }
      break;

    case 'ADD_INCOME':
      newState = {
        ...state,
        currentMonthIncomes: [...state.currentMonthIncomes, action.payload],
      };
      break;

    case 'DELETE_CURRENT_INCOME':
      newState = {
        ...state,
        currentMonthIncomes: state.currentMonthIncomes.filter(
          income => income.id !== action.payload
        ),
      };
      break;

    case 'SET_MONTHLY_INCOMES':
      newState = {
        ...state,
        monthlyIncomes: action.payload,
      };
      break;

    case 'DELETE_MONTHLY_INCOME':
      newState = {
        ...state,
        monthlyIncomes: state.monthlyIncomes.map(month => {
          if (month.monthKey === action.payload.monthKey) {
            const updatedIncomes = month.incomes.filter(
              income => income.id !== action.payload.incomeId
            );
            return {
              ...month,
              incomes: updatedIncomes,
              totalIncome: updatedIncomes.reduce((sum, income) => sum + income.amount, 0),
            };
          }
          return month;
        }).filter(month => month.incomes.length > 0),
      };
      break;

    case 'CLEAR_MONTHLY_INCOMES':
      newState = {
        ...state,
        monthlyIncomes: [],
      };
      break;

    case 'SET_CURRENT_MONTH_INCOMES':
      newState = {
        ...state,
        currentMonthIncomes: action.payload,
      };
      break;

    case 'SET_BUDGETS':
      newState = {
        ...state,
        budgets: action.payload,
      };
      break;

    case 'ADD_BUDGET':
      newState = {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
      break;

    case 'LOAD_STATE':
      newState = { ...state, ...action.payload };
      break;

    default:
      return state;
  }

  // Save state to localStorage after each update
  localStorage.setItem('financeState', JSON.stringify(newState));
  return newState;
}

const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('financeState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      dispatch({ type: 'LOAD_STATE', payload: parsedState });
    }
  }, []);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}