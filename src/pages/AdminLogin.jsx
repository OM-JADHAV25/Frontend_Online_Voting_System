// FILE: src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { ShieldCheck, User, Lock } from 'lucide-react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminId || !password) {
      setError('Admin ID and Password are required.');
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Changed 'id' to 'adminId' to match backend
      const response = await axios.post('/admin/login', {
        adminId: adminId,  // ✅ CORRECT FIELD NAME
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Login response:', response.data);

      // ✅ FIXED: Check for token directly instead of response.data.success
      if (response.data.token) {
        // Store admin token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('role', 'admin');

        // Store admin data if available
        if (response.data.admin) {
          localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        }

        // Set default Authorization header for future admin requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        console.log('Admin login successful, redirecting...');
        
        // Redirect to admin dashboard
        navigate('/admin-dashboard');
      } else {
        setError(response.data.message || "Login failed - No token received");
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || err.response.data || 'Login failed. Check credentials.');
      } else if (err.request) {
        setError('Unable to connect to server. Please check if backend is running.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans p-4">
      {/* Background Gradient Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-4000 { animation-delay: -4s; }
      `}</style>

      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg border border-blue-800/30 rounded-2xl shadow-2xl shadow-blue-500/10 p-8 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-blue-300 mt-2 text-sm">For authorized election officials only</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="space-y-6">
            {/* Admin ID Input */}
            <div>
              <label className="text-sm font-medium text-blue-200 block mb-2" htmlFor="adminId">
                Admin ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  id="adminId"
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter your admin ID"
                  className="w-full bg-slate-900/50 border border-blue-700/50 rounded-lg pl-11 pr-4 py-3 text-white placeholder-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm font-medium text-blue-200 block mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900/50 border border-blue-700/50 rounded-lg pl-11 pr-4 py-3 text-white placeholder-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-center text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            © 2025 National Election Commission. All rights reserved.
            <br />
            Access is monitored for security purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;