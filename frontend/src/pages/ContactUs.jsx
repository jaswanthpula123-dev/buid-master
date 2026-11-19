import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContactUs = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/enquiries', {
        ...formData,
        enquiryType: 'General',
      });

      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          message: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-navy-950 text-white py-14 mb-12 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/10 text-gold-400 border border-gold-400/20 mb-3">
            <Phone size={14} />
            Direct Communication
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-3">
            Contact BuildMaster
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Get in touch with our master builders, schedule private project tours, or discuss custom
            flat modifications directly with our senior architectural consultants.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-premium border border-slate-100 space-y-6">
              <h2 className="text-2xl font-bold font-display text-navy-950">
                Corporate Headquarters
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</h4>
                    <p className="text-sm font-semibold text-navy-950 mt-0.5 leading-relaxed">
                      BuildMaster Tower, Suite 500, 740 Skyline Boulevard, Downtown Financial District, NY 10005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Numbers</h4>
                    <p className="text-sm font-semibold text-navy-950 mt-0.5">
                      Direct / WhatsApp: <a href="tel:+919346638123" className="hover:text-gold-600 transition">+91 93466 38123</a><br />
                      Helpline: <a href="tel:+919346638123" className="hover:text-gold-600 transition">+91 93466 38123</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Enquiries</h4>
                    <p className="text-sm font-semibold text-navy-950 mt-0.5">
                      info@buildmaster.com<br />
                      sales@buildmaster.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Operating Hours</h4>
                    <p className="text-sm font-semibold text-navy-950 mt-0.5">
                      Monday - Saturday: 9:00 AM - 7:00 PM EST<br />
                      Sunday: Site Inspections by Appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Action */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="https://wa.me/919346638123?text=Hello%20BuildMaster,%20I%20would%20like%20to%20enquire%20about%20your%20buildings%20and%20properties."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <MessageCircle size={18} />
                  <span>Chat With Us on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* RERA and Licensing Certificate Box */}
            <div className="bg-navy-900 text-white p-6 rounded-3xl border border-navy-800 flex items-center gap-4">
              <ShieldCheck size={36} className="text-gold-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Registered & Audited Developer</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  RERA License #BM-77401-2024. All deposits held in statutory escrow accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-premium border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600 block mb-1">
                Direct Inquiry Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950 mb-2">
                Send Us a Message
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mb-6">
                Fill in your details and an authorized BuildMaster relationship manager will respond
                within 2 business hours.
              </p>

              {success ? (
                <div className="py-12 text-center bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-navy-950 font-display mb-1">
                    Thank You for Reaching Out!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Your enquiry has been securely logged into our database. Our project director
                    will review your query and contact you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-navy-900 text-white font-bold text-xs rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Reynolds"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="david@example.com"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 93466 38123"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Requirement Details *
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know which building or property you are interested in, preferred site visit date, or custom requests..."
                      className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-extrabold text-sm uppercase tracking-wider shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Send size={16} />
                    <span>{loading ? 'Submitting...' : 'Submit Contact Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* GOOGLE MAPS EMBED SECTION */}
        <div className="mt-16 bg-white p-4 rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="mb-3 px-2 pt-1 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-navy-950 flex items-center gap-2">
              <MapPin size={18} className="text-gold-600" />
              BuildMaster Experience Center & Head Office Map
            </h3>
            <span className="text-xs text-slate-500">GPS: 40.7061° N, 74.0092° W</span>
          </div>
          <div className="h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <iframe
              title="BuildMaster Corporate Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.361465985871!2d-74.01168532347714!3d40.70562897139446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae01!2sWall%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
