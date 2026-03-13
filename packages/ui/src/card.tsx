"use client";

import { ReactNode, forwardRef } from "react";
import { cn } from "./utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "brand" | "flat" | "elevated";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", padding = "md", ...props }, ref) => {
    const variants = {
      default: "bg-white border border-gray-100 shadow-sm rounded-[32px]",
      brand: "bg-lime-brand rounded-[32px] shadow-xl shadow-lime-brand/10",
      flat: "bg-background border border-black/5 rounded-[24px]",
      elevated: "bg-white border border-gray-100 shadow-xl rounded-[40px]",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8 md:p-10",
      xl: "p-10 md:p-14",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export { Card };
