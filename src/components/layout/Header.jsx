import React, { useState } from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';
import { mockSystemAlerts, mockStats } from '../../data/mockData';

/**
 * Header Component
 * Displays the current page title, notifications, and user profile information.
 */
const Header = ({ title }) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const alerts = mockSystemAlerts;

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-blue-300 mt-1">Welcome back, Admin. Here's your system overview.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="text-blue-300 hover:text-white transition-colors relative"
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
          
          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-blue-800/50 rounded-xl shadow-2xl z-10 animate-scaleIn">
              <div className="p-4 border-b border-blue-800/50">
                <h4 className="font-semibold text-white">System Alerts</h4>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-4 border-b border-blue-800/30 hover:bg-blue-900/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'warning' ? 'bg-yellow-400' :
                        alert.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{alert.message}</p>
                        <p className="text-blue-300 text-xs mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2 border border-blue-800/30">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-slate-700 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Admin User</p>
            <p className="text-xs text-blue-300">System Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;