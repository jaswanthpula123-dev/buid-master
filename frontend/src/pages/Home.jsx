import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Building,
  Shield,
  Clock,
  Award,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Quote,
  PhoneCall,
  MessageCircle,
  Box,
  Layers,
  Eye,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import SectionHeading from '../components/common/SectionHeading';
import ProjectCard from '../components/common/ProjectCard';
import PropertyCard from '../components/common/PropertyCard';

const Home = () => {
  const navigate = useNavigate();

  // Search filter bar states
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('All');
  const [searchPrice, setSearchPrice] = useState('All');

  // Dynamic projects & properties loaded from MongoDB
  const [completedProjects, setCompletedProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active tab for project showcases
  const [activeProjectTab, setActiveProjectTab] = useState('Ongoing');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compRes, ongRes, upcRes, propRes] = await Promise.all([
          api.get('/projects?status=Completed&limit=6'),
          api.get('/projects?status=Ongoing&limit=6'),
          api.get('/projects?status=Upcoming&limit=6'),
          api.get('/properties?limit=6'),
        ]);

        if (compRes.data.success) setCompletedProjects(compRes.data.data);
        if (ongRes.data.success) setOngoingProjects(ongRes.data.data);
        if (upcRes.data.success) setUpcomingProjects(upcRes.data.data);
        if (propRes.data.success) setFeaturedProperties(propRes.data.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    if (searchType !== 'All') params.append('type', searchType);
    if (searchPrice !== 'All') {
      const [min, max] = searchPrice.split('-');
      if (min) params.append('minPrice', min);
      if (max) params.append('maxPrice', max);
    }
    navigate(`/properties?${params.toString()}`);
  };

  const testimonials = [
    {
      name: 'Dr. Marcus Vance',
      role: 'Resident at Grand Horizon Towers',
      content:
        'BuildMaster delivered beyond our highest expectations. The structural quality, acoustic insulation, and Italian marble finishes are unmatched. Handover was executed precisely on time.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Investor, Skyline Pinnacle',
      content:
        'Tracking the live construction progress online gave me immense confidence as an NRI investor. BuildMaster sets the gold standard for builder transparency and structural engineering.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Jonathan Sterling',
      role: 'Villa Owner, Aura Waterfront',
      content:
        'From architectural blueprints to final fixtures, the dedication of the BuildMaster engineering team is world-class. Truly luxury living at its finest.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION - ENHANCED HIGH-CONTRAST & MAXIMUM VISIBILITY */}
      <section className="relative min-h-[96vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-navy-950">
        {/* Architectural Background with enhanced high-contrast deep overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=90"
            alt="Modern luxury skyscraper"
            className="w-full h-full object-cover object-center filter brightness-[0.22] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/75 to-navy-950"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
          {/* Top Developer Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-black tracking-wider uppercase mb-5 shadow-lg shadow-gold-500/10 animate-fadeIn">
            <Sparkles size={16} className="text-gold-400 shrink-0" />
            <span>Premier Construction & Real Estate Developer</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.1] mb-5 drop-shadow-2xl">
            Engineering Architectural{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-gold-400 to-amber-200">
              Landmarks
            </span>{' '}
            of Tomorrow
          </h1>

          {/* High-Contrast Subtitle */}
          <p className="max-w-3xl text-base sm:text-xl text-slate-100 font-normal leading-relaxed mb-8 drop-shadow-md">
            From high-rise residential towers and commercial tech parks to private beachfront villas.
            Experience unmatched craftsmanship, transparent construction milestones, and RERA-approved luxury.
          </p>

          {/* 3 FLAGSHIP INNOVATIONS QUICK-ACTION CARDS */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
            {/* Live Construction Tracker Card */}
            <Link
              to="/tracker"
              className="group p-4 rounded-2xl bg-navy-900/90 hover:bg-navy-800/95 backdrop-blur-md border border-red-500/40 hover:border-red-400 shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-3.5 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-red-400">Live 24/7</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">CCTV HUD</span>
                </div>
                <p className="text-sm font-black text-white truncate group-hover:text-gold-300 transition-colors">Site Tracker</p>
                <p className="text-[11px] text-slate-300 truncate">Telemetry & Milestones</p>
              </div>
            </Link>

            {/* 3D Visualizer Card */}
            <Link
              to="/visualizer"
              className="group p-4 rounded-2xl bg-navy-900/90 hover:bg-navy-800/95 backdrop-blur-md border border-gold-500/40 hover:border-gold-400 shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-3.5 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gold-600/30 to-amber-500/20 border border-gold-400/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <Box size={24} className="text-gold-400 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-gold-400">3D Studio</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-gold-400/20 text-gold-300 font-bold">WebGL</span>
                </div>
                <p className="text-sm font-black text-white truncate group-hover:text-gold-300 transition-colors">House Visualizer</p>
                <p className="text-[11px] text-slate-300 truncate">360° Walkthrough & Materials</p>
              </div>
            </Link>

            {/* PDF Quotation Card */}
            <Link
              to="/quotation"
              className="group p-4 rounded-2xl bg-navy-900/90 hover:bg-navy-800/95 backdrop-blur-md border border-emerald-500/40 hover:border-emerald-400 shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-3.5 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <FileText size={24} className="text-emerald-400 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">PDF Quote</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">RERA</span>
                </div>
                <p className="text-sm font-black text-white truncate group-hover:text-gold-300 transition-colors">Cost Generator</p>
                <p className="text-[11px] text-slate-300 truncate">Instant Stamped Cost Sheet</p>
              </div>
            </Link>
          </div>

          {/* SEARCH PROPERTIES WIDGET - ULTRA CLEAR & SHARP */}
          <div className="w-full max-w-4xl bg-white p-5 sm:p-6 rounded-3xl shadow-2xl border-2 border-slate-100 text-slate-800 text-left mb-8">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Input */}
              <div>
                <label className="block text-xs font-black text-navy-950 uppercase tracking-wider mb-2">
                  Location / Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. Downtown, Bayview"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-slate-50 font-bold text-navy-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label className="block text-xs font-black text-navy-950 uppercase tracking-wider mb-2">
                  Property Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-slate-50 font-bold text-navy-900 cursor-pointer"
                >
                  <option value="All">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">Flat</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Commercial">Commercial Hub</option>
                </select>
              </div>

              {/* Budget Range Dropdown */}
              <div>
                <label className="block text-xs font-black text-navy-950 uppercase tracking-wider mb-2">
                  Budget / Price (INR)
                </label>
                <select
                  value={searchPrice}
                  onChange={(e) => setSearchPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-slate-50 font-bold text-navy-900 cursor-pointer"
                >
                  <option value="All">Any Budget</option>
                  <option value="0-5000000">Under ₹50 Lakhs</option>
                  <option value="5000000-10000000">₹50 L - ₹1 Crore</option>
                  <option value="10000000-25000000">₹1 Cr - ₹2.5 Crore</option>
                  <option value="25000000-100000000">₹2.5 Cr+ (Ultra Luxury)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-gold-glow flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                >
                  <Search size={18} className="stroke-[2.5]" />
                  <span>Find Properties</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick stats below hero - High-contrast glassmorphic cards */}
          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-navy-900/85 backdrop-blur-md border border-white/10 shadow-xl">
              <p className="text-3xl sm:text-4xl font-black font-display text-gold-400">18+</p>
              <p className="text-xs sm:text-sm text-slate-200 uppercase tracking-wider font-bold mt-1">Years Experience</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-navy-900/85 backdrop-blur-md border border-white/10 shadow-xl">
              <p className="text-3xl sm:text-4xl font-black font-display text-gold-400">120+</p>
              <p className="text-xs sm:text-sm text-slate-200 uppercase tracking-wider font-bold mt-1">Landmarks Built</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-navy-900/85 backdrop-blur-md border border-white/10 shadow-xl">
              <p className="text-3xl sm:text-4xl font-black font-display text-gold-400">2.4M+</p>
              <p className="text-xs sm:text-sm text-slate-200 uppercase tracking-wider font-bold mt-1">Sq.Ft Delivered</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-navy-900/85 backdrop-blur-md border border-white/10 shadow-xl">
              <p className="text-3xl sm:text-4xl font-black font-display text-gold-400">99.4%</p>
              <p className="text-xs sm:text-sm text-slate-200 uppercase tracking-wider font-bold mt-1">On-Time Handover</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJECT SHOWCASE TABS (Completed, Ongoing, Upcoming) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Construction Portfolio"
            title="Our Architectural Spectrum"
            subtitle="Explore our completed masterpieces, currently progressing skyscrapers with live milestone percentages, and upcoming visionary developments."
          />

          {/* Tab Selector Buttons - Responsive Mobile & Desktop Layout */}
          <div className="flex justify-start sm:justify-center mb-10 overflow-x-auto no-scrollbar pb-2 px-1">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0">
              <button
                onClick={() => setActiveProjectTab('Ongoing')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeProjectTab === 'Ongoing'
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Clock size={16} className={activeProjectTab === 'Ongoing' ? 'text-gold-400' : ''} />
                <span>Ongoing ({ongoingProjects.length})</span>
                <span className="hidden sm:inline">Construction</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('Completed')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeProjectTab === 'Completed'
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <CheckCircle2 size={16} className={activeProjectTab === 'Completed' ? 'text-emerald-400' : ''} />
                <span>Completed ({completedProjects.length})</span>
                <span className="hidden sm:inline">Buildings</span>
              </button>

              <button
                onClick={() => setActiveProjectTab('Upcoming')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeProjectTab === 'Upcoming'
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Sparkles size={16} className={activeProjectTab === 'Upcoming' ? 'text-amber-400' : ''} />
                <span>Upcoming ({upcomingProjects.length})</span>
                <span className="hidden sm:inline">Projects</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {activeProjectTab === 'Ongoing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ongoingProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              )}

              {activeProjectTab === 'Completed' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              )}

              {activeProjectTab === 'Upcoming' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              )}

              <div className="text-center mt-12 mb-16">
                <Link
                  to={
                    activeProjectTab === 'Ongoing'
                      ? '/ongoing-projects'
                      : activeProjectTab === 'Completed'
                      ? '/completed-projects'
                      : '/upcoming-projects'
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md hover:shadow-xl transition"
                >
                  <span>View All {activeProjectTab} Projects</span>
                  <ArrowRight size={16} className="text-gold-400" />
                </Link>
              </div>

              {/* Live Construction Tracker Spotlight Banner */}
              <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 border border-gold-500/30 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="space-y-3 z-10 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>24/7 CCTV & Structural HUD Live Feed</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Live Construction Tracker & Smart Site Telemetry
                  </h3>
                  <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                    Inspect live site camera feeds, concrete pour audits, milestone progress bars, workforce logs, and weather conditions in real-time. Unprecedented transparency for buyers and investors.
                  </p>
                </div>
                <div className="z-10 shrink-0">
                  <Link
                    to="/tracker"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-sm shadow-gold-glow flex items-center gap-2 transition hover:scale-105 transform"
                  >
                    <span>Launch Live Site Tracker</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES FOR SALE */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-100 text-gold-700 border border-gold-300/40 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
                Direct From Builder
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
                Properties Available For Sale
              </h2>
            </div>
            <Link
              to="/properties"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-bold text-gold-600 hover:text-gold-700 group"
            >
              <span>Explore All Flats, Villas & Houses</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3D HOUSE VISUALIZER STUDIO SHOWCASE */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-navy-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-400/30">
                <Box size={14} className="text-gold-400" />
                <span>Next-Gen Architectural Technology</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                All-in-One <span className="text-gold-gradient">3D House Visualizer</span> & Material Studio
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Step inside our residences before construction even breaks ground. Orbit 360° around furnished 3D dollhouses, customize Italian marble floors & designer wall paints, toggle real-time daylight/night lighting, and estimate turnkey customization in Indian Rupees.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-1">
                  <span className="text-xl">📐</span>
                  <h4 className="font-bold text-white text-sm">3D Dollhouse Floor Plans</h4>
                  <p className="text-xs text-slate-400">Furnished cutaways of master suites, living lounges & modular kitchens.</p>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-1">
                  <span className="text-xl">🏛️</span>
                  <h4 className="font-bold text-white text-sm">Villa Exterior Facades</h4>
                  <p className="text-xs text-slate-400">2-storey contemporary architecture with swimming pools & sun decks.</p>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-1">
                  <span className="text-xl">🎨</span>
                  <h4 className="font-bold text-white text-sm">Real-Time Materials</h4>
                  <p className="text-xs text-slate-400">Switch Carrara marble, teakwood parquet, or polished black granite instantly.</p>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-1">
                  <span className="text-xl">☀️</span>
                  <h4 className="font-bold text-white text-sm">Day & Night Simulation</h4>
                  <p className="text-xs text-slate-400">Test 12 PM daylight, 6 PM golden sunset, or 9 PM ambient night luxury.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/visualizer"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-sm shadow-gold-glow flex items-center gap-2 transition hover:scale-105"
                >
                  <Box size={18} />
                  <span>Launch 3D House Visualizer</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/properties"
                  className="px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm border border-navy-700 transition"
                >
                  Browse Available Residences
                </Link>
              </div>
            </div>

            {/* Right Interactive Card / Visual Teaser */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-navy-900 to-navy-950 border border-gold-500/30 p-2 shadow-2xl group">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="3D Architectural Visualization"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>

                  {/* 3D Interactive Badge Overlay */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-navy-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>WebGL 3D Engine Ready</span>
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-black uppercase tracking-wider shadow-md">
                    360° Studio
                  </div>

                  {/* Floating Action Callout */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-navy-950/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gold-400 font-bold uppercase tracking-wider">Live Configurator</p>
                      <h4 className="text-base font-extrabold text-white">The Imperial 4BHK Sky Villa</h4>
                      <p className="text-[11px] text-slate-400">Italian Marble · Smart Automation · Sea View</p>
                    </div>

                    <Link
                      to="/visualizer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition"
                    >
                      <span>Explore 3D</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE BUILDMASTER */}
      <section className="py-20 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Engineering Integrity"
            title="Why Discerning Buyers Choose BuildMaster"
            subtitle="We don't simply pour concrete — we engineer lifetime investments with certified durability, legal certainty, and luxury specifications."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-5">
                <Shield size={24} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-white">
                RERA Registered & 100% Legal Title
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zero ambiguity. All projects carry clear title deeds, approved municipal masterplans,
                and dedicated escrow account governance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-5">
                <Clock size={24} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-white">
                Guaranteed On-Time Delivery
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our proprietary digital ERP monitors daily concrete curing, facade installation,
                and MEP milestones to ensure handover deadlines are always honored.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-5">
                <Building size={24} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-white">
                Tier-1 Construction Materials
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Constructed using Tata/JSW Fe 550D TMT steel, Lafarge ultra-strength concrete,
                and seismic-rated RCC shear walls built to outlast generations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-5">
                <Award size={24} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-white">
                Award-Winning Architecture
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Collaborating with leading global architects to achieve optimal cross-ventilation,
                expansive ceiling heights, and stunning double-glazed thermal glass facades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Client Testimonials"
            title="Voices of Our Homeowners & Investors"
            subtitle="Hear directly from families and corporate investors who have made BuildMaster developments their cherished home."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-premium border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold-500 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#EAB308" stroke="#EAB308" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                    "{test.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-11 h-11 rounded-full object-cover border border-gold-400"
                  />
                  <div>
                    <h4 className="font-bold text-navy-950 text-sm">{test.name}</h4>
                    <p className="text-xs text-slate-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION CONTACT BANNER */}
      <section className="py-16 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold mb-4">
            Ready to Build or Buy Your Dream Property?
          </h2>
          <p className="max-w-2xl text-slate-300 text-sm sm:text-base mb-8">
            Schedule a personalized site tour, review architectural blueprints, or discuss
            customization milestones directly with our master builders.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-extrabold text-sm shadow-xl hover:shadow-gold-glow transition"
            >
              Schedule a Site Consultation
            </Link>
            <a
              href="tel:+919346638123"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2"
            >
              <PhoneCall size={16} className="text-gold-400" />
              <span>Call +91 93466 38123</span>
            </a>
            <a
              href="https://wa.me/919346638123?text=Hello%20BuildMaster,%20I%20would%20like%20to%20consult%20regarding%20construction%20and%20properties."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
