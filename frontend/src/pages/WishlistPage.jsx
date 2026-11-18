import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Building2, Bed, Bath, Square, MapPin } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import PropertyCard from '../components/common/PropertyCard';

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-navy-950 text-white py-12 mb-10 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-400/20 mb-3">
            <Heart size={14} className="fill-rose-400" />
            Saved Shortlist
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2">
            My Property Wishlist
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Review and compare the luxury flats, apartments, and villas you have saved for further inspection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <Heart size={54} className="mx-auto text-slate-300 mb-4 stroke-1" />
            <h3 className="text-xl font-bold text-navy-950 font-display mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
              You haven't saved any properties yet. Click the heart icon on any flat or villa to shortlist it here.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              <span>Browse Properties for Sale</span>
              <ArrowRight size={16} className="text-gold-400" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-navy-950">
                You have {wishlist.length} saved propert{wishlist.length === 1 ? 'y' : 'ies'}
              </h2>
              <Link
                to="/properties"
                className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1"
              >
                Continue Browsing <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
