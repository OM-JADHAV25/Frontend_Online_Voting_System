// FILE: src/components/views/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { Users, Vote, Flag, UserCheck, Eye } from 'lucide-react';
import axios from '../../api/axios';
import StatCard from '../ui/StatCard';
import ActionButton from '../ui/ActionButton';
import StatusBadge from '../ui/StatusBadge';
import TopBar from '../layout/TopBar';

const DashboardOverview = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalVoters: 0,
    votesCast: 0,
    activeElections: 0,
    pendingVoters: 0,
    turnoutRate: 0
  });
  const [activeElections, setActiveElections] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');

      // Fetch all dashboard data in parallel
      const [statsRes, electionsRes, activityRes] = await Promise.all([
        axios.get('/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` } // Add headers
        }),
        axios.get('/admin/elections?status=Active', {
          headers: { Authorization: `Bearer ${token}` } // Add headers
        }),
        axios.get('/admin/dashboard/recent-activity', {
          headers: { Authorization: `Bearer ${token}` } // Add headers
        })
      ]);

      setStats(statsRes.data);
      setActiveElections(electionsRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <TopBar
        title="Dashboard Overview"
        subtitle="Monitor system activity and statistics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Voters"
          value={stats.totalVoters.toLocaleString()}
          onClick={() => onNavigate('voters')}
        />
        <StatCard
          icon={Vote}
          title="Votes Cast"
          value={stats.votesCast.toLocaleString()}
          trend={`+${stats.weeklyGrowth || 0}% this week`}
          onClick={() => onNavigate('results')}
        />
        <StatCard
          icon={Flag}
          title="Active Elections"
          value={stats.activeElections}
          onClick={() => onNavigate('elections')}
        />
        <StatCard
          icon={UserCheck}
          title="Pending Approvals"
          value={stats.pendingVoters}
          isPriority
          onClick={() => onNavigate('voters')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-blue-800/30 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Elections</h3>
            <ActionButton
              icon={Eye}
              label="View All"
              variant="small"
              onClick={() => onNavigate('elections')}
            />
          </div>
          <div className="space-y-4">
            {activeElections.length > 0 ? (
              activeElections.map(election => (
                <div key={election.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-blue-800/30">
                  <div>
                    <h4 className="font-semibold text-white">{election.name}</h4>
                    <p className="text-sm text-blue-300">{election.district} • {election.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={election.status} />
                    <div className="text-right">
                      <p className="text-white font-semibold">{election.totalVotes?.toLocaleString() || 0} votes</p>
                      <p className="text-xs text-blue-300">Ends {new Date(election.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-blue-300 text-center py-8">No active elections at the moment</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">System Health</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300">Status</span>
              <StatusBadge status="Active" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300">Voter Turnout</span>
              <span className="text-green-400 font-semibold">{stats.turnoutRate}%</span>
            </div>
            <div className="mt-4 bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                style={{ width: `${stats.turnoutRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-slate-800/30 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.description}</p>
                      <p className="text-blue-300 text-xs">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-blue-300 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;