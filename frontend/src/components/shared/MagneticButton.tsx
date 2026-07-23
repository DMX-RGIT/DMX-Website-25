"use client";

import { ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
}

export function MagneticButton({
  children,
  strength = 0.3,
  className,
  variant = "primary",
  ...props
}: MagneticButtonProps) {
  const { ref, style, handlers } = useMagnetic(strength);

  const baseStyles =
    "relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 active:scale-[0.98] overflow-hidden group";

  const variants = {
    primary: "text-bg-primary hover:text-white",
    outline: "text-text-primary border border-border-default bg-transparent",
    ghost: "text-text-secondary hover:text-text-primary bg-transparent",
  };

  return (
    <div ref={ref as any} className="inline-block" {...handlers}>
      <button
        className={cn(baseStyles, variants[variant], className)}
        style={{
          ...style,
          ...(variant === "primary" ? { background: "var(--gradient-teal)" } : {}),
        }}
        {...props}
      >
        {/* Split X Motif Hover Effects */}
        {variant === "primary" && (
          <>
            <span className="absolute inset-y-0 left-0 w-1/2 bg-brand-navy translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            <span className="absolute inset-y-0 right-0 w-1/2 bg-brand-teal translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
          </>
        )}

        {variant !== "primary" && (
          <>
            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-brand-navy origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
            <span className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-brand-teal origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
          </>
        )}

        <span className="relative z-10">{children}</span>
      </button>
    </div>
  );
}
