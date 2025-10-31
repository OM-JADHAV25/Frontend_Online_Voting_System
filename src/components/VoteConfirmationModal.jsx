import React, { useState } from 'react';
import { Vote, AlertTriangle, User } from 'lucide-react';
import defaultAvatar from '../assets/defaultAvatar.jpg';

export default function VoteConfirmationModal({ election, onClose, onConfirm }) {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  if (!election) return null;

  const handleConfirm = () => {
    if (!selectedCandidateId) {
      alert('Please select a candidate');
      return;
    }
    onConfirm(selectedCandidateId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border-2 border-blue-600 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Vote className="w-8 h-8 text-blue-400 mr-3" />
            <h3 className="text-2xl font-bold uppercase">Official Ballot</h3>
          </div>
          <p className="text-blue-200 mb-2">You are about to cast your vote for:</p>
          <p className="font-bold text-white text-lg uppercase">{election.name}</p>
          <p className="text-blue-300 text-sm mt-2">{election.description}</p>
        </div>

        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center text-yellow-400 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="font-bold uppercase">Important Notice</span>
          </div>
          <p className="text-blue-200 text-sm">Once you cast your vote, it cannot be changed or revoked. Your vote is anonymous and will be recorded securely.</p>
        </div>

        {/* Candidates List */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-white mb-4 uppercase">Select Your Candidate:</h4>
          <div className="space-y-3">
            {election.candidates && election.candidates.length > 0 ? (
              election.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedCandidateId(candidate.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCandidateId === candidate.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/10 bg-white/5 hover:border-blue-400/50'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={candidate.photo || defaultAvatar}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23ddd" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3ENo Photo%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-white text-lg">{candidate.name}</div>
                      <div className="text-blue-300">{candidate.party}</div>
                    </div>
                    {selectedCandidateId === candidate.id && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-blue-300 py-4">No candidates available</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/20 rounded-lg font-bold uppercase hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCandidateId}
            className={`flex-1 py-3 rounded-lg font-bold uppercase transition-colors ${selectedCandidateId
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
          >
            Cast Vote
          </button>
        </div>
      </div>
    </div>
  );
}