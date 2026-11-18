import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Printer,
  Building,
  Home,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Layers,
  Sliders,
  DollarSign,
  ChevronRight,
  User,
  Phone,
  Mail,
  Car,
} from 'lucide-react';
import api from '../services/api';
import { formatINR, formatPricePerSqFt } from '../utils/formatCurrency';
import { generateQuotationPdf } from '../utils/generateQuotationPdf';
import { useAuth } from '../context/AuthContext';

const QuotationGenerator = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Client Information
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '+91 98765 43210');
  const [clientEmail, setClientEmail] = useState(user?.email || 'buyer@example.com');
  const [clientCity, setClientCity] = useState('Mumbai, Maharashtra');

  // Customization Options
  const [unitNo, setUnitNo] = useState('Tower A - Suite 1802');
  const [floorLevel, setFloorLevel] = useState(18);
  const [facingOption, setFacingOption] = useState('sea'); // 'sea' | 'garden' | 'standard'
  const [flooringUpgrade, setFlooringUpgrade] = useState('marble'); // 'marble' | 'teak' | 'granite' | 'oak' | 'standard'
  const [parkingBays, setParkingBays] = useState(2);
  const [includeSmartHome, setIncludeSmartHome] = useState(true);
  const [includeClubhouse, setIncludeClubhouse] = useState(true);
  const [gstType, setGstType] = useState('standard'); // 'standard' (5%) | 'ready_oc' (0%)

  // Status message
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Initial load: Fetch properties
  useEffect(() => {
    const fetchProps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/properties');
        if (res.data.success && res.data.data.length > 0) {
          const list = res.data.data;
          setProperties(list);

          const propId = searchParams.get('propertyId');
          if (propId) {
            const found = list.find((p) => p._id === propId || p.slug === propId);
            setSelectedProperty(found || list[0]);
          } else {
            setSelectedProperty(list[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching properties for quotation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [searchParams]);

  // Read initial query params
  useEffect(() => {
    const floorParam = searchParams.get('floorType');
    if (floorParam && ['marble', 'teak', 'granite', 'oak'].includes(floorParam)) {
      setFlooringUpgrade(floorParam);
    }
  }, [searchParams]);

  // Facing options map
  const facingMap = {
    sea: { label: 'Panoramic Sea Facing (+ ₹ 15.00 L)', text: 'Panoramic Ocean & Sea View', cost: 1500000 },
    garden: { label: 'Corner Botanical Garden Facing (+ ₹ 8.00 L)', text: 'Corner Botanical Garden View', cost: 800000 },
    standard: { label: 'Standard Boulevard View (Included)', text: 'Central Boulevard View', cost: 0 },
  };

  // Flooring upgrade map
  const flooringMap = {
    marble: { name: 'Italian Carrara Marble', cost: 650000 },
    teak: { name: 'Solid Teakwood Parquet', cost: 450000 },
    granite: { name: 'Polished Black Granite', cost: 520000 },
    oak: { name: 'Scandinavian Light Oak', cost: 380000 },
    standard: { name: 'Standard Vitrified Tiles', cost: 0 },
  };

  // CALCULATIONS (in INR ₹)
  const basePrice = selectedProperty ? selectedProperty.price : 24500000;
  const carpetArea = selectedProperty?.areaSqFt || 1950;
  const superArea = Math.round(carpetArea * 1.3);
  const baseRatePerSqFt = Math.round(basePrice / carpetArea);

  // Additional charges
  const floorRiseCost = Math.max(0, (floorLevel - 1) * 60000); // ₹ 60k per floor rise
  const plcFacingCost = facingMap[facingOption].cost;
  const flooringCost = flooringMap[flooringUpgrade].cost;
  const parkingCost = parkingBays * 500000; // ₹ 5 L per parking bay
  const clubhouseCost = includeClubhouse ? 450000 : 0;
  const infraCost = 350000;
  const smartHomeCost = includeSmartHome ? 380000 : 0;

  // Subtotal before tax
  const subtotalBeforeTax =
    basePrice +
    floorRiseCost +
    plcFacingCost +
    flooringCost +
    parkingCost +
    clubhouseCost +
    infraCost +
    smartHomeCost;

  // Taxes
  const gstRate = gstType === 'ready_oc' ? 0 : 5;
  const gstAmount = Math.round((subtotalBeforeTax * gstRate) / 100);
  const stampDutyRate = 6; // 6% in Maharashtra / Standard
  const stampDutyAmount = Math.round((subtotalBeforeTax * stampDutyRate) / 100);
  const legalFee = 35000;

  // Grand Total Turnkey Payable
  const grandTotal = subtotalBeforeTax + gstAmount + stampDutyAmount + legalFee;
  const quoteRefNo = `BM-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Handle PDF Generation & Download
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      generateQuotationPdf({
        quoteNo: quoteRefNo,
        clientName: clientName || 'Valued Home Buyer',
        clientPhone,
        clientEmail,
        clientCity,
        propertyTitle: selectedProperty?.title || 'BuildMaster Luxury Residence',
        propertyType: selectedProperty?.type || 'Residential Apartment',
        location: selectedProperty?.location || 'Downtown Bayview',
        superArea,
        carpetArea,
        unitNo,
        facing: facingMap[facingOption].text,
        baseRate: baseRatePerSqFt,
        baseCost: basePrice,
        floorRise: floorRiseCost,
        plcFacing: plcFacingCost,
        flooringUpgrade: flooringMap[flooringUpgrade].name,
        flooringCost,
        parkingBays,
        parkingCost,
        clubhouseCharges: clubhouseCost,
        infraCharges: infraCost,
        gstRate,
        stampDutyRate,
        registrationFee: legalFee,
      });

      setDownloadSuccess('PDF Quotation Downloaded Successfully!');
      setTimeout(() => setDownloadSuccess(''), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Submit as formal enquiry to MongoDB
  const handleSaveEnquiry = async () => {
    try {
      await api.post('/enquiries', {
        name: clientName || 'Prospective Buyer',
        email: clientEmail,
        phone: clientPhone,
        message: `Generated Cost Sheet for "${selectedProperty?.title || 'Property'}" (${unitNo}). Total Estimate: ${formatINR(grandTotal)}. Requesting official site visit & booking token.`,
        enquiryType: 'Quotation',
        propertyId: selectedProperty?._id,
      });
      setEnquirySuccess(true);
      setTimeout(() => setEnquirySuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit quote enquiry:', err);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-900 text-slate-100">
      {/* Header Banner */}
      <div className="bg-navy-950 border-b border-navy-800 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-400/30 mb-2">
                <FileText size={14} className="text-gold-400" />
                <span>Instant Cost Sheet & Proforma Invoicing</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                Official PDF Quotation Generator
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Configure your residence with exact floor rise, parking stalls, Italian marble upgrades, and RERA milestone schedules. Download a legally stamped PDF quotation instantly.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs sm:text-sm shadow-gold-glow flex items-center gap-2 transition hover:scale-105"
              >
                <Download size={16} />
                <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-bold flex items-center gap-2 transition"
              >
                <Printer size={15} />
                <span>Print Cost Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600/90 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl animate-scaleIn">
            <CheckCircle2 size={18} />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {enquirySuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-gold-500 text-navy-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl animate-scaleIn">
            <CheckCircle2 size={18} />
            <span>Quotation details saved! Our Chief Relationship Officer will contact you shortly.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: INTERACTIVE CONFIGURATION FORM (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Property Selection */}
            <div className="bg-navy-950/80 rounded-2xl p-5 border border-navy-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                  <Building size={15} />
                  1. Select Residence / Property
                </span>
                <span className="text-[11px] text-slate-400">{properties.length} Available</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Choose Property
                </label>
                <select
                  value={selectedProperty?._id || ''}
                  onChange={(e) => {
                    const found = properties.find((p) => p._id === e.target.value);
                    if (found) setSelectedProperty(found);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-gold-400"
                >
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} — {formatINR(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProperty && (
                <div className="p-3 rounded-xl bg-navy-900/60 border border-navy-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Typology:</span>
                    <span className="font-bold text-white">{selectedProperty.bedrooms} BHK · {selectedProperty.bathrooms} Baths</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carpet Area:</span>
                    <span className="font-bold text-gold-400">{carpetArea} sq.ft ({superArea} sq.ft Super)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Cost:</span>
                    <span className="font-bold text-white">{formatINR(basePrice)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Client Particulars */}
            <div className="bg-navy-950/80 rounded-2xl p-5 border border-navy-800 shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2 border-b border-navy-800 pb-3">
                <User size={15} />
                2. Prospective Buyer Particulars
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Singhania"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">City of Residence</label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            {/* 3. Unit, Floor & Customization Options */}
            <div className="bg-navy-950/80 rounded-2xl p-5 border border-navy-800 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2 border-b border-navy-800 pb-3">
                <Sliders size={15} />
                3. Unit Stacking & Luxury Upgrades
              </span>

              <div className="space-y-3.5 text-xs">
                {/* Unit No */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Unit / Flat Allotment</label>
                    <input
                      type="text"
                      value={unitNo}
                      onChange={(e) => setUnitNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Floor Level: Floor {floorLevel} (+{formatINR(floorRiseCost)})
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="38"
                      value={floorLevel}
                      onChange={(e) => setFloorLevel(Number(e.target.value))}
                      className="w-full accent-gold-500 cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Facing / PLC */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preferential Location (PLC)</label>
                  <select
                    value={facingOption}
                    onChange={(e) => setFacingOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs"
                  >
                    <option value="sea">{facingMap.sea.label}</option>
                    <option value="garden">{facingMap.garden.label}</option>
                    <option value="standard">{facingMap.standard.label}</option>
                  </select>
                </div>

                {/* Flooring Material Upgrade */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Custom Flooring Upgrade (from 3D Studio)
                  </label>
                  <select
                    value={flooringUpgrade}
                    onChange={(e) => setFlooringUpgrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-semibold text-xs"
                  >
                    <option value="marble">Italian Carrara Marble (+₹ 6.50 L)</option>
                    <option value="teak">Solid Teakwood Parquet (+₹ 4.50 L)</option>
                    <option value="granite">Polished Black Granite (+₹ 5.20 L)</option>
                    <option value="oak">Scandinavian Light Oak (+₹ 3.80 L)</option>
                    <option value="standard">Standard Vitrified Ceramic (Included)</option>
                  </select>
                </div>

                {/* Parking Bays */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Covered Basement Parking Bays: {parkingBays} Stalls (+{formatINR(parkingCost)})
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((bays) => (
                      <button
                        key={bays}
                        type="button"
                        onClick={() => setParkingBays(bays)}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs border ${
                          parkingBays === bays
                            ? 'bg-gold-500 text-navy-950 border-gold-400'
                            : 'bg-navy-900 text-slate-300 border-navy-700'
                        }`}
                      >
                        {bays} Stalls
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkbox Toggles */}
                <div className="pt-2 border-t border-navy-800/80 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeSmartHome}
                        onChange={(e) => setIncludeSmartHome(e.target.checked)}
                        className="accent-gold-500 rounded"
                      />
                      Smart Neural Home Automation
                    </span>
                    <span className="font-bold text-gold-400">+₹ 3.80 L</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeClubhouse}
                        onChange={(e) => setIncludeClubhouse(e.target.checked)}
                        className="accent-gold-500 rounded"
                      />
                      Clubhouse & Infinity Pool Membership
                    </span>
                    <span className="font-bold text-gold-400">+₹ 4.50 L</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HIGH-FIDELITY LIVE DOCUMENT PREVIEW (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Document Wrapper */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
              {/* Document Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-navy-950 pb-5 mb-5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center text-gold-400 font-black">
                      BM
                    </div>
                    <span className="font-display text-2xl font-black text-navy-950">
                      BUILD<span className="text-gold-600">MASTER</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-1">
                    Infrastructure & Luxury Real Estate Developers
                  </p>
                  <p className="text-[10px] text-slate-500">
                    RERA Reg: #BM-77401-2024 · ISO 9001:2015 · Corporate HQ, Mumbai
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300">
                    Proforma Cost Sheet
                  </span>
                  <p className="text-xs font-mono font-bold text-navy-950 mt-1">Ref: {quoteRefNo}</p>
                  <p className="text-[10px] text-slate-500">
                    Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Client & Unit Snapshot */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Buyer Details</span>
                  <p className="font-extrabold text-navy-950 text-sm mt-0.5">{clientName || 'Valued Home Buyer'}</p>
                  <p className="text-slate-600 text-[11px]">{clientPhone} · {clientEmail}</p>
                  <p className="text-slate-500 text-[11px]">{clientCity}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Property Specifications</span>
                  <p className="font-extrabold text-navy-950 text-sm mt-0.5">{selectedProperty?.title || 'Selected Residence'}</p>
                  <p className="text-slate-600 text-[11px]">{unitNo} · Floor {floorLevel}</p>
                  <p className="text-gold-700 font-bold text-[11px]">{carpetArea} sq.ft Carpet ({superArea} sq.ft Super)</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>Cost Components Breakdown</span>
                  <span>Amount (INR)</span>
                </h4>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">Base Construction Value (BSP)</p>
                      <p className="text-[11px] text-slate-500">{carpetArea} sq.ft @ ₹ {baseRatePerSqFt.toLocaleString('en-IN')}/sq.ft</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(basePrice)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">Floor Rise Charges</p>
                      <p className="text-[11px] text-slate-500">Floor {floorLevel} elevation stacking</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(floorRiseCost)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">Preferential Location Charges (PLC)</p>
                      <p className="text-[11px] text-slate-500">{facingMap[facingOption].text}</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(plcFacingCost)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">3D Configured Luxury Flooring</p>
                      <p className="text-[11px] text-slate-500">{flooringMap[flooringUpgrade].name}</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(flooringCost)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">Covered Dedicated Car Parking</p>
                      <p className="text-[11px] text-slate-500">{parkingBays} Stalls Allotted</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(parkingCost)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">Clubhouse & Amenities Fee</p>
                      <p className="text-[11px] text-slate-500">Lifetime access to gym, spa, infinity pool</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(clubhouseCost)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-navy-950">Infrastructure Development Charges (IDC)</p>
                      <p className="text-[11px] text-slate-500">Electrical sub-station, water connection, fire NOC</p>
                    </div>
                    <span className="font-bold text-navy-950">{formatINR(infraCost)}</span>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="bg-slate-100 p-2.5 rounded-xl flex justify-between items-center text-xs font-bold text-navy-950">
                  <span>Subtotal (Before Statutory Duties)</span>
                  <span className="text-sm">{formatINR(subtotalBeforeTax)}</span>
                </div>
              </div>

              {/* Taxes & Registration */}
              <div className="space-y-1.5 mb-6 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Government Statutory Taxes & Registration
                </span>
                <div className="flex justify-between py-0.5">
                  <span>Goods & Services Tax (GST @ {gstRate}%)</span>
                  <span className="font-bold text-navy-950">{formatINR(gstAmount)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Stamp Duty Registration (@ {stampDutyRate}%)</span>
                  <span className="font-bold text-navy-950">{formatINR(stampDutyAmount)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Legal & Title Verification Surcharge</span>
                  <span className="font-bold text-navy-950">{formatINR(legalFee)}</span>
                </div>
              </div>

              {/* Grand Total Bar */}
              <div className="bg-navy-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl mb-6">
                <div>
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
                    Total All-Inclusive Investment
                  </span>
                  <p className="text-[11px] text-slate-300">Net Turnkey Payable with Statutory Charges</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-2xl sm:text-3xl font-black font-display text-white text-gold-gradient">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons underneath preview */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Download size={16} />
                  <span>{isDownloading ? 'Generating...' : 'Download Stamped PDF'}</span>
                </button>

                <button
                  onClick={handleSaveEnquiry}
                  className="py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
                >
                  <Send size={15} />
                  <span>Reserve This Unit</span>
                </button>

                <a
                  href={`https://wa.me/15550192834?text=Hello%20BuildMaster,%20I%20have%20generated%20the%20cost%20sheet%20for%20${encodeURIComponent(selectedProperty?.title || 'Property')}%20(${unitNo})%20with%20grand%20total%20${encodeURIComponent(formatINR(grandTotal))}.%20Please%20verify%20availability.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationGenerator;
