import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Calendar, Users, ChevronRight, Minus, Plus } from 'lucide-react';
import { events } from '../data/events';

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const event = events.find(e => e.slug === slug);

  const [selectedTier, setSelectedTier] = useState(0);
  const [qty, setQty] = useState(1);

  if (!event) {
    return (
      <div className="min-h-screen bg-szn-black flex flex-col items-center justify-center">
        <h2 className="font-anton text-5xl text-szn-cream mb-4">EVENT NOT FOUND.</h2>
        <Link to="/events" className="font-grotesk text-xs tracking-widest uppercase text-szn-magenta border border-szn-magenta px-6 py-3">
          BACK TO EVENTS
        </Link>
      </div>
    );
  }

  const tier = event.tickets[selectedTier];
  const available = tier?.available ?? 0;
  const isFree = event.priceType === 'FREE';

  const handleBook = () => {
    navigate(`/book/${event.slug}?tier=${selectedTier}&qty=${qty}`);
  };

  return (
    <div className="min-h-screen bg-szn-black">
      {/* Back */}
      <div className="fixed top-20 left-6 md:left-10 z-40">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase text-szn-cream/60 hover:text-szn-cream transition-colors bg-szn-black/80 backdrop-blur-sm border border-white/10 px-4 py-2"
        >
          <ArrowLeft size={12} /> BACK
        </Link>
      </div>

      {/* Hero poster */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(50vh,65vw,85vh)' }}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover absolute inset-0"
          style={{ filter: 'grayscale(100%) contrast(1.3) brightness(0.45)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
            backgroundSize: '5px 5px',
            opacity: 0.4,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-szn-black via-szn-black/30 to-szn-black/10" />

        <div className="absolute inset-0 p-6 md:p-14 flex flex-col justify-end">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`font-grotesk text-xs tracking-widest uppercase px-3 py-1 font-bold ${isFree ? 'bg-szn-magenta text-szn-black' : 'bg-szn-cream text-szn-black'
              }`}>
              {isFree ? 'FREE ENTRY' : `FROM ₹${event.price}`}
            </span>
            <span className="font-grotesk text-xs tracking-widest uppercase border border-szn-cream/30 text-szn-cream/70 px-3 py-1">
              {event.category}
            </span>
          </div>
          <motion.h1
            className="font-anton text-[clamp(3rem,12vw,13rem)] leading-[0.88] tracking-tighter uppercase text-szn-cream mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {event.title}
          </motion.h1>
          <p className="font-dm text-szn-cream/50 text-base md:text-lg max-w-2xl">{event.description}</p>
        </div>
      </div>

      {/* Content grid */}
      <div className="px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left — event info */}
        <div className="md:col-span-2 space-y-10">
          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Calendar size={14} />, label: 'DATE', value: event.date },
              { icon: <Clock size={14} />, label: 'TIME', value: event.time },
              { icon: <MapPin size={14} />, label: 'VENUE', value: event.venue },
              { icon: <Users size={14} />, label: 'LOCATION', value: event.location },
            ].map(item => (
              <div key={item.label} className="border border-white/10 p-4">
                <div className="flex items-center gap-2 text-szn-magenta mb-2">
                  {item.icon}
                  <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/40">{item.label}</span>
                </div>
                <p className="font-grotesk text-sm text-szn-cream font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-4">ABOUT THIS EVENT</span>
            <div className="border-l-2 border-szn-magenta pl-6">
              {event.fullDescription.split('\n\n').map((para, i) => (
                <p key={i} className="font-dm text-szn-cream/70 text-sm md:text-base leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-5">EVENT HIGHLIGHTS</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {event.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ChevronRight size={14} className="text-szn-magenta mt-0.5 shrink-0" />
                  <span className="font-dm text-szn-cream/70 text-sm">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30 block mb-3">TAGS</span>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(t => (
                <span key={t} className="font-grotesk text-xs tracking-widest uppercase border border-szn-cream/10 text-szn-cream/40 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Gallery strip */}
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-4">EXPERIENCE</span>
            <div className="grid grid-cols-3 gap-2">
              {[event.imageUrl,
                '/gallery/img_0453.jpg',
                '/gallery/img_0618.jpg',
              ].map((img, i) => (
                <div key={i} className="overflow-hidden" style={{ height: 'clamp(80px,12vw,160px)' }}>
                  <img
                    src={img}
                    alt="Event vibe"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    style={{ filter: 'grayscale(100%) contrast(1.3)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — booking sidebar */}
        <div className="space-y-5">
          <div className="border border-white/10 p-6 sticky top-24">
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-5">SELECT TICKETS</span>

            {/* Tier selection */}
            <div className="space-y-3 mb-6">
              {event.tickets.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(i)}
                  className={`w-full text-left border p-4 transition-all duration-200 ${selectedTier === i
                      ? 'border-szn-magenta bg-szn-magenta/5'
                      : 'border-white/10 hover:border-szn-cream/30'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-grotesk text-xs tracking-wider uppercase text-szn-cream font-semibold">{t.name}</span>
                    <span className="font-anton text-lg text-szn-magenta">
                      {t.price === 0 ? 'FREE' : `₹${t.price}`}
                    </span>
                  </div>
                  <p className="font-dm text-szn-cream/40 text-xs">{t.description}</p>
                  {t.available === 0 ? (
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-red-400 mt-2 block">SOLD OUT</span>
                  ) : (
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/30 mt-2 block">
                      {t.available} LEFT
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quantity */}
            {available > 0 && (
              <div className="mb-6">
                <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-3">QUANTITY</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="border border-white/20 p-2 hover:border-szn-magenta transition-colors"
                  >
                    <Minus size={14} className="text-szn-cream" />
                  </button>
                  <span className="font-anton text-2xl text-szn-cream w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(available, qty + 1))}
                    className="border border-white/20 p-2 hover:border-szn-magenta transition-colors"
                  >
                    <Plus size={14} className="text-szn-cream" />
                  </button>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-grotesk text-xs tracking-wider uppercase text-szn-cream/40">TOTAL</span>
                <span className="font-anton text-2xl text-szn-cream">
                  {tier?.price === 0 ? 'FREE' : `₹${(tier?.price ?? 0) * qty}`}
                </span>
              </div>
            </div>

            {/* CTA */}
            {available > 0 ? (
              <button
                onClick={handleBook}
                className="w-full bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold py-4 hover:bg-szn-cream transition-colors duration-300"
              >
                {isFree ? 'RSVP FOR EARLY ACCESS' : 'BUY TICKETS'}
              </button>
            ) : (
              <button disabled className="w-full bg-szn-cream/10 text-szn-cream/30 font-grotesk text-xs tracking-widest uppercase font-bold py-4 cursor-not-allowed">
                SOLD OUT
              </button>
            )}

            <p className="font-dm text-szn-cream/40 text-[10px] text-center mt-3">
              Official venue deeds & dates announcing soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
