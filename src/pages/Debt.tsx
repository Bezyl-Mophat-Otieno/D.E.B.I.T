import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import AddDebtForm from '../components/debt/AddDebtForm';
import DebtList from '../components/debt/DebtList';
import DebtOverview from '../components/debt/DebtOverview';
import { useFinance } from '../context/FinanceContext';
import { Debt as DebtType } from '../types';

export default function Debt() {
  const { state: { darkMode, debts: stateDebts }, dispatch } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);

  const selectedDebt = selectedDebtId
    ? stateDebts.find(d => d.id === selectedDebtId)
    : stateDebts.length > 0
      ? [...stateDebts].sort((a, b) => a.totalAmount - b.totalAmount)[0]
      : null;

  const handleAddDebt = (debt: DebtType) => {
    const newDebt = {
      ...debt,
      payments: [],
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_DEBT', payload: newDebt });
    if (!selectedDebtId && stateDebts.length === 0) {
      setSelectedDebtId(newDebt.id);
    }
  };

  const handleAddPayment = (debtId: string, amount: number) => {
    const debt = stateDebts.find(d => d.id === debtId);
    if (!debt) return;

    const newPayment = {
      id: crypto.randomUUID(),
      amount,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedDebt = {
      ...debt,
      payments: [...debt.payments, newPayment]
    };

    const totalPaid = updatedDebt.payments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= debt.totalAmount) {
      dispatch({ type: 'DELETE_DEBT', payload: debt.id });
      if (selectedDebtId === debt.id) {
        setSelectedDebtId(null);
      }
    } else {
      dispatch({ type: 'UPDATE_DEBT', payload: updatedDebt });
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (!selectedDebt) return;
    
    const updatedDebt = {
      ...selectedDebt,
      payments: selectedDebt.payments.filter(p => p.id !== paymentId)
    };
    
    dispatch({ type: 'UPDATE_DEBT', payload: updatedDebt });
  };

  return (
    <div className="space-y-8">
      <Header title="Debt Manager" />

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Debt
        </button>
      </div>

      {showAddForm && (
        <AddDebtForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddDebt}
        />
      )}

      <DebtList
        debts={stateDebts}
        selectedDebtId={selectedDebtId}
        onSelectDebt={setSelectedDebtId}
        onAddPayment={handleAddPayment}
      />

      {selectedDebt && (
        <DebtOverview
          debt={selectedDebt}
          onDeletePayment={handleDeletePayment}
        />
      )}
    </div>
  );
}