import React from 'react';
import { BarChart2, PieChart, FileText, User, Verified, LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, tabName, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center w-full px-4 py-4 text-left transition-all duration-300 rounded-lg border ${
      activeTab === tabName
        ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
        : 'text-blue-200 border-transparent hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon className="w-6 h-6 mr-4" />
    <span className="font-bold uppercase tracking-wide text-sm">{label}</span>
  </button>
);

export default function Sidebar({ voter, activeTab, setActiveTab }) {
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('voterId');
    window.location.href = '/';
  };

  // Show loading state if voter data is not available
  if (!voter) {
    return (
      <aside className="w-80 bg-blue-900/20 border-r border-blue-700/30 p-6 hidden lg:flex flex-col">
        <div className="mb-8 bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-6 bg-white/10 rounded mb-1"></div>
            <div className="h-3 bg-white/10 rounded"></div>
          </div>
        </div>
        <nav className="space-y-2">
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-blue-900/20 border-r border-blue-700/30 p-6 hidden lg:flex flex-col">
      <div>
        <div className="mb-8 bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-3">
            <Verified className="w-5 h-5 text-green-400 mr-2" />
            <span className="font-bold text-green-400 uppercase text-sm">Voter Verified</span>
          </div>
          <div className="text-lg font-bold uppercase">
            {voter.name ? voter.name.split(' ')[0] : voter.fullName ? voter.fullName.split(' ')[0] : 'Voter'}
          </div>
          <div className="text-blue-300 text-sm truncate">ID: {voter.voterId || 'N/A'}</div>
        </div>
        <nav className="space-y-2">
          <NavItem icon={BarChart2} label="Voting Dashboard" tabName="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={PieChart} label="Election Results" tabName="results" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={FileText} label="Voting History" tabName="history" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={User} label="Voter Profile" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>
      <div className="mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full text-red-300 hover:text-white transition-colors p-4 bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 rounded-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-bold uppercase text-sm">Secure Logout</span>
        </button>
      </div>
    </aside>
  );
}