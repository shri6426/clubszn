import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '../data/events';

export default function GalleryPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  const activeImage = activeIdx !== null ? galleryImages[activeIdx] : null;

  return (
    <div className="min-h-screen bg-szn-black">
      {/* Header */}
      <div className="pt-28 pb-10 px-6 md:px-10 overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30">
            CLUB SZN — ARCHIVE
          </span>
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta font-mono font-bold">
            {galleryImages.length} SHOTS
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
          Raw moments. Official photography from the Club SZN archives.
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="bg-szn-magenta overflow-hidden py-2.5 mb-10">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {['CHENNAI TURF SZN', '•', 'RAW ARCHIVE', '•', 'FLOODLIT MOMENTS', '•', 'REAL PLAYERS', '•',
              'CHENNAI TURF SZN', '•', 'RAW ARCHIVE', '•', 'FLOODLIT MOMENTS', '•', 'REAL PLAYERS', '•'].map((item, i) => (
              <span key={i} className="font-grotesk text-[10px] tracking-widest uppercase font-bold text-szn-black px-4 whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pure Photo Masonry Grid */}
      <div className="px-6 md:px-10 pb-20">
        <div className="masonry-grid">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              className="masonry-item group relative overflow-hidden cursor-pointer border border-white/10 bg-szn-charcoal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setActiveIdx(i)}
            >
              <img
                src={img.src}
                alt={`Club SZN Shot ${i + 1}`}
                loading="lazy"
                className="w-full object-cover transition-all duration-700 group-hover:scale-105 filter grayscale contrast-125 brightness-90 group-hover:filter-none group-hover:brightness-100"
              />

              {/* Subtle Halftone dot overlay that clears on hover */}
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Minimal Zoom Reticle on hover */}
              <div className="absolute inset-0 bg-szn-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="w-10 h-10 border border-szn-cream/60 bg-szn-black/80 flex items-center justify-center">
                  <ZoomIn size={16} className="text-szn-magenta" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal with Full-Screen Carousel (Clean, no text descriptions) */}
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
              <span className="font-grotesk text-xs tracking-widest uppercase text-szn-magenta font-mono font-bold">
                [{String(activeIdx + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}]
              </span>

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
                  setActiveIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
                }}
                className="absolute left-2 md:left-4 z-20 w-11 h-11 border border-white/20 bg-szn-black/80 text-szn-cream hover:border-szn-magenta hover:text-szn-magenta flex items-center justify-center transition-all"
                title="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <motion.img
                key={activeImage.id}
                src={activeImage.src}
                alt={`Club SZN Shot ${activeIdx + 1}`}
                className="max-w-full max-h-[78vh] object-contain shadow-2xl border border-white/10"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              />

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
                }}
                className="absolute right-2 md:right-4 z-20 w-11 h-11 border border-white/20 bg-szn-black/80 text-szn-cream hover:border-szn-magenta hover:text-szn-magenta flex items-center justify-center transition-all"
                title="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Bottom Bar: Clean, minimal navigation hint */}
            <div className="w-full max-w-6xl border-t border-white/10 pt-3 flex justify-between items-center text-[10px] text-szn-cream/30 font-grotesk tracking-widest uppercase z-10" onClick={e => e.stopPropagation()}>
              <span>CLUB SZN ARCHIVE</span>
              <span className="hidden sm:inline">USE ← → ARROWS TO NAVIGATE · ESC TO CLOSE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
