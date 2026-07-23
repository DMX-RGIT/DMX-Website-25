"use client";

import { useRef, useState, useCallback, type MouseEvent } from "react";

interface MagneticState {
  x: number;
  y: number;
}

export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState<MagneticState>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (e.clientX - centerX) * strength;
      const distY = (e.clientY - centerY) * strength;
      setOffset({ x: distX, y: distY });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    style: {
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      transition: offset.x === 0 && offset.y === 0 ? "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)" : "none",
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
