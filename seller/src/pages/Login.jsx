import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Shield, Mail, Loader2 } from 'lucide-react';
import { loginSeller } from '../api/auth';

const Login = ({ onSuccess, externalError = '', onClearError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    onClearError?.();
    setLoading(true);
    try {
      const res = await loginSeller({ email, password });
      const payload = res?.data ?? res;
      const user = payload?.user;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;

      if (!user || !accessToken) {
        throw new Error('Invalid login response');
      }

      const role = String(user.role || '').trim().toLowerCase();
      if (role !== 'seller') {
        throw new Error('Not a seller account');
      }

      onSuccess?.({ user, accessToken, refreshToken });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 via-amber-600 to-orange-600 text-white p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
              <Shield className="w-4 h-4" /> Seller only
            </div>
            <h2 className="text-3xl font-bold">Seller Console</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Manage your shop, products, orders and shipping. Sign in with your seller account to continue.
            </p>
          </div>
        </div>

        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Lock className="w-4 h-4" /> Seller login
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {error || externalError ? (
              <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-100 text-sm text-rose-700">
                {error || externalError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-slate-900/15 hover:bg-slate-800 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Login
            </button>

            <p className="text-xs text-slate-500 text-center">
              <Link to="/forgot-password" className="font-semibold text-amber-600 hover:text-amber-700">
                Forgot password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

