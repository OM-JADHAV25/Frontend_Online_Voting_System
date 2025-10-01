// FILE: src/components/views/ElectionManagement.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, Eye, Edit, BarChart3, Trash2 } from 'lucide-react';
import axios from '../../api/axios';
import ActionButton from '../ui/ActionButton';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';

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
      await axios.post('/admin/elections', formData);
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
      await axios.put(`/admin/elections/${selectedElection.id}`, formData);
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
        await axios.delete(`/admin/elections/${electionId}`);
        alert('Election deleted successfully!');
        fetchElections();
      } catch (error) {
        console.error('Error deleting election:', error);
        alert('Failed to delete election. Please try again.');
      }
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
                        <ActionButton icon={Eye} variant="icon" className="hover:bg-blue-400/10" />
                        <ActionButton
                          icon={Edit}
                          variant="icon"
                          className="hover:bg-blue-400/10"
                          onClick={() => handleEdit(election)}
                        />
                        <ActionButton icon={BarChart3} variant="icon" className="hover:bg-green-400/10" />
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
    </>
  );
};

export default ElectionManagement;