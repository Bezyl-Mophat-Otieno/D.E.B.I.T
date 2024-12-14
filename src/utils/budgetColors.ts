export const getBudgetColors = (classification: string): string => {
  const colors = {
    needs: [
      'bg-blue-50/80',
      'bg-blue-100/80',
      'bg-blue-50/60',
      'bg-sky-50/80',
      'bg-sky-100/80',
      'bg-sky-50/60',
      'bg-cyan-50/80',
      'bg-cyan-100/80',
      'bg-cyan-50/60',
    ],
    wants: [
      'bg-purple-50/80',
      'bg-purple-100/80',
      'bg-purple-50/60',
      'bg-fuchsia-50/80',
      'bg-fuchsia-100/80',
      'bg-fuchsia-50/60',
      'bg-pink-50/80',
      'bg-pink-100/80',
      'bg-pink-50/60',
    ],
    savings: [
      'bg-violet-50/80',
      'bg-violet-100/80',
      'bg-violet-50/60',
      'bg-indigo-50/80',
      'bg-indigo-100/80',
      'bg-indigo-50/60',
      'bg-slate-50/80',
      'bg-slate-100/80',
      'bg-slate-50/60',
    ],
  };

  const colorArray = colors[classification as keyof typeof colors] || colors.needs;
  return colorArray[Math.floor(Math.random() * colorArray.length)];
};