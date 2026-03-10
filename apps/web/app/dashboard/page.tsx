    "use client";

import { useAuth } from "../../context/AuthContext";
import { Leaf, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-white/20 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel md:px-8 px-4 py-4 flex justify-between items-center transition-all">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="text-green-400" />
          <span>RideMate</span>
        </Link>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors font-medium text-sm text-red-200 hover:text-red-100"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </nav>

      {/* Dashboard Content */}
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name || user.email.split('@')[0]}!</h1>
          <p className="text-green-300 font-medium tracking-wide">
            🌱 You have saved {user.carbonSavedKg || 0}kg of carbon so far.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-4">Your Rides as Driver</h2>
            <div className="text-slate-400 text-sm">No active rides offered yet.</div>
            <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all">
              Offer a New Ride
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
            <div className="text-slate-400 text-sm">No bookings yet.</div>
            <button className="mt-6 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all">
              Find a Ride
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
