import React from 'react';

/**
 * ActionButton Component
 * A versatile button component for primary and secondary actions, with icon support.
 */
const ActionButton = ({ icon: Icon, label, isPrimary = false, variant = 'full', onClick, className = '', ...props }) => {
  const base = "flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50";
  const variantClasses = {
    full: "px-4 py-2 text-sm",
    icon: "p-2",
    small: "px-3 py-1 text-xs"
  };
  const color = isPrimary
    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
    : "bg-slate-800 text-blue-200 hover:bg-slate-700 border border-blue-700/50 hover:border-blue-600";

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${color} ${className}`}
      onClick={onClick}
      {...props}
    >
      <Icon className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
