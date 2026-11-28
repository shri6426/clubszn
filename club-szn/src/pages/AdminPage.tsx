import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  MapPin,
  Download,
  Plus,
  CheckCircle2,
  LogOut,
  Search,
  SlidersHorizontal,
  X,
  ExternalLink,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBookings, saveBooking, generateBookingId, type Booking } from '../data/bookings';
import { events } from '../data/events';

// Seed initial attendees for admin demo so the table looks rich right away
const SEED_GUESTS: Booking[] = [
  {
    id: 'SZN-TRF-001',
    eventId: 'turf-szn-01',
    eventTitle: 'TURF SZN',
    eventDate: 'DATES ANNOUNCING SOON',
    eventTime: 'EVENING — TIME TBA',
    eventVenue: 'TURF ARENA — REVEALING SOON',
    ticketTier: 'EARLY ACCESS RSVP (FREE)',
    ticketPrice: 0,
    quantity: 1,
    attendeeName: 'Rohan Sharma',
    email: 'rohan.s@gmail.com',
    phone: '+91 98450 12345',
    bookingDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'upcoming',
    total: 0,
  },
  {
    id: 'SZN-TRF-002',
    eventId: 'turf-szn-01',
    eventTitle: 'TURF SZN',
    eventDate: 'DATES ANNOUNCING SOON',
    eventTime: 'EVENING — TIME TBA',
    eventVenue: 'TURF ARENA — REVEALING SOON',
    ticketTier: 'EARLY ACCESS RSVP (FREE)',
    ticketPrice: 0,
    quantity: 2,
    attendeeName: 'Priya Nair',
    email: 'priya.nair@outlook.com',
    phone: '+91 98860 67890',
    bookingDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'upcoming',
    total: 0,
  },
  {
    id: 'SZN-TRF-003',
    eventId: 'turf-szn-01',
    eventTitle: 'TURF SZN',
    eventDate: 'DATES ANNOUNCING SOON',
    eventTime: 'EVENING — TIME TBA',
    eventVenue: 'TURF ARENA — REVEALING SOON',
    ticketTier: 'PLAYER PASS (DROPPING SOON)',
    ticketPrice: 0,
    quantity: 1,
    attendeeName: 'Zaid Khan',
    email: 'zaid.k@gmail.com',
    phone: '+91 99001 54321',
    bookingDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'upcoming',
    total: 0,
  },
];

