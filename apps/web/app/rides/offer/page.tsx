"use client";

import { useAuth } from "../../../context/AuthContext";
import { client } from "../../../lib/api";
import { LogOut, Car, ArrowLeft, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OfferRide() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    departureDatetime: "",
    availableSeats: 3,
    description: "",
    distanceKm: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const hasVehicle = !!(user.vehicleModel && user.vehiclePlate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await client.rides.create({
        ...formData,
        availableSeats: Number(formData.availableSeats),
        distanceKm: Number(formData.distanceKm) || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create ride");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-lime-brand rounded-full flex items-center justify-center">
            <CheckCircle2 size={40} className="text-black-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black-brand mb-2">Ride Offered!</h1>
            <p className="text-gray-brand">Your ride has been successfully listed.</p>
          </div>
          <p className="text-sm text-gray-brand/60 mt-4">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      {/* Simple Header */}
      <nav className="w-full md:px-16 px-6 py-6 flex justify-between items-center border-b border-black/5 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/dashboard" className="text-gray-brand hover:text-black-brand transition-colors flex items-center gap-2 font-bold text-sm">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-sm font-extrabold">RM</div>
          <span className="tracking-tight text-sm">Offer a Ride</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-black-brand tracking-tight mb-3">Create a New Trip</h1>
          <p className="text-gray-brand font-medium">Fill in the details to start saving carbon with others.</p>
        </header>

        {!hasVehicle ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-amber-50 border border-amber-200 p-8 rounded-[32px] flex flex-col items-center text-center gap-4 mb-10"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">Vehicle Info Missing</h3>
              <p className="text-sm text-amber-800/70 max-w-sm">
                To offer a ride, you need to add your vehicle details to your profile first.
              </p>
            </div>
            <Link 
              href="/profile" 
              className="mt-2 px-8 py-3 bg-amber-900 text-white rounded-xl font-bold text-sm hover:bg-amber-800 transition-all"
            >
              Update Profile
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Departure</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. San Francisco"
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                  value={formData.startLocation}
                  onChange={(e) => setFormData({...formData, startLocation: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Destination</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. San Jose"
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                  value={formData.endLocation}
                  onChange={(e) => setFormData({...formData, endLocation: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                  value={formData.departureDatetime}
                  onChange={(e) => setFormData({...formData, departureDatetime: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Available Seats</label>
                <input
                  required
                  type="number"
                  min="1"
                  max="8"
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                  value={formData.availableSeats}
                  onChange={(e) => setFormData({...formData, availableSeats: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Distance (km) - optional</label>
              <input
                type="number"
                placeholder="e.g. 75"
                className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                value={formData.distanceKm || ""}
                onChange={(e) => setFormData({...formData, distanceKm: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Additional Notes</label>
              <textarea
                placeholder="Any specific pickup points or rules?"
                className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-4 w-full py-5 bg-lime-brand text-black-brand rounded-[20px] font-black text-lg shadow-lg shadow-lime-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="h-6 w-6 border-4 border-black/10 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={20} />
                  Post Ride Offer
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
