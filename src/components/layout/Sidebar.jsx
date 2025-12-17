import React from 'react';
import { LayoutDashboard, Users, Flag, UserCheck, BarChart3, LogOut, ShieldCheck } from 'lucide-react';

/**
 * Sidebar Component
 * Provides the main navigation for the admin dashboard. It is fixed to the left side.
 */
const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'voters', label: 'Voter', icon: Users },
    { id: 'elections', label: 'Election', icon: Flag },
    { id: 'candidates', label: 'Candidate', icon: UserCheck },
    { id: 'results', label: 'Election Results', icon: BarChart3 }
  ];

  return (
    <aside className="w-72 bg-slate-900/50 border-r border-blue-800/30 p-6 flex flex-col fixed left-0 top-0 bottom-0 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10">
        <ShieldCheck className="w-10 h-10 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SecureVote</h2>
          <p className="text-blue-400 text-xs">Admin Portal</p>
        </div>
      </div>
      
      <nav className="flex-grow space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 mb-1 ${
              activeView === item.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-blue-200 hover:bg-blue-900/30 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-4" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-blue-800/30 mt-auto">
        <button 
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
