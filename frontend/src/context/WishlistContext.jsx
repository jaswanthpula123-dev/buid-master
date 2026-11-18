import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user logs in or page loads
  useEffect(() => {
    if (token && user) {
      fetchWishlist();
    } else {
      // For guests: load from local storage
      const saved = localStorage.getItem('buildmaster_guest_wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [token, user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlist.some(item => (item._id || item) === propertyId);
  };

  const toggleWishlist = async (property) => {
    const propId = property._id || property;
    const exists = isInWishlist(propId);

    if (token) {
      try {
        if (exists) {
          await api.delete(`/wishlist/${propId}`);
          setWishlist(prev => prev.filter(item => (item._id || item) !== propId));
        } else {
          await api.post(`/wishlist/${propId}`);
          setWishlist(prev => [...prev, property]);
        }
      } catch (err) {
        console.error('Error updating wishlist', err);
      }
    } else {
      // Guest mode
      let updated;
      if (exists) {
        updated = wishlist.filter(item => (item._id || item) !== propId);
      } else {
        updated = [...wishlist, property];
      }
      setWishlist(updated);
      localStorage.setItem('buildmaster_guest_wishlist', JSON.stringify(updated));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
