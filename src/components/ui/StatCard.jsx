import React from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * StatCard Component
 * A card for displaying key performance indicators (KPIs) on the dashboard.
 */
const StatCard = ({ icon: Icon, title, value, trend, isPriority = false, onClick }) => (
  <div
    className="bg-slate-900/50 border border-blue-800/30 rounded-xl p-6 hover:border-blue-600/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-blue-300 font-medium text-sm uppercase tracking-wide">{title}</h4>
      <Icon className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
    </div>
    <p className="text-3xl font-bold text-white mb-2">{value}</p>
    <div className="flex items-center justify-between">
      <p className={`text-sm ${isPriority ? 'text-yellow-400' : 'text-green-400'}`}>
        {isPriority ? 'Action Required' : trend || 'System Normal'}
      </p>
      {trend && <TrendingUp className="w-4 h-4 text-green-400" />}
    </div>
  </div>
);

export default StatCard;
