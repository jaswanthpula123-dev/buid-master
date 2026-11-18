import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Building, MapPin, Search, Video, ArrowRight, ShieldCheck, Activity, HardHat, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProjectCard from '../components/common/ProjectCard';

const OngoingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOngoing = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects?status=Ongoing${search ? `&search=${search}` : ''}`);
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load ongoing projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoing();
  }, [search]);

  // Filter by category if not 'All'
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        if (selectedCategory === 'Residential') {
          return cat.includes('residential') || cat.includes('skyscraper') || cat.includes('condo') || cat.includes('tower');
        }
        return cat.includes(selectedCategory.toLowerCase());
      });

  const categories = ['All', 'Residential', 'Waterfront', 'Villas', 'Commercial'];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 mb-10 border-b border-navy-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Live Construction In Progress</span>
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-3 text-white">
            Ongoing Architectural Landmarks
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Witness our active high-rises, waterfront towers, and luxury golf estates taking shape in real time. Track verified construction milestones, concrete pour audits, and 24/7 CCTV feeds.
          </p>

          <div className="max-w-md mx-auto mt-6 relative">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ongoing developments..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-gold-400 shadow-inner"
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/tracker"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg transition hover:scale-105"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Open 24/7 Live Construction Tracker & Site Cams</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/visualizer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gold-400 border border-gold-400/40 font-bold text-xs sm:text-sm shadow transition"
            >
              <Sparkles size={15} />
              <span>Explore in 3D Studio</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Highlights Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="p-2 border-r border-slate-100">
            <span className="text-xs text-slate-500 block">Active Sites</span>
            <span className="text-xl sm:text-2xl font-black font-display text-navy-950">
              {projects.length} Landmarks
            </span>
          </div>
          <div className="p-2 sm:border-r border-slate-100">
            <span className="text-xs text-slate-500 block">Active Workforce</span>
            <span className="text-xl sm:text-2xl font-black font-display text-gold-600">
              980+ Engineers
            </span>
          </div>
          <div className="p-2 border-r border-slate-100">
            <span className="text-xs text-slate-500 block">Avg. Progress</span>
            <span className="text-xl sm:text-2xl font-black font-display text-emerald-600">
              68% Built
            </span>
          </div>
          <div className="p-2">
            <span className="text-xs text-slate-500 block">Structural Audit</span>
            <span className="text-xl sm:text-2xl font-black font-display text-navy-950">
              100% RERA
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-gold-400'
                }`}
              >
                {cat === 'All' ? `All Active (${projects.length})` : cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-semibold shrink-0">
            Showing {filteredProjects.length} of {projects.length} Ongoing Projects
          </span>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Building size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-xl font-bold text-navy-950 font-display">No Ongoing Projects Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try selecting "All" or adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingProjects;
