"use client";

import { useAuth } from "../../context/AuthContext";
import { LogOut, Car, MapPin, Leaf, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ride, Booking } from "@repo/api-client";
import { client } from "../../lib/api";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const loadData = async () => {
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
      };
      loadData();
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black-brand/20 border-t-lime-brand rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <nav className="w-full z-50 md:px-16 px-6 py-6 flex justify-between items-center border-b border-black/5 bg-background/80 backdrop-blur-sm sticky top-0">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-2 text-black-brand"
        >
          <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-xl font-extrabold flex items-center justify-center">
            RM
          </div>
          <span className="tracking-tight">RideMate</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm font-medium text-gray-brand">
            {user.email}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-brand/30 text-sm font-bold text-black-brand hover:bg-black/5 active:scale-95 transition-all"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:px-16 px-6 py-12 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-lime-brand rounded-[32px] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Decorative circle */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-black/5 pointer-events-none" />
          <div className="absolute -right-4 -bottom-12 w-40 h-40 rounded-full bg-black/5 pointer-events-none" />

          <div className="z-10">
            <p className="text-xs font-bold tracking-wider uppercase mb-2 text-black-brand/60">
              Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black-brand leading-tight tracking-tight mb-3">
              Welcome back,
              <br />
              {firstName}!
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <Leaf size={16} className="text-black-brand/70" />
              <span className="text-sm font-semibold text-black-brand/70">
                {user.carbonSavedKg || 0} kg of CO₂ saved so far
              </span>
            </div>
          </div>

          <div className="z-10 flex gap-3 flex-wrap">
            <Link href="/rides/offer" className="px-6 py-3 bg-black-brand text-white rounded-xl font-bold text-sm shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
              <Plus size={16} />
              Offer a Ride
            </Link>
            <Link href="/rides" className="px-6 py-3 bg-white text-black-brand rounded-xl font-bold text-sm shadow-sm hover:bg-white/80 active:scale-95 transition-all flex items-center gap-2">
              <Search size={16} />
              Find a Ride
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Rides Offered",
              value: myRides.length.toString(),
              icon: Car,
            },
            {
              label: "Bookings Made",
              value: myBookings.length.toString(),
              icon: MapPin,
            },
            {
              label: "CO₂ Saved (kg)",
              value: user.carbonSavedKg || "0",
              icon: Leaf,
            },
            {
              label: "Member Since",
              value: new Date(user.createdAt).getFullYear().toString(),
              icon: null,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col gap-3"
            >
              {stat.icon && (
                <div className="w-9 h-9 bg-background rounded-xl flex items-center justify-center">
                  <stat.icon size={18} className="text-black-brand" />
                </div>
              )}
              {!stat.icon && (
                <div className="w-9 h-9 bg-lime-brand rounded-xl flex items-center justify-center">
                  <span className="text-xs font-black text-black-brand">
                    RM
                  </span>
                </div>
              )}
              <div>
                <div className="text-2xl font-bold text-black-brand">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-brand font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Two-column section: Rides as Driver + Bookings */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rides as Driver */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-black-brand/40 mb-1">
                  Your rides
                </p>
                <h2 className="text-2xl font-bold text-black-brand">
                  As Driver
                </h2>
              </div>
              <div className="w-10 h-10 bg-lime-brand rounded-xl flex items-center justify-center">
                <Car size={18} className="text-black-brand" />
              </div>
            </div>

            {/* Content State */}
            {isDataLoading ? (
              <div className="flex-1 flex items-center justify-center py-10">
                <div className="h-6 w-6 border-2 border-black/10 border-t-lime-brand rounded-full animate-spin" />
              </div>
            ) : myRides.length > 0 ? (
              <div className="flex flex-col gap-4">
                {myRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="p-4 rounded-2xl bg-background border border-gray-50 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-black-brand flex items-center gap-2">
                          {ride.startLocation}{" "}
                          <span className="text-gray-300 font-normal">→</span>{" "}
                          {ride.endLocation}
                        </div>
                        <div className="text-xs text-gray-brand mt-1">
                          {new Date(
                            ride.departureDatetime,
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(ride.departureDatetime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-lime-brand/20 text-lime-brand text-[10px] font-black uppercase rounded-md tracking-tighter">
                        {ride.status}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-black/5 pt-2">
                      <div className="text-xs font-medium text-gray-brand">
                        {ride.availableSeats} seats left
                      </div>
                      <div className="text-xs font-bold text-black-brand">
                        {ride.bookings.length} Bookings
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 py-3 bg-background border border-dashed border-gray-brand/30 rounded-2xl text-xs font-bold text-gray-brand hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} />
                  Offer another Ride
                </button>
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-2">
                  <Car size={28} className="text-gray-brand/50" />
                </div>
                <p className="text-gray-brand text-sm font-medium">
                  No active rides offered yet.
                </p>
                <button className="mt-2 px-6 py-2.5 bg-lime-brand text-black-brand rounded-full font-bold text-sm hover:brightness-95 active:scale-95 transition-all flex items-center gap-2">
                  <Plus size={15} />
                  Offer a New Ride
                </button>
              </div>
            )}
          </motion.div>

          {/* Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-black-brand/40 mb-1">
                  Your rides
                </p>
                <h2 className="text-2xl font-bold text-black-brand">
                  Bookings
                </h2>
              </div>
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-gray-100">
                <MapPin size={18} className="text-black-brand" />
              </div>
            </div>

            {/* Content State */}
            {isDataLoading ? (
              <div className="flex-1 flex items-center justify-center py-10">
                <div className="h-6 w-6 border-2 border-black/10 border-t-lime-brand rounded-full animate-spin" />
              </div>
            ) : myBookings.length > 0 ? (
              <div className="flex flex-col gap-4">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-2xl bg-background border border-gray-50 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-black-brand flex items-center gap-2">
                          {booking.ride.startLocation}{" "}
                          <span className="text-gray-300 font-normal">→</span>{" "}
                          {booking.ride.endLocation}
                        </div>
                        <div className="text-xs text-gray-brand mt-1">
                          {new Date(
                            booking.ride.departureDatetime,
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            booking.ride.departureDatetime,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-black-brand text-white text-[10px] font-black uppercase rounded-md tracking-tighter">
                        {booking.status}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-black/5 pt-2">
                      <div className="text-xs font-medium text-gray-brand">
                        Passenger: You ({booking.seatsBooked} seat)
                      </div>
                      <div className="text-xs font-bold text-black-brand">
                        #{booking.id.toString().padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/rides" className="w-full mt-2 py-3 bg-background border border-dashed border-gray-brand/30 rounded-2xl text-xs font-bold text-gray-brand hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                  <Search size={14} />
                  Find more Rides
                </Link>
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-2">
                  <MapPin size={28} className="text-gray-brand/50" />
                </div>
                <p className="text-gray-brand text-sm font-medium">
                  No bookings yet.
                </p>
                <Link href="/rides" className="mt-2 px-6 py-2.5 bg-black-brand text-white rounded-full font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                  <Search size={15} />
                  Find a Ride
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black-brand text-white py-10 px-6 md:px-16 mt-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center border-t border-white/10 pt-10">
          <div className="text-xl font-bold flex items-center gap-2">
            <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md font-extrabold text-sm">
              RM
            </div>
            <span className="tracking-tight">RideMate</span>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            © 2025 RideMate. Concept Demo Project.
          </div>
        </div>
      </footer>
    </div>
  );
}
