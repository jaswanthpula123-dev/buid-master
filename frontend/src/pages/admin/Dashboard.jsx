import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Home,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/admin/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/stats/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const projects = stats?.projects || { total: 0, completed: 0, ongoing: 0, upcoming: 0 };
  const properties = stats?.properties || { total: 0, available: 0, booked: 0, sold: 0 };
  const enquiries = stats?.enquiries || { total: 0, new: 0 };
  const users = stats?.users || { totalCustomers: 0 };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display text-navy-950">
            Executive Construction Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time management of active sites, inventory availability, and customer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Plus size={16} className="text-gold-400" />
            <span>Add Project</span>
          </Link>

          <Link
            to="/admin/properties/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Plus size={16} />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* METRICS STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Building Projects"
          value={projects.total}
          subtitle={`${projects.ongoing} Ongoing • ${projects.completed} Completed`}
          icon={Building}
          color="blue"
        />

        <StatCard
          title="Active Ongoing Construction"
          value={projects.ongoing}
          subtitle={`${projects.upcoming} Upcoming Masterplans`}
          icon={Clock}
          color="gold"
        />

        <StatCard
          title="Properties For Sale"
          value={properties.total}
          subtitle={`${properties.available} Available • ${properties.sold} Sold`}
          icon={Home}
          color="emerald"
        />

        <StatCard
          title="Customer Inquiries"
          value={enquiries.total}
          subtitle={`${enquiries.new} New / Unread Inquiries`}
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* DETAILED SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy-950 font-display text-base">Projects By Category</h3>
            <Link to="/admin/projects" className="text-xs text-gold-600 font-bold hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Ongoing Construction
              </span>
              <span className="text-sm font-extrabold text-navy-950">{projects.ongoing}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Completed Buildings
              </span>
              <span className="text-sm font-extrabold text-navy-950">{projects.completed}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Upcoming Masterplans
              </span>
              <span className="text-sm font-extrabold text-navy-950">{projects.upcoming}</span>
            </div>
          </div>
        </div>

        {/* Property Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy-950 font-display text-base">Property Inventory</h3>
            <Link to="/admin/properties" className="text-xs text-gold-600 font-bold hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Available for Purchase
              </span>
              <span className="text-sm font-extrabold text-emerald-600">{properties.available}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Under Booking
              </span>
              <span className="text-sm font-extrabold text-amber-600">{properties.booked}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Sold Units
              </span>
              <span className="text-sm font-extrabold text-navy-950">{properties.sold}</span>
            </div>
          </div>
        </div>

        {/* Quick Help & Admin Actions */}
        <div className="bg-navy-950 text-white p-6 rounded-3xl border border-navy-800 shadow-sm space-y-4">
          <div className="border-b border-navy-800 pb-3">
            <h3 className="font-bold font-display text-base text-white">System Status</h3>
            <p className="text-xs text-slate-400">BuildMaster Database & API Online</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-navy-900">
              <span className="text-slate-400">Total Registered Customers:</span>
              <span className="font-bold text-gold-400">{users.totalCustomers}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-navy-900">
              <span className="text-slate-400">Real-time Sync:</span>
              <span className="font-bold text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">RERA Compliance:</span>
              <span className="font-bold text-gold-400">Verified</span>
            </div>
          </div>

          <Link
            to="/admin/enquiries"
            className="w-full mt-2 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <MessageSquare size={14} />
            <span>Review New Enquiries ({enquiries.new})</span>
          </Link>
        </div>
      </div>

      {/* RECENT ENQUIRIES TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-950 font-display text-lg">
              Recent Customer Inquiries
            </h3>
            <p className="text-xs text-slate-500">Latest site tour and purchase inquiries from website visitors</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1"
          >
            View All Enquiries <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Subject / Target</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(stats?.recentEnquiries || []).map((enq) => (
                <tr key={enq._id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6">
                    <p className="font-bold text-navy-950">{enq.name}</p>
                    <p className="text-[11px] text-slate-500">{enq.email} • {enq.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-800 block">
                      {enq.propertyTitle || enq.projectTitle || 'General Construction Query'}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">{enq.enquiryType}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        enq.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : enq.status === 'Contacted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to="/admin/enquiries"
                      className="text-gold-600 hover:text-gold-700 font-bold hover:underline"
                    >
                      Respond
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
