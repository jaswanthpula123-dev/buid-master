import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import ProgressBar from '../../components/common/ProgressBar';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/projects?${params.toString()}`);
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, search]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  // Quick inline update for status
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await api.put(`/projects/${id}`, { status: newStatus });
      if (res.data.success) {
        setProjects(projects.map((p) => (p._id === id ? res.data.data : p)));
      }
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display text-navy-950">
            Building Projects Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update construction progress, change project stages, or manage building specifications.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
        >
          <Plus size={16} />
          <span>Add New Building Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Ongoing', 'Completed', 'Upcoming'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} Projects
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 p-8">
            <Building size={48} className="mx-auto text-slate-300 mb-3" />
            <h4 className="font-bold text-navy-950 text-lg">No Projects Found</h4>
            <p className="text-slate-500 text-xs mt-1">Click "Add New Building Project" above to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Project Info</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Progress %</th>
                  <th className="py-3.5 px-6">Floors / Units</th>
                  <th className="py-3.5 px-6">Available / Sold</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.coverImage}
                          alt={proj.title}
                          className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-navy-950 text-sm">{proj.title}</p>
                          <p className="text-slate-500 text-[11px] truncate max-w-xs">{proj.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={proj.status}
                        onChange={(e) => handleQuickStatusChange(proj._id, e.target.value)}
                        disabled={updatingId === proj._id}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : proj.status === 'Ongoing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                    </td>

                    {/* Construction Progress */}
                    <td className="py-4 px-6 min-w-[150px]">
                      {proj.status === 'Ongoing' ? (
                        <ProgressBar percentage={proj.progressPercentage || 0} size="sm" />
                      ) : proj.status === 'Completed' ? (
                        <span className="font-bold text-emerald-600">100% Completed</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Planned (0%)</span>
                      )}
                    </td>

                    {/* Floors & Units */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-navy-950 block">{proj.totalFloors} Storeys</span>
                      <span className="text-slate-500 text-[11px]">{proj.totalUnits} Units</span>
                    </td>

                    {/* Units Breakdown */}
                    <td className="py-4 px-6">
                      <span className="text-emerald-600 font-bold block">{proj.availableUnits} Available</span>
                      <span className="text-slate-500 text-[11px]">{proj.soldUnits} Sold</span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${proj._id || proj.slug}`}
                          target="_blank"
                          title="View on Public Site"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-950 hover:bg-slate-100"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <Link
                          to={`/admin/projects/edit/${proj._id}`}
                          title="Edit Project"
                          className="p-1.5 rounded-lg text-gold-600 hover:text-gold-700 hover:bg-gold-50"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(proj._id, proj.title)}
                          title="Delete Project"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
