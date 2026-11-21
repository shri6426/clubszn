import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'EVENTS', path: '/events' },
  { label: 'ABOUT', path: '/#about' },
  { label: 'GALLERY', path: '/gallery' },
  { label: 'MY TICKETS', path: '/my-tickets' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-szn-black/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="px-6 md:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/logo.jpg"
              alt="CLUB SZN"
              className="h-8 md:h-10 w-auto object-contain"
              style={{ maxWidth: '120px' }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path
                    ? 'text-szn-magenta'
                    : 'text-szn-cream/70 hover:text-szn-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Quick Link if logged in as Admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-link flex items-center gap-1.5 ${
                  location.pathname === '/admin' ? 'text-szn-magenta' : 'text-szn-magenta/80 hover:text-szn-magenta'
                }`}
              >
                <Shield size={12} className="text-szn-magenta animate-pulse" />
                ADMIN
              </Link>
            )}
          </div>

          {/* CTA + Auth + Hamburger */}
          <div className="flex items-center gap-3">
            {/* User Auth Pills */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 border border-white/10 bg-szn-charcoal/80 px-3 py-1.5">
                <Link
                  to={isAdmin ? '/admin' : '/my-tickets'}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {isAdmin ? (
                    <span className="w-2 h-2 rounded-full bg-szn-magenta animate-ping" />
                  ) : (
                    <UserIcon size={12} className="text-szn-cream/60" />
                  )}
                  <span className="font-grotesk text-[10px] tracking-wider uppercase text-szn-cream truncate max-w-[110px]">
                    {isAdmin ? 'ADMIN' : user.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-szn-cream/40 hover:text-red-400 transition-colors pl-1 border-l border-white/10"
                  title="Sign out"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block font-grotesk text-xs tracking-widest uppercase text-szn-cream/70 hover:text-szn-magenta transition-colors px-2 py-1"
              >
                LOGIN
              </Link>
            )}

            <Link
              to="/events"
              className="hidden md:block text-xs font-semibold tracking-widest uppercase px-5 py-2 border border-szn-magenta text-szn-magenta hover:bg-szn-magenta hover:text-szn-black transition-all duration-300 font-grotesk"
            >
              BOOK NOW
            </Link>

            <button
              className="md:hidden text-szn-cream p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-szn-black flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <img src="/assets/logo.jpg" alt="CLUB SZN" className="h-8 w-auto" />
              <button onClick={() => setMenuOpen(false)} className="text-szn-cream">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col px-8 pt-12 gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    className="font-anton text-4xl text-szn-cream hover:text-szn-magenta transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Admin mobile link */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.38 }}
                >
                  <Link
                    to="/admin"
                    className="font-anton text-4xl text-szn-magenta hover:text-szn-cream transition-colors flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield size={24} /> ADMIN DASHBOARD
                  </Link>
                </motion.div>
              )}

              {/* Login / Logout mobile */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.44 }}
              >
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="font-anton text-2xl text-red-400 hover:text-szn-cream transition-colors flex items-center gap-2"
                  >
                    <LogOut size={18} /> LOG OUT ({user.name})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="font-anton text-4xl text-szn-cream/60 hover:text-szn-magenta transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                )}
              </motion.div>
            </nav>

            <div className="mt-auto px-8 pb-10">
              <Link
                to="/events"
                className="block text-center text-sm font-semibold tracking-widest uppercase px-6 py-4 bg-szn-magenta text-szn-black font-grotesk"
                onClick={() => setMenuOpen(false)}
              >
                BOOK YOUR SZN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
