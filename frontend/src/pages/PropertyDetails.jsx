import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Building,
  CheckCircle2,
  Calendar,
  Phone,
  Send,
  MessageCircle,
  Share2,
  ChevronRight,
  ShieldCheck,
  Compass,
  Box,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatCurrency';

const PropertyDetails = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Quick Enquiry Form state in sidebar
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/properties/${idOrSlug}`);
        if (res.data.success) {
          const prop = res.data.data;
          setProperty(prop);
          setActiveImage(prop.coverImage);
          setFormData((prev) => ({
            ...prev,
            message: `Hello, I am interested in viewing "${prop.title}" (${prop.priceDisplay || formatINR(prop.price)}). Please schedule a site inspection for me.`,
          }));
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [idOrSlug]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    setEnquiryError('');

    try {
      const res = await api.post('/enquiries', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        enquiryType: 'Property',
        propertyId: property._id,
      });

      if (res.data.success) {
        setEnquirySuccess(true);
      }
    } catch (err) {
      setEnquiryError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-xl mx-auto text-center px-4">
        <Building size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold font-display text-navy-950 mb-2">Property Not Found</h2>
        <p className="text-slate-600 mb-6">The requested property listing could not be found or has been sold.</p>
        <Link to="/properties" className="px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-sm">
          Browse All Properties
        </Link>
      </div>
    );
  }

  const favorited = isInWishlist(property._id);
  const allImages = [property.coverImage, ...(property.images || [])].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-gold-600 transition">Home</Link>
          <ChevronRight size={14} />
          <Link to="/properties" className="hover:text-gold-600 transition">Properties for Sale</Link>
          <ChevronRight size={14} />
          <span className="text-navy-950 font-bold truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  property.status === 'Available'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : property.status === 'Booked'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {property.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {property.type}
              </span>
              {property.projectTitle && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-navy-100 text-navy-900">
                  {property.projectTitle}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950">
              {property.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-gold-600 shrink-0" />
              <span>{property.address || property.location}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* PDF Quotation Generator Button */}
            <Link
              to={`/quotation?propertyId=${property._id}`}
              className="p-3 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-900 border border-gold-300 flex items-center gap-2 text-xs font-bold transition shadow-sm hover:scale-105"
              title="Generate Stamped PDF Quotation & Cost Sheet"
            >
              <FileText size={18} className="text-gold-700" />
              <span>PDF Cost Sheet</span>
            </Link>

            {/* 3D Visualizer Button */}
            <Link
              to={`/visualizer/${property._id}`}
              className="p-3 rounded-xl bg-gradient-to-r from-navy-950 to-navy-900 border border-gold-500/50 text-gold-400 hover:text-white flex items-center gap-2 text-xs font-bold transition shadow-sm hover:scale-105"
              title="Launch 3D House Visualizer"
            >
              <Box size={18} className="text-gold-400" />
              <span>Explore in 3D</span>
            </Link>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(property)}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 text-xs font-bold transition shadow-sm"
            >
              <Heart
                size={18}
                className={favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}
              />
              <span>{favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {/* WhatsApp Direct */}
            <a
              href={`https://wa.me/15550192834?text=Hello%20BuildMaster,%20I%20am%20inquiring%20about%20${encodeURIComponent(property.title)}%20(${property.priceDisplay || formatINR(property.price)})`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 text-xs font-bold transition shadow-sm"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="space-y-4 mb-12">
          <div className="relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
            <img
              src={activeImage || property.coverImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute top-4 left-4 bg-navy-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-white font-extrabold text-2xl font-display text-gold-400 border border-gold-400/30">
              {property.priceDisplay?.includes('₹') ? property.priceDisplay : formatINR(property.price)}
            </div>
          </div>

          {uniqueImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {uniqueImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img
                      ? 'border-gold-500 ring-2 ring-gold-400/50 scale-105'
                      : 'border-white opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS & SIDEBAR ENQUIRY FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* 3D Visualizer Interactive Callout Banner */}
            <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 border border-gold-500/30 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold border border-gold-500/30">
                  <Box size={13} />
                  <span>3D Interactive Architecture</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Experience This Property in 3D
                </h3>
                <p className="text-xs text-slate-300">
                  Preview furnished dollhouse floor plan, customize Italian marble floors & wall finishes, test day/night lighting, and estimate turnkey customization in real time.
                </p>
              </div>
              <Link
                to={`/visualizer/${property._id}`}
                className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs sm:text-sm shadow-gold-glow flex items-center gap-2 transition hover:scale-105"
              >
                <span>Launch 3D Studio</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Quick Specs Highlight Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="p-2">
                <span className="block text-xs text-slate-500 mb-1">Bedrooms</span>
                <span className="font-extrabold text-navy-950 text-xl font-display flex items-center justify-center gap-1.5">
                  <Bed size={20} className="text-gold-600" />
                  {property.bedrooms} BHK
                </span>
              </div>
              <div className="p-2 border-l border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">Bathrooms</span>
                <span className="font-extrabold text-navy-950 text-xl font-display flex items-center justify-center gap-1.5">
                  <Bath size={20} className="text-gold-600" />
                  {property.bathrooms} Baths
                </span>
              </div>
              <div className="p-2 border-l border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">Super Built-up Area</span>
                <span className="font-extrabold text-navy-950 text-xl font-display flex items-center justify-center gap-1.5">
                  <Square size={20} className="text-gold-600" />
                  {property.areaSqFt} sq.ft
                </span>
              </div>
              <div className="p-2 border-l border-slate-100">
                <span className="block text-xs text-slate-500 mb-1">Furnishing Status</span>
                <span className="font-extrabold text-navy-950 text-sm font-display block mt-1">
                  {property.furnishing || 'Semi-Furnished'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold font-display text-navy-950 mb-4">
                Property Description
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {property.description}
              </p>

              {/* Specifications Table */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold font-display text-navy-950 mb-4">
                  Unit Specifications & Orientations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <span className="text-slate-500">Facing Direction</span>
                    <span className="font-bold text-navy-950">{property.facing || 'East Facing'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <span className="text-slate-500">Dedicated Parking</span>
                    <span className="font-bold text-navy-950">{property.parking || 1} Covered Bay</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <span className="text-slate-500">Floor Level</span>
                    <span className="font-bold text-navy-950">Floor {property.floorNo} of {property.totalFloors}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <span className="text-slate-500">Property Type</span>
                    <span className="font-bold text-navy-950">{property.type}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold font-display text-navy-950 mb-4">
                    Exclusive Amenities & Inclusions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.amenities.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Linked Building Project */}
            {property.projectId && (
              <div className="bg-navy-950 text-white p-6 rounded-3xl border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Parent Development</span>
                  <h3 className="text-xl font-bold font-display mt-0.5">{property.projectTitle || 'High-Rise Tower'}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Explore full project amenities, construction timeline, and master plan.
                  </p>
                </div>
                <Link
                  to={`/projects/${property.projectId}`}
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shrink-0 transition"
                >
                  View Building Project
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Direct Enquiry Form */}
          <div>
            <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-premium border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600 block mb-1">
                Direct Builder Sales
              </span>
              <h3 className="text-xl font-bold font-display text-navy-950 mb-1">
                Schedule Site Inspection
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Receive priority appointment, pricing breakdown, and brochure on your email.
              </p>

              {enquirySuccess ? (
                <div className="py-8 text-center bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-navy-950 font-display">Enquiry Submitted!</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Our sales advisor will call you to confirm your inspection appointment.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  {enquiryError && (
                    <p className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                      {enquiryError}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Preferred Date
                    </label>
                    <textarea
                      rows="3"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Send size={15} />
                    <span>{enquiryLoading ? 'Submitting...' : 'Send Enquiry to Builder'}</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    🔒 Zero spam. We protect your privacy. RERA verified.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
