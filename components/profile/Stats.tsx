import React from 'react';

type Stat = {
  label: string;
  value: string;
};

const stats: Stat[] = [
  { label: 'TOTAL XP', value: '935' },
  { label: 'GENERATED RECIPES', value: '9' },
  { label: 'FAVORITE RECIPES', value: '3' },
  { label: 'DAILY STREAK', value: '1' },
];

const Stats = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Stats<hr/></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
        key={index}
        className="bg-white rounded-lg p-4 text-center shadow-md"
        >
        <span className="block text-sm text-gray-500 uppercase">
          {stat.label}
        </span>
        <span className="block text-2xl font-bold text-blue-500 mt-2">
          {stat.value}
        </span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Stats;
