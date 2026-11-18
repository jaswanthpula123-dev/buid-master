import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MessageSquare, Calendar, Building, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyEnquiries = () => {
  const { user, loading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEnquiries = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.get('/enquiries/my');
        if (res.data.success) {
          setEnquiries(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load my enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyEnquiries();
    }
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const statusColors = {
    New: 'bg-blue-100 text-blue-800 border-blue-200',
    Contacted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
    Closed: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-navy-950 text-white py-12 mb-10 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/10 text-gold-400 border border-gold-400/20 mb-3">
            <MessageSquare size={14} />
            Customer Activity
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2">
            My Enquiries & Inspection Requests
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Track the status of your site tour requests, pricing inquiries, and messages submitted to BuildMaster.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-xl font-bold text-navy-950 font-display">No Enquiries Found</h3>
            <p className="text-slate-500 text-sm mt-1 mb-4">
              You have not submitted any enquiries yet. Inquire on any property or project to see it here.
            </p>
            <Link
              to="/properties"
              className="px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-600 block">
                      {enq.enquiryType} Enquiry
                    </span>
                    <h3 className="text-base font-bold text-navy-950 font-display">
                      {enq.propertyTitle || enq.projectTitle || 'General Construction Enquiry'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        statusColors[enq.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{enq.message}"
                </p>

                {enq.notes && (
                  <div className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Builder Team Note:</span> {enq.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnquiries;
