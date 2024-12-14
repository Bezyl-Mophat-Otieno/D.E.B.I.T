import React, { useState, useRef } from 'react';
import { MoreVertical, Minus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Debt, Payment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import FormattedNumberInput from '../FormattedNumberInput';

interface DebtOverviewProps {
  debt: Debt;
  onDeletePayment: (paymentId: string) => void;
}

interface PaymentEdit {
  type: 'delete' | 'modify';
  paymentId: string;
  previousValue: Payment;
  newValue?: Payment;
}

export default function DebtOverview({ debt, onDeletePayment }: DebtOverviewProps) {
  const { state: { darkMode } } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPayments, setEditedPayments] = useState<Payment[]>(debt.payments);
  const [editHistory, setEditHistory] = useState<PaymentEdit[]>([]);
  const editingAmountRef = useRef<{ id: string; startAmount: number } | null>(null);

  const totalPaid = editedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = debt.totalAmount - totalPaid;
  const percentage = (totalPaid / debt.totalAmount) * 100;

  const handleSave = () => {
    setIsEditing(false);
    setEditHistory([]);
    editingAmountRef.current = null;
    onDeletePayment(editedPayments[0]?.id); // Trigger parent update
  };

  const handleUndo = () => {
    if (editHistory.length === 0) return;

    const lastEdit = editHistory[editHistory.length - 1];
    let newPayments = [...editedPayments];

    if (lastEdit.type === 'delete') {
      newPayments = [...editedPayments, lastEdit.previousValue];
    } else if (lastEdit.type === 'modify') {
      newPayments = editedPayments.map(p =>
        p.id === lastEdit.paymentId ? lastEdit.previousValue : p
      );
    }

    setEditedPayments(newPayments);
    setEditHistory(prev => prev.slice(0, -1));
  };

  const handleDeletePayment = (paymentId: string) => {
    const payment = editedPayments.find(p => p.id === paymentId);
    if (!payment) return;

    setEditHistory(prev => [...prev, {
      type: 'delete',
      paymentId,
      previousValue: payment
    }]);

    setEditedPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const handleAmountFocus = (payment: Payment) => {
    editingAmountRef.current = {
      id: payment.id,
      startAmount: payment.amount
    };
  };

  const handleAmountBlur = () => {
    const editingAmount = editingAmountRef.current;
    if (!editingAmount) return;

    const payment = editedPayments.find(p => p.id === editingAmount.id);
    if (!payment || payment.amount === editingAmount.startAmount) {
      editingAmountRef.current = null;
      return;
    }

    setEditHistory(prev => [...prev, {
      type: 'modify',
      paymentId: editingAmount.id,
      previousValue: { ...payment, amount: editingAmount.startAmount }
    }]);

    editingAmountRef.current = null;
  };

  const handleAmountChange = (paymentId: string, newAmount: number) => {
    setEditedPayments(prev => prev.map(p =>
      p.id === paymentId ? { ...p, amount: newAmount } : p
    ));
  };

  return (
    <div className={`rounded-xl ${
      darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    } p-6 shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Debt Overview
      </h3>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Name
            </h4>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {debt.name}
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Principal Amount
            </h4>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatCurrency(debt.principal)}
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Amount Paid
            </h4>
            <p className="text-2xl font-bold mt-1 text-emerald-600">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Interest Rate
            </h4>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {debt.interestRate}% {debt.interestType === 'monthly' ? 'monthly' : 'annual'}
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Amount to be Paid
            </h4>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatCurrency(debt.totalAmount)}
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Balance
            </h4>
            <p className="text-2xl font-bold mt-1 text-rose-600">
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="none"
            />
            <circle
              className="text-red-600 progress-ring stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              style={{
                strokeDasharray: `${2 * Math.PI * 40}`,
                strokeDashoffset: `${2 * Math.PI * 40 * (1 - percentage / 100)}`,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
            <text
              x="50"
              y="50"
              className={`${darkMode ? 'fill-white' : 'fill-gray-800'} text-lg font-bold`}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {percentage.toFixed(1)}%
            </text>
          </svg>
        </div>
      </div>

      {/* Payment History */}
      <div className={`rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Payment History
          </h4>
          <div className="relative">
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditHistory([]);
                }}
                className={`px-4 py-2 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleUndo}
                  disabled={editHistory.length === 0}
                  className={`px-4 py-2 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${editHistory.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Undo Changes ({editHistory.length})
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' 
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {editedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className={`group ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  <td className="py-2">{formatDate(payment.date)}</td>
                  <td className="py-2 relative">
                    {isEditing ? (
                      <FormattedNumberInput
                        value={payment.amount}
                        onChange={(value) => handleAmountChange(payment.id, value)}
                        onFocus={() => handleAmountFocus(payment)}
                        onBlur={handleAmountBlur}
                        className="w-32"
                      />
                    ) : (
                      formatCurrency(payment.amount)
                    )}
                    {isEditing && (
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}