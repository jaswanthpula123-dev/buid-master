import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Home, ArrowLeft, Save, Plus } from 'lucide-react';
import api from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';
import { formatINR } from '../../utils/formatCurrency';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [projectsList, setProjectsList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment',
    status: 'Available',
    price: 6500000,
    priceDisplay: '₹65 Lakhs',
    location: '',
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1250,
    furnishing: 'Semi-Furnished',
    facing: 'East Facing',
    parking: 1,
    floorNo: 4,
    totalFloors: 16,
    coverImage: '',
    images: [],
    description: '',
    amenities: ['Modular Kitchen', 'Power Backup', 'Covered Parking', 'Balcony View'],
    projectId: '',
    projectTitle: '',
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available projects to link property to building
    const loadProjects = async () => {
      try {
        const res = await api.get('/projects?limit=50');
        if (res.data.success) {
          setProjectsList(res.data.data);
        }
      } catch (e) {
        console.warn('Failed to load projects list for dropdown');
      }
    };
    loadProjects();

    if (isEdit) {
      const fetchProperty = async () => {
        try {
          setFetching(true);
          const res = await api.get(`/properties/${id}`);
          if (res.data.success) {
            setFormData(res.data.data);
          }
        } catch (err) {
          setError('Failed to load property details.');
        } finally {
          setFetching(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEdit]);

  const handleProjectSelect = (e) => {
    const selectedProjId = e.target.value;
    const found = projectsList.find((p) => p._id === selectedProjId);
    setFormData({
      ...formData,
      projectId: selectedProjId || null,
      projectTitle: found ? found.title : '',
    });
  };

  const handleAddAmenity = () => {
    if (!amenityInput.trim()) return;
    setFormData({
      ...formData,
      amenities: [...(formData.amenities || []), amenityInput.trim()],
    });
    setAmenityInput('');
  };

  const handleRemoveAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.coverImage || !formData.price) {
      setError('Please provide property title, price, location, and at least one cover image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        priceDisplay: formatINR(formData.price),
      };

      if (isEdit) {
        await api.put(`/properties/${id}`, payload);
      } else {
        await api.post('/properties', payload);
      }
      navigate('/admin/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property listing.');
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
      <div className="flex items-center justify-between">
        <Link
          to="/admin/properties"
          className="text-xs font-bold text-slate-500 hover:text-navy-950 flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={16} />
          Back to Properties List
        </Link>
        <h2 className="text-xl font-bold font-display text-navy-950">
          {isEdit ? 'Edit Property Listing' : 'Add New Property Listing'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Property Info */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-navy-950 font-display border-b border-slate-100 pb-3">
            Property Specifications & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Property Listing Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 3-BHK Panoramic City View Flat"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="Apartment">Apartment</option>
                <option value="Flat">Flat</option>
                <option value="Villa">Villa</option>
                <option value="Independent House">Independent House</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status / Availability *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 bg-white font-bold"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 font-bold text-gold-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Associated Building Project (Optional)
              </label>
              <select
                value={formData.projectId || ''}
                onChange={handleProjectSelect}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="">None / Standalone Property</option>
                {projectsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / City Area *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Midtown Financial District"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Physical Address / Unit No
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Skyline Pinnacle, Floor 18, Unit 1804"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Dimensions & Specifications */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-navy-950 font-display border-b border-slate-100 pb-3">
            Dimensions, Floor & Parking
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Area (Sq.Ft) *
              </label>
              <input
                type="number"
                min="100"
                value={formData.areaSqFt}
                onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Furnishing
              </label>
              <select
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facing
              </label>
              <input
                type="text"
                value={formData.facing}
                onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                placeholder="e.g. East Facing"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Parking Bays
              </label>
              <input
                type="number"
                min="0"
                value={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <ImageUploader
            images={formData.images || []}
            coverImage={formData.coverImage || ''}
            onCoverChange={(url) => setFormData({ ...formData, coverImage: url })}
            onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
            title="Property Photos & Interior Gallery"
          />
        </div>

        {/* Description & Amenities */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-navy-950 font-display border-b border-slate-100 pb-3">
            Listing Details & Amenities
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Property Description
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe interior finishes, view, kitchen fittings, balcony, etc..."
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Included Amenities & Perks
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g. Private Balcony Hot Tub"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
              >
                Add Amenity
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.amenities || []).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/properties"
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
            <span>{loading ? 'Saving Property...' : isEdit ? 'Update Property' : 'Publish Property'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
