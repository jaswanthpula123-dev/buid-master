import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart, ArrowRight, Box } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR, formatPricePerSqFt } from '../../utils/formatCurrency';
import EnquiryModal from './EnquiryModal';

const PropertyCard = ({ property }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showEnquiry, setShowEnquiry] = useState(false);

  const favorited = isInWishlist(property._id);

  const statusColors = {
    Available: 'bg-emerald-500 text-white',
    Booked: 'bg-amber-500 text-navy-950 font-bold',
    Sold: 'bg-rose-500 text-white',
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
        {/* Cover Image & Badges */}
        <div className="relative h-60 overflow-hidden bg-slate-900">
          <img
            src={property.coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-black/20"></div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${
                statusColors[property.status] || 'bg-slate-700 text-white'
              }`}
            >
              {property.status}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(property)}
            title={favorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center transition shadow-md hover:scale-110 active:scale-95"
          >
            <Heart
              size={18}
              className={`transition-colors ${favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`}
            />
          </button>

          {/* Type Tag & Location Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <span className="bg-navy-900/85 backdrop-blur-md text-gold-400 border border-gold-400/30 text-xs px-2.5 py-1 rounded-md font-semibold">
              {property.type}
            </span>
            {property.projectTitle && (
              <span className="text-[11px] text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded truncate max-w-[160px]">
                {property.projectTitle}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-2xl font-extrabold text-gold-600 font-display">
                {property.priceDisplay?.includes('₹') ? property.priceDisplay : formatINR(property.price)}
              </span>
              <span className="text-xs text-slate-500">
                {formatPricePerSqFt(property.price, property.areaSqFt)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-navy-950 font-display line-clamp-1 group-hover:text-gold-600 transition-colors">
              {property.title}
            </h3>

            <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-1.5">
              <MapPin size={13} className="text-gold-500 shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-1.5">
              <Bed size={15} className="text-gold-600 shrink-0" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={15} className="text-gold-600 shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square size={15} className="text-gold-600 shrink-0" />
              <span>{property.areaSqFt} sq.ft</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <Link
              to={`/visualizer/${property._id || property.slug}`}
              className="py-2 px-2.5 rounded-xl bg-navy-950 text-gold-400 hover:text-white border border-gold-500/30 text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm hover:border-gold-400"
              title="Interactive 3D House Visualizer"
            >
              <Box size={14} className="text-gold-400" />
              <span>3D</span>
            </Link>
            <Link
              to={`/properties/${property._id || property.slug}`}
              className="flex-1 py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1 transition"
            >
              Details
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setShowEnquiry(true)}
              className="py-2 px-3.5 rounded-xl border border-gold-500/50 bg-gold-50 text-gold-700 hover:bg-gold-500 hover:text-navy-950 font-bold text-xs sm:text-sm transition"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        property={property}
      />
    </>
  );
};

export default PropertyCard;
