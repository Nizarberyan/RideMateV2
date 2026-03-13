"use client";

import Link from "next/link";
import { BrandLogo } from "@repo/ui";

export function Footer() {
  return (
    <footer className="w-full bg-black-brand text-white py-12 px-6 md:px-16 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-10">
        <Link href="/">
          <BrandLogo size="sm" className="text-white" />
        </Link>
        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/rides" className="hover:text-white transition-colors">Find Ride</Link>
          <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          © 2026 RideMate. Concept Demo Project.
        </div>
      </div>
    </footer>
  );
}
