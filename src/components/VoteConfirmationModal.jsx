import React from 'react';
import { Vote, AlertTriangle } from 'lucide-react';

export default function VoteConfirmationModal({ election, onClose, onConfirm }) {
  if (!election) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border-2 border-blue-600 rounded-xl max-w-2xl w-full p-6 animate-pulse">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Vote className="w-8 h-8 text-blue-400 mr-3" />
            <h3 className="text-2xl font-bold uppercase">Official Ballot</h3>
          </div>
          <p className="text-blue-200 mb-2">You are about to cast your vote for:</p>
          <p className="font-bold text-white text-lg uppercase">{election.name}</p>
          <p className="text-blue-300 text-sm mt-2">Conducted by: {election.department}</p>
        </div>
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center text-yellow-400 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="font-bold uppercase">Important Notice</span>
          </div>
          <p className="text-blue-200 text-sm">Once you cast your vote, it cannot be changed or revoked. Your vote is anonymous and will be recorded securely.</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={onClose} className="flex-1 py-3 border border-white/20 rounded-lg font-bold uppercase hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-blue-600 rounded-lg font-bold uppercase hover:bg-blue-700 transition-colors">Proceed to Vote</button>
        </div>
      </div>
    </div>
  );
}