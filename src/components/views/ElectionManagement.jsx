// FILE: src/components/views/ElectionManagement.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, BarChart3, Trash2 } from 'lucide-react';
import axios from '../../api/axios';
import ActionButton from '../ui/ActionButton';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import ResultsModal from '../ui/ResultsModal';
import TopBar from '../layout/TopBar';

const ElectionManagement = () => {
  const [elections, setElections] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'National',
    district: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [currentResults, setCurrentResults] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken'); // Add this
      const response = await axios.get('/admin/elections', {
        headers: { Authorization: `Bearer ${token}` } // Add headers
      });
      setElections(response.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
      alert('Failed to fetch elections. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/admin/elections', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Election created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchElections();
    } catch (error) {
      console.error('Error creating election:', error);
      alert(error.response?.data?.message || 'Failed to create election. Please try again.');
    }
  };

  const handleEdit = (election) => {
    setSelectedElection(election);
    setFormData({
      name: election.name || '',
      type: election.type || 'National',
      district: election.district || '',
      startDate: election.startDate ? election.startDate.split('T')[0] : '',
      endDate: election.endDate ? election.endDate.split('T')[0] : '',
      description: election.description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/admin/elections/${selectedElection.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Election updated successfully!');
      setIsEditModalOpen(false);
      setSelectedElection(null);
      resetForm();
      fetchElections();
    } catch (error) {
      console.error('Error updating election:', error);
      alert('Failed to update election. Please try again.');
    }
  };

  const handleDelete = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`/admin/elections/${electionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Election deleted successfully!');
        fetchElections();
      } catch (error) {
        console.error('Error deleting election:', error);
        alert('Failed to delete election. Please try again.');
      }
    }
  };

  const handleStopElection = async (electionId) => {
    if (!window.confirm("Are you sure you want to stop this election and finalize results? This cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      console.log('Stopping election:', electionId);

      const res = await axios.post(`/admin/elections/${electionId}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Stop response:', res.data);

      setSuccessMessage("Election stopped and results calculated!");
      setTimeout(() => setSuccessMessage(null), 3000);


      setTimeout(async () => {
        await fetchElections();
        console.log('Elections refreshed');
      }, 1000);

    } catch (err) {
      console.error("Error stopping election:", err);
      setErrorMessage(err.response?.data?.message || err.response?.data?.error || "Failed to stop election");
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (electionId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`/admin/elections/${electionId}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCurrentResults(res.data);
      setResultsModalOpen(true);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError(err.response?.data?.message || "Failed to fetch results");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'National',
      district: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {errorMessage}
        </div>
      )}

      <TopBar
        title="Election Management"
        subtitle="Create and manage election events"
      />

      <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl animate-fadeIn">
        <div className="p-6 border-b border-blue-800/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Election Management</h3>
            <p className="text-blue-300 text-sm">Create and manage election events</p>
          </div>
          <ActionButton
            icon={PlusCircle}
            label="Create Election"
            isPrimary
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-blue-300 uppercase text-sm border-b border-blue-800/30">
                <th className="p-4 text-left">Election</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Dates</th>
                <th className="p-4 text-left">Candidates</th>
                <th className="p-4 text-left">Votes</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.length > 0 ? (
                elections.map(election => (
                  <tr key={election.id} className="border-b border-blue-800/30 hover:bg-blue-900/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-white">{election.name}</p>
                        <p className="text-blue-300 text-sm">{election.district}</p>
                      </div>
                    </td>
                    <td className="p-4 text-blue-200">{election.type}</td>
                    <td className="p-4 text-blue-200 text-sm">
                      <p>Start: {election.startDate ? new Date(election.startDate).toLocaleDateString() : 'N/A'}</p>
                      <p>End: {election.endDate ? new Date(election.endDate).toLocaleDateString() : 'N/A'}</p>
                    </td>
                    <td className="p-4 text-blue-200">{election.candidateCount || 0}</td>
                    <td className="p-4 text-blue-200">{election.totalVotes?.toLocaleString() || 0}</td>
                    <td className="p-4"><StatusBadge status={election.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Show Stop button only for Active elections */}
                        {election.status === 'Active' && (
                          <button
                            onClick={() => handleStopElection(election.id)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm rounded-lg font-semibold transition-colors"
                          >
                            Stop Election
                          </button>
                        )}

                        {/* Show Results button only for Completed elections */}
                        {election.status === 'Completed' && (
                          <button
                            onClick={() => handleViewResults(election.id)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-sm rounded-lg font-semibold transition-colors"
                          >
                            View Results
                          </button>
                        )}

                        <ActionButton
                          icon={Edit}
                          variant="icon"
                          className="hover:bg-blue-400/10"
                          onClick={() => handleEdit(election)}
                        />
                        <ActionButton
                          icon={Trash2}
                          variant="icon"
                          className="text-red-400 hover:bg-red-400/10"
                          onClick={() => handleDelete(election.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-blue-300">
                    No elections found. Create your first election to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Election Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Election" size="lg">
        <form onSubmit={handleCreateElection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm mb-2">Election Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">Election Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Lok Sabha</option>
                <option>Vidhan Sabha</option>
                <option>Municipal</option>
                <option>Referendum</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none h-24 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Election
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Election Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Election" size="lg">
        <form onSubmit={handleUpdateElection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm mb-2">Election Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">Election Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>National</option>
                <option>Municipal</option>
                <option>Referendum</option>
                <option>Gubernatorial</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none h-24 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Election
            </button>
          </div>
        </form>
      </Modal>

      {/* Results Modal */}
      <ResultsModal
        isOpen={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        results={currentResults}
      />
    </>
  );
};

export default ElectionManagement;