import { useFinance } from '../context/FinanceContext';

export function useTheme() {
  const { state: { darkMode } } = useFinance();

  const getBackgroundColor = (isLight: boolean, classification?: string) => {
    if (!classification) return isLight ? 'bg-gray-50/80' : 'bg-gray-100/80';

    switch (classification) {
      case 'needs':
        return isLight ? 'bg-blue-50/80' : 'bg-blue-100/80';
      case 'wants':
        return isLight ? 'bg-purple-50/80' : 'bg-purple-100/80';
      case 'savings':
        return isLight ? 'bg-violet-50/80' : 'bg-violet-100/80';
      default:
        return isLight ? 'bg-gray-50/80' : 'bg-gray-100/80';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'needs':
        return 'from-blue-400 to-blue-500';
      case 'wants':
        return 'from-purple-400 to-purple-500';
      case 'savings':
        return 'from-violet-400 to-violet-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return {
    darkMode,
    getBackgroundColor,
    getClassificationColor,
  };
}