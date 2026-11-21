import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';

// Simple Instagram SVG icon
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-szn-black border-t border-white/10 pt-20 pb-10 overflow-hidden">
      {/* Big headline */}
      <div className="px-6 md:px-10 mb-16">
        <h2 className="font-anton text-[clamp(2.5rem,8vw,8rem)] leading-none text-szn-cream uppercase tracking-tighter">
          MADE FOR THE PEOPLE.
        </h2>
        <h2 className="font-anton text-[clamp(2.5rem,8vw,8rem)] leading-none text-stroke-magenta uppercase tracking-tighter">
          MADE FOR THE MOMENTS.
        </h2>
      </div>

      {/* Divider */}
      <div className="mx-6 md:mx-10 border-t border-white/10 mb-12" />

      {/* Footer grid */}
      <div className="px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        {/* Logo + social */}
        <div className="col-span-2 md:col-span-1">
          <img src="/assets/logo.jpg" alt="CLUB SZN" className="h-10 w-auto mb-6" />
          <p className="font-dm text-szn-cream/50 text-sm leading-relaxed mb-6 max-w-xs">
            Youth-focused socializing experiences. Affordable. Accessible. Unforgettable.
          </p>
          <a
            href="https://www.instagram.com/club_szn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-szn-cream/60 hover:text-szn-magenta transition-colors text-sm font-grotesk"
          >
            <InstagramIcon size={16} />
            @club_szn
            <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Navigate */}
        <div>
          <p className="font-grotesk text-xs tracking-widest uppercase text-szn-cream/40 mb-4">Navigate</p>
          <ul className="space-y-3">
            {[
              { label: 'Home', path: '/' },
              { label: 'Events', path: '/events' },
              { label: 'Gallery', path: '/gallery' },
              { label: 'My Tickets', path: '/my-tickets' },
            ].map(l => (
              <li key={l.label}>
                <Link to={l.path} className="font-grotesk text-sm text-szn-cream/60 hover:text-szn-cream transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-grotesk text-xs tracking-widest uppercase text-szn-cream/40 mb-4">Contact</p>
          <ul className="space-y-3">
            <li>
              <a
                href="https://www.instagram.com/club_szn/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-grotesk text-sm text-szn-cream/60 hover:text-szn-magenta transition-colors flex items-center gap-1"
              >
                <InstagramIcon size={13} /> Instagram DMs
              </a>
            </li>
            <li>
              <a
                href="mailto:clubszn.faq@gmail.com"
                className="font-grotesk text-sm text-szn-cream/60 hover:text-szn-cream transition-colors flex items-center gap-1"
              >
                <Mail size={13} /> clubszn.faq@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="font-grotesk text-xs tracking-widest uppercase text-szn-cream/40 mb-4">Legal</p>
          <ul className="space-y-3">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
              <li key={l}>
                <a href="#" className="font-grotesk text-sm text-szn-cream/60 hover:text-szn-cream transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-6 md:mx-10 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <p className="font-grotesk text-xs text-szn-cream/30 tracking-wider">
          © {new Date().getFullYear()} CLUB SZN — ALL RIGHTS RESERVED
        </p>
        <p className="font-grotesk text-xs text-szn-cream/50 tracking-wider uppercase">
          POWERED BY <span className="text-szn-magenta font-semibold tracking-widest">MECHSTREK</span>
        </p>
      </div>
    </footer>
  );
}
