import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Lock, LogIn, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  // Quick One-Click Fill for Easy Evaluation
  const fillDemoAdmin = () => {
    setEmail('admin@buildmaster.com');
    setPassword('admin123');
    setError('');
  };

  const fillDemoCustomer = () => {
    setEmail('customer@buildmaster.com');
    setPassword('customer123');
    setError('');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-navy-950 p-8 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-gold-glow mx-auto mb-3">
            <Building2 size={28} className="text-navy-950 stroke-[2.2]" />
          </div>
          <h2 className="font-display text-2xl font-black text-white">
            Sign In to Build<span className="text-gold-400">Master</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access your customer wishlist, project enquiries, or admin management portal
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="bg-gold-50/70 p-4 border-b border-gold-200/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gold-800 text-center mb-2">
            🚀 Instant Demo One-Click Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-3 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>Fill Admin</span>
            </button>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-navy-950 text-xs font-bold border border-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <User size={14} />
              <span>Fill Customer</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@buildmaster.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-sm shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <LogIn size={18} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-gold-600 hover:text-gold-700 underline">
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
