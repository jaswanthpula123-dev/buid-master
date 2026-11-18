import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Note editing state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/enquiries?${params.toString()}`);
      if (res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, search]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/enquiries/${id}`, { status });
      if (res.data.success) {
        setEnquiries(enquiries.map((e) => (e._id === id ? res.data.data : e)));
      }
    } catch (err) {
      alert('Failed to update enquiry status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer enquiry record?')) return;
    try {
      const res = await api.delete(`/enquiries/${id}`);
      if (res.data.success) {
        setEnquiries(enquiries.filter((e) => e._id !== id));
      }
    } catch (err) {
      alert('Failed to delete enquiry.');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedEnquiry) return;
    try {
      setSavingNote(true);
      const res = await api.put(`/enquiries/${selectedEnquiry._id}`, { notes: adminNote });
      if (res.data.success) {
        setEnquiries(enquiries.map((e) => (e._id === selectedEnquiry._id ? res.data.data : e)));
        setSelectedEnquiry(null);
      }
    } catch (err) {
      alert('Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display text-navy-950">
            Customer Enquiries & Tour Requests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming purchase leads, mark status, log internal follow-up notes, and call prospects.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'New', 'Contacted', 'In Progress', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-20 p-8">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
            <h4 className="font-bold text-navy-950 text-lg">No Enquiries Found</h4>
            <p className="text-slate-500 text-xs mt-1">There are no customer inquiries matching your filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enquiries.map((enq) => (
              <div key={enq._id} className="p-6 hover:bg-slate-50/60 transition space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-navy-950 text-base">{enq.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                        {enq.enquiryType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <a href={`mailto:${enq.email}`} className="flex items-center gap-1 hover:text-navy-950">
                        <Mail size={13} className="text-gold-600" />
                        {enq.email}
                      </a>
                      <a href={`tel:${enq.phone}`} className="flex items-center gap-1 hover:text-navy-950">
                        <Phone size={13} className="text-gold-600" />
                        {enq.phone}
                      </a>
                      <span>• Received: {new Date(enq.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-3">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-none ${
                        enq.status === 'New'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : enq.status === 'Contacted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : enq.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="New">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(enq._id)}
                      title="Delete Enquiry"
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Target Property / Project */}
                {(enq.propertyTitle || enq.projectTitle) && (
                  <div className="text-xs bg-slate-100/80 px-3 py-1.5 rounded-lg text-slate-700 font-semibold inline-block">
                    Inquiring About: {enq.propertyTitle || enq.projectTitle}
                  </div>
                )}

                {/* Message */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-sm text-slate-700">
                  <p className="whitespace-pre-line leading-relaxed">"{enq.message}"</p>
                </div>

                {/* Notes & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <div>
                    {enq.notes ? (
                      <p className="text-slate-600">
                        <span className="font-bold text-navy-950">Follow-up Note:</span> {enq.notes}
                      </p>
                    ) : (
                      <span className="text-slate-400 italic">No internal follow-up notes logged yet.</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setAdminNote(enq.notes || '');
                    }}
                    className="text-gold-600 hover:text-gold-700 font-bold flex items-center gap-1 shrink-0"
                  >
                    <Edit3 size={13} />
                    <span>{enq.notes ? 'Edit Note' : 'Add Note'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Edit Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold font-display text-navy-950">
              Admin Follow-up Note for {selectedEnquiry.name}
            </h3>
            <textarea
              rows="4"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Scheduled site tour for Saturday 3 PM. Sent pricing sheet to their email."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 resize-none"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={savingNote}
                className="px-5 py-2 text-xs font-bold bg-navy-900 text-white rounded-xl hover:bg-navy-800 disabled:opacity-50"
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;
