'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import galleryData from '@/content/gallery.json';

type GalleryCategory = {
  id: string;
  label: string;
  images: string[];
};

// Start with the "All" category
const categories: GalleryCategory[] = [
  {
    id: 'all',
    label: 'All',
    images: galleryData.flatMap((c) => c.images),
  },
  ...galleryData,
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const currentImages =
    categories.find((c) => c.id === activeCategory)?.images ?? categories[0].images;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? currentImages.length - 1 : lightboxIndex - 1);
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === currentImages.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <div className="min-h-screen metamask-page">
      <style jsx>{`
        .metamask-page {
          background: linear-gradient(135deg, #fef7f4 0%, #fff5f0 50%, #f9f4ff 100%);
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .metamask-page::before {
          content: '';
          position: absolute;
          top: 10%;
          left: -5%;
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ff6b35, #f7931e);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float1 12s ease-in-out infinite;
          z-index: 1;
        }

        .metamask-page::after {
          content: '';
          position: absolute;
          top: 60%;
          right: -3%;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 50% 20% 50% 20%;
          animation: float2 15s ease-in-out infinite reverse;
          z-index: 1;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-180deg); }
        }

        .floating-shape-1 {
          position: absolute;
          top: 30%;
          right: 10%;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #06d6a0, #118ab2);
          border-radius: 20px;
          animation: float3 10s ease-in-out infinite;
          z-index: 1;
        }

        .floating-shape-2 {
          position: absolute;
          bottom: 20%;
          left: 8%;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ffd60a, #ff8500);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: float4 14s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
        }

        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-35px) rotate(120deg); }
        }

        @media (max-width: 767px) {
          .metamask-page::before,
          .metamask-page::after,
          .floating-shape-1,
          .floating-shape-2 {
            display: none;
          }
        }

        @media (min-width: 640px) {
          .metamask-page { padding: 1.5rem; }
        }

        @media (min-width: 1024px) {
          .metamask-page { padding: 2rem; }
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow:
            0 20px 40px rgba(139, 92, 246, 0.1),
            0 8px 32px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        @media (min-width: 640px) {
          .glass-container { padding: 2rem; border-radius: 28px; margin-bottom: 2.5rem; }
        }

        @media (min-width: 1024px) {
          .glass-container { padding: 2.5rem; border-radius: 32px; margin-bottom: 3rem; }
        }

        .glass-container:hover {
          transform: translateY(-8px);
          box-shadow:
            0 32px 64px rgba(139, 92, 246, 0.2),
            0 16px 48px rgba(255, 107, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .glass-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, #8b5cf6, #06d6a0, #ff6b35, #ffd60a, #8b5cf6);
          background-size: 300% 300%;
          animation: gradientShift 6s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glass-container:hover::before {
          opacity: 1;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .page-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #8b5cf6, #5b21b6, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #5b21b6;
          line-height: 0.9;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
          animation: titlePulse 4s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @media (min-width: 640px) {
          .page-title { font-size: 4rem; margin-bottom: 2.5rem; }
        }

        @media (min-width: 1024px) {
          .page-title { font-size: 5rem; margin-bottom: 3rem; }
        }

        .filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .filter-tab {
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 2px solid rgba(139, 92, 246, 0.2);
          background: rgba(255, 255, 255, 0.8);
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .filter-tab:hover {
          border-color: rgba(139, 92, 246, 0.4);
          color: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.15);
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.35);
        }

        :global(.gallery-grid) {
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-flow: dense;
          gap: 1rem;
          grid-auto-rows: 250px;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 768px) {
          :global(.gallery-grid) { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        }

        @media (min-width: 1024px) {
          :global(.gallery-grid) { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        }

        :global(.gallery-item) {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        /* Bento Box Layout Pattern */
        @media (min-width: 768px) {
          :global(.gallery-item.featured) {
            grid-column: span 2;
            grid-row: span 2;
          }
        }

        :global(.gallery-item:hover) {
          transform: scale(1.02);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.25);
          z-index: 3;
        }

        :global(.gallery-item::after) {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(91, 33, 182, 0.4) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        :global(.gallery-item:hover::after) {
          opacity: 1;
        }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .lightbox-image-wrapper {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 102;
        }

        .lightbox-btn:hover {
          background: rgba(139, 92, 246, 0.6);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-btn.prev { left: 1rem; }
        .lightbox-btn.next { right: 1rem; }

        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 102;
        }

        .lightbox-close:hover {
          background: rgba(239, 68, 68, 0.7);
          transform: scale(1.1);
        }

        .lightbox-counter {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          font-weight: 500;
          z-index: 102;
        }
      `}</style>

      {/* Floating Shapes */}
      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Page Title */}
        <h1 className="page-title">
          Gallery
        </h1>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="glass-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="gallery-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentImages.map((src, index) => (
                <motion.div
                  key={src}
                  className={`gallery-item ${index % 5 === 0 ? 'featured' : ''}`}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              <X size={22} />
            </button>

            <button
              className="lightbox-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <div
              className="lightbox-image-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={currentImages[lightboxIndex]}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <Image
                  src={currentImages[lightboxIndex]}
                  alt={`Gallery image ${lightboxIndex + 1}`}
                  fill
                  sizes="90vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </motion.div>
            </div>

            <button
              className="lightbox-btn next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              <ChevronRight size={24} />
            </button>

            <div className="lightbox-counter">
              {lightboxIndex + 1} / {currentImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
