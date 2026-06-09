'use client';

import { useState } from 'react';
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';

export function LoginPage() {
  const { setAuthed, setRole } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      if (signInError.message.includes('Invalid login')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    setAuthed(true);
    router.push('/dashboard');
  }

  async function handleDemoLogin(role: 'cm' | 'pm' | 'pd') {
  setError('');
  setLoading(true);

  const demoEmail = 'cm@gpl-tower.com';
  const demoPassword = 'Demo@12345';

  let { error: signInError } = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  if (signInError) {
    const { error: signUpError } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
    });

    if (signUpError) {
      setError('Demo login failed. Please try again.');
      setLoading(false);
      return;
    }

    await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });
  }

  localStorage.setItem('role', role);
  setRole(role);
  setAuthed(true);

  if (role === 'cm') {
    router.push('/dashboard');
  } else if (role === 'pm') {
    router.push('/pm/dashboard');
  } else {
    router.push('/pd/dashboard');
  }
}

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0F1B3D] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-tight">GPL AI Control Tower</p>
              <p className="text-primary-300 text-[10px] tracking-widest uppercase">Phase 1 — RCC Slab Cycle</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Construction<br />Operations<br />Center
            </h2>
            <p className="text-neutral-400 mt-4 text-sm leading-relaxed max-w-sm">
              Real-time visibility across all active towers. Monitor slab cycles, manage TIC updates, and drive every pour to completion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active Towers', value: '4' },
              { label: 'Open Risks', value: '6' },
              { label: 'Pours This Week', value: '2' },
              { label: 'SLA Compliance', value: '87%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-neutral-600 text-xs">GPL Infrastructure · Phase 1 Operations · v2.4.0</p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <p className="text-base font-semibold text-[#1C1B1B]">GPL AI Control Tower</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1C1B1B]">Welcome back</h1>
            <p className="text-neutral-500 text-sm mt-1">Sign in to your operations account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cm@company.com"
                required
                className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-[#1C1B1B] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full h-11 px-3 pr-10 rounded-xl border border-border bg-white text-sm text-[#1C1B1B] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-error-light text-error rounded-xl px-3 py-2.5">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4">
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-neutral-400">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button
              type="button"
           onClick={() => setShowRoleModal(true)}
              disabled={loading}
              className="w-full h-11 border border-border bg-white text-sm font-medium text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-60"
            >
              Continue with demo account
            </button>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-6">
            GPL Infrastructure Operations Platform &copy; 2026
          </p>
          {showRoleModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-2">
        Select Demo Role
      </h2>

      <p className="text-sm text-neutral-500 mb-5">
        Choose a role to continue.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => handleDemoLogin('cm')}
          className="w-full p-4 border border-border rounded-xl text-left hover:border-primary hover:bg-primary-50 transition"
        >
          <div className="font-semibold">
            👷 Construction Manager
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Site execution and tower operations
          </div>
        </button>

        <button
          onClick={() => handleDemoLogin('pm')}
          className="w-full p-4 border border-border rounded-xl text-left hover:border-primary hover:bg-primary-50 transition"
        >
          <div className="font-semibold">
            📊 Project Manager
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Portfolio health, risks and escalations
          </div>
        </button>

        <button
          onClick={() => handleDemoLogin('pd')}
          className="w-full p-4 border border-border rounded-xl text-left hover:border-primary hover:bg-primary-50 transition"
        >
          <div className="font-semibold">
            🎯 Program Director
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Executive oversight across all projects
          </div>
        </button>
      </div>

      <button
        onClick={() => setShowRoleModal(false)}
        className="w-full mt-4 text-sm text-neutral-500"
      >
        Cancel
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}
