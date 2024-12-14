export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
};

export const parseFormattedNumber = (value: string): number => {
  // Remove all non-digit characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  return parseFloat(numericValue) || 0;
};

export const formatDate = (date: string): string => {
  // Create date with timezone offset to prevent date shifting
  const [year, month, day] = date.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
};

export const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${crypto.randomUUID()}`;
};

export const normalizeDate = (date: string): string => {
  // Ensure consistent date format without timezone conversion
  const [year, month, day] = date.split('-');
  const normalizedDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
  return normalizedDate.toISOString().split('T')[0];
};