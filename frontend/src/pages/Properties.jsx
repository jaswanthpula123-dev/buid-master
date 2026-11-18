import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/common/PropertyCard';
import SectionHeading from '../components/common/SectionHeading';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state initialized from URL search params
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (type !== 'All') params.append('type', type);
      if (status !== 'All') params.append('status', status);
      if (location) params.append('location', location);
      if (bedrooms !== 'All') params.append('bedrooms', bedrooms);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/properties?${params.toString()}`);
      if (res.data.success) {
        setProperties(res.data.data);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [type, status, location, bedrooms, minPrice, maxPrice, search, sort]);

  const handleResetFilters = () => {
    setType('All');
    setStatus('All');
    setLocation('');
    setBedrooms('All');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Top Banner */}
      <div className="bg-navy-950 text-white py-14 mb-10 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/10 text-gold-400 border border-gold-400/20 mb-3">
            <Home size={14} />
            Exclusive Residential & Commercial Units
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-3">
            Properties For Sale
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Browse our hand-crafted flats, luxury high-rise apartments, beachfront villas, and independent
            residences available directly from BuildMaster with zero broker commission.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* COMPREHENSIVE FILTER BAR */}
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-slate-200 mb-10">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gold-600" />
              <h3 className="font-bold text-navy-950 text-sm sm:text-base font-display">
                Filter & Search Properties
              </h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-navy-950 flex items-center gap-1"
            >
              <RotateCcw size={13} />
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Penthouse, Sea View"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 font-medium"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Property Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Flat">Flat</option>
                <option value="Villa">Villa</option>
                <option value="Independent House">Independent House</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Status (Available, Booked, Sold) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Availability
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available for Sale</option>
                <option value="Booked">Under Booking</option>
                <option value="Sold">Sold Out</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="All">Any Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Max Budget
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="">Any Max Price</option>
                <option value="5000000">Up to ₹50 Lakhs</option>
                <option value="10000000">Up to ₹1 Crore</option>
                <option value="20000000">Up to ₹2 Crore</option>
                <option value="50000000">Up to ₹5 Crore</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sort Order
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 bg-white font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="area-high">Area: Largest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS BAR */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-bold text-slate-600">
            Showing <span className="text-navy-950 font-extrabold">{properties.length}</span> properties
          </p>
        </div>

        {/* PROPERTIES GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Home size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-xl font-bold text-navy-950 font-display">No Properties Match Your Filters</h3>
            <p className="text-slate-500 text-sm mt-1 mb-4">
              Try widening your budget range or selecting "All Types".
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