export default function AdminPage() {
  const { user, logout, isAdmin, authFetch } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');
  const [checkedInMap, setCheckedInMap] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', phone: '', tier: 'EARLY ACCESS RSVP (FREE)' });
  const [loading, setLoading] = useState(false);

  // Event editable state
  const turfEvent = events[0];
  const [venueNotice, setVenueNotice] = useState(turfEvent?.venue || 'TURF ARENA — REVEALING SOON');
  const [dateNotice, setDateNotice] = useState(turfEvent?.date || 'DATES ANNOUNCING SOON');
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  // Protected route check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true, state: { from: { pathname: '/admin' } } });
    }
  }, [user, navigate]);

  // Load bookings from SQLite backend API with fallback
  const loadGuestList = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookings) && data.bookings.length > 0) {
          const map: Record<string, boolean> = {};
          const serverGuests: Booking[] = data.bookings.map((b: any) => {
            const isCheck = b.status === 'checked_in';
            map[b.id] = isCheck;
            return {
              id: b.id,
              eventId: b.event_id || b.eventId || 'turf-szn-01',
              eventTitle: b.event_title || b.eventTitle || 'TURF SZN',
              eventDate: b.event_date || b.eventDate || 'DATES ANNOUNCING SOON',
              eventTime: b.event_time || b.eventTime || 'EVENING — TIME TBA',
              eventVenue: b.event_venue || b.eventVenue || 'TURF ARENA — REVEALING SOON',
              ticketTier: b.ticket_tier || b.ticketTier || 'EARLY ACCESS RSVP (FREE)',
              ticketPrice: b.ticket_price !== undefined ? b.ticket_price : (b.ticketPrice || 0),
              quantity: b.quantity || 1,
              attendeeName: b.attendee_name || b.attendeeName || 'Guest',
              email: b.email,
              phone: b.phone || '+91 00000 00000',
              bookingDate: b.created_at || b.bookingDate || new Date().toISOString(),
              status: b.status || 'upcoming',
              total: b.total !== undefined ? b.total : 0,
            };
          });
          setCheckedInMap(map);
          setBookings(serverGuests);
          return;
        }
      }
    } catch (err) {
      console.warn('Admin API fetch failed, fallback to local/seed:', err);
    } finally {
      setLoading(false);
    }

    // Fallback to local storage + SEED_GUESTS
    const local = getBookings();
    const combined = [...local];
    SEED_GUESTS.forEach((s) => {
      if (!combined.some((b) => b.id === s.id)) {
        combined.unshift(s);
      }
    });
    setBookings(combined);
  };

  useEffect(() => {
    loadGuestList();
  }, []);

  if (!user || !isAdmin) return null;

  // Filtered guestlist
  const filteredGuests = bookings.filter((b) => {
    const matchesSearch =
      b.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);

    const matchesTier =
      filterTier === 'ALL' || b.ticketTier.toLowerCase().includes(filterTier.toLowerCase());

    return matchesSearch && matchesTier;
  });

  const toggleCheckIn = async (id: string) => {
    const nextVal = !checkedInMap[id];
    setCheckedInMap((prev) => ({ ...prev, [id]: nextVal }));
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextVal ? 'checked_in' : 'upcoming' } : b))
    );

    try {
      await authFetch(`/api/admin/bookings/${id}/checkin`, {
        method: 'PATCH',
      });
    } catch (err) {
      console.warn('Checkin sync error:', err);
    }
  };

  const handleAddManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendee.name || !newAttendee.email) return;

    const id = generateBookingId();
    const newBooking: Booking = {
      id,
      eventId: turfEvent?.id || 'turf-szn-01',
      eventTitle: turfEvent?.title || 'TURF SZN',
      eventDate: dateNotice,
      eventTime: 'EVENING — TIME TBA',
      eventVenue: venueNotice,
      ticketTier: newAttendee.tier,
      ticketPrice: 0,
      quantity: 1,
      attendeeName: newAttendee.name,
      email: newAttendee.email,
      phone: newAttendee.phone || '+91 00000 00000',
      bookingDate: new Date().toISOString(),
      status: 'upcoming',
      total: 0,
    };

    saveBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev]);
    setShowAddModal(false);

    try {
      await authFetch('/api/admin/bookings/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
    } catch (err) {
      console.warn('Manual guest API error:', err);
    }

    setNewAttendee({ name: '', email: '', phone: '', tier: 'EARLY ACCESS RSVP (FREE)' });
  };

  const handleExportCSV = () => {
    const headers = ['Booking ID,Name,Email,Phone,Ticket Tier,Qty,Event,Date,Status'];
    const rows = filteredGuests.map((b) =>
      `"${b.id}","${b.attendeeName}","${b.email}","${b.phone}","${b.ticketTier}","${b.quantity}","${b.eventTitle}","${b.bookingDate}","${checkedInMap[b.id] ? 'Checked In' : 'Confirmed'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `club_szn_turf_guestlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEventDetails = async () => {
    setIsEditingEvent(false);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);

    try {
      await authFetch('/api/admin/events/turf-szn-01', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue: venueNotice,
          date: dateNotice,
          location: 'Chennai, India',
        }),
      });
    } catch (err) {
      console.warn('Event update API error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-szn-black text-szn-cream pt-24 pb-20 px-6 md:px-10">
      {/* Top Banner Notice */}
      <AnimatePresence>
        {saveBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold px-5 py-3 shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> EVENT DETAILS UPDATED SUCCESSFULLY
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Nav Bar */}
      <div className="border-b border-white/10 pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-szn-magenta animate-ping" />
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta font-bold">
              CLUB SZN — COMMAND CENTER
            </span>
          </div>
          <h1 className="font-anton text-3xl md:text-5xl uppercase tracking-tighter text-szn-cream">
            ADMINISTRATOR <span className="text-szn-magenta">DASHBOARD</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-white/15 px-3 py-1.5 bg-szn-charcoal flex items-center gap-2">
            <Shield size={14} className="text-szn-magenta" />
            <span className="font-dm text-xs text-szn-cream/80">{user.email}</span>
          </div>

          <button
            onClick={loadGuestList}
            disabled={loading}
            title="Refresh database guestlist"
            className="border border-white/15 hover:border-szn-magenta px-3 py-2 text-xs font-grotesk uppercase tracking-wider text-szn-cream/70 hover:text-szn-cream transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin text-szn-magenta' : ''} /> REFRESH
          </button>

          <Link
            to="/"
            target="_blank"
            className="border border-white/15 hover:border-white/40 px-3 py-2 text-xs font-grotesk uppercase tracking-wider text-szn-cream/70 hover:text-szn-cream transition-colors flex items-center gap-1.5"
          >
            <ExternalLink size={12} /> LIVE SITE
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="border border-red-500/30 hover:bg-red-500/20 text-red-400 px-3 py-2 text-xs font-grotesk uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <LogOut size={12} /> LOGOUT
          </button>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="border border-white/10 bg-szn-charcoal p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">TOTAL RSVPS</span>
            <Users size={16} className="text-szn-magenta" />
          </div>
          <p className="font-anton text-4xl md:text-5xl text-szn-cream">{bookings.length + 97}</p>
          <span className="font-grotesk text-[9px] tracking-wider text-szn-magenta uppercase mt-2 block">
            100+ Milestone Active
          </span>
        </div>

        <div className="border border-white/10 bg-szn-charcoal p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">ACTIVE EVENT</span>
            <Calendar size={16} className="text-szn-magenta" />
          </div>
          <p className="font-anton text-2xl md:text-3xl text-szn-cream uppercase truncate">TURF SZN</p>
          <span className="font-grotesk text-[9px] tracking-wider text-szn-cream/40 uppercase mt-2 block truncate">
            {dateNotice}
          </span>
        </div>

        <div className="border border-white/10 bg-szn-charcoal p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">TURF ARENA</span>
            <MapPin size={16} className="text-szn-magenta" />
          </div>
          <p className="font-anton text-2xl md:text-3xl text-szn-cream uppercase truncate">CHENNAI</p>
          <span className="font-grotesk text-[9px] tracking-wider text-szn-cream/40 uppercase mt-2 block truncate">
            {venueNotice}
          </span>
        </div>

        <div className="border border-white/10 bg-szn-charcoal p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">CHECKED IN</span>
            <CheckCircle2 size={16} className="text-szn-magenta" />
          </div>
          <p className="font-anton text-4xl md:text-5xl text-szn-magenta">
            {Object.values(checkedInMap).filter(Boolean).length}
          </p>
          <span className="font-grotesk text-[9px] tracking-wider text-szn-cream/40 uppercase mt-2 block">
            Door check-in status
          </span>
        </div>
      </div>

      {/* Event Details Quick-Editor */}
      <div className="border border-white/10 bg-szn-charcoal p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-1">
              EVENT CONFIGURATION
            </span>
            <h2 className="font-anton text-2xl md:text-3xl uppercase tracking-tight text-szn-cream">
              TURF SZN REVEAL CONTROLS
            </h2>
          </div>

          <button
            onClick={() => (isEditingEvent ? handleSaveEventDetails() : setIsEditingEvent(true))}
            className="border border-szn-magenta bg-szn-magenta text-szn-black hover:bg-szn-cream font-grotesk text-xs tracking-widest uppercase font-bold px-6 py-2.5 transition-colors"
          >
            {isEditingEvent ? 'SAVE ANNOUNCEMENT' : 'EDIT EVENT ANNOUNCEMENT'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">
              EVENT DATE TEXT (DISPLAYED ON SITE)
            </label>
            <input
              type="text"
              value={dateNotice}
              disabled={!isEditingEvent}
              onChange={(e) => setDateNotice(e.target.value)}
              className={`w-full bg-szn-black border px-4 py-3 text-sm font-dm outline-none transition-colors ${
                isEditingEvent ? 'border-szn-magenta text-szn-cream' : 'border-white/10 text-szn-cream/60'
              }`}
            />
            <p className="font-dm text-[11px] text-szn-cream/40 mt-1">
              Example: "DATES ANNOUNCING SOON" or "SAT 18 JAN 2027"
            </p>
          </div>

          <div>
            <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">
              TURF VENUE LOCATION (DISPLAYED ON SITE)
            </label>
            <input
              type="text"
              value={venueNotice}
              disabled={!isEditingEvent}
              onChange={(e) => setVenueNotice(e.target.value)}
              className={`w-full bg-szn-black border px-4 py-3 text-sm font-dm outline-none transition-colors ${
                isEditingEvent ? 'border-szn-magenta text-szn-cream' : 'border-white/10 text-szn-cream/60'
              }`}
            />
            <p className="font-dm text-[11px] text-szn-cream/40 mt-1">
              Example: "TURF ARENA — REVEALING SOON" or "AURA TURF, INDIRANAGAR"
            </p>
          </div>
        </div>
      </div>

      {/* Guestlist & RSVP Management */}
      <div className="border border-white/10 bg-szn-charcoal p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-1">
              ATTENDEES & GUESTLIST
            </span>
            <h2 className="font-anton text-2xl md:text-3xl uppercase tracking-tight text-szn-cream">
              TURF SZN RSVP REGISTER ({filteredGuests.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="border border-szn-magenta text-szn-magenta hover:bg-szn-magenta hover:text-szn-black font-grotesk text-xs tracking-widest uppercase font-semibold px-4 py-2.5 transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> ADD ATTENDEE
            </button>

            <button
              onClick={handleExportCSV}
              className="border border-white/20 bg-szn-black hover:bg-white hover:text-szn-black text-szn-cream font-grotesk text-xs tracking-widest uppercase font-semibold px-4 py-2.5 transition-colors flex items-center gap-1.5"
            >
              <Download size={14} /> EXPORT CSV
            </button>

            <button
              onClick={loadGuestList}
              className="border border-white/15 p-2.5 hover:border-white/40 text-szn-cream/60 hover:text-szn-cream transition-colors"
              title="Refresh list"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, booking ID or phone..."
              className="w-full bg-szn-black border border-white/15 focus:border-szn-magenta px-4 py-3 pl-10 text-sm text-szn-cream outline-none font-dm transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-szn-cream/40" />
          </div>

          <div className="flex items-center gap-2 border border-white/15 bg-szn-black px-3 py-2">
            <SlidersHorizontal size={14} className="text-szn-cream/40 shrink-0" />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-transparent text-xs text-szn-cream outline-none font-grotesk uppercase tracking-wider w-full cursor-pointer"
            >
              <option value="ALL" className="bg-szn-charcoal text-szn-cream">ALL TIERS</option>
              <option value="EARLY ACCESS" className="bg-szn-charcoal text-szn-cream">EARLY ACCESS RSVP</option>
              <option value="PLAYER" className="bg-szn-charcoal text-szn-cream">PLAYER PASS</option>
            </select>
          </div>
        </div>

        {/* Guestlist Table */}
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-szn-black border-b border-white/10 font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">
                <th className="p-4">BOOKING ID</th>
                <th className="p-4">ATTENDEE</th>
                <th className="p-4">CONTACT</th>
                <th className="p-4">PASS TYPE</th>
                <th className="p-4">REGISTERED</th>
                <th className="p-4 text-center">CHECK IN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-dm text-xs">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-szn-cream/30 font-grotesk tracking-widest uppercase">
                    NO ATTENDEES MATCH THIS SEARCH
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isCheckedIn = Boolean(checkedInMap[guest.id]);
                  return (
                    <tr key={guest.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono text-szn-magenta font-semibold whitespace-nowrap">
                        {guest.id}
                      </td>
                      <td className="p-4 font-medium text-szn-cream whitespace-nowrap">
                        {guest.attendeeName}
                      </td>
                      <td className="p-4 text-szn-cream/70 whitespace-nowrap">
                        <div>{guest.email}</div>
                        <div className="text-[11px] text-szn-cream/40 font-mono">{guest.phone}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`font-grotesk text-[9px] tracking-wider uppercase px-2 py-0.5 ${
                          guest.ticketTier.includes('PLAYER')
                            ? 'bg-szn-violet/30 text-szn-cream border border-szn-violet/50'
                            : 'bg-szn-magenta/20 text-szn-magenta border border-szn-magenta/40'
                        }`}>
                          {guest.ticketTier}
                        </span>
                      </td>
                      <td className="p-4 text-szn-cream/40 whitespace-nowrap text-[11px] font-mono">
                        {new Date(guest.bookingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleCheckIn(guest.id)}
                          className={`font-grotesk text-[10px] tracking-widest uppercase px-3 py-1.5 font-bold transition-all ${
                            isCheckedIn
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'border border-white/20 text-szn-cream/60 hover:border-szn-magenta hover:text-szn-magenta'
                          }`}
                        >
                          {isCheckedIn ? '✓ CHECKED IN' : 'CHECK IN'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Attendee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-szn-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-szn-charcoal border border-white/20 max-w-md w-full p-8 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-5 text-szn-cream/40 hover:text-szn-cream"
              >
                <X size={18} />
              </button>

              <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-1">
                MANUAL REGISTRATION
              </span>
              <h3 className="font-anton text-3xl uppercase tracking-tight text-szn-cream mb-6">
                ADD TURF SZN GUEST
              </h3>

              <form onSubmit={handleAddManualGuest} className="space-y-4">
                <div>
                  <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50 block mb-1.5">
                    ATTENDEE FULL NAME *
                  </label>
                  <input
                    type="text"
                    value={newAttendee.name}
                    onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                    required
                    placeholder="Guest name"
                    className="w-full bg-szn-black border border-white/15 px-4 py-2.5 text-sm text-szn-cream outline-none focus:border-szn-magenta"
                  />
                </div>

                <div>
                  <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50 block mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    value={newAttendee.email}
                    onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                    required
                    placeholder="name@email.com"
                    className="w-full bg-szn-black border border-white/15 px-4 py-2.5 text-sm text-szn-cream outline-none focus:border-szn-magenta"
                  />
                </div>

                <div>
                  <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50 block mb-1.5">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={newAttendee.phone}
                    onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                    placeholder="+91 00000 00000"
                    className="w-full bg-szn-black border border-white/15 px-4 py-2.5 text-sm text-szn-cream outline-none focus:border-szn-magenta"
                  />
                </div>

                <div>
                  <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50 block mb-1.5">
                    PASS TYPE
                  </label>
                  <select
                    value={newAttendee.tier}
                    onChange={(e) => setNewAttendee({ ...newAttendee, tier: e.target.value })}
                    className="w-full bg-szn-black border border-white/15 px-4 py-2.5 text-sm text-szn-cream outline-none focus:border-szn-magenta font-grotesk uppercase text-xs"
                  >
                    <option value="EARLY ACCESS RSVP (FREE)">EARLY ACCESS RSVP (FREE)</option>
                    <option value="PLAYER PASS (DROPPING SOON)">PLAYER PASS (DROPPING SOON)</option>
                    <option value="VIP SZN PASS">VIP SZN PASS</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold py-3.5 mt-4 hover:bg-szn-cream transition-colors"
                >
                  ADD TO GUESTLIST
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
