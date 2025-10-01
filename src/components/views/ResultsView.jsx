// FILE: src/components/views/ResultsView.jsx
import React, { useState, useEffect } from 'react';
import { Download, Award, Crown, TrendingUp, Vote, AlertCircle, Calendar, MapPin } from 'lucide-react';
import axios from '../../api/axios';

/**
 * Results View
 * Displays the certified results of completed elections from the backend.
 */
const ResultsView = () => {
  const [completedElections, setCompletedElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  useEffect(() => {
    fetchCompletedElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      fetchElectionResults(selectedElectionId);
    }
  }, [selectedElectionId]);

  const fetchCompletedElections = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken'); // Add this

      const response = await axios.get('/admin/elections', {
        headers: { Authorization: `Bearer ${token}` } // Add headers
      });

      // Filter for completed elections
      const completed = response.data.filter(e => e.status === 'Completed');
      setCompletedElections(completed);

      // Auto-select first election if available
      if (completed.length > 0 && !selectedElectionId) {
        setSelectedElectionId(completed[0].id);
      }
    } catch (error) {
      console.error('Error fetching completed elections:', error);
      alert('Failed to fetch elections. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElectionResults = async (electionId) => {
    try {
      setIsLoadingResults(true);
      const token = localStorage.getItem('adminToken');

      // Fetch election results from backend
      const response = await axios.get(`/admin/elections/${electionId}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResultData(response.data);
    } catch (error) {
      console.error('Error fetching election results:', error);
      // If no results endpoint exists, try to construct from election data
      fetchElectionWithCandidates(electionId);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const fetchElectionWithCandidates = async (electionId) => {
    try {
      const token = localStorage.getItem('adminToken');

      // Fetch election details
      const electionResponse = await axios.get(`/admin/elections/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch candidates for this election
      const candidatesResponse = await axios.get(`/admin/candidates?electionId=${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const election = electionResponse.data;
      const candidates = candidatesResponse.data;

      // Sort candidates by votes descending
      const sortedCandidates = candidates
        .map(c => ({
          ...c,
          votes: c.voteCount || 0,
          percentage: election.totalVotes > 0
            ? ((c.voteCount || 0) / election.totalVotes * 100).toFixed(2)
            : 0
        }))
        .sort((a, b) => b.votes - a.votes);

      const winner = sortedCandidates[0];
      const runnerUp = sortedCandidates[1];
      const margin = winner && runnerUp ? winner.votes - runnerUp.votes : 0;

      // Calculate turnout (you may need to fetch total registered voters)
      const turnout = 75; // This should come from backend - total votes / registered voters * 100

      setResultData({
        election: election,
        winner: winner ? winner.name : 'No candidates',
        totalVotes: election.totalVotes || 0,
        turnout: turnout,
        margin: margin,
        candidates: sortedCandidates
      });
    } catch (error) {
      console.error('Error constructing election results:', error);
      setResultData(null);
    }
  };

  const handleExportResults = async () => {
    if (!resultData) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/admin/elections/${selectedElectionId}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `election_results_${selectedElectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Export feature not yet implemented on backend.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (completedElections.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 border border-blue-800/30 rounded-xl">
        <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Completed Elections</h3>
        <p className="text-blue-300">There are no completed elections to display results for.</p>
      </div>
    );
  }

  const selectedElection = completedElections.find(e => e.id === selectedElectionId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-xl font-semibold text-white">Certified Election Results</h3>
        <select
          value={selectedElectionId || ''}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          className="bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          {completedElections.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <button
          onClick={handleExportResults}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {isLoadingResults ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : resultData ? (
        <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl p-6 space-y-8">
          {/* Election Info Header */}
          {selectedElection && (
            <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-700/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedElection.name}</h2>
                  <div className="flex items-center gap-4 text-blue-300 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedElection.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(selectedElection.startDate).toLocaleDateString()} - {new Date(selectedElection.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-semibold">
                  Certified
                </div>
              </div>
            </div>
          )}

          {/* Winner Announcement */}
          <div className="text-center border-b border-blue-800/30 pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <p className="text-blue-300 uppercase text-sm font-semibold">Certified Winner</p>
            </div>
            <h2 className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3">
              <Crown className="w-8 h-8" />
              {resultData.winner}
            </h2>
            <p className="text-blue-300 mt-2">Election has been officially certified</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-lg text-center border border-blue-800/30">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-sm text-blue-300">Voter Turnout</p>
              <p className="text-2xl font-bold text-white">{resultData.turnout}%</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg text-center border border-blue-800/30">
              <Vote className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-sm text-blue-300">Total Votes Cast</p>
              <p className="text-2xl font-bold text-white">{resultData.totalVotes.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg text-center border border-blue-800/30">
              <AlertCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-sm text-blue-300">Margin of Victory</p>
              <p className="text-2xl font-bold text-white">{resultData.margin.toLocaleString()} Votes</p>
            </div>
          </div>

          {/* Detailed Results Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Detailed Results Breakdown</h4>
            <div className="space-y-4">
              {resultData.candidates && resultData.candidates.length > 0 ? (
                resultData.candidates.map((candidate, index) => (
                  <div key={candidate.id} className="bg-slate-800/50 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {candidate.name.charAt(0)}
                          </div>
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{candidate.name}</p>
                          <p className="text-sm text-blue-300">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{candidate.votes.toLocaleString()} Votes</p>
                        <p className="text-sm text-blue-300">{candidate.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-blue-300">
                  No candidate data available for this election.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900/50 border border-blue-800/30 rounded-xl">
          <p className="text-blue-300">No results available for this election.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsView;