import React, { useState } from 'react';
import { MoreVertical, Minus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CompletedDebt } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getTableStyles } from '../../utils/tableStyles';

interface PaymentHistoryProps {
  completedDebts: CompletedDebt[];
  onDeleteDebt: (id: string) => void;
  onClearAll: () => void;
}

export default function PaymentHistory({ 
  completedDebts, 
  onDeleteDebt,
  onClearAll 
}: PaymentHistoryProps) {
  const { state: { darkMode } } = useFinance();
  const styles = getTableStyles(darkMode);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editedDebts, setEditedDebts] = useState<CompletedDebt[]>(completedDebts);

  const handleSave = () => {
    setIsEditing(false);
    setShowActions(false);
  };

  const handleUndo = () => {
    setEditedDebts(completedDebts);
    setIsEditing(false);
    setShowActions(false);
  };

  const handleDeleteDebt = (id: string) => {
    setEditedDebts(prev => prev.filter(debt => debt.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={styles.header}>Payment History</h3>
        <div className="relative">
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setShowActions(false);
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
                className={`px-4 py-2 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Undo Changes
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

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={styles.tableHeader}>
              <th className="text-left py-4 px-4 rounded-tl-lg">Name</th>
              <th className="text-left py-4 px-4">Principal</th>
              <th className="text-left py-4 px-4">Amount Paid</th>
              <th className="text-left py-4 px-4 rounded-tr-lg">Date Cleared</th>
            </tr>
          </thead>
          <tbody>
            {editedDebts.map((debt, index) => {
              const isLast = index === editedDebts.length - 1;
              const uniqueKey = `${debt.id}-${debt.dateCleared}-${debt.amountPaid}`;
              
              return (
                <tr
                  key={uniqueKey}
                  className={`group ${styles.row}`}
                >
                  <td className={`py-4 px-4 ${isLast ? 'rounded-bl-lg' : ''}`}>
                    {debt.name}
                  </td>
                  <td className="py-4 px-4">{formatCurrency(debt.principal)}</td>
                  <td className="py-4 px-4">{formatCurrency(debt.amountPaid)}</td>
                  <td className={`py-4 px-4 relative ${isLast ? 'rounded-br-lg' : ''}`}>
                    {formatDate(debt.dateCleared)}
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {completedDebts.length > 0 && (
        <div className="mt-6">
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-base text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}