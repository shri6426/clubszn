import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck, UserCheck, Lock, Mail, AlertCircle, X } from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';

export default function LoginPage() {
  const { loginWithEmail, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Destination after login (if came from protected page)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  // Auto redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from || '/my-tickets', { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginWithEmail(email, password);
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Login failed. Please check your credentials.');
        return;
      }

      // Auto-detect and route accordingly
      if (res.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from || '/my-tickets', { replace: true });
      }
    }, 400);
  };

  const handleGoogleSelect = (chosenEmail: string, name?: string) => {
    setShowGoogleModal(false);
    setLoading(true);

    setTimeout(() => {
      const res = loginWithGoogle(chosenEmail, name);
      setLoading(false);

      if (res.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from || '/my-tickets', { replace: true });
      }
    }, 450);
  };

  const fillQuickCreds = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('clubszn.faq@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('member@gmail.com');
      setPassword('sznmember2026');
    }
    setError(null);
  };

  const isAdminCandidate = ADMIN_EMAILS.includes(email.trim().toLowerCase()) || email.trim().toLowerCase().startsWith('admin@');

  return (
    <div className="min-h-screen bg-szn-black pt-28 pb-20 px-6 md:px-10 flex flex-col justify-center">
      {/* Back button */}
      <div className="max-w-md mx-auto w-full mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase text-szn-cream/50 hover:text-szn-cream transition-colors"
        >
          <ArrowLeft size={12} /> BACK TO HOME
        </Link>
      </div>

      <div className="max-w-md mx-auto w-full border border-white/10 bg-szn-charcoal p-8 md:p-10 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-szn-magenta via-szn-violet to-szn-magenta" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">
              {isAdminCandidate ? '⚡ ADMIN ACCESS DETECTED' : 'MEMBERS & ADMIN'}
            </span>
            <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/30">
              UNIFIED PORTAL
            </span>
          </div>

          <h1 className="font-anton text-4xl md:text-5xl uppercase tracking-tighter text-szn-cream">
            SIGN IN TO <span className="text-szn-magenta">SZN.</span>
          </h1>
          <p className="font-dm text-szn-cream/50 text-xs mt-2 leading-relaxed">
            Enter your credentials. Administrator accounts are automatically recognized and routed to the Command Center.
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full border border-white/20 bg-szn-black/70 hover:bg-white hover:text-szn-black text-szn-cream font-grotesk text-xs tracking-widest uppercase font-semibold py-4 px-4 flex items-center justify-center gap-3 transition-all duration-300 group mb-6"
        >
          {/* Official Google G Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/30">OR WITH EMAIL</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-red-500/40 bg-red-500/10 p-3 mb-6 flex items-start gap-2.5"
          >
            <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="font-dm text-xs text-red-300 leading-relaxed">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50 block mb-2 flex items-center justify-between">
              <span>EMAIL ADDRESS</span>
              {isAdminCandidate && (
                <span className="text-szn-magenta text-[9px] flex items-center gap-1">
                  <ShieldCheck size={10} /> ADMIN ACCOUNT
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                required
                className="w-full bg-szn-black border border-white/15 focus:border-szn-magenta text-szn-cream font-dm text-sm px-4 py-3 outline-none transition-colors pr-10"
              />
              <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-szn-cream/30 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50 block mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-szn-black border border-white/15 focus:border-szn-magenta text-szn-cream font-dm text-sm px-4 py-3 outline-none transition-colors pr-10"
              />
              <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-szn-cream/30 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-grotesk text-xs tracking-widest uppercase font-bold py-4 mt-2 flex items-center justify-center gap-2 transition-all duration-300 ${
              isAdminCandidate
                ? 'bg-szn-magenta text-szn-black hover:bg-szn-cream'
                : 'bg-szn-cream text-szn-black hover:bg-szn-magenta'
            }`}
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-szn-black/30 border-t-szn-black rounded-full" />
            ) : (
              <>
                {isAdminCandidate ? 'ENTER ADMIN DASHBOARD' : 'SIGN IN'} <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/30 mb-3">
            QUICK LOGIN TESTERS (CLICK TO AUTOFILL):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCreds('admin')}
              className="text-left border border-szn-magenta/40 bg-szn-magenta/5 hover:bg-szn-magenta/20 p-2.5 transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-szn-magenta mb-0.5">
                <ShieldCheck size={12} />
                <span className="font-grotesk text-[10px] font-bold tracking-wider uppercase">ADMIN</span>
              </div>
              <p className="font-dm text-[10px] text-szn-cream/60 truncate">clubszn.faq@gmail.com</p>
              <p className="font-mono text-[9px] text-szn-cream/30">Pass: admin123</p>
            </button>

            <button
              type="button"
              onClick={() => fillQuickCreds('user')}
              className="text-left border border-white/15 bg-white/5 hover:bg-white/10 p-2.5 transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-szn-cream/70 mb-0.5">
                <UserCheck size={12} />
                <span className="font-grotesk text-[10px] font-bold tracking-wider uppercase">MEMBER</span>
              </div>
              <p className="font-dm text-[10px] text-szn-cream/60 truncate">member@gmail.com</p>
              <p className="font-mono text-[9px] text-szn-cream/30">Pass: any</p>
            </button>
          </div>
        </div>
      </div>

      {/* Google Account Chooser Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-szn-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGoogleModal(false)}
          >
            <motion.div
              className="bg-szn-charcoal border border-white/15 max-w-sm w-full p-6 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-4 right-4 text-szn-cream/50 hover:text-szn-cream"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-grotesk text-xs tracking-wider uppercase text-szn-cream font-bold">
                  CHOOSE A GOOGLE ACCOUNT
                </h3>
              </div>
              <p className="font-dm text-xs text-szn-cream/50 mb-4">
                Select an account to continue to CLUB SZN. Admin accounts automatically route to the Admin panel.
              </p>

              <div className="space-y-2 mb-4">
                {/* Admin Google Account Option */}
                <button
                  onClick={() => handleGoogleSelect('clubszn.faq@gmail.com', 'SZN Admin')}
                  className="w-full text-left p-3 border border-szn-magenta/40 bg-szn-magenta/10 hover:bg-szn-magenta/20 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-szn-magenta text-szn-black font-anton flex items-center justify-center text-sm">
                      A
                    </div>
                    <div>
                      <p className="font-grotesk text-xs text-szn-cream font-semibold">clubszn.faq@gmail.com</p>
                      <p className="font-dm text-[10px] text-szn-magenta">Admin Account • Instant Dashboard</p>
                    </div>
                  </div>
                  <ShieldCheck size={14} className="text-szn-magenta" />
                </button>

                {/* Member Google Account Option */}
                <button
                  onClick={() => handleGoogleSelect('alex.szn@gmail.com', 'Alex Rivera')}
                  className="w-full text-left p-3 border border-white/10 hover:border-white/30 bg-szn-black transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-szn-cream/20 text-szn-cream font-anton flex items-center justify-center text-sm">
                      M
                    </div>
                    <div>
                      <p className="font-grotesk text-xs text-szn-cream font-semibold">alex.szn@gmail.com</p>
                      <p className="font-dm text-[10px] text-szn-cream/40">Member Account</p>
                    </div>
                  </div>
                  <UserCheck size={14} className="text-szn-cream/40" />
                </button>
              </div>

              {/* Or enter custom gmail */}
              <div className="border-t border-white/10 pt-3">
                <label className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/40 block mb-1.5">
                  OR SIGN IN WITH YOUR OWN GMAIL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="flex-1 bg-szn-black border border-white/15 px-3 py-2 text-xs text-szn-cream outline-none focus:border-szn-magenta"
                  />
                  <button
                    onClick={() => customGoogleEmail && handleGoogleSelect(customGoogleEmail)}
                    disabled={!customGoogleEmail}
                    className="bg-szn-magenta text-szn-black px-3 py-2 text-xs font-grotesk uppercase font-bold hover:bg-szn-cream disabled:opacity-30"
                  >
                    GO
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
