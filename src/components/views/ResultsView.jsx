// FILE: src/components/views/ResultsView.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Download, Award, Crown, TrendingUp, Vote, AlertCircle, Calendar, MapPin, CheckCircle } from 'lucide-react';

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
  const [declaringResults, setDeclaringResults] = useState(false);

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

      const response = await axios.get(`/admin/elections/${electionId}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;

      // Transform backend response to match frontend expectations
      setResultData({
        election: {
          id: data.electionId,
          name: data.electionName,
          status: data.status
        },
        winner: data.winner?.name || 'No winner',
        totalVotes: data.totalVotes || 0,
        totalRegisteredVoters: data.totalRegisteredVoters || 0, // NEW
        turnout: parseFloat(data.turnout) || 0, // Real turnout from backend
        margin: data.marginOfVictory || 0, // Real margin from backend
        candidates: data.breakdown?.map(c => ({
          id: c.id || Math.random(),
          name: c.name,
          party: c.party,
          votes: c.votes || 0,
          percentage: c.percentage
        })) || []
      });
    } catch (error) {
      console.error('Error fetching election results:', error);
      setResultData(null);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleDeclareResults = async (electionId) => {
    const election = completedElections.find(e => e.id === electionId);

    if (!window.confirm(`⚠️ Are you sure you want to declare results for "${election?.name}" to the public?\n\nVoters will be able to see the election results immediately.\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await axios.post(
        `/admin/elections/${electionId}/declare-results`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('✅ Results have been declared successfully!\n\nVoters can now view the election results in their dashboard.');

      // Refresh data
      await fetchCompletedElections();
      // Refresh results for current election
      if (selectedElectionId === electionId) {
        await fetchElectionResults(electionId);
      }

    } catch (error) {
      console.error('Error declaring results:', error);
      alert('❌ Failed to declare results: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportResults = async (electionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/admin/elections/${electionId}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `election_results_${electionId}.pdf`);
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

  // Collapsible Election Result Card Component
  const ElectionResultCard = ({
    election,
    isExpanded,
    onToggle,
    onDeclare,
    onExport,
    resultData,
    isLoadingResults
  }) => {
    return (
      <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl overflow-hidden transition-all duration-300">
        {/* Card Header - Always Visible */}
        <div
          className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">


              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold text-white">{election.name}</h4>
                  {election.resultsDeclared && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      DECLARED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-blue-300 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{election.district}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Vote className="w-4 h-4" />
                    <span>{election.totalVotes || 0} Total Votes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expand/Collapse Icon */}
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-blue-800/30 p-6 space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center gap-3 pb-4 border-b border-blue-800/30">
              {!election.resultsDeclared ? (
                <button
                  onClick={() => onDeclare(election.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                >
                  <Award className="w-4 h-4" />
                  Declare Results to Public
                </button>
              ) : (
                <div className="px-4 py-2 bg-green-600/20 border border-green-500 text-green-300 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Results Publicly Declared
                </div>
              )}

              <button
                onClick={() => onExport(election.id)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            {/* Loading State */}
            {isLoadingResults && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Results Content */}
            {!isLoadingResults && resultData && (
              <>
                {/* Winner Announcement */}
                <div className="text-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <p className="text-yellow-400 uppercase text-sm font-semibold">Certified Winner</p>
                  </div>
                  <h2 className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-3">
                    <Crown className="w-8 h-8" />
                    {resultData.winner}
                  </h2>
                  <p className="text-blue-300 mt-2 text-sm">Election has been officially certified</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center border border-blue-800/30">
                    <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-xs text-blue-300 mb-1">Voter Turnout</p>
                    <p className="text-xl font-bold text-white">{resultData.turnout}%</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center border border-blue-800/30">
                    <Vote className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-blue-300 mb-1">Total Votes Cast</p>
                    <p className="text-xl font-bold text-white">{resultData.totalVotes.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center border border-blue-800/30">
                    <AlertCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-xs text-blue-300 mb-1">Margin of Victory</p>
                    <p className="text-xl font-bold text-white">{resultData.margin.toLocaleString()} Votes</p>
                  </div>
                </div>

                {/* Detailed Results Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Detailed Results Breakdown</h4>
                  <div className="space-y-3">
                    {resultData.candidates && resultData.candidates.length > 0 ? (
                      resultData.candidates.map((candidate, index) => (
                        <div key={candidate.id} className="bg-slate-800/50 p-4 rounded-lg border border-blue-800/30">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                  {candidate.name.charAt(0)}
                                </div>
                                {index === 0 && <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />}
                              </div>
                              <div>
                                <p className="font-bold text-white">{candidate.name}</p>
                                <p className="text-xs text-blue-300">{candidate.party}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white">{candidate.votes.toLocaleString()} Votes</p>
                              <p className="text-xs text-blue-300">{candidate.percentage}%</p>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
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
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Certified Election Results</h1>
        <p className="text-blue-300">View and declare election results to the public</p>
      </div>


      {/* Elections List */}
      <div className="space-y-4">
        {completedElections.map((election) => (
          <ElectionResultCard
            key={election.id}
            election={election}
            isExpanded={selectedElectionId === election.id}
            onToggle={() => setSelectedElectionId(
              selectedElectionId === election.id ? null : election.id
            )}
            onDeclare={handleDeclareResults}
            onExport={handleExportResults}
            resultData={selectedElectionId === election.id ? resultData : null}
            isLoadingResults={selectedElectionId === election.id && isLoadingResults}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsView;