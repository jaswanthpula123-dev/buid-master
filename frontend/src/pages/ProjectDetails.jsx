import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  PhoneCall,
  Send,
  MessageCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import ProgressBar from '../components/common/ProgressBar';
import EnquiryModal from '../components/common/EnquiryModal';
import PropertyCard from '../components/common/PropertyCard';

const ProjectDetails = () => {
  const { idOrSlug } = useParams();

  const [project, setProject] = useState(null);
  const [properties, setProperties] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects/${idOrSlug}`);
        if (res.data.success) {
          const proj = res.data.data;
          setProject(proj);
          setActiveImage(proj.coverImage);

          // Fetch properties belonging to this project
          const propRes = await api.get(`/properties?projectId=${proj._id}`);
          if (propRes.data.success) {
            setProperties(propRes.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-xl mx-auto text-center px-4">
        <Building size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold font-display text-navy-950 mb-2">Project Not Found</h2>
        <p className="text-slate-600 mb-6">The requested building project could not be found or has been removed.</p>
        <Link to="/" className="px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  const allImages = [project.coverImage, ...(project.images || [])].filter(Boolean);
  // Dedup images
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-gold-600 transition">Home</Link>
          <ChevronRight size={14} />
          <Link
            to={
              project.status === 'Completed'
                ? '/completed-projects'
                : project.status === 'Ongoing'
                ? '/ongoing-projects'
                : '/upcoming-projects'
            }
            className="hover:text-gold-600 transition"
          >
            {project.status} Projects
          </Link>
          <ChevronRight size={14} />
          <span className="text-navy-950 font-bold truncate max-w-xs">{project.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  project.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : project.status === 'Ongoing'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {project.status} Building
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {project.category}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950">
              {project.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-gold-600 shrink-0" />
              <span>{project.address || project.location}</span>
            </p>
          </div>

          {/* Quick Enquire Button */}
          <div className="flex flex-wrap items-center gap-3">
            {project.status === 'Ongoing' && (
              <Link
                to={`/tracker/${project._id}`}
                className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 shadow-md transition"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Track Live Site Cam</span>
              </Link>
            )}
            <a
              href={`https://wa.me/15550192834?text=Hello%20BuildMaster,%20I%20am%20inquiring%20about%20${encodeURIComponent(project.title)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-md transition"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              onClick={() => setShowEnquiry(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-extrabold text-sm shadow-lg hover:shadow-gold-glow flex items-center gap-2 transition"
            >
              <Send size={16} />
              <span>Request Brochure & Site Visit</span>
            </button>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="space-y-4 mb-12">
          {/* Main Large Image */}
          <div className="relative h-[400px] sm:h-[520px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
            <img
              src={activeImage || project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent pointer-events-none"></div>

            {project.status === 'Ongoing' && (
              <div className="absolute bottom-6 left-6 right-6 max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50">
                <ProgressBar percentage={project.progressPercentage || 50} />
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
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

        {/* MAIN SPECS & DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Left Column: Description & Specifications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold font-display text-navy-950 mb-4">
                About The Development
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {project.description ||
                  `${project.title} represents pinnacle architectural design and certified engineering by BuildMaster.`}
              </p>

              {/* Highlights & Features */}
              {project.features && project.features.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold font-display text-navy-950 mb-3">
                    Key Architectural Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            {project.specifications && project.specifications.length > 0 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold font-display text-navy-950 mb-4">
                  Engineering & Material Specifications
                </h2>
                <div className="divide-y divide-slate-100">
                  {project.specifications.map((spec, i) => (
                    <div key={i} className="py-3 flex flex-col sm:flex-row sm:justify-between text-sm">
                      <span className="font-bold text-navy-950">{spec.label}</span>
                      <span className="text-slate-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            {project.floorPlans && project.floorPlans.length > 0 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold font-display text-navy-950 mb-4">
                  Floor Plans & Layouts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.floorPlans.map((plan, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden p-4 bg-slate-50">
                      {plan.image && (
                        <div className="h-44 rounded-xl overflow-hidden mb-3 bg-white">
                          <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h4 className="font-bold text-navy-950 text-base">{plan.title}</h4>
                      <div className="flex justify-between items-center text-xs text-slate-600 mt-1">
                        <span>{plan.bedrooms} Bedrooms</span>
                        <span className="font-bold text-gold-600">{plan.area}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Overview Box & Builder Card */}
          <div className="space-y-6">
            {/* Project Overview Card */}
            <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100 space-y-4">
              <h3 className="font-display text-xl font-bold text-navy-950 border-b border-slate-100 pb-3">
                Project Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-navy-950">{project.status}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Total Storeys</span>
                  <span className="font-bold text-navy-950">{project.totalFloors} Floors</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Total Units</span>
                  <span className="font-bold text-navy-950">{project.totalUnits} Units</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Units Available</span>
                  <span className="font-bold text-emerald-600">{project.availableUnits} Available</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Units Sold</span>
                  <span className="font-bold text-navy-950">{project.soldUnits} Sold</span>
                </div>

                {project.completionDate && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Completion Date</span>
                    <span className="font-bold text-navy-950">{project.completionDate}</span>
                  </div>
                )}

                {project.expectedCompletionDate && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Expected Delivery</span>
                    <span className="font-bold text-navy-950">{project.expectedCompletionDate}</span>
                  </div>
                )}

                {project.estimatedStartDate && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Groundbreaking</span>
                    <span className="font-bold text-navy-950">{project.estimatedStartDate}</span>
                  </div>
                )}

                {project.priceRange && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Price Range</span>
                    <span className="font-bold text-gold-600">{project.priceRange}</span>
                  </div>
                )}
              </div>

              {project.status === 'Ongoing' && (
                <Link
                  to={`/tracker/${project._id}`}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span>View 24/7 Site Cam & Milestones</span>
                </Link>
              )}

              <button
                onClick={() => setShowEnquiry(true)}
                className="w-full mt-2 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>Contact Builder Directly</span>
              </button>
            </div>

            {/* Builder Accreditation Card */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white p-6 rounded-3xl shadow-premium border border-navy-800">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Master Builder</span>
              <h4 className="text-lg font-bold font-display mt-1">BuildMaster Infrastructure Pvt Ltd</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                18+ Years of excellence in high-rise, gated townships, and luxury residential development.
                All plans RERA certified and audited by independent structural inspection authorities.
              </p>
              <div className="mt-4 pt-4 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
                <span>RERA Reg: #BM-77401-2024</span>
                <span className="text-gold-400 font-semibold">Verified Builder</span>
              </div>
            </div>
          </div>
        </div>

        {/* ASSOCIATED PROPERTIES FOR SALE IN THIS PROJECT */}
        {properties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-600">Available Units</span>
                <h2 className="font-display text-3xl font-bold text-navy-950">
                  Flats & Residences For Sale in {project.title}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        project={project}
      />
    </div>
  );
};

export default ProjectDetails;
