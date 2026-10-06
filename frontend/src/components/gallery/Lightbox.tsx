"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/types";
import { useEffect, useState } from "react";

interface LightboxProps {
  images?: GalleryImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images = [], initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex, onClose]);

  const handleNext = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (!isOpen || images.length === 0 || currentIndex < 0) return null;

  const image = images[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
        />
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 md:left-8 z-10 p-2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 md:right-8 z-10 p-2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-5xl max-h-[85vh] flex flex-col items-center"
        >
          <img
            src={image.image_url}
            alt={image.caption || "Gallery image"}
            className="w-full h-full object-contain max-h-[80vh] rounded-lg shadow-2xl select-none"
          />
          {image.caption && (
            <div className="mt-4 text-white/90 text-center text-sm max-w-2xl bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
              {image.caption}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
