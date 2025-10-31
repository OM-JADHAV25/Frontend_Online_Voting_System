import React from 'react';
import { Award, BadgeCheck, Trophy, TrendingUp } from 'lucide-react';

export default function ResultsCard({ election }) {
  return (
    <div className="space-y-4">
      {/* Winner Section - Enhanced */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-5 border-2 border-green-500/30 relative overflow-hidden">
        {/* Decorative corner badge */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-bl-full"></div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <Trophy className="w-6 h-6 text-yellow-900" />
            </div>
            <div>
              <span className="text-yellow-400 font-bold uppercase text-xs tracking-wider">Official Winner</span>
              <div className="flex items-center gap-2 mt-1">
                <BadgeCheck className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-semibold">Certified Result</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 relative z-10">
          <div className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            {election.results?.winner?.name || election.winner?.name || 'N/A'}
          </div>
          <div className="text-green-300 font-semibold text-lg">
            {election.results?.winner?.percentage || election.winner?.percentage || '0'}% of valid votes
          </div>
          <div className="text-blue-300 text-sm mt-2">
            Party: {election.results?.winner?.party || election.winner?.party || 'Independent'}
          </div>
        </div>
      </div>

      {/* Winner Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
          <div className="text-blue-300 text-xs uppercase tracking-wide mb-1">Total Votes Won</div>
          <div className="text-2xl font-bold text-white">
            {(election.results?.winner?.votes || election.winner?.votes || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
          <div className="text-blue-300 text-xs uppercase tracking-wide mb-1">Victory Margin</div>
          <div className="text-2xl font-bold text-green-400">
            {election.results?.winner?.percentage || election.winner?.percentage || '0'}%
          </div>
        </div>
      </div>

      {/* Complete Results Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-blue-800/30"></div>
          <div className="text-sm font-bold text-blue-200 uppercase tracking-wider px-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Complete Results Breakdown
          </div>
          <div className="h-px flex-1 bg-blue-800/30"></div>
        </div>
        
        {(election.results?.breakdown || election.breakdown || []).map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              index === 0 
                ? 'bg-green-500/10 border-2 border-green-500/30' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-500 text-yellow-900' :
                index === 1 ? 'bg-gray-400 text-gray-900' :
                index === 2 ? 'bg-orange-600 text-orange-100' :
                'bg-blue-600 text-white'
              }`}>
                {index + 1}
              </div>
              
              <div>
                <div className="text-white font-bold flex items-center gap-2">
                  {item.option || item.name}
                  {index === 0 && <span className="text-yellow-400 text-lg">👑</span>}
                </div>
                <div className="text-blue-300 text-sm">
                  {item.party || 'Independent'}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white font-bold text-lg">{item.percentage}%</div>
              <div className="text-blue-300 text-sm">{(item.votes || 0).toLocaleString()} votes</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Total Ballots */}
      <div className="bg-blue-900/30 border-t-2 border-blue-700/30 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="text-blue-300 text-sm font-semibold uppercase tracking-wide">
            Total Ballots Cast
          </div>
          <div className="text-2xl font-bold text-white">
            {(election.results?.totalVotes || election.totalVotes || 0).toLocaleString()}
          </div>
        </div>
        <div className="mt-2 text-center text-blue-400 text-xs">
          Results certified and published by Election Commission
        </div>
      </div>
    </div>
  );
}