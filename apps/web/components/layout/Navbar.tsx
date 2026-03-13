"use client";

import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { BrandLogo, Button } from "@repo/ui";

export function Navbar() {
  const { user, logout } = useAuth();
  
  const firstName = user?.name?.split(" ")[0] || user?.email.split("@")[0] || "User";

  return (
    <nav className="w-full z-50 md:px-16 px-6 py-6 flex justify-between items-center border-b border-black/5 bg-background/80 backdrop-blur-sm sticky top-0">
      <Link href="/">
        <BrandLogo />
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-brand/10 hover:border-gray-brand/30 transition-all font-bold text-sm text-black-brand bg-white/50">
              <div className="w-6 h-6 bg-lime-brand rounded-full flex items-center justify-center text-[10px] font-black">
                {firstName[0]}
              </div>
              <span className="hidden sm:inline">My Profile</span>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-5 py-2.5 rounded-full border border-gray-brand/30 text-black-brand font-bold text-sm hover:bg-black/5 active:scale-95 transition-all">
              Log in
            </Link>
            <Link href="/register" className="px-5 py-2.5 rounded-full bg-lime-brand text-black-brand font-bold text-sm shadow-sm hover:brightness-95 active:scale-95 transition-all">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
