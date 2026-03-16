"use client";

import { useAuth } from "../../../context/AuthContext";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  ShieldCheck, 
  Leaf,
  ChevronRight,
  Info,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Ride } from "@repo/api-client";
import { client } from "../../../lib/api";
import { Button, Card } from "@repo/ui";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";

export default function RideDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const loadRideDetails = useCallback(async () => {
    if (!id) return;
    try {
      const data = await client.rides.getOne(id);
      setRide(data);
    } catch (e: any) {
      console.error("Failed to load ride details:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRideDetails();
  }, [loadRideDetails]);

  const handleBookRide = async () => {
    if (!ride || !user) {
      if (!user) router.push("/login");
      return;
    }
    
    if (ride.driverId === user?.id) {
      alert("You cannot book your own ride.");
      return;
    }

    if (!confirm(`Do you want to book 1 seat for the ride from ${ride.startLocation} to ${ride.endLocation}?`)) {
      return;
    }

    setIsBooking(true);
    setBookingError("");
    try {
      await client.bookings.create({
        rideId: ride.id,
        seatsBooked: 1,
      });
      setBookingSuccess(true);
      loadRideDetails(); // Refresh to show new passenger
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (e: any) {
      setBookingError(e.message || "Failed to book ride");
    } finally {
      setIsBooking(false);
    }
  };

  if (isDataLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black-brand/20 border-t-lime-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <AlertCircle size={48} className="text-red-500" />
          <h1 className="text-2xl font-black text-black-brand">Ride not found</h1>
          <Link href="/rides">
            <Button variant="black">Back to Search</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = ride.driverId === user?.id;
  const departureDate = new Date(ride.departureDatetime);
  const alreadyBooked = ride.bookings?.some(b => b.userId === user?.id);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 md:px-16 px-6 py-12 max-w-5xl mx-auto w-full flex flex-col gap-10">
        {/* Top Navigation */}
        <Link href="/rides" className="text-gray-brand hover:text-black-brand transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info Area */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Route Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card padding="xl" className="border-none shadow-sm overflow-hidden relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-lime-brand/5 rounded-bl-full pointer-events-none" />
                
                <div className="flex flex-col gap-10 relative z-10">
                  <div className="flex items-start gap-8">
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <div className="w-4 h-4 rounded-full bg-lime-brand border-4 border-white shadow-sm" />
                      <div className="w-0.5 h-16 bg-gray-100 rounded-full" />
                      <div className="w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-8 flex-1">
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Pickup Location</p>
                        <h2 className="text-3xl font-black text-black-brand tracking-tight">{ride.startLocation}</h2>
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Dropoff Location</p>
                        <h2 className="text-3xl font-black text-black-brand tracking-tight">{ride.endLocation}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-black/5 w-full" />

                  <div className="flex flex-wrap gap-8 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-lime-brand border border-black/5 shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure Date</p>
                        <p className="font-black text-black-brand">{departureDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-lime-brand border border-black/5 shadow-sm">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup Time</p>
                        <p className="font-black text-black-brand">{departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Ride Description */}
            {ride.description && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-xl font-black text-black-brand mb-4 flex items-center gap-3">
                  <Info size={20} />
                  Driver's Note
                </h3>
                <Card padding="lg" className="border-none shadow-sm bg-white/50">
                  <p className="text-gray-brand font-medium leading-relaxed italic text-lg">
                    "{ride.description}"
                  </p>
                </Card>
              </motion.section>
            )}

            {/* Passengers Section */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-black-brand flex items-center gap-3">
                  <Users size={20} />
                  Passengers
                </h3>
                <span className="text-xs font-black bg-black-brand text-white px-3 py-1 rounded-full uppercase tracking-widest">
                  {ride.bookings?.length || 0} Booked
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ride.bookings && ride.bookings.length > 0 ? (
                  ride.bookings.map((booking, index) => (
                    <motion.div 
                      key={booking.id} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <Link href={`/user/${booking.userId}`}>
                        <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-lime-brand/50 hover:shadow-md transition-all group">
                          <div className="w-12 h-12 bg-lime-brand rounded-xl flex items-center justify-center font-black text-black-brand shadow-sm">
                            {booking.user?.name?.[0] || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-black-brand truncate group-hover:text-lime-brand transition-colors">
                              {booking.user?.id === user?.id ? "You" : booking.user?.name}
                            </p>
                            <p className="text-[10px] font-bold text-gray-brand uppercase tracking-widest">Verified Passenger</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-lime-brand" />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-10 px-6 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center gap-3">
                    <Users size={32} className="text-gray-200" />
                    <p className="text-gray-brand font-medium text-sm">Be the first to join this ride!</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar / Actions Area */}
          <div className="flex flex-col gap-6">
            {/* Booking Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card padding="lg" className="sticky top-28 border-none shadow-lg">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                      <p className="text-4xl font-black text-black-brand tracking-tighter">$25.00</p>
                    </div>
                    <div className="bg-lime-brand/10 text-lime-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {ride.availableSeats} Available
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {isOwner ? (
                      <Button variant="outline" size="xl" className="w-full font-black border-2 h-16 rounded-2xl" disabled>
                        Manage My Ride
                      </Button>
                    ) : alreadyBooked ? (
                      <div className="flex flex-col gap-4">
                        <div className="p-4 bg-lime-brand/10 border border-lime-brand/20 rounded-2xl flex items-center gap-3 text-lime-brand font-black text-sm">
                          <CheckCircle2 size={20} />
                          You're Booked!
                        </div>
                        <Button variant="black" size="xl" className="w-full h-16 rounded-2xl" onClick={() => router.push("/dashboard")}>
                          Go to Dashboard
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="black" 
                        size="xl" 
                        className="w-full h-16 rounded-2xl font-black text-lg active:scale-95 transition-all"
                        disabled={ride.availableSeats === 0 || isBooking}
                        onClick={handleBookRide}
                      >
                        {isBooking ? (
                          <div className="h-6 w-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : ride.availableSeats === 0 ? "Fully Booked" : "Book Now"}
                      </Button>
                    )}
                    
                    {bookingError && (
                      <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                        <AlertCircle size={14} />
                        {bookingError}
                      </div>
                    )}
                    
                    {bookingSuccess && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-lime-brand text-black-brand text-xs font-black uppercase tracking-widest rounded-xl text-center">
                        Successfully Booked!
                      </motion.div>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-brand font-medium text-center leading-relaxed">
                    By booking, you agree to our split-cost guidelines and community code of conduct.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Driver Profile Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card padding="lg" className="border-none shadow-sm group">
                <Link href={`/user/${ride.driverId}`}>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-lime-brand rounded-2xl flex items-center justify-center font-black text-black-brand text-2xl shadow-sm relative">
                        {ride.driver?.name?.[0] || "U"}
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-black/5 shadow-sm">
                          <ShieldCheck size={14} className="text-lime-brand" fill="currentColor" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-black-brand group-hover:text-lime-brand transition-colors">
                          {ride.driver?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Leaf size={12} className="text-green-500" />
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{ride.driver?.carbonSavedKg || 0}kg Saved</span>
                        </div>
                      </div>
                    </div>

                    {ride.driver?.bio && (
                      <p className="text-xs text-gray-brand font-medium line-clamp-3 leading-relaxed">
                        "{ride.driver.bio}"
                      </p>
                    )}

                    <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center text-gray-400">
                          <Car size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</p>
                          <p className="text-xs font-bold text-black-brand">{ride.driver?.vehicleColor} {ride.driver?.vehicleModel}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
