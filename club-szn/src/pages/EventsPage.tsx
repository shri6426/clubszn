import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { events } from '../data/events';
import type { EventCategory, PriceType } from '../data/events';

type FilterType = 'ALL' | EventCategory | PriceType;

const filters: { label: string; value: FilterType }[] = [
  { label: 'ALL', value: 'ALL' },
  { label: 'SOCIAL', value: 'SOCIAL' },
  { label: 'PARTIES', value: 'PARTIES' },
  { label: 'GAMES', value: 'GAMES' },
  { label: 'SPECIAL EVENTS', value: 'SPECIAL EVENTS' },
  { label: 'FREE', value: 'FREE' },
  { label: 'PAID', value: 'PAID' },
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const filtered = events.filter(e => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FREE' || activeFilter === 'PAID') return e.priceType === activeFilter;
    return e.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-szn-black">
      {/* Header */}
      <div className="pt-28 pb-0 px-6 md:px-10 overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30">CLUB SZN — EVENTS</span>
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">{filtered.length} EVENTS</span>
        </div>

        <motion.h1
          className="font-anton text-[clamp(3.5rem,14vw,16rem)] leading-[0.88] tracking-tighter uppercase text-szn-cream mb-2"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          FIND YOUR
        </motion.h1>
        <motion.h1
          className="font-anton text-[clamp(3.5rem,14vw,16rem)] leading-[0.88] tracking-tighter uppercase text-szn-magenta mb-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          NEXT SZN.
        </motion.h1>

        {/* Announcement notice */}
        <div className="border border-szn-cream/10 bg-szn-cream/5 px-4 py-3 mb-10 inline-flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-szn-magenta animate-pulse" />
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/60 font-semibold">
            NEXT OFFICIAL EVENT · VENUE & DATE ANNOUNCING SOON
          </span>
        </div>
      </div>

      {/* Magenta divider */}
      <div className="h-px bg-szn-magenta/30 mx-6 md:mx-10 mb-8" />

      {/* Filters */}
      <div className="px-6 md:px-10 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <SlidersHorizontal size={12} className="text-szn-cream/40" />
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">FILTER BY</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`font-grotesk text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                activeFilter === f.value
                  ? 'bg-szn-magenta border-szn-magenta text-szn-black'
                  : 'border-szn-cream/20 text-szn-cream/60 hover:border-szn-magenta hover:text-szn-magenta'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="px-6 md:px-10 pb-20">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 text-center"
            >
              <h3 className="font-anton text-5xl md:text-7xl text-szn-cream/20 uppercase mb-4">NO SZN YET.</h3>
              <p className="font-dm text-szn-cream/40 text-sm">No events match this filter. Try another.</p>
              <button
                onClick={() => setActiveFilter('ALL')}
                className="mt-8 font-grotesk text-xs tracking-widest uppercase border border-szn-magenta text-szn-magenta px-6 py-3 hover:bg-szn-magenta hover:text-szn-black transition-all"
              >
                SHOW ALL EVENTS
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filtered.map((event, i) => {
                const isLarge = i === 0;
                return (
                  <motion.div
                    key={event.id}
                    className={isLarge ? 'md:col-span-2' : ''}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link to={`/events/${event.slug}`}>
                      <div
                        className="relative overflow-hidden group bg-szn-charcoal border border-white/5 hover:border-szn-magenta/40 transition-all duration-500"
                        style={{ minHeight: isLarge ? 'clamp(300px,45vw,580px)' : 'clamp(260px,35vw,440px)' }}
                      >
                        {/* Image */}
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          style={{ filter: 'grayscale(100%) contrast(1.3) brightness(0.5)' }}
                        />
                        {/* Halftone */}
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
                            backgroundSize: '4px 4px',
                            opacity: 0.45,
                          }}
                        />
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-szn-black via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                          {/* Top badges */}
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                              <span className={`font-grotesk text-xs tracking-widest uppercase px-3 py-1 font-bold w-fit ${
                                event.priceType === 'FREE'
                                  ? 'bg-szn-magenta text-szn-black'
                                  : 'bg-szn-cream text-szn-black'
                              }`}>
                                {event.priceType === 'FREE' ? 'FREE ENTRY' : `₹${event.price}`}
                              </span>
                              {event.soldOut && (
                                <span className="font-grotesk text-xs tracking-widest uppercase px-3 py-1 bg-szn-cream/20 text-szn-cream/60 w-fit">
                                  SOLD OUT
                                </span>
                              )}
                            </div>
                            <span className="font-grotesk text-xs tracking-widest uppercase border border-szn-cream/20 text-szn-cream/60 px-3 py-1">
                              {event.category}
                            </span>
                          </div>

                          {/* Bottom content */}
                          <div>
                            <span className="font-grotesk text-xs tracking-widest uppercase text-szn-magenta block mb-2">
                              {event.date}
                            </span>
                            <h2 className={`font-anton leading-none tracking-tighter uppercase text-szn-cream mb-2 ${
                              isLarge
                                ? 'text-[clamp(2.5rem,8vw,8rem)]'
                                : 'text-[clamp(2rem,5vw,5rem)]'
                            }`}>
                              {event.title}
                            </h2>
                            <p className="font-dm text-szn-cream/50 text-sm mb-4">
                              {event.venue}, {event.location}
                            </p>
                            <p className="font-dm text-szn-cream/40 text-sm mb-6 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {event.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase text-szn-cream border border-szn-cream/30 px-5 py-2.5 group-hover:bg-szn-magenta group-hover:border-szn-magenta group-hover:text-szn-black transition-all duration-300">
                                EXPLORE EVENT <ArrowRight size={12} />
                              </span>
                              {/* Availability */}
                              {event.tickets[0] && !event.soldOut && (
                                <div className="text-right">
                                  <span className="font-grotesk text-[10px] tracking-wider uppercase text-szn-cream/30 block">
                                    AVAILABILITY
                                  </span>
                                  <div className="mt-1 w-24 h-0.5 bg-szn-cream/10">
                                    <div
                                      className="h-full bg-szn-magenta transition-all"
                                      style={{
                                        width: `${(event.tickets[0].available / event.tickets[0].total) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Future SZN Pipeline Box */}
        <div className="mt-16 border border-white/10 p-8 md:p-12 bg-szn-charcoal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-2">
              MORE SZNS IN THE WORKS
            </span>
            <h3 className="font-anton text-2xl md:text-4xl uppercase text-szn-cream tracking-tight">
              COMMUNITY GATHERINGS · NEW VENUES · DROPPING EVERY MONTH
            </h3>
            <p className="font-dm text-szn-cream/50 text-xs md:text-sm mt-2 max-w-lg">
              We scout unique venues, turfs, warehouses and private spots across the city. Want to suggest a turf or collab? Drop into our Instagram DMs.
            </p>
          </div>
          <a
            href="https://www.instagram.com/club_szn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-szn-magenta text-szn-magenta font-grotesk text-xs tracking-widest uppercase font-bold px-6 py-4 hover:bg-szn-magenta hover:text-szn-black transition-all shrink-0"
          >
            INSTAGRAM @CLUB_SZN <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
