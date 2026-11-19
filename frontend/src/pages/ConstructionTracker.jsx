import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Video,
  CheckCircle2,
  Calendar,
  Layers,
  Building,
  ShieldCheck,
  HardHat,
  Thermometer,
  Wind,
  Activity,
  ArrowRight,
  Send,
  MessageCircle,
  Eye,
  Camera,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import ProgressBar from '../components/common/ProgressBar';

const ConstructionTracker = () => {
  const { id } = useParams();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Camera state
  const [activeCamIndex, setActiveCamIndex] = useState(0);
  const [isFeedLive, setIsFeedLive] = useState(true);
  const [liveTimestamp, setLiveTimestamp] = useState(new Date().toLocaleTimeString());

  // Homeowner notification form state
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberPhone, setSubscriberPhone] = useState('');
  const [subscriberUnit, setSubscriberUnit] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Live ticking clock for CCTV overlay
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch ongoing/active projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects');
        if (res.data.success && res.data.data.length > 0) {
          const list = res.data.data;
          setProjects(list);

          // Select requested project by ID or first Ongoing project
          if (id) {
            const found = list.find((p) => p._id === id || p.slug === id);
            setSelectedProject(found || list[0]);
          } else {
            const ongoing = list.find((p) => p.status === 'Ongoing');
            setSelectedProject(ongoing || list[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load projects for tracker:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);

  const handleProjectSelect = (projectId) => {
    const found = projects.find((p) => p._id === projectId);
    if (found) {
      setSelectedProject(found);
      setActiveCamIndex(0);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscriberPhone) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setSubscriberName('');
        setSubscriberPhone('');
        setSubscriberUnit('');
      }, 4000);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-slate-900 flex justify-center items-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-300">Connecting to BuildMaster Live Telemetry...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-slate-900 text-white text-center px-4">
        <Building size={48} className="mx-auto text-slate-500 mb-3" />
        <h2 className="text-2xl font-bold font-display">No Active Construction Projects Available</h2>
        <Link to="/" className="mt-4 inline-block px-6 py-2.5 bg-gold-500 text-navy-950 rounded-xl font-bold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  const cameras = selectedProject.siteCameras && selectedProject.siteCameras.length > 0
    ? selectedProject.siteCameras
    : [
        {
          id: 'cam-1',
          name: 'CAM 01: Core Tower Slab Crane View',
          location: `Elevation Deck (${selectedProject.totalFloors} Storeys)`,
          thumbnail: selectedProject.coverImage,
          status: 'Live HD',
        },
      ];

  const currentCam = cameras[activeCamIndex] || cameras[0];

  const milestones = selectedProject.milestones && selectedProject.milestones.length > 0
    ? selectedProject.milestones
    : [
        { name: 'Soil Stratum Testing & Deep Bored Piling', percentage: 100, status: 'Completed', completionDate: 'Q1', inspectionNotes: 'Foundation load test certified.' },
        { name: 'Subterranean Basements & Raft Foundation', percentage: 100, status: 'Completed', completionDate: 'Q2', inspectionNotes: 'Waterproofing membrane approved.' },
        { name: `RCC Structural Framing to Level ${Math.round((selectedProject.totalFloors || 20) * 0.8)}`, percentage: selectedProject.progressPercentage || 60, status: 'In Progress', completionDate: 'Current', inspectionNotes: 'Concrete compressive strength verified.' },
        { name: 'Exterior Glazing & Acoustic Double Glass', percentage: Math.max(0, (selectedProject.progressPercentage || 60) - 20), status: 'In Progress', completionDate: 'Next Phase', inspectionNotes: 'Curtain wall installation underway.' },
        { name: 'Internal MEP, Plumbing & Electrical Risers', percentage: Math.max(0, (selectedProject.progressPercentage || 60) - 35), status: 'In Progress', completionDate: 'Scheduled', inspectionNotes: 'Pressure testing scheduled.' },
        { name: 'Final Statutory RERA Inspection & Key Handover', percentage: 0, status: 'Pending', completionDate: selectedProject.expectedCompletionDate || 'Target 2026', inspectionNotes: 'Municipal occupancy clearance.' },
      ];

  const metrics = selectedProject.siteMetrics || {
    activeWorkforce: 210,
    safetyScore: '100% Zero Incidents',
    concreteGrade: 'M50 High-Tensile Self-Compacting',
    weatherCondition: 'Clear / 28°C / Low Wind',
    lastInspected: 'Today by Structural Auditor',
  };

  return (
    <div className="pt-20 bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. TOP TELEMETRY HEADER BAR */}
      <div className="bg-navy-950 border-b border-navy-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Live Telemetry Active
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-900 text-gold-400 border border-gold-500/30">
                BuildMaster ERP Sync
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Live Construction Site Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              24/7 transparent engineering feed: track milestone percentages, live site CCTV angles,
              concrete curing metrics, and safety audits in real time.
            </p>
          </div>

          {/* PROJECT SELECTOR DROPDOWN */}
          <div className="bg-navy-900/90 p-4 rounded-2xl border border-navy-800 shrink-0 w-full md:w-80 shadow-lg">
            <label className="block text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-1.5">
              Select Active Construction Site:
            </label>
            <select
              value={selectedProject._id}
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-navy-950 border border-navy-700 text-white font-bold focus:outline-none focus:border-gold-500"
            >
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title} ({proj.status} • {proj.progressPercentage || 0}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* 2. OVERALL PROJECT PROGRESS GAUGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Percentage Card */}
          <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800/80 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Overall Progress
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-display text-gold-400">
                  {selectedProject.progressPercentage || 0}%
                </span>
                <span className="text-xs text-emerald-400 font-bold">On Schedule</span>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={selectedProject.progressPercentage || 0} showLabel={false} size="sm" />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                <span>Handover Target:</span>
                <span className="text-white font-bold">{selectedProject.expectedCompletionDate || selectedProject.completionDate}</span>
              </div>
            </div>
          </div>

          {/* Active Workforce */}
          <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800/80 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <HardHat size={26} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Workforce On-Site
              </span>
              <p className="text-2xl font-black font-display text-white mt-0.5">
                {metrics.activeWorkforce} Personnel
              </p>
              <span className="text-[11px] text-slate-400">Civil & Structural Engineers</span>
            </div>
          </div>

          {/* Safety Record */}
          <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800/80 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Safety Record
              </span>
              <p className="text-xl font-black font-display text-white mt-0.5">
                {metrics.safetyScore}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold">ISO 45001 Compliant</span>
            </div>
          </div>

          {/* Concrete Mix Strength */}
          <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800/80 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
              <Activity size={26} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Material Grade
              </span>
              <p className="text-lg font-black font-display text-white mt-0.5 truncate">
                {metrics.concreteGrade}
              </p>
              <span className="text-[11px] text-slate-400">Cube Crushing Tested</span>
            </div>
          </div>
        </div>

        {/* 3. LIVE SITE CCTV FEED SIMULATOR */}
        <div className="bg-navy-900/90 rounded-3xl border border-navy-800 overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-6 border-b border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Video size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                  <span>Site Optical Camera Feed</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </h3>
                <p className="text-xs text-slate-400">
                  {currentCam.name} • {currentCam.location}
                </p>
              </div>
            </div>

            {/* Camera Switcher Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {cameras.map((cam, idx) => (
                <button
                  key={cam.id || idx}
                  onClick={() => setActiveCamIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeCamIndex === idx
                      ? 'bg-gold-500 text-navy-950 shadow-md'
                      : 'bg-navy-950 text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  <Camera size={14} />
                  <span>CAM 0{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feed Viewport */}
          <div className="relative aspect-video max-h-[540px] w-full bg-black overflow-hidden flex items-center justify-center">
            <img
              src={currentCam.thumbnail || selectedProject.coverImage}
              alt={currentCam.name}
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                isFeedLive ? 'opacity-90' : 'opacity-40 filter grayscale'
              }`}
            />

            {/* CCTV Scanline & Vignette Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

            {/* Live Camera HUD Overlay */}
            <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex justify-between items-start gap-2 text-[10px] sm:text-[11px] font-mono text-white/90 drop-shadow-md">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-black/75 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-lg border border-white/10 w-fit max-w-full">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                  <span className="font-bold text-rose-400 shrink-0">REC</span>
                  <span className="text-slate-400">|</span>
                  <span className="truncate max-w-[120px] sm:max-w-xs">{currentCam.name}</span>
                </div>
                <div className="hidden sm:block bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 w-fit">
                  <span>GPS: {selectedProject.location} • 1080p 60FPS</span>
                </div>
              </div>

              {/* Digital Clock in Right Corner */}
              <div className="bg-black/80 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-lg border border-white/10 font-mono text-gold-400 text-[10px] sm:text-xs font-black shrink-0">
                {liveTimestamp} IST
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-black/70 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/10 text-[11px] sm:text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 truncate">
                <Thermometer size={14} className="text-gold-400 shrink-0" />
                <span className="truncate">Ambient: {metrics.weatherCondition}</span>
              </span>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsFeedLive(!isFeedLive)}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1 text-[10px] sm:text-xs"
                >
                  {isFeedLive ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isFeedLive ? 'Freeze Feed' : 'Resume Live'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. STAGE-BY-STAGE ENGINEERING MILESTONE BREAKDOWN */}
        <div className="bg-navy-900/90 p-6 sm:p-8 rounded-3xl border border-navy-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Structural Engineering Milestones
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Independent structural audit certification for {selectedProject.title}
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
              Last Audited: {metrics.lastInspected}
            </span>
          </div>

          <div className="space-y-4">
            {milestones.map((ms, index) => {
              const isCompleted = ms.percentage === 100 || ms.status === 'Completed';
              const isInProgress = ms.status === 'In Progress';

              return (
                <div
                  key={index}
                  className={`p-4 sm:p-5 rounded-2xl border transition ${
                    isCompleted
                      ? 'bg-navy-950/60 border-emerald-500/30'
                      : isInProgress
                      ? 'bg-navy-950 border-gold-500/40 shadow-gold-glow/20'
                      : 'bg-navy-950/40 border-navy-800/60 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-navy-950'
                            : isInProgress
                            ? 'bg-gold-500 text-navy-950'
                            : 'bg-navy-800 text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{ms.name}</h4>
                        {ms.inspectionNotes && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{ms.inspectionNotes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isInProgress
                            ? 'bg-gold-500/20 text-gold-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ms.status}
                      </span>
                      <span className="font-mono font-bold text-xs text-white">
                        {ms.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar inside Milestone */}
                  <div className="w-full bg-navy-800 rounded-full h-1.5 overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isInProgress
                          ? 'bg-gradient-to-r from-gold-500 to-amber-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${ms.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. PHOTO TIMELINE LOG & HOMEOWNER ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Construction Inspection Photo Log */}
          <div className="lg:col-span-7 bg-navy-900/90 p-6 sm:p-8 rounded-3xl border border-navy-800 shadow-xl space-y-4">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Camera size={20} className="text-gold-400" />
              Verified On-Site Inspection Photo Log
            </h3>
            <p className="text-xs text-slate-400">
              High-resolution field photography captured during weekly quality inspection rounds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(selectedProject.timelinePhotos && selectedProject.timelinePhotos.length > 0
                ? selectedProject.timelinePhotos
                : [
                    {
                      date: 'Nov 2026',
                      title: 'Level 32 Core Shear Wall Casting',
                      stage: 'RCC Framing',
                      image: selectedProject.images?.[0] || selectedProject.coverImage,
                      notes: 'M50 concrete batching plant tested. Curing confirmed.',
                    },
                    {
                      date: 'Oct 2026',
                      title: 'Double Glazed Facade Installation',
                      stage: 'Exterior Enclosure',
                      image: selectedProject.images?.[1] || selectedProject.coverImage,
                      notes: 'Thermal and acoustic sealing verified with air pressure gauges.',
                    },
                  ]
              ).map((photo, i) => (
                <div key={i} className="bg-navy-950 rounded-2xl overflow-hidden border border-navy-800 group">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-gold-400 font-bold px-2 py-0.5 rounded">
                      {photo.date} • {photo.stage}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h5 className="font-bold text-xs text-white truncate">{photo.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-snug">{photo.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homeowner Alerts Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-navy-900 to-navy-950 p-6 sm:p-8 rounded-3xl border border-navy-800 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">
              Homeowner Direct Service
            </span>
            <h3 className="text-2xl font-bold font-display text-white">
              Get WhatsApp Live Drone & Progress Updates
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you an investor or homeowner in {selectedProject.title}? Enter your flat/unit number
              and WhatsApp phone to receive bi-weekly aerial drone videos, engineering audit notes,
              and possession schedule alerts.
            </p>

            {subscribed ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Subscription Confirmed!</h4>
                <p className="text-xs text-slate-300">
                  You are now registered for priority WhatsApp telemetry dispatches for {selectedProject.title}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-navy-950 border border-navy-700 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={subscriberPhone}
                      onChange={(e) => setSubscriberPhone(e.target.value)}
                      placeholder="+91 93466 38123"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-navy-950 border border-navy-700 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Flat / Unit No.
                    </label>
                    <input
                      type="text"
                      value={subscriberUnit}
                      onChange={(e) => setSubscriberUnit(e.target.value)}
                      placeholder="e.g. Unit 1804"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-navy-950 border border-navy-700 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle size={16} />
                  <span>Subscribe to WhatsApp Updates</span>
                </button>
              </form>
            )}

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck size={14} className="text-gold-400 shrink-0" />
              <span>Verified Homeowner Registry • RERA Audited Telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionTracker;
