import React, { useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface CategoryActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onUndo: () => void;
}

export default function CategoryActions({ 
  isEditing, 
  onEdit, 
  onDelete, 
  onSave, 
  onUndo 
}: CategoryActionsProps) {
  const { state: { darkMode } } = useFinance();
  const [showActions, setShowActions] = React.useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actionButtonClass = `
    px-3 py-0.5 text-xs rounded-lg shadow-sm transition-all duration-200
    hover:shadow-md hover:scale-105 active:scale-95
  `;

  return (
    <div className="relative" ref={actionsRef}>
      {!isEditing && (
        <button
          onClick={() => setShowActions(!showActions)}
          className={`p-1 rounded-full transition-all duration-200
            ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}
          `}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      )}

      {showActions && !isEditing && (
        <div className="absolute right-0 top-0 z-10 flex gap-2">
          <button
            onClick={() => {
              onEdit();
              setShowActions(false);
            }}
            className={`${actionButtonClass} ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Edit Category
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowActions(false);
            }}
            className={`${actionButtonClass} ${
              darkMode 
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300' 
                : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
            }`}
          >
            Delete Category
          </button>
        </div>
      )}

      {isEditing && (
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            className={`${actionButtonClass} ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Undo Changes
          </button>
          <button
            onClick={onSave}
            className={`${actionButtonClass} ${
              darkMode 
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
            }`}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}