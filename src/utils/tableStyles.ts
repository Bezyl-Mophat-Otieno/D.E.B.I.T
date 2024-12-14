export const getTableStyles = (darkMode: boolean) => ({
  container: `rounded-xl ${
    darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
  } p-6 shadow-lg backdrop-blur-sm`,
  
  header: `text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`,
  
  tableHeader: `${
    darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80'
  }`,
  
  row: `group transition-all duration-200 ${
    darkMode 
      ? 'hover:bg-gray-700/30 text-gray-200' 
      : 'hover:bg-emerald-100/30 text-gray-700'
  }`,
  
  deleteButton: "text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
  
  clearAllButton: "px-4 py-2 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200",
  
  addButton: "px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
});

export const getFormStyles = (darkMode: boolean) => ({
  container: `rounded-xl ${
    darkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
  } p-6 shadow-lg backdrop-blur-sm`,
  
  input: `w-full px-3 py-2 rounded-lg border ${
    darkMode
      ? 'bg-gray-700/50 border-gray-600 text-white'
      : 'bg-white/50 border-emerald-200'
  } focus:outline-none focus:ring-2 focus:ring-emerald-500`,
  
  label: `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`,
  
  submitButton: "px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200",
  
  cancelButton: "px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
});