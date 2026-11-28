import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '../data/events';

type GalleryCategory = 'ALL' | 'Turf Action' | 'Match Moments' | 'Squad & Crew' | 'Night Lights' | 'Golden Hour';

const categories: GalleryCategory[] = ['ALL', 'Turf Action', 'Match Moments', 'Squad & Crew', 'Night Lights', 'Golden Hour'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('ALL');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const filtered = galleryImages.filter(img =>
    activeCategory === 'ALL' || img.category === activeCategory
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null ? (prev + 1) % filtered.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, filtered.length]);

  const activeImage = activeIdx !== null ? filtered[activeIdx] : null;

  return (
    <div className="min-h-screen bg-szn-black">
      {/* Header */}
      <div className="pt-28 pb-10 px-6 md:px-10 overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30">
            CLUB SZN — TURF ARCHIVE
          </span>
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta font-mono font-bold">
            {filtered.length} OFFICIAL SHOTS
          </span>
        </div>

        <motion.h1
          className="font-anton text-[clamp(3.5rem,14vw,16rem)] leading-[0.88] tracking-tighter uppercase"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <span className="text-szn-cream">THE</span><br />
          <span className="text-szn-magenta">ARCHIVE.</span>
        </motion.h1>

        <motion.p
          className="font-instrument text-xl italic text-szn-cream/50 mt-6 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Raw floodlight energy, golden hour sprints, and sideline brotherhood. Official photography from the Club SZN archives.
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="bg-szn-magenta overflow-hidden py-2.5 mb-10">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {['CHENNAI TURF SZN', '•', 'RAW SHOTS', '•', 'FLOODLIT BATTLES', '•', 'NO MOCKUPS', '•', 'REAL PLAYERS', '•',
              'CHENNAI TURF SZN', '•', 'RAW SHOTS', '•', 'FLOODLIT BATTLES', '•', 'NO MOCKUPS', '•', 'REAL PLAYERS', '•'].map((item, i) => (
              <span key={i} className="font-grotesk text-[10px] tracking-widest uppercase font-bold text-szn-black px-4 whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="px-6 md:px-10 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveIdx(null);
              }}
              className={`font-grotesk text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-szn-magenta border-szn-magenta text-szn-black font-bold'
                  : 'border-szn-cream/20 text-szn-cream/50 hover:border-szn-magenta hover:text-szn-magenta'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="px-6 md:px-10 pb-20">
        <AnimatePresence>
          <div className="masonry-grid">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                className="masonry-item group relative overflow-hidden cursor-pointer border border-white/5 bg-szn-charcoal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActiveIdx(i)}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full object-cover transition-all duration-700 group-hover:scale-105 filter grayscale contrast-125 brightness-90 group-hover:filter-none group-hover:brightness-100"
                />

                {/* Subtle Halftone dot overlay that clears on hover */}
                <div
                  className="absolute inset-0 opacity-25 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                />

                {/* Hover overlay caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-szn-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 border border-szn-cream/40 bg-szn-black/60 flex items-center justify-center">
                      <ZoomIn size={14} className="text-szn-magenta" />
                    </div>
                  </div>
                  <div>
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-magenta block mb-1">
                      {img.category}
                    </span>
                    <p className="font-dm text-szn-cream text-xs font-medium">{img.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal with Full-Screen Carousel */}
      <AnimatePresence>
        {activeImage && activeIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-szn-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIdx(null)}
          >
            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center z-10" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta font-mono font-bold">
                  [{String(activeIdx + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}]
                </span>
                <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 hidden sm:inline">
                  {activeImage.category}
                </span>
              </div>

              <button
                className="w-10 h-10 border border-szn-cream/20 flex items-center justify-center hover:border-szn-magenta hover:text-szn-magenta transition-colors text-szn-cream"
                onClick={() => setActiveIdx(null)}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Center Image Container with Arrow Controls */}
            <div
              className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0));
                }}
                className="absolute left-2 md:left-4 z-20 w-11 h-11 border border-white/20 bg-szn-black/80 text-szn-cream hover:border-szn-magenta hover:text-szn-magenta flex items-center justify-center transition-all"
                title="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <motion.img
                key={activeImage.id}
                src={activeImage.src}
                alt={activeImage.caption}
                className="max-w-full max-h-[75vh] object-contain shadow-2xl border border-white/10"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              />

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev + 1) % filtered.length : 0));
                }}
                className="absolute right-2 md:right-4 z-20 w-11 h-11 border border-white/20 bg-szn-black/80 text-szn-cream hover:border-szn-magenta hover:text-szn-magenta flex items-center justify-center transition-all"
                title="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full max-w-6xl border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 z-10" onClick={e => e.stopPropagation()}>
              <div>
                <p className="font-grotesk text-sm text-szn-cream font-medium">
                  {activeImage.caption}
                </p>
                <span className="font-grotesk text-[9px] text-szn-cream/40 uppercase tracking-widest">
                  CLUB SZN — TURF EDITION — CHENNAI
                </span>
              </div>
              <span className="font-grotesk text-[9px] text-szn-cream/30 uppercase tracking-wider hidden md:block">
                USE ← → ARROWS OR CLICK SIDES TO NAVIGATE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
