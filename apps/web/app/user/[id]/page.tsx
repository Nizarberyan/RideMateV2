"use client";

import { useAuth } from "../../../context/AuthContext";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Leaf, 
  Car, 
  Calendar, 
  MapPin,
  Star,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { User } from "@repo/api-client";
import { client } from "../../../lib/api";
import { Button, Card } from "@repo/ui";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    if (!id) return;
    try {
      // If it's the current user, we could potentially just use currentUser
      // but fetching from users.getOne ensures we have the latest and correct "public" view
      const data = await client.users.getOne(id);
      setUser(data);
    } catch (e: any) {
      console.error("Failed to load user profile:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  if (isDataLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black-brand/20 border-t-lime-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <Globe size={48} className="text-gray-200" />
          <h1 className="text-2xl font-black text-black-brand">User not found</h1>
          <Link href="/dashboard">
            <Button variant="black">Back to Dashboard</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isSelf = currentUser?.id === user.id;
  const joinedDate = new Date(user.createdAt);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 md:px-16 px-6 py-12 max-w-4xl mx-auto w-full flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left Side: Avatar & Basic Stats */}
          <div className="w-full md:w-80 flex flex-col gap-6 sticky top-28">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card padding="xl" className="border-none shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-lime-brand" />
                
                <div className="relative mt-4 mb-6">
                  <div className="w-32 h-32 bg-white rounded-[48px] p-2 shadow-xl relative z-10">
                    <div className="w-full h-full bg-background rounded-[40px] flex items-center justify-center text-5xl font-black text-black-brand overflow-hidden">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.[0] || "U"
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-lime-brand text-black-brand p-2 rounded-2xl shadow-lg z-20 border-4 border-white">
                    <ShieldCheck size={20} fill="currentColor" />
                  </div>
                </div>

                <h1 className="text-2xl font-black text-black-brand mb-1 leading-tight">{user.name}</h1>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MapPin size={12} />
                  {user.city || "Earth"}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-background p-4 rounded-2xl border border-black/5">
                    <Leaf size={20} className="text-green-500 mx-auto mb-2" />
                    <p className="text-xl font-black text-black-brand leading-none">{user.carbonSavedKg || 0}kg</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">CO2 Saved</p>
                  </div>
                  <div className="bg-background p-4 rounded-2xl border border-black/5">
                    <Star size={20} className="text-amber-500 mx-auto mb-2" />
                    <p className="text-xl font-black text-black-brand leading-none">4.9</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Rating</p>
                  </div>
                </div>

                {isSelf && (
                  <Link href="/profile" className="w-full mt-6">
                    <Button variant="outline" className="w-full h-12 rounded-xl text-xs">Edit Profile</Button>
                  </Link>
                )}
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-2 text-gray-400">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Joined {joinedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            </motion.div>
          </div>

          {/* Right Side: Details & History */}
          <div className="flex-1 flex flex-col gap-8">
            {/* About Section */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-black text-black-brand mb-4 uppercase tracking-tight">About</h2>
              <Card padding="lg" className="border-none shadow-sm bg-white/50 min-h-[120px]">
                {user.bio ? (
                  <p className="text-gray-brand font-medium leading-relaxed text-lg">
                    {user.bio}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-300 gap-2">
                    <Globe size={32} />
                    <p className="text-sm font-bold">No bio available yet.</p>
                  </div>
                )}
              </Card>
            </motion.section>

            {/* Vehicle Details */}
            {user.vehicleModel && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-xl font-black text-black-brand mb-4 uppercase tracking-tight">Verified Vehicle</h2>
                <Card padding="lg" className="border-none shadow-sm flex items-center gap-6">
                  <div className="w-16 h-16 bg-lime-brand/10 rounded-[24px] flex items-center justify-center text-lime-brand">
                    <Car size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black-brand leading-none mb-1">
                      {user.vehicleColor} {user.vehicleModel}
                    </h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Confirmed by RideMate Safety Team
                    </p>
                  </div>
                </Card>
              </motion.section>
            )}

            {/* Badges/Achievements (Placeholder for now) */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-black text-black-brand mb-4 uppercase tracking-tight">Impact Badges</h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Early Adopter", icon: Globe, color: "bg-blue-100 text-blue-600" },
                  { name: "Eco Warrior", icon: Leaf, color: "bg-green-100 text-green-600" },
                  { name: "Safe Driver", icon: ShieldCheck, color: "bg-lime-100 text-lime-600" }
                ].map((badge, i) => (
                  <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${badge.color} font-black text-[10px] uppercase tracking-widest shadow-sm`}>
                    <badge.icon size={14} />
                    {badge.name}
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
