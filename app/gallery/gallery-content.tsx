'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export type GalleryCategory = {
  id: string;
  label: string;
  images: string[];
  source: 'event' | 'static';
};

type GalleryItem = {
  image: string;
  categoryId: string;
  categoryLabel: string;
};

interface GalleryContentProps {
  categories: GalleryCategory[];
  initialCategoryId: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.03 },
  }),
};

export default function GalleryContent({ categories, initialCategoryId }: GalleryContentProps) {
  const normalizedCategoryIds = new Set(categories.map((c) => c.id));
  const initial = normalizedCategoryIds.has(initialCategoryId) ? initialCategoryId : 'all';

  const [activeCategory, setActiveCategory] = useState(initial);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allItems = useMemo<GalleryItem[]>(() => {
    return categories.flatMap((category) =>
      category.images.map((image) => ({
        image,
        categoryId: category.id,
        categoryLabel: category.label,
      }))
    );
  }, [categories]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return allItems;
    return allItems.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, allItems]);

  const tabCategories = useMemo(() => {
    return [{ id: 'all', label: 'All' }, ...categories.map((c) => ({ id: c.id, label: c.label }))];
  }, [categories]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1);
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1);
  };

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

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
        }

        @media (min-width: 640px) {
          .page-title { font-size: 4rem; }
        }

        @media (min-width: 1024px) {
          .page-title { font-size: 5rem; }
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow:
            0 20px 40px rgba(139, 92, 246, 0.1),
            0 8px 32px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .glass-container { padding: 2rem; border-radius: 28px; }
        }

        .filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .filter-tab {
          padding: 0.6rem 1.4rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 2px solid rgba(139, 92, 246, 0.2);
          background: rgba(255, 255, 255, 0.8);
          color: #6b7280;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: #fff;
          border-color: transparent;
        }

        :global(.gallery-grid) {
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-flow: dense;
          gap: 1rem;
          grid-auto-rows: 250px;
        }

        @media (min-width: 768px) {
          :global(.gallery-grid) { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          :global(.gallery-grid) { grid-template-columns: repeat(3, 1fr); }
        }

        :global(.gallery-item) {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: transform 0.25s ease;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          :global(.gallery-item.featured) {
            grid-column: span 2;
            grid-row: span 2;
          }
        }

        :global(.gallery-item:hover) {
          transform: scale(1.02);
        }

        :global(.gallery-item::after) {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(91, 33, 182, 0.4) 100%);
        }

      `}</style>

      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      <h1 className="page-title">Gallery</h1>

      <div className="max-w-7xl mx-auto">
        <div className="glass-container">
          <div className="filter-tabs">
            {tabCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setLightboxIndex(null);
                }}
                className={`filter-tab ${activeCategory === category.id ? 'active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300/60 p-8 text-center text-gray-500">
              No images in this category yet.
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <motion.button
                  key={`${item.image}-${index}`}
                  custom={index}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  onClick={() => openLightbox(index)}
                  className={`gallery-item ${index % 5 === 0 ? 'featured' : ''}`}
                >
                  <Image
                    src={item.image}
                    alt={item.categoryLabel}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 text-left text-xs font-semibold text-white z-10">
                    {item.categoryLabel}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-[130] inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/60 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-black/75"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
              Close
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 top-1/2 z-[130] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-black/75 sm:left-4"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 top-1/2 z-[130] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-black/75 sm:right-4"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div
              className="relative flex h-full w-full items-center justify-center p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[78vh] w-full max-w-6xl">
                <Image
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].categoryLabel}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
