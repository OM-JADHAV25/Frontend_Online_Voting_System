import React from 'react';

/**
 * StatusBadge Component
 * A reusable badge for displaying various status types with consistent styling.
 */
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full text-center";
  const statusClasses = {
    'Verified': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'Active': 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse',
    'Pending': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Scheduled': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'Blocked': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Completed': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'Approved': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'Rejected': 'bg-red-500/20 text-red-400 border border-red-500/30'
  };
  return <span className={`${baseClasses} ${statusClasses[status] || ''}`}>{status}</span>;
};

export default StatusBadge;
