import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Heart,
  User,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  FileText,
  ChevronDown,
  PhoneCall,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: '3D Studio', path: '/visualizer', is3D: true },
    { name: 'Live Tracker', path: '/tracker', isLive: true },
    { name: 'Completed', path: '/completed-projects' },
    { name: 'Ongoing', path: '/ongoing-projects' },
    { name: 'Upcoming', path: '/upcoming-projects' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md shadow-xl py-3 border-b border-navy-800'
          : 'bg-navy-900 py-4 border-b border-navy-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <Building2 size={24} className="text-navy-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Build<span className="text-gold-400">Master</span>
              </span>
              <span className="block text-[10px] tracking-widest text-slate-300 uppercase font-semibold">
                Construction & Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
                    link.isLive
                      ? isActive
                        ? 'text-red-400 bg-red-950/40 font-bold border border-red-500/30'
                        : 'text-red-300 hover:text-red-200 bg-red-950/20 border border-red-500/20'
                      : isActive
                      ? 'text-gold-400 bg-white/5 font-bold'
                      : 'text-slate-200 hover:text-gold-300 hover:bg-white/5'
                  }`
                }
              >
                {link.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                {link.is3D && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-gold-400 to-amber-500 text-navy-950 shadow-sm">
                    3D
                  </span>
                )}
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* PDF Quotation Generator Button */}
            <Link
              to="/quotation"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-400/30 text-xs font-bold transition shadow-sm"
              title="Instant PDF Quotation & Cost Sheet"
            >
              <FileText size={15} />
              <span>Get Quote</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl bg-navy-800/80 hover:bg-navy-700/80 text-slate-200 hover:text-white transition border border-navy-700/50"
              title="My Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'text-rose-400 fill-rose-400' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 text-navy-950 text-xs font-black flex items-center justify-center shadow-md animate-scaleIn">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Quick Contact hotline */}
            <a
              href="tel:+18005552845"
              className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800/40 text-slate-300 hover:text-gold-300 text-xs font-semibold border border-navy-700/30"
            >
              <PhoneCall size={14} className="text-gold-400" />
              <span>(800) 555-BUILD</span>
            </a>

            {/* User Profile / Admin or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-gold-400"
                  />
                  <span className="text-xs font-bold truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-800">
                        {user.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-navy-900 bg-amber-50 hover:bg-amber-100 text-amber-900 transition"
                      >
                        <ShieldAlert size={16} className="text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-enquiries"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <FileText size={16} className="text-slate-400" />
                      My Enquiries
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Heart size={16} className="text-rose-500" />
                      Saved Wishlist ({wishlistCount})
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-gold-glow transition"
              >
                <User size={16} />
                <span>Login / Register</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-200"
              title="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'text-rose-400 fill-rose-400' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-navy-950 text-[10px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-950 border-b border-navy-800 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  link.isLive
                    ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                    : isActive
                    ? 'text-gold-400 bg-white/10 font-bold'
                    : 'text-slate-200 hover:text-gold-300'
                }`
              }
            >
              {link.isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {link.is3D && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-gold-400 text-navy-950">
                  3D
                </span>
              )}
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/quotation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-gold-400 bg-gold-500/10 border border-gold-400/30"
          >
            <FileText size={16} />
            <span>Generate PDF Quotation</span>
          </Link>

          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-white text-xs font-semibold">
                  <span>Signed in as:</span>
                  <span className="text-gold-400 font-bold">{user.name}</span>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold"
                  >
                    <ShieldAlert size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/my-enquiries"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  My Enquiries
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gold-500 text-navy-950 font-bold text-sm"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
