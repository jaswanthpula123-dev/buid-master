import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, Calendar, Layers, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import ProgressBar from './ProgressBar';
import EnquiryModal from './EnquiryModal';

const ProjectCard = ({ project }) => {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const statusConfig = {
    Completed: {
      badgeBg: 'bg-emerald-500 text-white',
      icon: CheckCircle2,
      label: 'Completed Building',
    },
    Ongoing: {
      badgeBg: 'bg-blue-600 text-white',
      icon: Clock,
      label: 'Under Construction',
    },
    Upcoming: {
      badgeBg: 'bg-gradient-to-r from-amber-500 to-gold-500 text-navy-950',
      icon: Sparkles,
      label: 'Upcoming Project',
    },
  };

  const currentStatus = statusConfig[project.status] || statusConfig.Ongoing;
  const StatusIcon = currentStatus.icon;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
        {/* Cover Image & Badge */}
        <div className="relative h-64 overflow-hidden bg-slate-900">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/30"></div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md ${currentStatus.badgeBg}`}
            >
              <StatusIcon size={14} />
              {currentStatus.label}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-navy-900/80 backdrop-blur-md text-gold-400 border border-gold-400/30 text-xs px-2.5 py-1 rounded-full font-semibold">
              {project.category || 'Residential'}
            </span>
          </div>

          {/* Bottom Title Bar on Image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold font-display text-white drop-shadow-md truncate">
              {project.title}
            </h3>
            <p className="text-slate-200 text-xs flex items-center gap-1.5 mt-1 drop-shadow">
              <MapPin size={13} className="text-gold-400 shrink-0" />
              <span className="truncate">{project.location}</span>
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          {/* Construction Progress Bar (if Ongoing) */}
          {project.status === 'Ongoing' && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Construction</span>
                <Link
                  to={`/tracker/${project._id}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-600 hover:text-red-700 transition"
                  title="View Live CCTV & Telemetry"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  Live Tracker
                </Link>
              </div>
              <ProgressBar percentage={project.progressPercentage || 50} />
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                <span>Target Handover:</span>
                <span className="font-semibold text-navy-900">{project.expectedCompletionDate || 'Late 2026'}</span>
              </div>
            </div>
          )}

          {/* Date info for Completed / Upcoming */}
          {project.status === 'Completed' && (
            <div className="flex items-center justify-between text-xs bg-emerald-50/60 text-emerald-800 p-2.5 rounded-lg border border-emerald-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={14} className="text-emerald-600" />
                Handover Completed:
              </span>
              <span className="font-bold">{project.completionDate || '2024'}</span>
            </div>
          )}

          {project.status === 'Upcoming' && (
            <div className="flex items-center justify-between text-xs bg-amber-50/70 text-amber-900 p-2.5 rounded-lg border border-amber-200/50">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={14} className="text-amber-600" />
                Groundbreaking:
              </span>
              <span className="font-bold">{project.estimatedStartDate || 'Q1 2027'}</span>
            </div>
          )}

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
            <div className="p-1.5">
              <span className="block text-xs text-slate-500">Floors</span>
              <span className="font-bold text-navy-900 text-sm">{project.totalFloors} Storeys</span>
            </div>
            <div className="p-1.5 border-x border-slate-100">
              <span className="block text-xs text-slate-500">Total Units</span>
              <span className="font-bold text-navy-900 text-sm">{project.totalUnits} Units</span>
            </div>
            <div className="p-1.5">
              <span className="block text-xs text-slate-500">
                {project.status === 'Upcoming' ? 'Pre-Book' : 'Available'}
              </span>
              <span className={`font-bold text-sm ${project.availableUnits > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                {project.availableUnits} Flats
              </span>
            </div>
          </div>

          {/* Price Range preview if available */}
          {project.priceRange && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Investment Range:</span>
              <span className="font-bold text-navy-900">{project.priceRange}</span>
            </div>
          )}

          {/* Card Actions */}
          <div className="pt-2 flex items-center gap-2">
            <Link
              to={`/projects/${project._id || project.slug}`}
              className="flex-1 py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              View Details
              <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => setShowEnquiry(true)}
              className="py-2.5 px-4 rounded-xl border border-gold-500/50 bg-gold-50 text-gold-700 hover:bg-gold-500 hover:text-navy-950 font-bold text-xs sm:text-sm transition"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        project={project}
      />
    </>
  );
};

export default ProjectCard;
