import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 text-white px-6 py-3 rounded-lg shadow-2xl border bg-green-600 border-green-500 flex items-center animate-pulse">
      <CheckCircle className="w-6 h-6 mr-3" />
      <span className="font-semibold">{message}</span>
    </div>
  );
}