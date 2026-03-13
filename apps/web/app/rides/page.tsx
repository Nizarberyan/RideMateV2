"use client";

import { useAuth } from "../../context/AuthContext";
import { Search, MapPin, Calendar, Users, ArrowRight, ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "@repo/api-client";
import { client } from "../../lib/api";
import { Button, Card } from "@repo/ui";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { RideCard } from "../../components/rides/RideCard";

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
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 md:px-16 px-6 py-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-black tracking-[0.3em] uppercase text-lime-brand mb-3"
            >
              Marketplace
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-black-brand tracking-tight mb-4"
            >
              Find your next <br />
              <span className="text-highlight">journey.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-brand font-medium text-lg"
            >
              Connect with drivers, split costs, and reduce your carbon footprint.
            </motion.p>
          </div>
          
          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <div className="relative flex-1 w-full group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lime-brand transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by city (e.g. San Francisco)..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[24px] shadow-sm focus:outline-none focus:ring-4 focus:ring-lime-brand/20 transition-all font-bold text-black-brand placeholder:text-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="xl" className="w-full md:w-auto h-[68px] px-8 rounded-[24px] gap-3">
              <SlidersHorizontal size={20} />
              Filters
            </Button>
          </motion.div>
        </div>

        {/* Results Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-brand">
              {isDataLoading ? "Searching..." : `${filteredRides.length} Rides Available`}
            </h2>
            <div className="h-px flex-1 bg-black/5 mx-6" />
          </div>

          <AnimatePresence mode="wait">
            {isDataLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-[32px] p-8 border border-gray-100 h-[320px] animate-pulse">
                    <div className="w-20 h-4 bg-gray-100 rounded-full mb-6" />
                    <div className="w-full h-10 bg-gray-50 rounded-xl mb-4" />
                    <div className="w-2/3 h-10 bg-gray-50 rounded-xl mb-8" />
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                        <div className="w-24 h-4 bg-gray-100 rounded-full" />
                      </div>
                      <div className="w-20 h-10 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : filteredRides.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredRides.map((ride, index) => (
                  <RideCard key={ride.id} ride={ride} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center gap-8 bg-white rounded-[48px] border border-gray-100 border-dashed"
              >
                <div className="w-24 h-24 bg-background rounded-[32px] flex items-center justify-center">
                  <Search size={40} className="text-gray-brand/20" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-black text-black-brand">No adventures found</h3>
                  <p className="text-gray-brand max-w-sm mx-auto font-medium">
                    We couldn't find any rides matching "{searchQuery}". <br />
                    Try searching for a different city or broaden your search.
                  </p>
                </div>
                <Button 
                  variant="black"
                  size="lg"
                  onClick={() => setSearchQuery("")}
                  className="px-10"
                >
                  View all rides
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
