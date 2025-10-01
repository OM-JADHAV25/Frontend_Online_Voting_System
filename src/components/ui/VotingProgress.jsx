import React from 'react';

export default function VotingProgress({ total, current }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-blue-300 font-semibold">VOTER PARTICIPATION</span>
        <span className="font-bold text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-blue-900/50 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-blue-300">
        <span>{current.toLocaleString()} VOTES CAST</span>
        <span>{total.toLocaleString()} REGISTERED VOTERS</span>
      </div>
    </div>
  );
}