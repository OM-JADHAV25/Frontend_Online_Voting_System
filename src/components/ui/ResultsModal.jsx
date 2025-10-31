import React from 'react';
import { X, Award, TrendingUp } from 'lucide-react';

export default function ResultsModal({ isOpen, onClose, results }) {
  if (!isOpen || !results) return null;

  const { electionName, winner, breakdown, totalVotes } = results;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-700/50">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-blue-700/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{electionName}</h2>
            <p className="text-blue-300 text-sm">Final Election Results</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Winner Section */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold text-white uppercase">Winner</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{winner.name}</p>
                <p className="text-green-300 font-semibold">{winner.party}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-400">{winner.percentage}%</p>
                <p className="text-white font-semibold">{winner.votes.toLocaleString()} votes</p>
              </div>
            </div>
          </div>

          {/* Total Votes */}
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 flex items-center justify-between">
            <span className="text-blue-300 font-semibold">Total Votes Cast</span>
            <span className="text-2xl font-bold text-white">{totalVotes.toLocaleString()}</span>
          </div>

          {/* All Candidates Breakdown */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 uppercase flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Complete Results Breakdown
            </h4>
            <div className="space-y-3">
              {breakdown.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className={`border rounded-lg p-4 transition-all ${
                    index === 0
                      ? 'bg-green-500/10 border-green-500/50'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-bold">
                        {index + 1}. {candidate.name}
                      </p>
                      <p className="text-blue-300 text-sm">{candidate.party}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{candidate.percentage}%</p>
                      <p className="text-blue-300 text-sm">{candidate.votes.toLocaleString()} votes</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        index === 0 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-blue-700/50 p-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
}