"use client";

import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api";
import { ArrowLeft, Save, User as UserIcon, Car, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    vehicleModel: "",
    vehicleColor: "",
    vehiclePlate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        vehicleModel: user.vehicleModel || "",
        vehicleColor: user.vehicleColor || "",
        vehiclePlate: user.vehiclePlate || "",
      });
    }
  }, [user]);

  if (isLoading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const updatedUser = await client.auth.updateProfile(formData);
      // We need to update the local context
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (token && refreshToken) {
        login({
          access_token: token,
          refresh_token: refreshToken,
          user: updatedUser
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      <nav className="w-full md:px-16 px-6 py-6 flex justify-between items-center border-b border-black/5 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/dashboard" className="text-gray-brand hover:text-black-brand transition-colors flex items-center gap-2 font-bold text-sm">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-sm font-extrabold">RM</div>
          <span className="tracking-tight text-sm">My Profile</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-12">
        <header className="mb-10 flex items-center gap-6">
          <div className="w-24 h-24 bg-lime-brand rounded-[32px] flex items-center justify-center shadow-lg shadow-lime-brand/20">
            <UserIcon size={40} className="text-black-brand" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black-brand tracking-tight">{user.name || "User"}</h1>
            <p className="text-gray-brand font-medium">{user.email}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* General Info */}
          <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-black-brand mb-6 flex items-center gap-2">
              <UserIcon size={20} />
              General Information
            </h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Bio</label>
                <textarea
                  placeholder="Tell others about yourself..."
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium min-h-[100px]"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Vehicle Info */}
          <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-black-brand mb-6 flex items-center gap-2">
              <Car size={20} />
              Vehicle Details
            </h2>
            <p className="text-sm text-gray-brand mb-6">Required if you want to offer rides as a driver.</p>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Vehicle Model</label>
                <input
                  type="text"
                  placeholder="e.g. Tesla Model 3"
                  className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Silver"
                    className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                    value={formData.vehicleColor}
                    onChange={(e) => setFormData({...formData, vehicleColor: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-brand ml-1">License Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC-1234"
                    className="w-full px-5 py-4 bg-background border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-brand/30 transition-all font-medium"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 py-5 bg-black-brand text-white rounded-[20px] font-black text-lg shadow-lg hover:brightness-125 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="h-6 w-6 border-4 border-white/10 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-lime-600 font-bold"
              >
                <CheckCircle2 size={24} />
                <span>Updated!</span>
              </motion.div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
