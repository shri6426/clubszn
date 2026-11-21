import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';

// Section 01 — Hero
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] bg-szn-black overflow-hidden flex flex-col">
      {/* Background image */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1400&q=80"
          alt="People socializing"
          className="w-full h-full object-cover img-bw-halftone opacity-50"
        />
        {/* Halftone dot overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(5,5,5,0.9) 1px, transparent 1px)',
            backgroundSize: '5px 5px',
          }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-szn-black via-szn-black/60 to-szn-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-szn-black/80 via-transparent to-szn-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col h-full pt-28 pb-10 px-6 md:px-10"
        style={{ opacity }}
      >
        {/* Top editorial labels */}
        <div className="flex justify-between items-start mb-auto">
          <div>
            <span className="font-grotesk text-[10px] tracking-[0.25em] uppercase text-szn-magenta block mb-1">EST. 2026</span>
            <span className="font-grotesk text-[10px] tracking-[0.2em] uppercase text-szn-cream/40">Chennai, India</span>
          </div>
          <div className="text-right">
            <span className="font-grotesk text-[10px] tracking-[0.2em] uppercase text-szn-cream/40 block">Issue No. 001</span>
            <span className="font-grotesk text-[10px] tracking-[0.2em] uppercase text-szn-cream/40">Vol. 1</span>
          </div>
        </div>

        {/* Main headline */}
        <div className="mt-auto">
          <div className="relative mb-2">
            {/* Magenta accent */}
            <div className="w-16 h-0.5 bg-szn-magenta mb-6" />
            <motion.h1
              className="font-anton text-[clamp(4.5rem,16vw,18rem)] leading-[0.88] tracking-tighter uppercase text-szn-cream"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            >
              YOUR
            </motion.h1>
            <motion.h1
              className="font-anton text-[clamp(4.5rem,16vw,18rem)] leading-[0.88] tracking-tighter uppercase text-szn-magenta"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.45 }}
            >
              PEOPLE.
            </motion.h1>
            <motion.h1
              className="font-anton text-[clamp(4.5rem,16vw,18rem)] leading-[0.88] tracking-tighter uppercase text-szn-cream"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.55 }}
            >
              YOUR PLANS.
            </motion.h1>
            <motion.h1
              className="font-anton text-[clamp(4.5rem,16vw,18rem)] leading-[0.88] tracking-tighter uppercase text-szn-cream/30"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.65 }}
            >
              YOUR SZN.
            </motion.h1>
          </div>

          {/* Bottom row */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-3 bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold px-7 py-4 hover:bg-szn-cream transition-colors duration-300 self-start"
            >
              EXPLORE THE SZN <ArrowRight size={14} />
            </Link>
            <div className="flex flex-col items-start md:items-end gap-1">
              <span className="font-grotesk text-[10px] tracking-[0.2em] uppercase text-szn-cream/40">Scroll to explore</span>
              <ArrowDown size={14} className="text-szn-magenta animate-bounce" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Section 02 — Brand Introduction
function BrandIntroSection() {
  return (
    <section className="bg-szn-cream overflow-hidden relative">
      {/* Top editorial bar */}
      <div className="bg-szn-black px-6 md:px-10 py-2 flex justify-between">
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">CLUB SZN — BRAND</span>
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">02 / 08</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* Left — image */}
        <div className="relative overflow-hidden min-h-[50vw] md:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80"
            alt="Community"
            className="w-full h-full object-cover img-bw absolute inset-0"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(240,235,221,0.6) 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }}
          />
          {/* Rotated editorial label */}
          <div className="absolute bottom-6 left-6">
            <span
              className="font-grotesk text-[10px] tracking-widest uppercase text-szn-black/60 block"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              People. Connections. Moments.
            </span>
          </div>
        </div>

        {/* Right — text */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-szn-cream">
          {/* Number */}
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-black/40 mb-6">02 — ABOUT</span>

          <motion.h2
            className="font-anton text-[clamp(2.5rem,7vw,8rem)] leading-[0.9] tracking-tighter uppercase text-szn-black mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true }}
          >
            NOT JUST<br />
            <span className="text-szn-magenta">ANOTHER</span><br />
            PLAN.
          </motion.h2>

          <div className="w-12 h-0.5 bg-szn-magenta mb-6" />

          <motion.p
            className="font-dm text-szn-black/70 text-base md:text-lg leading-relaxed max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            CLUB SZN brings people together through affordable social experiences, new friendships and unforgettable moments.
          </motion.p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <div>
              <span className="font-anton text-4xl text-szn-black">100+</span>
              <p className="font-grotesk text-xs tracking-wider uppercase text-szn-black/50 mt-1">People Showed Up</p>
            </div>
            <div>
              <span className="font-anton text-4xl text-szn-magenta">01</span>
              <p className="font-grotesk text-xs tracking-wider uppercase text-szn-black/50 mt-1">Event Hosted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 03 — What We Do
const categories = [
  { num: '01', label: 'SOCIAL MEETUPS', desc: 'Meet new people in a natural, comfortable environment.', img: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80' },
  { num: '02', label: 'PARTIES & THEMED EVENTS', desc: 'Full-production parties and themed nights.', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80' },
  { num: '03', label: 'GAMES & CHALLENGES', desc: 'Team games, trivia and competitive chaos.', img: 'https://images.unsplash.com/photo-1543079467-a9ea9d8e1ef4?w=600&q=80' },
  { num: '04', label: 'MUSIC & ENTERTAINMENT', desc: 'Live sets, DJ nights and curated soundscapes.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { num: '05', label: 'FESTIVAL CELEBRATIONS', desc: 'Mark every season with something memorable.', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80' },
  { num: '06', label: 'COMMUNITY EXPERIENCES', desc: 'Shared meals, potlucks and community moments.', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80' },
];

function WhatWeDoSection() {
  return (
    <section className="bg-szn-black overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-10 pt-20 pb-10">
        <div className="flex justify-between items-start">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30">03 — WHAT WE DO</span>
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">SZN EXPERIENCES</span>
        </div>
        <motion.h2
          className="font-anton text-[clamp(3.5rem,13vw,15rem)] leading-[0.88] tracking-tighter uppercase mt-4"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <span className="text-szn-cream">WE MAKE</span><br />
          <span className="text-szn-magenta">SOCIALIZING</span><br />
          <span className="text-stroke text-szn-cream/40 [&]:[-webkit-text-stroke:1px_#F0EBDD]">A THING.</span>
        </motion.h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.num}
            className={`relative overflow-hidden group cursor-pointer ${
              i % 2 === 0 ? 'bg-szn-black' : 'bg-szn-charcoal'
            }`}
            style={{ minHeight: '320px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            {/* Background image */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover img-bw" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full min-h-[320px]">
              <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta mb-auto">{cat.num}</span>
              <div>
                <h3 className="font-anton text-[clamp(1.4rem,3.5vw,2.5rem)] leading-tight tracking-tight uppercase text-szn-cream mb-3 group-hover:text-szn-magenta transition-colors duration-300">
                  {cat.label}
                </h3>
                <p className="font-dm text-szn-cream/50 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-xs">
                  {cat.desc}
                </p>
              </div>
              {/* Border accent */}
              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-szn-magenta transition-all duration-500" />
            </div>

            {/* Number watermark */}
            <div className="absolute right-4 top-4 font-anton text-[6rem] leading-none text-szn-cream/5 select-none">
              {cat.num}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Section 04 — Upcoming Events (preview strip)
import { events } from '../data/events';

function UpcomingEventsSection() {
  const featured = events.filter(e => e.featured).slice(0, 3);

  return (
    <section className="bg-szn-cream overflow-hidden">
      <div className="bg-szn-black px-6 md:px-10 py-2 flex justify-between">
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">CLUB SZN — EVENTS</span>
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">04 / 08</span>
      </div>

      <div className="px-6 md:px-10 pt-16 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <motion.h2
            className="font-anton text-[clamp(3rem,10vw,11rem)] leading-[0.88] tracking-tighter uppercase text-szn-black"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            WHAT'S<br />
            <span className="text-szn-magenta">HAPPENING?</span>
          </motion.h2>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase border-b-2 border-szn-black text-szn-black hover:border-szn-magenta hover:text-szn-magenta transition-all pb-1 shrink-0"
          >
            ALL EVENTS <ArrowRight size={12} />
          </Link>
        </div>

        {/* Demo notice */}
        <div className="border border-szn-black/20 bg-szn-black/5 px-4 py-3 mb-8 inline-flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-szn-magenta animate-pulse" />
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-black/80 font-bold">
            NEXT OFFICIAL EVENT · DATE & VENUE ANNOUNCING SOON
          </span>
        </div>
      </div>

      {/* Featured event — large */}
      {featured[0] && (
        <div className="px-6 md:px-10 mb-8">
          <Link to={`/events/${featured[0].slug}`}>
            <motion.div
              className="relative overflow-hidden group bg-szn-black border border-szn-black/10"
              style={{ minHeight: 'clamp(380px, 45vw, 620px)' }}
              whileHover={{ scale: 1.003 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={featured[0].imageUrl}
                alt={featured[0].title}
                className="w-full h-full object-cover img-bw opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-szn-black via-szn-black/40 to-transparent" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(5,5,5,0.7) 1px, transparent 1px)',
                  backgroundSize: '5px 5px',
                }}
              />
              <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-grotesk text-xs tracking-widest uppercase px-3 py-1 font-bold bg-szn-magenta text-szn-black">
                    EARLY ACCESS WAITLIST
                  </span>
                  <span className="font-grotesk text-xs tracking-widest uppercase text-szn-cream/70 border border-szn-cream/20 px-3 py-1 bg-szn-black/40 backdrop-blur-sm">
                    {featured[0].category}
                  </span>
                  <span className="font-grotesk text-xs tracking-widest uppercase text-szn-cream/60 border border-szn-cream/20 px-3 py-1 bg-szn-black/40 backdrop-blur-sm">
                    UNDER FLOODLIGHTS
                  </span>
                </div>
                <div>
                  <span className="font-grotesk text-xs tracking-widest uppercase text-szn-magenta block mb-3 font-semibold">
                    {featured[0].date}
                  </span>
                  <h3 className="font-anton text-[clamp(3.5rem,11vw,10rem)] leading-none tracking-tighter uppercase text-szn-cream mb-3">
                    {featured[0].title}
                  </h3>
                  <p className="font-dm text-szn-cream/70 text-sm md:text-base max-w-xl mb-6">
                    {featured[0].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase text-szn-black bg-szn-cream px-6 py-3 font-bold group-hover:bg-szn-magenta transition-all duration-300">
                      EXPLORE TURF SZN <ArrowRight size={12} />
                    </span>
                    <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/50">
                      LOCATION & SCHEDULE REVEALING SOON
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      )}

      {/* Editorial Teaser Strip for Upcoming Details */}
      <div className="px-6 md:px-10 mb-12">
        <div className="border border-szn-black/15 p-8 bg-szn-cream flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-black/40 block mb-1">
              THE SZN TAKEOVER
            </span>
            <h4 className="font-anton text-2xl md:text-3xl tracking-tight uppercase text-szn-black">
              ARENA TURF · FOOTBALL & CRICKET BATTLES · DJ SETS
            </h4>
            <p className="font-dm text-szn-black/60 text-xs md:text-sm mt-1 max-w-lg">
              Official venue deeds, exact dates, squad brackets and timing will be revealed right here. Secure your priority RSVP slot today.
            </p>
          </div>
          <Link
            to="/events/turf-szn"
            className="inline-flex items-center gap-2 bg-szn-black text-szn-cream font-grotesk text-xs tracking-widest uppercase font-bold px-6 py-3.5 hover:bg-szn-magenta hover:text-szn-black transition-all shrink-0"
          >
            RSVP FOR PRIORITY ACCESS <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-16 text-center">
        <Link
          to="/events"
          className="inline-flex items-center gap-3 bg-szn-black text-szn-cream font-grotesk text-xs tracking-widest uppercase font-bold px-10 py-5 hover:bg-szn-magenta hover:text-szn-black transition-all duration-300"
        >
          VIEW ALL EVENTS <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// Section 05 — Social Proof
function SocialProofSection() {
  return (
    <section className="bg-szn-black relative overflow-hidden">
      {/* BG image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80"
          alt="Crowd"
          className="w-full h-full object-cover img-bw opacity-25"
        />
        <div className="absolute inset-0 bg-szn-black/50" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #050505 1.2px, transparent 1.2px)',
            backgroundSize: '5px 5px',
            opacity: 0.5,
          }}
        />
      </div>

      <div className="relative z-10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-6xl mx-auto">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30 block mb-10">05 — MILESTONE</span>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-anton text-[clamp(7rem,25vw,28rem)] leading-none tracking-tighter text-szn-magenta">
              100+
            </h2>
            <h3 className="font-anton text-[clamp(2rem,8vw,9rem)] leading-[0.9] tracking-tighter uppercase text-szn-cream mt-4">
              PEOPLE SHOWED UP.
            </h3>
            <div className="w-20 h-0.5 bg-szn-magenta mt-8 mb-8" />
            <p className="font-instrument text-xl md:text-2xl italic text-szn-cream/60 max-w-lg">
              "Connections happened. Strangers became friends. And it was just the beginning."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section 06 — The Experience
function ExperienceSection() {
  const images = [
    'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
    'https://images.unsplash.com/photo-1543079467-a9ea9d8e1ef4?w=600&q=80',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
  ];

  return (
    <section className="bg-szn-cream overflow-hidden relative">
      {/* Top bar */}
      <div className="bg-szn-black px-6 md:px-10 py-2 flex justify-between">
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">06 — THE EXPERIENCE</span>
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">MEMORIES</span>
      </div>

      <div className="relative">
        {/* BIG text layer */}
        <div className="px-6 md:px-10 pt-16 pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-anton text-[clamp(4rem,16vw,18rem)] leading-[0.85] tracking-tighter uppercase text-szn-black">
              STRANGERS
            </h2>
            <h2 className="font-anton text-[clamp(4rem,16vw,18rem)] leading-[0.85] tracking-tighter uppercase text-szn-magenta">
              TODAY.
            </h2>
          </motion.div>
        </div>

        {/* Image collage */}
        <div className="relative overflow-hidden px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                className="overflow-hidden"
                style={{
                  height: i % 2 === 0 ? 'clamp(200px,30vw,400px)' : 'clamp(150px,22vw,300px)',
                  marginTop: i % 3 === 1 ? '30px' : '0',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={img}
                  alt="SZN moment"
                  className="w-full h-full object-cover img-bw hover:scale-105 transition-transform duration-700"
                  style={{ filter: 'grayscale(100%) contrast(1.3)' }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="px-6 md:px-10 pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-right"
          >
            <h2 className="font-anton text-[clamp(4rem,16vw,18rem)] leading-[0.85] tracking-tighter uppercase text-szn-black">
              STORIES
            </h2>
            <h2 className="font-anton text-[clamp(4rem,16vw,18rem)] leading-[0.85] tracking-tighter uppercase text-stroke-magenta" style={{ WebkitTextStroke: '2px #8316C8' }}>
              TOMORROW.
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section 07 — About
function AboutSection() {
  return (
    <section id="about" className="bg-szn-black overflow-hidden">
      <div className="bg-szn-cream/10 px-6 md:px-10 py-2 flex justify-between">
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40">07 — ABOUT CLUB SZN</span>
        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">WHO WE ARE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Text side */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta mb-6">07 — ABOUT</span>
          <motion.h2
            className="font-anton text-[clamp(2rem,5vw,5rem)] leading-tight tracking-tighter uppercase text-szn-cream mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            THE STORY<br />
            <span className="text-szn-magenta">BEHIND</span><br />
            THE SZN.
          </motion.h2>
          <div className="w-12 h-0.5 bg-szn-magenta mb-8" />
          <div className="space-y-5 max-w-sm">
            <p className="font-dm text-szn-cream/70 text-sm leading-relaxed">
              CLUB SZN is a youth-focused socializing club created to bring people together, help them make new friends, meet new people and create memorable experiences.
            </p>
            <p className="font-dm text-szn-cream/70 text-sm leading-relaxed">
              Our goal is to make socializing affordable and accessible. We organise fun, budget-friendly events where people can chill, interact, participate in games, enjoy music and experience something different from their usual routine.
            </p>
          </div>
          <div className="mt-10">
            <a
              href="https://www.instagram.com/club_szn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase text-szn-magenta border border-szn-magenta px-6 py-3 hover:bg-szn-magenta hover:text-szn-black transition-all duration-300"
            >
              FOLLOW ON INSTAGRAM
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden min-h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1536745511163-cc7f06aa8b88?w=800&q=80"
            alt="CLUB SZN"
            className="w-full h-full object-cover img-bw absolute inset-0"
            style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.6)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
              backgroundSize: '4px 4px',
              opacity: 0.4,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-szn-black/20" />
          {/* Large watermark text */}
          <div className="absolute inset-0 flex items-end p-8">
            <span
              className="font-anton text-[8rem] leading-none text-szn-cream/5 select-none"
              style={{ lineHeight: '1' }}
            >
              SZN
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 08 — Final CTA
function FinalCTASection() {
  return (
    <section className="bg-szn-black overflow-hidden relative py-24 md:py-36">
      {/* BG decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-szn-magenta/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-szn-violet/5 blur-3xl" />
      </div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Magenta accent lines */}
        <div className="flex gap-2 mb-10">
          <div className="h-1 w-16 bg-szn-magenta" />
          <div className="h-1 w-6 bg-szn-violet" />
          <div className="h-1 w-3 bg-szn-magenta/40" />
        </div>

        <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30 block mb-6">08 — JOIN THE SZN</span>

        <motion.h2
          className="font-anton text-[clamp(4rem,16vw,18rem)] leading-[0.88] tracking-tighter uppercase mb-6"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-szn-cream">YOUR NEXT</span><br />
          <span className="text-szn-magenta">MEMORY</span><br />
          <span className="text-stroke" style={{ WebkitTextStroke: '1px rgba(240,235,221,0.3)', color: 'transparent' }}>STARTS HERE.</span>
        </motion.h2>

        <motion.p
          className="font-instrument text-xl md:text-2xl italic text-szn-cream/50 mb-12 max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Step out. Meet people. Make memories.
        </motion.p>

        <Link
          to="/events"
          className="inline-flex items-center gap-3 bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold px-10 py-5 hover:bg-szn-cream transition-all duration-300"
        >
          FIND YOUR NEXT SZN <ArrowRight size={16} />
        </Link>

        {/* Logo bottom */}
        <div className="mt-24 flex justify-end">
          <img src="/assets/logo.jpg" alt="CLUB SZN" className="h-14 md:h-20 w-auto opacity-80" />
        </div>
      </div>
    </section>
  );
}

// Marquee section between hero and brand
function MarqueeSection() {
  const items = [
    'TURF SZN', '•',
    'DATES ANNOUNCING SOON', '•',
    'UNDER THE FLOODLIGHTS', '•',
    'LOCATION DEEDS DROPPING SOON', '•',
    'TURF TAKEOVER', '•',
    'CHENNAI', '•'
  ];

  return (
    <div className="bg-szn-magenta overflow-hidden py-3">
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-grotesk text-xs tracking-widest uppercase font-bold text-szn-black px-4 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <BrandIntroSection />
      <WhatWeDoSection />
      <UpcomingEventsSection />
      <SocialProofSection />
      <ExperienceSection />
      <AboutSection />
      <FinalCTASection />
    </>
  );
}
