import React from 'react';
import { Building } from 'lucide-react';
import VotingProgress from './ui/VotingProgress';
import CountdownTimer from './ui/CountdownTimer';

export default function ElectionCard({ election, onVote, voterStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'border-l-green-500 bg-green-500/5';
      case 'upcoming': return 'border-l-blue-500 bg-blue-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return 'VOTING ACTIVE';
      case 'upcoming': return 'SCHEDULED';
      default: return 'PENDING';
    }
  };

  return (
    <div className={`flex flex-col border-l-4 rounded-r-lg ${getStatusColor(election.status)} border border-white/10 p-6`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-3">
              <Building className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">{election.department}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{election.name}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">{election.description}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${election.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {getStatusText(election.status)}
            </div>
            <div className="text-xs text-blue-300 mt-1">SECURITY: {election.securityLevel || 'HIGH'}</div>
          </div>
        </div>
        {election.status === 'ongoing' && (
          <div className="my-4"><VotingProgress total={election.totalVoters} current={election.votedSoFar} /></div>
        )}
      </div>
      <div className="mt-auto">
        {election.status === 'ongoing' && <div className="mb-4"><CountdownTimer expiryTimestamp={election.endDate} /></div>}
        <button 
          onClick={() => onVote(election)}
          disabled={election.status !== 'ongoing' || voterStatus.hasVoted}
          className={`w-full py-3 px-4 font-bold rounded-lg transition-all duration-300 uppercase tracking-wide ${
            election.status === 'ongoing' && !voterStatus.hasVoted
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {voterStatus.hasVoted ? 'VOTE ALREADY CAST' : 
           election.status === 'ongoing' ? 'PROCEED TO VOTE' : 'VOTING SCHEDULED'}
        </button>
      </div>
    </div>
  );
}