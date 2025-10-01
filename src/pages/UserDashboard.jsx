import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, Calendar, Award } from 'lucide-react';
import axios from '../api/axios';

// Component Imports
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ElectionCard from '../components/ElectionCard';
import ResultsCard from '../components/ResultsCard';
import ProfileSection from '../components/ProfileSection';
import VoteConfirmationModal from '../components/VoteConfirmationModal';
import Toast from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';

// Local component for history records
const VotingHistoryRecord = ({ record }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
    <div>
      <div className="font-bold text-white uppercase">{record.election}</div>
      <div className="text-blue-300 text-sm mt-1">
        {new Date(record.date).toLocaleDateString()} • {record.type} • REF: {record.reference}
      </div>
    </div>
    <div className="flex items-center bg-green-500/20 text-green-400 px-3 py-2 rounded-full text-sm font-bold uppercase shrink-0 ml-4">
      <CheckCircle className="w-4 h-4 mr-2" />{record.status}
    </div>
  </div>
);

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [voter, setVoter] = useState(null);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch voter data from backend
  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        const voterId = localStorage.getItem('voterId');
        const token = localStorage.getItem('token');

        if (!voterId || !token) {
          window.location.href = "/"; // redirect to login if not logged in
          return;
        }

        console.log('Fetching voter data for:', voterId);
        
        const res = await axios.get(`/voters/${voterId}`, {
          headers: { Authorization: `Bearer ${token}` } // attach JWT
        });
        
        console.log('Voter data received:', res.data);
        setVoter(res.data);
      } catch (error) {
        console.error('Error fetching voter data:', error);
        setError('Failed to load voter data');
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Token might be invalid, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('voterId');
          window.location.href = "/";
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchElections = async () => {
      try {
        const res = await axios.get('/elections');
        setElections(res.data);
      } catch (error) {
        console.error('Error fetching elections:', error);
        // Don't redirect for election fetch errors, just show empty state
      }
    };

    fetchVoterData();
    fetchElections();
  }, []);

  const handleVoteClick = (election) => {
    if (election.status === 'ongoing' && !voter?.hasVoted) {
      setSelectedElection(election);
    }
  };

  const confirmVote = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/votes/cast?electionId=${selectedElection.id}&candidateId=${selectedElection.selectedCandidateId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVoter({ ...voter, hasVoted: true });
      setElections(elections.map(e =>
        e.id === selectedElection.id ? { ...e, votedSoFar: e.votedSoFar + 1 } : e
      ));
      setSelectedElection(null);
      setToastMessage('Your vote has been securely cast!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (error) {
      console.error('Error casting vote:', error);
      setToastMessage('Error: Could not cast vote.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  // Memoize filtered elections
  const completedElections = useMemo(() => elections.filter(e => e.status === 'completed'), [elections]);
  const currentElections = useMemo(() => elections.filter(e => e.status !== 'completed'), [elections]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-white text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded mx-auto w-64"></div>
            <div className="h-4 bg-white/10 rounded mx-auto w-48"></div>
            <div className="h-32 bg-white/10 rounded"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!voter) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Voter Data Unavailable</h3>
          <p className="text-blue-300">Unable to load voter information.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'results':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Certified Election Results</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {completedElections.length > 0 ? (
                completedElections.map(election => <ResultsCard key={election.id} election={election} />)
              ) : (
                <EmptyState message="No certified election results are available." icon={Award} />
              )}
            </div>
          </div>
        );
      case 'profile':
        return <ProfileSection voter={voter} />;
      case 'history':
        return (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Complete Voting History</h3>
            <div className="space-y-4">
              {voter.votingHistory && voter.votingHistory.length > 0 ? (
                voter.votingHistory.map(record => <VotingHistoryRecord key={record.reference} record={record} />)
              ) : (
                <p className="text-center text-blue-300 py-4">No past voting records found.</p>
              )}
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Voter Information Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                      <span className="text-blue-300 font-semibold">Voter ID</span>
                      <span className="font-mono font-bold">{voter.voterId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                      <span className="text-blue-300 font-semibold">Status</span>
                      <span className="font-bold text-green-400 uppercase">{voter.status || 'ACTIVE'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                      <span className="text-blue-300 font-semibold">Constituency</span>
                      <span className="font-bold text-right uppercase">{voter.constituency || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                      <span className="text-blue-300 font-semibold">Registered</span>
                      <span className="font-bold">
                        {voter.registrationDate ? new Date(voter.registrationDate).getFullYear() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-6 text-center border-2 flex flex-col justify-center ${voter.hasVoted ? 'bg-green-500/10 border-green-500/50' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
                {voter.hasVoted ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="font-bold text-2xl uppercase mb-2">Vote Cast</p>
                    <p className="text-green-200 text-sm">Thank you for your participation</p>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="font-bold text-2xl uppercase mb-2">Ready to Vote</p>
                    <p className="text-yellow-200 text-sm">An election is awaiting your vote</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Current Elections</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {currentElections.length > 0 ? (
                  currentElections.map(election => (
                    <ElectionCard key={election.id} election={election} onVote={handleVoteClick} voterStatus={voter} />
                  ))
                ) : (
                  <EmptyState message="There are no active or upcoming elections." icon={Calendar} />
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading SecureVote Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar voter={voter} activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 lg:p-8">
            <div className="bg-blue-900/50 border border-blue-700/30 rounded-lg p-4 mb-6 flex items-center">
              <ShieldCheck className="w-6 h-6 text-blue-400 mr-3 shrink-0" />
              <div>
                <h4 className="font-bold text-white uppercase text-sm">Security Notice</h4>
                <p className="text-blue-200 text-sm">Your voting session is protected by government-grade encryption. All votes are anonymous and secure.</p>
              </div>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>

      {selectedElection && (
        <VoteConfirmationModal
          election={selectedElection}
          onClose={() => setSelectedElection(null)}
          onConfirm={confirmVote}
        />
      )}
      <Toast message={toastMessage} />
    </div>
  );
}