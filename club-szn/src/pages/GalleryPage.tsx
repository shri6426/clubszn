import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { galleryImages } from '../data/events';

type GalleryCategory = 'ALL' | 'Social Meetups' | 'Parties' | 'Games' | 'Festival Celebrations' | 'Community Moments';

const categories: GalleryCategory[] = ['ALL', 'Social Meetups', 'Parties', 'Games', 'Festival Celebrations', 'Community Moments'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('ALL');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = galleryImages.filter(img =>
    activeCategory === 'ALL' || img.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-szn-black">
      {/* Header */}
      <div className="pt-28 pb-10 px-6 md:px-10 overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/30">CLUB SZN — GALLERY</span>
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta">{filtered.length} IMAGES</span>
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
          className="font-instrument text-xl italic text-szn-cream/40 mt-6 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Every frame, a memory. Every face, a story.
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="bg-szn-magenta overflow-hidden py-2.5 mb-10">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {['REAL PEOPLE', '•', 'REAL MOMENTS', '•', 'REAL MEMORIES', '•', 'REAL CONNECTIONS', '•',
              'REAL PEOPLE', '•', 'REAL MOMENTS', '•', 'REAL MEMORIES', '•', 'REAL CONNECTIONS', '•'].map((item, i) => (
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
              onClick={() => setActiveCategory(cat)}
              className={`font-grotesk text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-szn-magenta border-szn-magenta text-szn-black'
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
                className="masonry-item group relative overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setLightbox(img.src.replace('w=600', 'w=1200'))}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ filter: 'grayscale(100%) contrast(1.25) brightness(0.85)' }}
                />

                {/* Halftone overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #050505 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-szn-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 border border-szn-cream/30 flex items-center justify-center">
                      <ZoomIn size={14} className="text-szn-cream" />
                    </div>
                  </div>
                  <div>
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-magenta block mb-1">
                      {img.category}
                    </span>
                    <p className="font-dm text-szn-cream text-xs">{img.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-szn-black/95 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 border border-szn-cream/20 flex items-center justify-center hover:border-szn-magenta transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={16} className="text-szn-cream" />
            </button>
            <motion.img
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[85vh] object-contain"
              style={{ filter: 'grayscale(100%) contrast(1.25)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
