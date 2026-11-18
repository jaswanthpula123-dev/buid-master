import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Building,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import api from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    status: 'Ongoing',
    category: 'Residential High-Rise',
    location: '',
    address: '',
    totalFloors: 12,
    totalUnits: 60,
    availableUnits: 15,
    soldUnits: 45,
    progressPercentage: 45,
    completionDate: '',
    estimatedStartDate: '',
    expectedCompletionDate: '',
    priceRange: '₹80 Lakhs - ₹2.5 Crore',
    coverImage: '',
    images: [],
    description: '',
    features: ['24/7 Security & Concierge', 'High-Speed Elevators', 'Clubhouse & Pool'],
    specifications: [
      { label: 'Structure', value: 'Seismic Zone V compliant RCC shear wall' },
      { label: 'Flooring', value: 'Imported Italian Marble in living room' },
    ],
  });

  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchProject = async () => {
        try {
          setFetching(true);
          const res = await api.get(`/projects/${id}`);
          if (res.data.success) {
            setFormData(res.data.data);
          }
        } catch (err) {
          setError('Failed to load project details.');
        } finally {
          setFetching(false);
        }
      };
      fetchProject();
    }
  }, [id, isEdit]);

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({
      ...formData,
      features: [...(formData.features || []), featureInput.trim()],
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleAddSpec = () => {
    setFormData({
      ...formData,
      specifications: [...(formData.specifications || []), { label: '', value: '' }],
    });
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData({ ...formData, specifications: updated });
  };

  const handleRemoveSpec = (index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.coverImage) {
      setError('Please provide project title, location, and at least one cover image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/projects/${id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      navigate('/admin/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/projects"
          className="text-xs font-bold text-slate-500 hover:text-navy-950 flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={16} />
          Back to Projects List
        </Link>
        <h2 className="text-xl font-bold font-display text-navy-950">
          {isEdit ? 'Edit Building Project' : 'Create New Building Project'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-navy-950 font-display border-b border-slate-100 pb-3">
            Core Project Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Name / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Skyline Pinnacle Residences"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Construction Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 bg-white font-bold"
              >
                <option value="Completed">Completed Building</option>
                <option value="Ongoing">Ongoing Construction</option>
                <option value="Upcoming">Upcoming Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Luxury High-Rise"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                General Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Downtown Bayview, Sector 12"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 742 Ocean Parkway"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Construction Progress & Timeline */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-navy-950 font-display border-b border-slate-100 pb-3">
            Milestones, Progress & Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Progress Percentage ({formData.progressPercentage}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progressPercentage}
                onChange={(e) => setFormData({ ...formData, progressPercentage: Number(e.target.value) })}
                className="w-full accent-gold-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Floors / Storeys
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalFloors}
                onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Units / Flats
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Available Units
              </label>
              <input
                type="number"
                min="0"
                value={formData.availableUnits}
                onChange={(e) => setFormData({ ...formData, availableUnits: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sold Units
              </label>
              <input
                type="number"
                min="0"
                value={formData.soldUnits}
                onChange={(e) => setFormData({ ...formData, soldUnits: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Completion Date (If Completed)
              </label>
              <input
                type="text"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                placeholder="e.g. May 2024"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Handover (If Ongoing)
              </label>
              <input
                type="text"
                value={formData.expectedCompletionDate}
                onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                placeholder="e.g. December 2025"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price / Investment Range
              </label>
              <input
                type="text"
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                placeholder="e.g. ₹80 Lakhs - ₹2.5 Crore"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Gallery Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <ImageUploader
            images={formData.images || []}
            coverImage={formData.coverImage || ''}
            onCoverChange={(url) => setFormData({ ...formData, coverImage: url })}
            onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
            title="Building Architecture & Elevation Gallery"
          />
        </div>

        {/* Description & Features */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-navy-950 font-display border-b border-slate-100 pb-3">
            Description & Specifications
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Comprehensive Project Overview
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the architectural design, location connectivity, materials, and highlights..."
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 resize-none"
            ></textarea>
          </div>

          {/* Key Features Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Features & Highlights
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g. Rooftop Sky Lounge"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
              >
                Add Feature
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.features || []).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/projects"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-extrabold text-sm shadow-md hover:shadow-gold-glow flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'Saving Project...' : isEdit ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
