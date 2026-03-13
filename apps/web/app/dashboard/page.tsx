"use client";

import { useAuth } from "../../context/AuthContext";
import { Car, MapPin, Leaf, Plus, Search, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Ride, Booking } from "@repo/api-client";
import { client } from "../../lib/api";
import { Button, Card } from "@repo/ui";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { StatCard } from "../../components/dashboard/StatCard";
import { RideActivityCard } from "../../components/dashboard/RideActivityCard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"driver" | "passenger">("driver");

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [rides, bookings] = await Promise.all([
        client.rides.getMine(),
        client.bookings.getMine(),
      ]);
      setMyRides(rides);
      setMyBookings(bookings);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, isLoading, router, loadData]);

  const handleCancelRide = async (rideId: string) => {
    if (!confirm("Are you sure you want to cancel this ride? This will notify all passengers.")) return;
    try {
      await client.rides.delete(rideId);
      loadData();
    } catch (e) {
      alert("Failed to cancel ride");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel your seat?")) return;
    try {
      await client.bookings.cancel(bookingId);
      loadData();
    } catch (e) {
      alert("Failed to cancel booking");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black-brand/20 border-t-lime-brand rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      <Navbar />

      <main className="md:px-16 px-6 py-12 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Welcome Banner */}
        <Card
          variant="brand"
          padding="xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Decorative circle */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-black/5 pointer-events-none" />
          <div className="absolute -right-4 -bottom-12 w-40 h-40 rounded-full bg-black/5 pointer-events-none" />

          <div className="z-10">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-black-brand/60">
              Personal Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-black-brand leading-[1.1] tracking-tight mb-3">
              Good morning,
              <br />
              {firstName}!
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <Leaf size={16} className="text-black-brand/70" />
              <span className="text-sm font-bold text-black-brand/70">
                You've prevented {user.carbonSavedKg || 0} kg of CO₂ emissions
              </span>
            </div>
          </div>

          <div className="z-10 flex gap-3 flex-wrap">
            <Link href="/rides/offer">
              <Button variant="black" size="xl" className="gap-2">
                <Plus size={18} />
                Offer a Ride
              </Button>
            </Link>
            <Link href="/rides">
              <Button variant="secondary" size="xl" className="gap-2">
                <Search size={18} />
                Find a Ride
              </Button>
            </Link>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Rides Hosted" value={myRides.length.toString()} icon={Car} delay={0.1} />
          <StatCard label="Trips Taken" value={myBookings.length.toString()} icon={MapPin} delay={0.15} />
          <StatCard label="CO₂ Impact (kg)" value={(user.carbonSavedKg || 0).toString()} icon={Leaf} delay={0.2} />
          <StatCard label="Years with us" value={(new Date().getFullYear() - new Date(user.createdAt).getFullYear() + 1).toString()} icon={UserIcon} delay={0.25} />
        </div>

        {/* Activity Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <h2 className="text-2xl font-black text-black-brand tracking-tight">Recent Activity</h2>
            <div className="flex p-1 bg-white border border-gray-100 rounded-2xl">
              <button 
                onClick={() => setActiveTab("driver")}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "driver" ? "bg-black-brand text-white shadow-md" : "text-gray-brand hover:bg-black/5"}`}
              >
                As Driver
              </button>
              <button 
                onClick={() => setActiveTab("passenger")}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "passenger" ? "bg-black-brand text-white shadow-md" : "text-gray-brand hover:bg-black/5"}`}
              >
                As Passenger
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "driver" ? (
              <motion.div
                key="driver"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {isDataLoading ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                    <div className="h-8 w-8 border-4 border-black/5 border-t-lime-brand rounded-full animate-spin" />
                    <p className="text-gray-brand font-bold text-sm">Syncing your rides...</p>
                  </div>
                ) : myRides.length > 0 ? (
                  myRides.map((ride) => (
                    <RideActivityCard 
                      key={ride.id} 
                      type="driver" 
                      ride={ride} 
                      onCancel={handleCancelRide} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-6 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-background rounded-[32px] flex items-center justify-center">
                      <Car size={32} className="text-gray-brand/30" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-black-brand mb-1">Ready to lead?</h3>
                      <p className="text-gray-brand max-w-xs font-medium text-sm leading-relaxed">
                        You haven't offered any rides yet. Share your journey and help someone out.
                      </p>
                    </div>
                    <Link href="/rides/offer">
                      <Button size="lg" className="px-8">Offer a Ride</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="passenger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {isDataLoading ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                    <div className="h-8 w-8 border-4 border-black/5 border-t-lime-brand rounded-full animate-spin" />
                    <p className="text-gray-brand font-bold text-sm">Loading your bookings...</p>
                  </div>
                ) : myBookings.length > 0 ? (
                  myBookings.map((booking) => (
                    <RideActivityCard 
                      key={booking.id} 
                      type="passenger" 
                      booking={booking} 
                      onCancel={handleCancelBooking} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-6 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-background rounded-[32px] flex items-center justify-center">
                      <MapPin size={32} className="text-gray-brand/30" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-black-brand mb-1">Where to next?</h3>
                      <p className="text-gray-brand max-w-xs font-medium text-sm leading-relaxed">
                        You haven't booked any rides. Find a seat and start saving today.
                      </p>
                    </div>
                    <Link href="/rides">
                      <Button variant="black" size="lg" className="px-8">Find a Ride</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
