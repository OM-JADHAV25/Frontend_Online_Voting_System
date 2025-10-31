// FILE: src/components/views/VoterManagement.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, CheckCircle, Edit, Trash2, X } from 'lucide-react';
import axios from '../../api/axios';
import ActionButton from '../ui/ActionButton';
import ConfirmationModal from '../ui/ConfirmationModal';
import StatusBadge from '../ui/StatusBadge';
import Modal from '../ui/Modal';
import TopBar from '../layout/TopBar';

const VoterManagement = () => {
  const [voters, setVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    address: '',
    voterId: ''
  });

  useEffect(() => {
    fetchVoters();
  }, [statusFilter]);

  const fetchVoters = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken'); // Add this
      const url = statusFilter === 'All'
        ? '/admin/voters'
        : `/admin/voters?status=${statusFilter}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` } // Add headers
      });
      setVoters(response.data);
    } catch (error) {
      console.error('Error fetching voters:', error);
      alert('Failed to fetch voters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVoters = voters.filter(voter => {
    if (!searchTerm) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      voter.voterId?.toLowerCase().includes(lowerSearchTerm) ||
      voter.name?.toLowerCase().includes(lowerSearchTerm) ||
      voter.email?.toLowerCase().includes(lowerSearchTerm)
    );
  });

  const handleApprove = async (voter) => {
    try {
      await axios.put(`/admin/voters/${voter.id}/approve`);
      alert(`Approved voter: ${voter.name}`);
      fetchVoters();
    } catch (error) {
      console.error('Error approving voter:', error);
      alert('Failed to approve voter. Please try again.');
    }
  };

  const handleDelete = (voter) => {
    setSelectedVoter(voter);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/voters/${selectedVoter.id}`);
      alert(`Deleted voter: ${selectedVoter.name}`);
      setIsDeleteModalOpen(false);
      setSelectedVoter(null);
      fetchVoters();
    } catch (error) {
      console.error('Error deleting voter:', error);
      alert('Failed to delete voter. Please try again.');
    }
  };

  const handleEdit = (voter) => {
    setSelectedVoter(voter);
    setFormData({
      name: voter.name || '',
      email: voter.email || '',
      dateOfBirth: voter.dateOfBirth || '',
      address: voter.address || '',
      voterId: voter.voterId || ''
    });
    setIsEditModalOpen(true);
  };

  const handleAddVoter = () => {
    setFormData({
      name: '',
      email: '',
      dateOfBirth: '',
      address: '',
      voterId: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/voters', formData);
      alert('Voter added successfully!');
      setIsAddModalOpen(false);
      fetchVoters();
    } catch (error) {
      console.error('Error adding voter:', error);
      alert(error.response?.data?.message || 'Failed to add voter. Please try again.');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/voters/${selectedVoter.id}`, formData);
      alert('Voter updated successfully!');
      setIsEditModalOpen(false);
      setSelectedVoter(null);
      fetchVoters();
    } catch (error) {
      console.error('Error updating voter:', error);
      alert('Failed to update voter. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      <TopBar
        title="Voter Management"
        subtitle="Manage registered voters"
      />

      <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl animate-fadeIn">
        <div className="p-6 border-b border-blue-800/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Voter Management</h3>
            <p className="text-blue-300 text-sm">Manage voter registrations and approvals</p>
          </div>
        </div>

        <div className="p-6 border-b border-blue-800/30">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search by Voter ID, Name, or Email..."
                  className="w-full bg-slate-800 border border-blue-700/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-3 text-white outline-none"
            >
              <option value="All">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-blue-300 uppercase text-sm border-b border-blue-800/30">
                <th className="p-4 text-left">Voter</th>
                <th className="p-4 text-left">Registration Date</th>
                <th className="p-4 text-left">Last Voted</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.length > 0 ? (
                filteredVoters.map(voter => (
                  <tr key={voter.id} className="border-b border-blue-800/30 hover:bg-blue-900/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-white">{voter.name}</p>
                        <p className="text-blue-300 text-sm">{voter.email}</p>
                        <p className="font-mono text-blue-400 text-xs">{voter.voterId}</p>
                      </div>
                    </td>
                    <td className="p-4 text-blue-200">
                      {voter.registrationDate ? new Date(voter.registrationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-blue-200">
                      {voter.lastVoted ? new Date(voter.lastVoted).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4"><StatusBadge status={voter.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {voter.status === 'Pending' && (
                          <ActionButton
                            icon={CheckCircle}
                            variant="icon"
                            className="text-green-400 hover:bg-green-400/10"
                            onClick={() => handleApprove(voter)}
                          />
                        )}
                      
                        <ActionButton
                          icon={Trash2}
                          variant="icon"
                          className="text-red-400 hover:bg-red-400/10"
                          onClick={() => handleDelete(voter)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-blue-300">
                    No voters found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Voter Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Voter">
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <div>
            <label className="block text-blue-300 text-sm mb-2">Full Name</label>
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
            <label className="block text-blue-300 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Voter
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Voter Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Voter">
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div>
            <label className="block text-blue-300 text-sm mb-2">Full Name</label>
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
            <label className="block text-blue-300 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
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
              Update Voter
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Voter"
        message={`Are you sure you want to delete ${selectedVoter?.name}? This action cannot be undone.`}
      />
    </>
  );
};

export default VoterManagement;