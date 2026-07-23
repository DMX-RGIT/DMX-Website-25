"use client";

import { useRef, useState, useCallback, type MouseEvent } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export function useTilt(maxTilt: number = 8) {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -maxTilt * 2;
      const rotateY = (x - 0.5) * maxTilt * 2;
      setTilt({ rotateX, rotateY, scale: 1.02 });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return {
    ref,
    style: {
      transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
      transition: tilt.scale === 1 ? "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)" : "transform 0.1s ease-out",
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
