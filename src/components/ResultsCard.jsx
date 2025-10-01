import React from 'react';
import { Award, BadgeCheck } from 'lucide-react';

export default function ResultsCard({ election }) {
  return (
    <div className="border-l-4 border-l-purple-500 bg-purple-500/5 border border-white/10 rounded-r-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{election.name}</h3>
          <p className="text-blue-300 text-sm">CONDUCTED BY: {election.department}</p>
        </div>
        <div className="flex items-center px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold uppercase">
          <Award className="w-4 h-4 mr-1" /> FINALIZED
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 font-bold uppercase text-sm">Official Result</span>
            <BadgeCheck className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{election.results.winner.name}</div>
          <div className="text-green-300 font-semibold">{election.results.winner.percentage}% of valid votes</div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-bold text-blue-200 uppercase tracking-wide">Complete Results</div>
          {election.results.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-semibold">{item.option}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{item.percentage}%</div>
                <div className="text-blue-300 text-sm">{item.votes.toLocaleString()} votes</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-blue-300 text-sm border-t border-white/10 pt-3">
          TOTAL BALLOTS CAST: {election.results.totalVotes.toLocaleString()}
        </div>
      </div>
    </div>
  );
}