import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Layers,
  Sun,
  Moon,
  Sunset,
  Camera,
  Maximize2,
  Sparkles,
  CheckCircle2,
  Eye,
  RotateCcw,
  Building,
  Home,
  MapPin,
  Send,
  MessageCircle,
  HelpCircle,
  Download,
  ShieldCheck,
  ChevronRight,
  Sliders,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import ThreeHouseCanvas from '../components/3d/ThreeHouseCanvas';
import EnquiryModal from '../components/common/EnquiryModal';
import { formatINR } from '../utils/formatCurrency';

const HouseVisualizer = () => {
  const { id } = useParams();

  // Properties list for switching
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3D Visualizer States
  const [mode, setMode] = useState('dollhouse'); // 'dollhouse' | 'exterior'
  const [activeRoom, setActiveRoom] = useState('all'); // 'all' | 'living' | 'master' | 'kitchen' | 'bath' | 'balcony'
  const [wallColor, setWallColor] = useState('#F4EFE6');
  const [floorType, setFloorType] = useState('marble'); // 'marble' | 'teak' | 'granite' | 'oak'
  const [lightingMood, setLightingMood] = useState('day'); // 'day' | 'sunset' | 'night'
  const [showHotspots, setShowHotspots] = useState(true);

  // Add-ons for dynamic pricing calculation
  const [includeSmartHome, setIncludeSmartHome] = useState(true);
  const [includeDesignerLighting, setIncludeDesignerLighting] = useState(true);

  // Modal & screenshot capture
  const [showEnquiry, setShowEnquiry] = useState(false);
  const captureFnRef = useRef(null);
  const [capturedMessage, setCapturedMessage] = useState('');

  // Default fallback properties if API is empty
  const defaultPresets = [
    {
      _id: 'preset-1',
      title: 'The Imperial 4BHK Sky Penthouse',
      propertyType: 'Penthouse',
      location: 'Worli Sea Face, Mumbai',
      bedrooms: 4,
      bathrooms: 4,
      area: 3450,
      price: 48500000, // ₹ 4.85 Cr
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      _id: 'preset-2',
      title: 'Aura Waterfront Luxury Villa',
      propertyType: 'Villa',
      location: 'Palm Beach Road, Navi Mumbai',
      bedrooms: 5,
      bathrooms: 6,
      area: 4800,
      price: 65000000, // ₹ 6.50 Cr
      coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    },
    {
      _id: 'preset-3',
      title: 'Skyline Heights 3BHK Smart Home',
      propertyType: 'Flat',
      location: 'Bandra West, Mumbai',
      bedrooms: 3,
      bathrooms: 3,
      area: 1950,
      price: 24500000, // ₹ 2.45 Cr
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Fetch properties from backend API
  useEffect(() => {
    const fetchProps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/properties');
        if (res.data.success && res.data.data.length > 0) {
          const list = res.data.data;
          setProperties(list);
          if (id) {
            const found = list.find((p) => p._id === id || p.slug === id);
            setSelectedProperty(found || list[0]);
          } else {
            setSelectedProperty(list[0]);
          }
        } else {
          setProperties(defaultPresets);
          setSelectedProperty(defaultPresets[0]);
        }
      } catch (err) {
        console.error('Error fetching properties for 3D visualizer:', err);
        setProperties(defaultPresets);
        setSelectedProperty(defaultPresets[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [id]);

  // Wall color palettes
  const wallColors = [
    { label: 'Royal Pearl', hex: '#F4EFE6', bg: 'bg-[#F4EFE6]' },
    { label: 'Cashmere Cream', hex: '#EDE3D2', bg: 'bg-[#EDE3D2]' },
    { label: 'Desert Sand', hex: '#D6C7B2', bg: 'bg-[#D6C7B2]' },
    { label: 'Modern Slate', hex: '#4A5568', bg: 'bg-[#4A5568]' },
    { label: 'Tuscan Terracotta', hex: '#9E5B42', bg: 'bg-[#9E5B42]' },
    { label: 'Emerald Sage', hex: '#3B5949', bg: 'bg-[#3B5949]' },
  ];

  // Flooring options
  const floorOptions = [
    {
      id: 'marble',
      name: 'Italian Carrara Marble',
      desc: 'Seamless off-white with natural grey veins & high-gloss reflection',
      extraCost: 650000,
    },
    {
      id: 'teak',
      name: 'Teakwood Parquet',
      desc: 'Solid Burmese teak hardwood with warm natural grain',
      extraCost: 450000,
    },
    {
      id: 'granite',
      name: 'Polished Black Granite',
      desc: 'Deep black stone with crystalline mirror finish',
      extraCost: 520000,
    },
    {
      id: 'oak',
      name: 'Scandinavian Light Oak',
      desc: 'Clean Nordic blonde timber with matte protective coating',
      extraCost: 380000,
    },
  ];

  // Dynamic Investment Calculation
  const basePrice = selectedProperty ? selectedProperty.price : 24500000;
  const currentFloorOption = floorOptions.find((f) => f.id === floorType) || floorOptions[0];
  const floorCost = currentFloorOption.extraCost;
  const smartHomeCost = includeSmartHome ? 380000 : 0;
  const designerLightingCost = includeDesignerLighting ? 240000 : 0;
  const totalTurnkeyEstimate = basePrice + floorCost + smartHomeCost + designerLightingCost;

  // Handle Screenshot Download
  const handleDownloadSnapshot = () => {
    if (captureFnRef.current) {
      const dataUrl = captureFnRef.current();
      const link = document.createElement('a');
      link.download = `BuildMaster-3D-House-${selectedProperty?.title || 'Tour'}.png`;
      link.href = dataUrl;
      link.click();
      setCapturedMessage('3D Architectural Render Downloaded!');
      setTimeout(() => setCapturedMessage(''), 3000);
    }
  };

  const handleReset = () => {
    setMode('dollhouse');
    setActiveRoom('all');
    setWallColor('#F4EFE6');
    setFloorType('marble');
    setLightingMood('day');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
      {/* Top Banner & Header */}
      <div className="border-b border-navy-800/80 bg-navy-900/60 backdrop-blur py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-400/30 mb-2">
                <Box size={14} className="text-gold-400" />
                <span>Next-Gen 3D Architectural Studio</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                Interactive 3D House Visualizer
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Explore furnished dollhouse floor plans, customize Italian marble floors & wall finishes, test day/night lighting, and inspect room dimensions in real-time.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadSnapshot}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 hover:border-gold-400 text-xs font-bold flex items-center gap-2 transition"
                title="Download 3D Render"
              >
                <Camera size={16} className="text-gold-400" />
                <span className="hidden sm:inline">Capture 3D Render</span>
              </button>

              <button
                onClick={() => setShowEnquiry(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs sm:text-sm shadow-gold-glow flex items-center gap-2 transition"
              >
                <Send size={15} />
                <span>Book On-Site VR Tour</span>
              </button>
            </div>
          </div>

          {/* Property Selector Strip */}
          <div className="mt-6 pt-4 border-t border-navy-800/60 flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Building size={14} className="text-gold-400" />
              Select Residence:
            </span>
            {properties.map((prop) => {
              const isSelected = selectedProperty?._id === prop._id;
              return (
                <button
                  key={prop._id}
                  onClick={() => setSelectedProperty(prop)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-md'
                      : 'bg-navy-800/80 text-slate-300 border-navy-700/80 hover:bg-navy-700'
                  }`}
                >
                  <span>{prop.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-navy-950/20 text-navy-950 font-extrabold' : 'bg-navy-900 text-gold-400'}`}>
                    {formatINR(prop.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main 3D Studio Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 3D Viewport & Navigation Tabs (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* View Mode Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-900/90 p-2 rounded-2xl border border-navy-800 shadow-xl">
              {/* Mode Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setMode('dollhouse');
                    setActiveRoom('all');
                  }}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition ${
                    mode === 'dollhouse'
                      ? 'bg-gold-500 text-navy-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers size={15} />
                  <span>3D Dollhouse</span>
                  <span className="hidden sm:inline">Floor Plan</span>
                </button>

                <button
                  onClick={() => setMode('exterior')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition ${
                    mode === 'exterior'
                      ? 'bg-gold-500 text-navy-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home size={15} />
                  <span>3D Exterior</span>
                  <span className="hidden sm:inline">Villa Facade</span>
                </button>
              </div>

              {/* Reset & Hotspots controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                    showHotspots
                      ? 'bg-navy-800 text-gold-400 border-gold-500/40'
                      : 'bg-navy-950 text-slate-500 border-navy-800'
                  }`}
                  title="Toggle Dimension Markers"
                >
                  <Eye size={13} />
                  <span>{showHotspots ? 'Dimensions ON' : 'Dimensions OFF'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 transition"
                  title="Reset 3D Camera"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* 3D Canvas Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-navy-800 bg-navy-950">
              <ThreeHouseCanvas
                mode={mode}
                activeRoom={activeRoom}
                wallColor={wallColor}
                floorType={floorType}
                lightingMood={lightingMood}
                showHotspots={showHotspots}
                onCaptureReady={(fn) => {
                  captureFnRef.current = fn;
                }}
              />

              {capturedMessage && (
                <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-scaleIn">
                  <CheckCircle2 size={16} />
                  <span>{capturedMessage}</span>
                </div>
              )}
            </div>

            {/* Room-by-Room Walkthrough Focus Toolbar (when in dollhouse mode) */}
            {mode === 'dollhouse' && (
              <div className="bg-navy-900/80 backdrop-blur p-3 rounded-2xl border border-navy-800">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-gold-400" />
                    Focus Room Walkthrough:
                  </span>
                  <span className="text-[11px] text-slate-400">Click room to fly camera in</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'all', label: 'All Layout', icon: '📐' },
                    { id: 'living', label: 'Living Lounge', icon: '🛋️' },
                    { id: 'master', label: 'Master Suite', icon: '🛏️' },
                    { id: 'kitchen', label: 'Kitchen Island', icon: '🍳' },
                    { id: 'bath', label: 'Ensuite Bath', icon: '🚿' },
                    { id: 'balcony', label: 'Private Deck', icon: '🌿' },
                  ].map((room) => {
                    const isActive = activeRoom === room.id;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoom(room.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border ${
                          isActive
                            ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-md scale-[1.02]'
                            : 'bg-navy-950/70 text-slate-300 border-navy-800 hover:bg-navy-800'
                        }`}
                      >
                        <span className="text-base">{room.icon}</span>
                        <span className="truncate w-full text-center">{room.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Material Configurator, Lighting Studio & Pricing (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Property Overview Card */}
            {selectedProperty && (
              <div className="bg-navy-900/90 rounded-2xl p-5 border border-navy-800 shadow-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-400/30">
                      {selectedProperty.propertyType}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-1.5">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-gold-400" />
                      <span>{selectedProperty.location}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-navy-800/80 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bedrooms</span>
                    <span className="font-bold text-white text-sm">{selectedProperty.bedrooms} BHK</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bathrooms</span>
                    <span className="font-bold text-white text-sm">{selectedProperty.bathrooms} Baths</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Super Built-up</span>
                    <span className="font-bold text-gold-400 text-sm">{selectedProperty.area} sq.ft</span>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Time-of-Day Lighting Studio */}
            <div className="bg-navy-900/90 rounded-2xl p-5 border border-navy-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sun size={15} className="text-amber-400" />
                  Lighting Atmosphere
                </span>
                <span className="text-[11px] font-bold text-gold-400 capitalize">{lightingMood} Mode</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setLightingMood('day')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border ${
                    lightingMood === 'day'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400 shadow-md'
                      : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
                  }`}
                >
                  <Sun size={18} className="text-amber-400" />
                  <span>Daylight 12PM</span>
                </button>

                <button
                  onClick={() => setLightingMood('sunset')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border ${
                    lightingMood === 'sunset'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-400 shadow-md'
                      : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
                  }`}
                >
                  <Sunset size={18} className="text-orange-400" />
                  <span>Sunset 6PM</span>
                </button>

                <button
                  onClick={() => setLightingMood('night')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border ${
                    lightingMood === 'night'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-400 shadow-md'
                      : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
                  }`}
                >
                  <Moon size={18} className="text-blue-400" />
                  <span>Night Luxe 9PM</span>
                </button>
              </div>
            </div>

            {/* 2. Flooring Material Customizer */}
            <div className="bg-navy-900/90 rounded-2xl p-5 border border-navy-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers size={15} className="text-gold-400" />
                  Flooring Material
                </span>
                <span className="text-[11px] font-bold text-gold-400">
                  +{formatINR(currentFloorOption.extraCost)}
                </span>
              </div>

              <div className="space-y-2">
                {floorOptions.map((opt) => {
                  const isSelected = floorType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFloorType(opt.id)}
                      className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-navy-800 text-white border-gold-400 shadow-md'
                          : 'bg-navy-950/70 text-slate-300 border-navy-800 hover:bg-navy-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-gold-400 bg-gold-400' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-navy-950 rounded-full"></div>}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{opt.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{opt.desc}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-gold-400 shrink-0">
                        {opt.extraCost === 0 ? 'Standard' : `+${formatINR(opt.extraCost)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Wall Color Customizer */}
            <div className="bg-navy-900/90 rounded-2xl p-5 border border-navy-800 shadow-lg space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders size={15} className="text-gold-400" />
                Wall Paint & Accent Color
              </span>

              <div className="grid grid-cols-6 gap-2 pt-1">
                {wallColors.map((col) => {
                  const isSelected = wallColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      onClick={() => setWallColor(col.hex)}
                      className={`h-10 rounded-xl transition border-2 flex items-center justify-center ${col.bg} ${
                        isSelected ? 'border-gold-400 ring-2 ring-gold-400/50 scale-105' : 'border-slate-700/60'
                      }`}
                      title={col.label}
                    >
                      {isSelected && <CheckCircle2 size={16} className={col.hex === '#4A5568' || col.hex === '#3B5949' || col.hex === '#9E5B42' ? 'text-white' : 'text-navy-950'} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Real-time Investment Calculation in ₹ INR */}
            <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-2xl p-5 border border-gold-500/30 shadow-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <Sparkles size={14} />
                Dynamic Investment Breakdown (INR)
              </h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-navy-800 text-slate-300">
                  <span>Base Residence Cost:</span>
                  <span className="font-bold text-white">{formatINR(basePrice)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-navy-800 text-slate-300">
                  <span>Custom Flooring ({currentFloorOption.name}):</span>
                  <span className="font-bold text-gold-400">+{formatINR(floorCost)}</span>
                </div>

                <label className="flex items-center justify-between py-1 border-b border-navy-800 text-slate-300 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeSmartHome}
                      onChange={(e) => setIncludeSmartHome(e.target.checked)}
                      className="accent-gold-500 rounded"
                    />
                    Smart Home Automation
                  </span>
                  <span className="font-bold text-gold-400">+₹ 3.80 L</span>
                </label>

                <label className="flex items-center justify-between py-1 border-b border-navy-800 text-slate-300 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeDesignerLighting}
                      onChange={(e) => setIncludeDesignerLighting(e.target.checked)}
                      className="accent-gold-500 rounded"
                    />
                    Architectural Lighting Fixtures
                  </span>
                  <span className="font-bold text-gold-400">+₹ 2.40 L</span>
                </label>

                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span className="text-white">Estimated Turnkey Total:</span>
                  <span className="text-gold-400 text-base">{formatINR(totalTurnkeyEstimate)}</span>
                </div>
              </div>

              <Link
                to={`/quotation?propertyId=${selectedProperty?._id}&floorType=${floorType}`}
                className="w-full mt-2 py-2.5 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 text-gold-400 border border-gold-400/40 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <FileText size={15} />
                <span>Generate Official PDF Cost Sheet</span>
              </Link>

              <button
                onClick={() => setShowEnquiry(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-sm shadow-gold-glow flex items-center justify-center gap-2 transition"
              >
                <Send size={16} />
                <span>Enquire With This 3D Configuration</span>
              </button>

              <a
                href={`https://wa.me/919346638123?text=Hello%20BuildMaster,%20I%20configured%20the%20${encodeURIComponent(selectedProperty?.title || 'House')}%20in%203D%20with%20${encodeURIComponent(currentFloorOption.name)}%20estimated%20at%20${encodeURIComponent(formatINR(totalTurnkeyEstimate))}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageCircle size={15} />
                <span>Share 3D Config on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default HouseVisualizer;
