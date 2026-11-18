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
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

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
          ? 'bg-navy-950/95 backdrop-blur-md shadow-2xl py-2.5 border-b border-navy-800/80'
          : 'bg-navy-950/90 backdrop-blur-sm py-3.5 border-b border-navy-800/60'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 xl:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <Building2 size={24} className="text-navy-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Build<span className="text-gold-400">Master</span>
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase font-semibold">
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
              href="tel:+18005552845"
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800/60 text-slate-200 hover:text-gold-300 text-xs font-bold border border-navy-700/40 whitespace-nowrap shrink-0"
            >
              <PhoneCall size={14} className="text-gold-400 shrink-0" />
              <span className="whitespace-nowrap">(800) 555-BUILD</span>
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
