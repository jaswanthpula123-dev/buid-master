import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Home,
  MessageSquare,
  Globe,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ closeMobile }) => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Projects', path: '/admin/projects', icon: Building },
    { name: 'Manage Properties', path: '/admin/properties', icon: Home },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-navy-950 text-white min-h-screen flex flex-col justify-between border-r border-navy-800">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-gold-glow">
              <Building size={20} className="text-navy-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-lg font-black tracking-tight text-white block">
                Build<span className="text-gold-400">Master</span>
              </span>
              <span className="text-[10px] tracking-wider text-gold-400 uppercase font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User Badge */}
        <div className="px-6 py-4 border-b border-navy-800/60 bg-navy-900/50 flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gold-400"
          />
          <div className="overflow-hidden">
            <h5 className="text-xs font-bold text-white truncate">{user?.name}</h5>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Super Admin
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-navy-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-gold-400 hover:bg-white/5 transition"
        >
          <Globe size={16} />
          <span>View Public Website</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
