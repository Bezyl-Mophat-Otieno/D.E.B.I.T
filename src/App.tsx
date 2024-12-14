import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Budget from './pages/Budget';
import Expenses from './pages/Expenses';
import Savings from './pages/Savings';
import Debt from './pages/Debt';

function App() {
  return (
    <FinanceProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Sidebar />
          <div className="ml-52 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/income" element={<Income />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/debt" element={<Debt />} />
            </Routes>
          </div>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;