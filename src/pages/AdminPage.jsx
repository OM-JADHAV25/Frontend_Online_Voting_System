// FILE: src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // your axios instance pointing to Spring Boot backend

// Layout
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

// Views
import DashboardOverview from '../components/views/DashboardOverview';
import VoterManagement from '../components/views/VoterManagement';
import ElectionManagement from '../components/views/ElectionManagement';
import CandidateManagement from '../components/views/CandidateManagement';
import ResultsView from '../components/views/ResultsView';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const viewTitles = {
    dashboard: 'Dashboard Overview',
    voters: 'Voter Management',
    elections: 'Election Management',
    candidates: 'Candidate Management',
    results: 'Certified Election Results',
  };

  const renderContent = () => {
    switch (activeView) {
      case 'voters': return <VoterManagement />;
      case 'elections': return <ElectionManagement />;
      case 'candidates': return <CandidateManagement />;
      case 'results': return <ResultsView />;
      case 'dashboard':
      default: return <DashboardOverview onNavigate={setActiveView} />;
    }
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
       console.log('Admin token from localStorage:', token);
    
    if (!token) {
      console.log('No admin token found, redirecting to login');
      navigate('/admin');
      return;
    }

      try {
       console.log('Verifying admin token...');
      
      // Set the token as default header FIRST
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('📨 Authorization header set for all requests:', axios.defaults.headers.common['Authorization']);

      const response = await axios.get('/admin/verify-token');
      console.log('Token verification successful:', response.data);
      
      setAdminData(response.data);
      setIsLoading(false); // Set loading to false after successful verification
      } catch (err) {
        console.error('Admin verification failed:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('role');
      navigate('/admin');; // Navigate to admin login page
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Admin logging out');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');

    // Clear axios default authorization header
    delete axios.defaults.headers.common['Authorization'];

    navigate('/admin'); // Navigate to admin login page
  };

  // Show loading screen while verifying token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
      <main className="flex-1 p-8 ml-72">
        <Header
          title={viewTitles[activeView]}
          adminName={adminData ? adminData.name : 'Admin'}
          onLogout={handleLogout}
        />
        {renderContent()}
      </main>
    </div>
  );
}