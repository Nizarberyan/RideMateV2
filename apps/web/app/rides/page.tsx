"use client";

import { useAuth } from "../context/AuthContext";
import { Search, MapPin, Calendar, Users, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "@repo/api-client";
import { client } from "../lib/api";

export default function FindRides() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const allRides = await client.rides.getAll();
        setRides(allRides);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredRides = useMemo(() => {
    if (!searchQuery.trim()) return rides;
    const query = searchQuery.toLowerCase();
    return rides.filter(
      (ride) =>
        ride.startLocation.toLowerCase().includes(query) ||
        ride.endLocation.toLowerCase().includes(query)
    );
  }, [rides, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black-brand/20 border-t-lime-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <nav className="w-full z-50 md:px-16 px-6 py-6 flex justify-between items-center border-b border-black/5 bg-background/80 backdrop-blur-sm sticky top-0">
        <Link
          href="/dashboard"
          className="text-2xl font-bold flex items-center gap-2 text-black-brand"
        >
          <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-xl font-extrabold flex items-center justify-center">
            RM
          </div>
          <span className="tracking-tight text-xl">RideMate</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-bold text-black-brand hover:text-lime-brand transition-colors">
            Dashboard
          </Link>
          <Link href="/rides/offer" className="px-5 py-2.5 bg-black-brand text-white rounded-xl font-bold text-sm shadow-sm hover:brightness-110 active:scale-95 transition-all">
            Offer a Ride
          </Link>
        </div>
      </nav>

      <main className="md:px-16 px-6 py-12 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-black-brand tracking-tight mb-2">Find a Ride</h1>
            <p className="text-gray-brand font-medium">Browse available carpools and book your seat.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by city..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-brand/50 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-black-brand/20 border-t-lime-brand rounded-full animate-spin" />
            <p className="text-gray-brand font-bold text-sm animate-pulse">Loading amazing rides...</p>
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-lime-brand bg-lime-brand/10 px-2 py-1 rounded-md self-start mb-2">
                      Active Ride
                    </div>
                    <div className="text-2xl font-black text-black-brand flex items-center gap-2">
                      {ride.startLocation}
                    </div>
                    <div className="h-6 w-px bg-gray-100 ml-4 my-1" />
                    <div className="text-2xl font-black text-black-brand">
                      {ride.endLocation}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-black-brand">$25</div>
                    <div className="text-[10px] font-bold text-gray-brand uppercase">per seat</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-brand bg-background p-3 rounded-2xl">
                    <Calendar size={16} />
                    <span className="text-xs font-bold">
                      {new Date(ride.departureDatetime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-brand bg-background p-3 rounded-2xl">
                    <Users size={16} />
                    <span className="text-xs font-bold">
                      {ride.availableSeats} seats left
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lime-brand rounded-xl flex items-center justify-center font-black text-black-brand text-sm shadow-sm">
                      {ride.driver?.name?.[0] || "U"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-black-brand">{ride.driver?.name || "Driver"}</div>
                      <div className="text-[10px] font-medium text-gray-brand">Verified Driver</div>
                    </div>
                  </div>
                  
                  <button className="h-12 px-6 bg-black-brand text-white rounded-xl font-bold text-sm flex items-center gap-2 group-hover:bg-lime-brand group-hover:text-black-brand transition-all">
                    Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-white rounded-[40px] border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-background rounded-[24px] flex items-center justify-center">
              <Search size={32} className="text-gray-brand/30" />
            </div>
            <div>
              <h3 className="text-xl font-black text-black-brand mb-2">No rides found</h3>
              <p className="text-gray-brand max-w-xs mx-auto font-medium">
                We couldn't find any rides matching "{searchQuery}". Try a different location.
              </p>
            </div>
            <button 
              onClick={() => setSearchQuery("")}
              className="px-8 py-3 bg-black-brand text-white rounded-2xl font-bold text-sm active:scale-95 transition-all"
            >
              View all rides
            </button>
          </div>
        )}
      </main>

      <footer className="w-full bg-black-brand text-white py-12 px-6 md:px-16 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-10">
          <div className="text-xl font-bold flex items-center gap-2">
            <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md font-extrabold text-sm">
              RM
            </div>
            <span className="tracking-tight">RideMate</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/rides/offer" className="hover:text-white transition-colors">Offer a Ride</Link>
            <Link href="/profile" className="hover:text-white transition-colors">My Profile</Link>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            © 2026 RideMate. Built for a better commute.
          </div>
        </div>
      </footer>
    </div>
  );
}
