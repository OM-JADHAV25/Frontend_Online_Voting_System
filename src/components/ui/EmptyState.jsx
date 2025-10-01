import React from 'react';

export default function EmptyState({ message, icon: Icon }) {
  return (
    <div className="text-center p-12 bg-white/5 border-2 border-dashed border-white/10 rounded-lg col-span-full">
      <Icon className="mx-auto w-12 h-12 text-blue-400 mb-4" />
      <p className="text-blue-200">{message}</p>
    </div>
  );
}