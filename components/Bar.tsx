import React, { memo } from 'react';

interface BarProps {
  value: number;
  maxValue: number;
  state: 'default' | 'compare' | 'swap' | 'sorted' | 'sub-sorted';
  widthPercentage: number;
}

const Bar: React.FC<BarProps> = memo(({ value, maxValue, state, widthPercentage }) => {
  // Determine color based on state
  let colorClass = 'bg-blue-500'; // Default (Unsorted)
  
  switch (state) {
    case 'compare':
      colorClass = 'bg-yellow-400'; // Comparing
      break;
    case 'swap':
      colorClass = 'bg-red-500'; // Swapping
      break;
    case 'sorted':
      colorClass = 'bg-green-500'; // Final Sorted
      break;
    case 'sub-sorted':
      colorClass = 'bg-emerald-300'; // Intermediate Sorted (e.g. Insertion Sort)
      break;
    default:
      colorClass = 'bg-blue-500';
  }

  const heightPercentage = Math.max((value / maxValue) * 100, 1); // Ensure at least 1% height

  return (
    <div 
      className="flex flex-col justify-end items-center transition-all ease-in-out duration-100"
      style={{ 
        width: `${widthPercentage}%`,
        height: '100%' 
      }}
    >
      <div 
        className={`w-11/12 rounded-t-md shadow-md transition-colors duration-100 ${colorClass}`}
        style={{ height: `${heightPercentage}%` }}
      ></div>
    </div>
  );
});

export default Bar;