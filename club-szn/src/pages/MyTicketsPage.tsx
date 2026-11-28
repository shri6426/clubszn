import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Download, Clock, LogIn, RefreshCw, User as UserIcon } from 'lucide-react';
import { getBookings, type Booking } from '../data/bookings';
import { useAuth } from '../context/AuthContext';

export default function MyTicketsPage() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  const [loading, setLoading] = useState(false);

  const fetchUserTickets = async () => {
    const local = getBookings();
    if (!user) {
      setBookings(local);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch('/api/bookings/my-tickets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tickets)) {
          const serverTickets: Booking[] = data.tickets.map((t: any) => ({
            id: t.id,
            eventId: t.event_id || t.eventId || 'turf-szn-01',
            eventTitle: t.event_title || t.eventTitle || 'TURF SZN',
            eventDate: t.event_date || t.eventDate || 'DATES ANNOUNCING SOON',
            eventTime: t.event_time || t.eventTime || 'EVENING — TIME TBA',
            eventVenue: t.event_venue || t.eventVenue || 'TURF ARENA — REVEALING SOON',
            ticketTier: t.ticket_tier || t.ticketTier || 'EARLY ACCESS RSVP (FREE)',
            ticketPrice: t.ticket_price !== undefined ? t.ticket_price : (t.ticketPrice || 0),
            quantity: t.quantity || 1,
            attendeeName: t.attendee_name || t.attendeeName || user.name,
            email: t.email || user.email,
            phone: t.phone || '',
            bookingDate: t.created_at || t.bookingDate || new Date().toISOString(),
            status: t.status === 'checked_in' || t.status === 'upcoming' ? 'upcoming' : 'past',
            total: t.total !== undefined ? t.total : 0,
          }));

          // Merge server tickets with any local unsynced tickets
          const combined = [...serverTickets];
          local.forEach((l) => {
            if (!combined.some((c) => c.id === l.id)) {
              combined.push(l);
            }
          });

          setBookings(combined);
        }
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to local cache:', err);
      setBookings(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, [user]);

  const filtered = bookings.filter((b) => b.status === tab);

  return (
    <div className="min-h-screen bg-szn-black pt-28 pb-20 px-6 md:px-10">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30 block mb-4">
            MY SZN PASSES
          </span>
          <motion.h1
            className="font-anton text-[clamp(3rem,12vw,10rem)] leading-[0.88] tracking-tighter uppercase text-szn-cream mb-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            MY <span className="text-szn-magenta">TICKETS</span>
          </motion.h1>
        </div>

        {/* User bar / Quick actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="border border-white/10 bg-szn-charcoal px-4 py-2 flex items-center gap-3">
              <UserIcon size={14} className="text-szn-magenta" />
              <div>
                <span className="font-grotesk text-[9px] uppercase tracking-wider text-szn-cream/40 block">
                  ACCOUNT
                </span>
                <span className="font-dm text-xs text-szn-cream font-medium">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/my-tickets' } } })}
              className="border border-szn-magenta text-szn-magenta px-4 py-2.5 font-grotesk text-xs tracking-widest uppercase font-bold hover:bg-szn-magenta hover:text-szn-black transition-colors flex items-center gap-2"
            >
              <LogIn size={13} /> SIGN IN TO SYNC
            </button>
          )}

          <button
            onClick={fetchUserTickets}
            disabled={loading}
            title="Refresh tickets"
            className="border border-white/10 p-2.5 text-szn-cream/60 hover:text-szn-cream hover:border-szn-magenta transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-szn-magenta' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border border-white/10 w-fit mb-10">
        {(['upcoming', 'past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-grotesk text-xs tracking-widest uppercase px-6 py-3 transition-all ${
              tab === t ? 'bg-szn-magenta text-szn-black' : 'text-szn-cream/50 hover:text-szn-cream'
            }`}
          >
            {t === 'upcoming' ? 'UPCOMING' : 'PAST'}
          </button>
        ))}
      </div>

      {/* Tickets */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-28 text-center"
        >
          <h3 className="font-anton text-5xl md:text-7xl text-szn-cream/15 uppercase mb-5">
            {tab === 'upcoming' ? 'NO PLANS YET.' : 'NO HISTORY YET.'}
          </h3>
          <p className="font-dm text-szn-cream/40 text-sm mb-8">
            {tab === 'upcoming'
              ? 'You haven\'t booked any upcoming events. Time to start your SZN.'
              : 'Your past events will appear here.'}
          </p>
          {tab === 'upcoming' && (
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold px-8 py-4 hover:bg-szn-cream transition-colors"
            >
              BROWSE EVENTS
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-5 max-w-3xl">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="ticket-card bg-szn-charcoal border border-white/10 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4">
                {/* Event image strip */}
                <div className="md:col-span-1 relative overflow-hidden min-h-[120px]">
                  <div className="absolute inset-0 bg-szn-black">
                    {/* Pattern background */}
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(208,0,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '8px 8px',
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-anton text-5xl text-szn-magenta/30">
                      {booking.eventTitle.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-magenta bg-szn-black px-2 py-1">
                      {booking.ticketTier.includes('VIP') ? 'VIP' : 'TICKET'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-2 p-5 md:p-6 border-t md:border-t-0 md:border-l border-white/10">
                  <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-magenta block mb-1">
                    BOOKING ID: {booking.id}
                  </span>
                  <h3 className="font-anton text-xl md:text-2xl tracking-tight uppercase text-szn-cream mb-3">
                    {booking.eventTitle}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-szn-cream/40 shrink-0" />
                      <span className="font-grotesk text-xs text-szn-cream/60">{booking.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-szn-cream/40 shrink-0" />
                      <span className="font-grotesk text-xs text-szn-cream/60">{booking.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-szn-cream/40 shrink-0" />
                      <span className="font-grotesk text-xs text-szn-cream/60">{booking.eventVenue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket size={12} className="text-szn-cream/40 shrink-0" />
                      <span className="font-grotesk text-xs text-szn-cream/60">
                        {booking.quantity}× {booking.ticketTier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR + actions */}
                <div className="md:col-span-1 p-5 md:p-6 border-t md:border-t-0 md:border-l border-white/10 flex flex-col items-center justify-between gap-4">
                  {/* QR placeholder */}
                  <div className="border border-white/10 p-2 bg-szn-black/50 w-fit">
                    <div className="grid grid-cols-5 gap-0.5 w-20 h-20">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`${i % 3 === 0 || i % 7 === 0 ? 'bg-szn-cream/60' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <p className="font-grotesk text-[8px] tracking-widest uppercase text-szn-cream/20 text-center mt-1">QR CODE</p>
                  </div>

                  <div className="w-full space-y-2">
                    <div className="text-center">
                      <span className="font-anton text-lg text-szn-magenta">
                        {booking.total === 0 ? 'FREE' : `₹${booking.total}`}
                      </span>
                      <p className="font-grotesk text-[9px] text-szn-cream/30 tracking-wider">TOTAL PAID</p>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 border border-white/10 text-szn-cream/50 hover:border-szn-magenta hover:text-szn-magenta transition-all py-2 font-grotesk text-[10px] tracking-widest uppercase">
                      <Download size={10} /> DOWNLOAD
                    </button>
                  </div>
                </div>
              </div>

              {/* Dashed line */}
              <div className="border-t border-dashed border-white/10 mx-6 md:mx-0" />
              <div className="px-6 py-3 flex justify-between items-center">
                <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/25">
                  BOOKED {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className={`font-grotesk text-[9px] tracking-widest uppercase px-2 py-0.5 ${
                  booking.status === 'upcoming' ? 'bg-szn-magenta/20 text-szn-magenta' : 'bg-szn-cream/10 text-szn-cream/40'
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Browse more */}
      {filtered.length > 0 && (
        <div className="mt-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase border border-szn-magenta text-szn-magenta px-6 py-3 hover:bg-szn-magenta hover:text-szn-black transition-all"
          >
            BROWSE MORE EVENTS
          </Link>
        </div>
      )}
    </div>
  );
}
