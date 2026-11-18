import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Bed,
  Bath,
  Square,
} from 'lucide-react';
import api from '../../services/api';
import { formatINR } from '../../utils/formatCurrency';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/properties?${params.toString()}`);
      if (res.data.success) {
        setProperties(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, search]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete property "${title}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/properties/${id}`);
      if (res.data.success) {
        setProperties(properties.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete property.');
    }
  };

  const handleQuickStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await api.patch(`/properties/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setProperties(properties.map((p) => (p._id === id ? res.data.data : p)));
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
            Property Listings Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update availability (Available, Booked, Sold), pricing, and specifications for flats and villas.
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
        >
          <Plus size={16} />
          <span>Add New Property Listing</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Available', 'Booked', 'Sold'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 p-8">
            <Home size={48} className="mx-auto text-slate-300 mb-3" />
            <h4 className="font-bold text-navy-950 text-lg">No Properties Found</h4>
            <p className="text-slate-500 text-xs mt-1">Click "Add New Property Listing" to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Property Title</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Specs</th>
                  <th className="py-3.5 px-6">Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.coverImage}
                          alt={prop.title}
                          className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-navy-950 text-sm">{prop.title}</p>
                          <p className="text-slate-500 text-[11px] truncate max-w-xs">{prop.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-semibold">
                        {prop.type}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-extrabold text-gold-600 text-sm">
                      {prop.priceDisplay?.includes('₹') ? prop.priceDisplay : formatINR(prop.price)}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-700 block">
                        {prop.bedrooms} BHK • {prop.bathrooms} Bath
                      </span>
                      <span className="text-slate-400 text-[11px]">{prop.areaSqFt} sq.ft</span>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={prop.status}
                        onChange={(e) => handleQuickStatus(prop._id, e.target.value)}
                        disabled={updatingId === prop._id}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                          prop.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : prop.status === 'Booked'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/properties/${prop._id || prop.slug}`}
                          target="_blank"
                          title="View on Public Site"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-950 hover:bg-slate-100"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <Link
                          to={`/admin/properties/edit/${prop._id}`}
                          title="Edit Property"
                          className="p-1.5 rounded-lg text-gold-600 hover:text-gold-700 hover:bg-gold-50"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop._id, prop.title)}
                          title="Delete Property"
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

export default ManageProperties;
