import React from 'react';
import { 
  LayoutDashboard, 
  PiggyBank, 
  Receipt, 
  Wallet,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { title: 'Overview', icon: LayoutDashboard, path: '/' },
  { title: 'Income', icon: DollarSign, path: '/income' },
  { title: 'Budget', icon: Wallet, path: '/budget' },
  { title: 'Expenses', icon: Receipt, path: '/expenses' },
  { title: 'Savings', icon: PiggyBank, path: '/savings' },
  { title: 'Debt', icon: CreditCard, path: '/debt' },
];

export default function Sidebar() {
  const { state: { darkMode } } = useFinance();
  const location = useLocation();

  return (
    <div className={`w-52 h-screen fixed ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="p-4">
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          D.E.B.I.T
        </h1>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Financial Manager
        </p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                isActive
                  ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-50 text-indigo-600'}`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              } transition-colors duration-200`}
            >
              <Icon className="w-5 h-5" />
              <span className="ml-3 text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}