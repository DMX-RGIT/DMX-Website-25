"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GalleryImage } from "@/types";
import { useEffect } from "react";

interface LightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (image) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [image, onClose]);

  if (!image) return null;

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

        <motion.div
          layoutId={`gallery-img-${image.id}`}
          className="relative z-10 w-full max-w-5xl max-h-[85vh] flex flex-col items-center"
        >
          <img
            src={image.image_url}
            alt={image.caption || "Gallery image"}
            className="w-full h-full object-contain max-h-[80vh] rounded-lg shadow-2xl"
          />
          {image.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-white/90 text-center text-sm max-w-2xl bg-black/40 px-4 py-2 rounded-full backdrop-blur-md"
            >
              {image.caption}
            </motion.p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
