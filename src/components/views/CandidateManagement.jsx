import React, { useState, useEffect } from "react";
import { UserPlus, Edit, Trash2, AlertCircle } from "lucide-react";
import axios from "../../api/axios";
import ActionButton from "../ui/ActionButton";
import Modal from "../ui/Modal";
import StatusBadge from "../ui/StatusBadge";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import TopBar from "../layout/TopBar";

const CandidateManagement = () => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  // --------------------------
  // Fetch Elections
  // --------------------------
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const res = await axios.get("/admin/elections", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setElections(res.data);
        if (res.data.length > 0) {
          setSelectedElection(res.data[0].id);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load elections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  // --------------------------
  // Fetch Candidates by Election
  // --------------------------
  useEffect(() => {
    if (!selectedElection) return;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`/admin/candidates?electionId=${selectedElection}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCandidates(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError("Failed to load candidates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedElection]);


  // Helper function to convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error("Image size must be less than 2MB"));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        reject(new Error("Please upload an image file"));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };



  // --------------------------
  // Add Candidate Handler
  // --------------------------
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Get the uploaded file
    const photoFile = form.photo.files[0];
    let photoBase64 = null;

    // If file is uploaded, convert to base64
    if (photoFile) {
      try {
        photoBase64 = await convertToBase64(photoFile);
      } catch (error) {
        console.error("Error converting image:", error);
        setError(error.message || "Failed to process image. Please try again.");
        setTimeout(() => setError(null), 5000);
        return;
      }
    }

    const newCandidate = {
      name: form.name.value.trim(),
      party: form.party.value.trim(),
      electionId: parseInt(form.election.value),
      photo: photoBase64 || null, // Send null if no image uploaded (NOT defaultAvatar)
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.post("/admin/candidates", newCandidate, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.electionId === selectedElection) {
        setCandidates([...candidates, res.data]);
      }

      setSuccess("Candidate added successfully!");
      setIsAddModalOpen(false);
      setImagePreview(null);
      form.reset();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding candidate:", err);
      setError(err.response?.data?.message || "Failed to add candidate. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Edit Candidate Handler
  // --------------------------
  const handleEditCandidate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedCandidate = {
      name: form.name.value.trim(),
      party: form.party.value.trim(),
      electionId: parseInt(form.election.value),
      photo: form.photo.value.trim() || editingCandidate.photo,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`/admin/candidates/${editingCandidate.id}`, updatedCandidate, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update candidates list
      setCandidates(candidates.map(c => c.id === editingCandidate.id ? res.data : c));

      setSuccess("Candidate updated successfully!");
      setIsEditModalOpen(false);
      setEditingCandidate(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating candidate:", err);
      setError(err.response?.data?.message || "Failed to update candidate. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Delete Candidate Handler
  // --------------------------
  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/admin/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });


      // Remove from UI
      setCandidates(candidates.filter(c => c.id !== candidateId));

      setSuccess("Candidate deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting candidate:", err);
      setError(err.response?.data?.message || "Failed to delete candidate. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Open Edit Modal
  // --------------------------
  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const selectedElectionData = elections.find(
    (e) => e.id === selectedElection
  );

  return (
    <>
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 bg-green-900/50 border border-green-700 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-green-400" size={20} />
          <span className="text-green-200">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      <TopBar
        title="Candidate Management"
        subtitle="Manage candidates for elections"
      />

      <div className="bg-slate-900/50 border border-blue-800/30 rounded-xl animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-blue-800/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Candidate Management</h3>
              <p className="text-blue-300 text-sm">Manage candidates for elections</p>
            </div>
            {elections.length > 0 && (
              <select
                value={selectedElection || ""}
                onChange={(e) => setSelectedElection(parseInt(e.target.value))}
                className="bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none"
                disabled={loading}
              >
                {elections.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <ActionButton
            icon={UserPlus}
            label="Add Candidate"
            isPrimary
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading || elections.length === 0}
          />
        </div>

        {/* Election Info */}
        {selectedElectionData && (
          <div className="p-6 border-b border-blue-800/30">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                {selectedElectionData.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-300">Status:</span>{" "}
                  <StatusBadge status={selectedElectionData.status} />
                </div>
                <div>
                  <span className="text-blue-300">Candidates:</span>
                  <span className="text-white ml-2">{candidates.length}</span>
                </div>
                <div>
                  <span className="text-blue-300">Total Votes:</span>
                  <span className="text-white ml-2">
                    {selectedElectionData?.totalVotes?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="whitespace-nowrap">
                  <span className="text-blue-300">Period:</span>
                  <span className="text-white ml-2">
                    {selectedElectionData?.startDate} to{" "}
                    {selectedElectionData?.endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && candidates.length === 0 && (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-300">Loading candidates...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && candidates.length === 0 && (
          <div className="p-12 text-center">
            <UserPlus className="mx-auto text-blue-500 mb-4" size={48} />
            <p className="text-blue-300 text-lg mb-2">No candidates yet</p>
            <p className="text-blue-400 text-sm">Add your first candidate to get started</p>
          </div>
        )}

        {/* Candidate Table */}
        {!loading && candidates.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-blue-300 uppercase text-sm border-b border-blue-800/30">
                  <th className="p-4 text-left">Candidate</th>
                  <th className="p-4 text-left">Party</th>
                  <th className="p-4 text-left">Votes</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-blue-800/30 hover:bg-blue-900/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.photo || defaultAvatar}
                          alt={candidate.name}
                          className="w-10 h-10 rounded-full border-2 border-blue-600 object-cover"
                          onError={(e) => {
                            e.target.src = defaultAvatar; // Use local default instead
                            e.target.onerror = null; // Prevent infinite loop
                          }}
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {candidate.name}
                          </p>
                          <p className="text-blue-300 text-sm">ID: {candidate.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-blue-200">{candidate.party}</td>
                    <td className="p-4 text-blue-200">
                      {candidate.votes?.toLocaleString() || "0"}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={candidate.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          icon={Edit}
                          variant="icon"
                          className="hover:bg-blue-400/10"
                          onClick={() => openEditModal(candidate)}
                          disabled={loading}
                        />
                        <ActionButton
                          icon={Trash2}
                          variant="icon"
                          className="text-red-400 hover:bg-red-400/10"
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          disabled={loading}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setImagePreview(null);  // ← ADD THIS
        }}
        title="Add New Candidate"
      >
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter candidate name"
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">Party *</label>
              <input
                type="text"
                name="party"
                required
                placeholder="Enter party name"
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-blue-300 text-sm mb-2">Election *</label>
            <select
              name="election"
              required
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {elections.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-blue-300 text-sm mb-2">Candidate Photo</label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
            )}

            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
              className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <p className="text-blue-400 text-xs mt-1">
              Upload image (max 2MB) or leave blank for default avatar
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setImagePreview(null);  // ← ADD THIS
              }}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Candidate"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCandidate(null);
        }}
        title="Edit Candidate"
      >
        {editingCandidate && (
          <form onSubmit={handleEditCandidate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-300 text-sm mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCandidate.name}
                  className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-blue-300 text-sm mb-2">Party *</label>
                <input
                  type="text"
                  name="party"
                  required
                  defaultValue={editingCandidate.party}
                  className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">Election *</label>
              <select
                name="election"
                required
                defaultValue={editingCandidate.electionId}
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {elections.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-blue-300 text-sm mb-2">Photo URL</label>
              <input
                type="url"
                name="photo"
                defaultValue={editingCandidate.photo}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-slate-800 border border-blue-700/50 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCandidate(null);
                }}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Candidate"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default CandidateManagement;