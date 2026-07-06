import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import logo from '../assets/logo.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate small delay for premium feel
    setTimeout(() => {
      if (email.trim() === 'admin@gmail.com' && password === 'admin@1') {
        // Store mock credentials
        localStorage.setItem('token', 'mock-admin-session-token-abc123xyz');
        localStorage.setItem('user_name', 'Admin User');
        localStorage.setItem('user_phone', '+91 9999999999');

        setLoading(false);
        navigate('/', { replace: true });
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-950/30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-950/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 relative z-10 animate-in fade-in duration-500">
        {/* Card Container */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative">
              <img src={logo} className="w-16 h-16 object-cover rounded-2xl shadow-xl border border-white/10" alt="Broom Boom Logo" />
              <div className="absolute -bottom-1 -right-1 bg-primary-600 text-black p-1 rounded-lg shadow-md">
                <Sparkles size={12} />
              </div>
            </div>
            <div className="text-center mt-2">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Broom Boom <span className="text-primary-400">Cabs</span>
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-1">Authenticate to access admin controls</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-bold animate-in shake duration-300">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@gmail.com"
                  className="w-full px-4 py-3.5 pl-12 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pl-12 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-black text-sm font-black rounded-2xl shadow-lg shadow-primary-950/50 hover:shadow-primary-900/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
