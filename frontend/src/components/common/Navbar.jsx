import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
          ? 'bg-navy-950/95 backdrop-blur-md shadow-2xl py-2.5 border-b border-navy-800/80'
          : 'bg-navy-950/90 backdrop-blur-sm py-3.5 border-b border-navy-800/60'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 xl:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform shrink-0">
              <Building2 size={22} className="text-navy-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Build<span className="text-gold-400">Master</span>
              </span>
              <span className="hidden sm:block text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase font-semibold">
                Construction & Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Clean Single-Row Layout */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-200 hover:text-gold-300 hover:bg-white/5'
                }`
              }
            >
              Home
            </NavLink>

            {/* 3D Studio */}
            <NavLink
              to="/visualizer"
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-gold-300 bg-gold-500/20 border border-gold-400/50 shadow-sm shadow-gold-500/20'
                    : 'text-gold-400 hover:text-gold-200 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-400/30'
                }`
              }
            >
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-gold-400 to-amber-500 text-navy-950 shadow-sm">
                3D
              </span>
              <span>3D Studio</span>
            </NavLink>

            {/* Live Tracker */}
            <NavLink
              to="/tracker"
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-red-300 bg-red-950/70 border border-red-500/50 shadow-sm shadow-red-500/20'
                    : 'text-red-400 hover:text-red-200 bg-red-950/30 hover:bg-red-950/50 border border-red-500/30'
                }`
              }
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Live Tracker</span>
            </NavLink>

            {/* Projects Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setProjectsDropdownOpen(true)}
              onMouseLeave={() => setProjectsDropdownOpen(false)}
            >
              <button
                onClick={() => setProjectsDropdownOpen(!projectsDropdownOpen)}
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold text-slate-200 hover:text-gold-300 hover:bg-white/5 flex items-center gap-1 transition whitespace-nowrap"
              >
                <span>Projects</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    projectsDropdownOpen ? 'rotate-180 text-gold-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {projectsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-navy-950/95 backdrop-blur-xl border border-navy-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <Link
                    to="/ongoing-projects"
                    onClick={() => setProjectsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-slate-200 hover:text-gold-300 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center text-sm">
                      🏗️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-gold-400">Ongoing Projects</p>
                      <p className="text-[10px] text-slate-400">6 Active Sites · Live Telemetry</p>
                    </div>
                  </Link>

                  <Link
                    to="/completed-projects"
                    onClick={() => setProjectsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-slate-200 hover:text-gold-300 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-sm">
                      🏆
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-gold-400">Completed Landmarks</p>
                      <p className="text-[10px] text-slate-400">6 Delivered · OC Approved</p>
                    </div>
                  </Link>

                  <Link
                    to="/upcoming-projects"
                    onClick={() => setProjectsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-slate-200 hover:text-gold-300 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-sm">
                      🚀
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-gold-400">Upcoming Masterplans</p>
                      <p className="text-[10px] text-slate-400">2027–2030 Horizons</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Properties */}
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-200 hover:text-gold-300 hover:bg-white/5'
                }`
              }
            >
              Properties
            </NavLink>

            {/* About Us */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-200 hover:text-gold-300 hover:bg-white/5'
                }`
              }
            >
              About Us
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-200 hover:text-gold-300 hover:bg-white/5'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* PDF Quotation Generator Button */}
            <Link
              to="/quotation"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-black text-xs shadow-md shadow-gold-500/20 hover:scale-105 transition whitespace-nowrap shrink-0"
              title="Instant PDF Quotation & Cost Sheet"
            >
              <FileText size={15} className="stroke-[2.5]" />
              <span>Get Quote</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl bg-navy-800/80 hover:bg-navy-700/80 text-slate-200 hover:text-white transition border border-navy-700/50 shrink-0"
              title="My Wishlist"
            >
              <Heart size={18} className={wishlistCount > 0 ? 'text-rose-400 fill-rose-400' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-navy-950 text-[10px] font-black flex items-center justify-center shadow-md animate-scaleIn">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Quick Contact hotline - only on extra wide screens, with strict nowrap to prevent line breaks */}
            <a
              href="tel:+919346638123"
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800/60 text-slate-200 hover:text-gold-300 text-xs font-bold border border-navy-700/40 whitespace-nowrap shrink-0"
            >
              <PhoneCall size={14} className="text-gold-400 shrink-0" />
              <span className="whitespace-nowrap">+91 93466 38123</span>
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

          {/* Mobile Right Controls: Wishlist + Hamburger */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl bg-navy-800/80 text-slate-200 border border-navy-700/60 active:scale-95 transition"
              title="Wishlist"
            >
              <Heart size={18} className={wishlistCount > 0 ? 'text-rose-400 fill-rose-400' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-navy-950 text-[10px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="p-2 rounded-xl bg-navy-800/90 text-slate-100 hover:text-white border border-navy-700 active:scale-95 transition shadow-sm"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} className="text-gold-400" /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Overlay mounted via Portal directly to body */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bottom-0 z-[9999] bg-navy-950/98 backdrop-blur-2xl border-t border-navy-800/80 overflow-y-auto animate-slideDown">
          <div className="px-4 py-5 space-y-4 max-w-md mx-auto pb-16">
            {/* 1. Flagship Innovations Strip */}
            <div className="grid grid-cols-2 gap-2.5">
              <NavLink
                to="/visualizer"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-gold-500/10 border border-gold-400/30 text-gold-400 flex flex-col items-center justify-center text-center gap-1 active:scale-95 transition"
              >
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gold-400 text-navy-950 shadow-sm">
                  3D WebGL
                </span>
                <span className="text-xs font-black text-white">3D Studio</span>
                <span className="text-[10px] text-slate-300">House Visualizer</span>
              </NavLink>

              <NavLink
                to="/tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400 flex flex-col items-center justify-center text-center gap-1 active:scale-95 transition"
              >
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-red-400">Live CCTV</span>
                </div>
                <span className="text-xs font-black text-white">Site Tracker</span>
                <span className="text-[10px] text-slate-300">HUD Telemetry</span>
              </NavLink>
            </div>

            {/* 2. Full PDF Quotation Button */}
            <Link
              to="/quotation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 text-navy-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <FileText size={16} className="stroke-[2.5]" />
              <span>Generate PDF Quotation & Cost Sheet</span>
            </Link>

            {/* 3. Portfolio & Landmarks */}
            <div className="pt-2 border-t border-navy-800/80">
              <p className="text-[10px] font-black uppercase tracking-widest text-gold-400 mb-2 px-1">
                Architectural Portfolio
              </p>
              <div className="space-y-1">
                <NavLink
                  to="/ongoing-projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10"
                >
                  <span className="text-base">🏗️</span>
                  <div>
                    <p className="text-white font-bold">Ongoing Construction</p>
                    <p className="text-[10px] text-slate-400">6 Active Sites · Live Progress</p>
                  </div>
                </NavLink>

                <NavLink
                  to="/completed-projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10"
                >
                  <span className="text-base">🏆</span>
                  <div>
                    <p className="text-white font-bold">Completed Landmarks</p>
                    <p className="text-[10px] text-slate-400">6 Delivered · OC Approved</p>
                  </div>
                </NavLink>

                <NavLink
                  to="/upcoming-projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10"
                >
                  <span className="text-base">🚀</span>
                  <div>
                    <p className="text-white font-bold">Upcoming Masterplans</p>
                    <p className="text-[10px] text-slate-400">2027–2030 Horizons</p>
                  </div>
                </NavLink>

                <NavLink
                  to="/properties"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10"
                >
                  <span className="text-base">🏢</span>
                  <div>
                    <p className="text-white font-bold">Properties for Sale</p>
                    <p className="text-[10px] text-slate-400">Flats, Penthouses & Villas</p>
                  </div>
                </NavLink>
              </div>
            </div>

            {/* 4. Company & Support */}
            <div className="pt-2 border-t border-navy-800/80">
              <p className="text-[10px] font-black uppercase tracking-widest text-gold-400 mb-2 px-1">
                Company & Support
              </p>
              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-200 text-xs font-bold text-center hover:bg-white/5"
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-200 text-xs font-bold text-center hover:bg-white/5"
                >
                  Contact
                </NavLink>
              </div>

              {/* 1-Tap Hotline */}
              <a
                href="tel:+919346638123"
                className="mt-2.5 w-full py-2.5 px-3 rounded-xl bg-navy-900 border border-navy-800 text-gold-400 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <PhoneCall size={14} />
                <span>Call Hotline: +91 93466 38123</span>
              </a>
            </div>

            {/* 5. User Account / Login */}
            <div className="pt-2 border-t border-navy-800/80">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-navy-900">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-gold-400"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold-400/20 text-gold-300">
                      {user.role}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold justify-center"
                    >
                      <ShieldAlert size={15} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow active:scale-95 transition"
                >
                  <User size={15} />
                  <span>Login / Register Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Navbar;
