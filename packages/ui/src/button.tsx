"use client";

import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "./utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart" | "style"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "black";
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-lime-brand text-black-brand shadow-sm hover:brightness-95",
      secondary: "bg-white text-black-brand shadow-sm hover:bg-white/80",
      outline: "border border-gray-brand/30 text-black-brand hover:bg-black/5",
      ghost: "text-black-brand hover:bg-black/5",
      black: "bg-black-brand text-white shadow-lg hover:brightness-125",
    };

    const sizes = {
      sm: "px-4 py-2 rounded-full text-xs",
      md: "px-5 py-2.5 rounded-full text-sm",
      lg: "px-6 py-3 rounded-xl text-sm",
      xl: "px-8 py-4 rounded-[20px] text-lg font-black",
    };

    return (
      <motion.button
        whileActive={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
