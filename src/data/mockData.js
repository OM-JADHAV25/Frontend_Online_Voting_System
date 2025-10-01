// ===================================================================================
// FILE: src/data/mockData.js
// Mock data for the online voting system
// ===================================================================================

export const mockStats = {
  totalVoters: 125864,
  votesCast: 89432,
  activeElections: 3,
  pendingVoters: 16,
  turnoutRate: 71.2,
  systemHealth: 'Optimal'
};

export const mockVoters = [
  { id: 'VOTER-001', name: 'Amelia Chen', email: 'amelia.c@example.com', status: 'Verified', registrationDate: '2025-01-15', lastVoted: '2025-10-05' },
  { id: 'VOTER-002', name: 'Ben Carter', email: 'ben.carter@example.com', status: 'Verified', registrationDate: '2025-01-18', lastVoted: '2025-10-05' },
  { id: 'VOTER-003', name: 'Chloe Davis', email: 'chloe.d@example.com', status: 'Pending', registrationDate: '2025-10-01', lastVoted: null },
  { id: 'VOTER-004', name: 'David Evans', email: 'david.e@example.com', status: 'Blocked', registrationDate: '2025-01-20', lastVoted: null },
  { id: 'VOTER-005', name: 'Emily Foster', email: 'emily.f@example.com', status: 'Verified', registrationDate: '2025-02-10', lastVoted: '2025-10-05' },
  { id: 'VOTER-006', name: 'Michael Rodriguez', email: 'michael.r@example.com', status: 'Pending', registrationDate: '2025-10-02', lastVoted: null },
];

export const mockElections = [
  { id: 'ELEC-2025-MUN', name: 'Municipal General Election 2025', status: 'Active', startDate: '2025-10-01', endDate: '2025-10-07', votes: 45210, candidates: 8, type: 'Municipal', district: 'All Districts' },
  { id: 'ELEC-2025-NAT', name: 'National Assembly Election 2025', status: 'Active', startDate: '2025-11-05', endDate: '2025-11-12', votes: 12567, candidates: 12, type: 'National', district: 'Federal' },
  { id: 'ELEC-2026-REF', name: 'State Referendum on Prop 12', status: 'Scheduled', startDate: '2026-02-10', endDate: '2026-02-11', votes: 0, candidates: 0, type: 'Referendum', district: 'Statewide' },
  { id: 'ELEC-2024-GOV', name: 'Gubernatorial Election 2024', status: 'Completed', startDate: '2024-11-05', endDate: '2024-11-05', votes: 102589, candidates: 4, type: 'Gubernatorial', district: 'Statewide' },
];

export const mockCandidates = [
  { id: 'CAND-01', name: 'Marcus Thorne', electionId: 'ELEC-2024-GOV', party: 'Progressive Alliance', photo: 'https://i.pravatar.cc/150?u=marcus', votes: 50523, status: 'Approved' },
  { id: 'CAND-02', name: 'Helena Vance', electionId: 'ELEC-2024-GOV', party: 'Civic Union', photo: 'https://i.pravatar.cc/150?u=helena', votes: 52066, status: 'Approved' },
  { id: 'CAND-03', name: 'Julian Croft', electionId: 'ELEC-2025-NAT', party: 'Federalist Party', photo: 'https://i.pravatar.cc/150?u=julian', votes: 6321, status: 'Approved' },
  { id: 'CAND-04', name: 'Isabelle Reed', electionId: 'ELEC-2025-NAT', party: 'National Unity', photo: 'https://i.pravatar.cc/150?u=isabelle', votes: 6246, status: 'Approved' },
  { id: 'CAND-05', name: 'Robert Kim', electionId: 'ELEC-2025-MUN', party: 'Green Future', photo: 'https://i.pravatar.cc/150?u=robert', votes: 21540, status: 'Approved' },
  { id: 'CAND-06', name: 'Sarah Johnson', electionId: 'ELEC-2025-MUN', party: 'Urban Development', photo: 'https://i.pravatar.cc/150?u=sarah', votes: 23670, status: 'Approved' },
];

export const mockResults = {
  'ELEC-2024-GOV': {
    turnout: 81.5,
    totalVotes: 102589,
    winner: 'Helena Vance',
    margin: 1543,
    certificationStatus: 'Certified',
    candidates: [
      { ...mockCandidates[1], votes: 52066, percentage: 50.75 },
      { ...mockCandidates[0], votes: 50523, percentage: 49.25 },
    ]
  }
};

export const mockSystemAlerts = [
  { id: 1, type: 'info', message: 'System backup completed successfully', time: '2 hours ago' },
  { id: 2, type: 'warning', message: 'Unusual login attempt detected', time: '5 hours ago' },
  { id: 3, type: 'success', message: 'New election created: Municipal Election 2025', time: '1 day ago' },
];
