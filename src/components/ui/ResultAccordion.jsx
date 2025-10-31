import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Award, Calendar, MapPin } from 'lucide-react';

export default function ResultAccordion({ election, children, showDeclareButton = false, onDeclare = null, isDeclared = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-blue-800/30 rounded-xl overflow-hidden bg-slate-900/50 transition-all duration-300 hover:border-blue-700/50">
      {/* Accordion Header - Always Visible */}
      <div 
        className="p-5 cursor-pointer select-none bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Election Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                {election.name}
              </h3>
              <div className="flex items-center px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase">
                <Award className="w-3 h-3 mr-1" /> 
                {isDeclared ? 'DECLARED' : 'FINALIZED'}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-300">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{election.district || election.type || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {election.startDate && new Date(election.startDate).toLocaleDateString()} - 
                  {election.endDate && new Date(election.endDate).toLocaleDateString()}
                </span>
              </div>
              {election.totalVotes !== undefined && (
                <div className="font-semibold text-green-400">
                  {election.totalVotes.toLocaleString()} votes cast
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Actions & Toggle */}
          <div className="flex items-center gap-3">
            {/* Declare Button for Admin */}
            {showDeclareButton && !isDeclared && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeclare && onDeclare();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Declare Results
              </button>
            )}

            {isDeclared && (
              <div className="px-3 py-1 bg-green-600/20 border border-green-500 text-green-300 rounded-lg text-xs font-semibold">
                ✓ DECLARED
              </div>
            )}

            {/* Expand/Collapse Icon */}
            <div className={`p-2 rounded-full bg-blue-600/20 text-blue-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Content - Expandable */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-6 border-t border-blue-800/30 bg-slate-900/30">
          {children}
        </div>
      </div>
    </div>
  );
}