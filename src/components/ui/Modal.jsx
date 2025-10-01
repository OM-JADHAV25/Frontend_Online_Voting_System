import React from 'react';
import { XCircle } from 'lucide-react';

/**
 * Modal Component
 * A generic, reusable modal overlay for displaying content in a focused view.
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-900 border border-blue-800/50 rounded-xl shadow-2xl w-full ${sizeClasses[size]} animate-scaleIn`}>
        <div className="p-6 border-b border-blue-800/50 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-blue-400 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
