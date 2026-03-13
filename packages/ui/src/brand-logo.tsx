"use client";

import { cn } from "./utils";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  hideText?: boolean;
}

export const BrandLogo = ({ className, size = "md", hideText = false }: BrandLogoProps) => {
  const sizes = {
    sm: {
      box: "px-2 py-0.5 rounded-md text-sm",
      text: "text-lg",
      gap: "gap-2"
    },
    md: {
      box: "px-2 py-0.5 rounded-md text-xl",
      text: "text-2xl",
      gap: "gap-2"
    },
    lg: {
      box: "px-3 py-1 rounded-lg text-2xl",
      text: "text-4xl",
      gap: "gap-3"
    }
  };

  return (
    <div className={cn("font-bold flex items-center text-black-brand", sizes[size].gap, className)}>
      <div className={cn("bg-lime-brand text-black-brand font-extrabold flex items-center justify-center shadow-sm shadow-lime-brand/20", sizes[size].box)}>
        RM
      </div>
      {!hideText && <span className={cn("tracking-tight", sizes[size].text)}>RideMate</span>}
    </div>
  );
};
