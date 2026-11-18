import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Send,
  MessageCircle,
} from 'lucide-react';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-800 relative overflow-hidden">
      {/* Background architectural grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E3E62_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Company Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-gold-glow">
                <Building2 size={24} className="text-navy-950 stroke-[2.2]" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Build<span className="text-gold-400">Master</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leading the future of modern construction and luxury real estate. For over 18 years,
              BuildMaster has crafted landmark towers, premium township communities, and bespoke
              villas engineered to perfection.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 bg-gold-400/10 px-3 py-1.5 rounded-lg border border-gold-400/20">
                <ShieldCheck size={14} />
                RERA Registered
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                <Award size={14} />
                ISO 9001:2015
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span>
              Construction Portfolios
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/completed-projects" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-gold-500" />
                  Completed Buildings
                </Link>
              </li>
              <li>
                <Link to="/ongoing-projects" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-gold-500" />
                  Ongoing Construction Sites
                </Link>
              </li>
              <li>
                <Link to="/upcoming-projects" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-gold-500" />
                  Upcoming Masterplans
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-gold-500" />
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-gold-500" />
                  Builder Profile & Legacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-display text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span>
              Corporate Headquarters
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-gold-400 shrink-0 mt-0.5" />
                <span>BuildMaster Tower, 740 Skyline Boulevard, Suite 500, Metro Financial Center</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-gold-400 shrink-0" />
                <a href="tel:+18005552845" className="hover:text-white transition">
                  +1 (800) 555-BUILD / +1 (555) 019-2834
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-gold-400 shrink-0" />
                <a href="mailto:info@buildmaster.com" className="hover:text-white transition">
                  info@buildmaster.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={18} className="text-gold-400 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>

            {/* Direct WhatsApp Action */}
            <div className="mt-4">
              <a
                href="https://wa.me/15550192834?text=Hello%20BuildMaster,%20I%20would%20like%20to%20enquire%20about%20your%20buildings%20and%20properties."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Newsletter & Investor Alerts */}
          <div>
            <h4 className="text-white font-display text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span>
              VIP Pre-Launch Alerts
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe to receive exclusive invitations for upcoming project groundbreakings and
              first-allotment investor pricing.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-gold-400 transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 w-7 h-7 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center justify-center transition"
                >
                  <Send size={14} />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 font-semibold">
                  Thank you! You are on our VIP priority list.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BuildMaster Construction & Real Estate Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300 transition">Terms of Construction</Link>
            <Link to="/contact" className="hover:text-slate-300 transition">RERA Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
