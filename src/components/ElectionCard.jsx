import React from 'react';
import { Building } from 'lucide-react';
import VotingProgress from './ui/VotingProgress';
import CountdownTimer from './ui/CountdownTimer';

export default function ElectionCard({ election, onVote, voterStatus }) {
  // Normalize status to lowercase for comparison
  const normalizedStatus = election.status?.toLowerCase();

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'active': return 'border-l-green-500 bg-green-500/5';
      case 'upcoming': return 'border-l-blue-500 bg-blue-500/5';
      case 'completed': return 'border-l-gray-500 bg-gray-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getStatusText = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'active': return 'VOTING ACTIVE';
      case 'upcoming': return 'SCHEDULED';
      case 'completed': return 'COMPLETED';
      default: return 'PENDING';
    }
  };

  // Check if election is active
  const isActive = normalizedStatus === 'active';

  return (
    <div className={`flex flex-col border-l-4 rounded-r-lg ${getStatusColor(election.status)} border border-white/10 p-6`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-3">
              <Building className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
                {election.type || election.department || 'General Election'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{election.name}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              {election.description || 'No description available'}
            </p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              isActive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {getStatusText(election.status)}
            </div>
            <div className="text-xs text-blue-300 mt-1">SECURITY: HIGH</div>
          </div>
        </div>
        
        {/* Show voting progress only for active elections 
        {isActive && (
          <div className="my-4">
            <VotingProgress 
              total={election.totalVoters || 1000} 
              current={election.totalVotes || 0} 
            />
          </div>
        )} */}
      </div>

      <div className="mt-auto">
        {/* Show countdown timer only for active elections */}
        {isActive && election.endDate && (
          <div className="mb-4">
            <CountdownTimer expiryTimestamp={election.endDate} />
          </div>
        )}
        
        <button 
          onClick={() => onVote(election)}
          disabled={!isActive || voterStatus?.hasVoted}
          className={`w-full py-3 px-4 font-bold rounded-lg transition-all duration-300 uppercase tracking-wide ${
            isActive && !voterStatus?.hasVoted
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {voterStatus?.hasVoted 
            ? 'VOTE ALREADY CAST' 
            : isActive 
              ? 'PROCEED TO VOTE' 
              : 'VOTING SCHEDULED'}
        </button>
      </div>
    </div>
  );
}