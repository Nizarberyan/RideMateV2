"use client";

import { Card, Button } from "@repo/ui";
import { Calendar, Users, ChevronRight, MapPin } from "lucide-react";
import { Ride } from "@repo/api-client";
import { motion } from "framer-motion";
import Link from "next/link";

export interface RideCardProps {
  ride: Ride;
  index: number;
}

export function RideCard({ ride, index }: RideCardProps) {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col hover:shadow-xl transition-all h-full"
      padding="lg"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-brand bg-lime-brand/10 px-2 py-1 rounded-md self-start mb-2">
            {ride.status}
          </div>
          <div className="text-2xl font-black text-black-brand leading-tight">
            {ride.startLocation}
          </div>
          <div className="flex items-center gap-2 my-1">
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="w-1 h-1 rounded-full bg-gray-200" />
          </div>
          <div className="text-2xl font-black text-black-brand leading-tight">
            {ride.endLocation}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-black-brand tracking-tighter">$25</div>
          <div className="text-[10px] font-black text-gray-brand uppercase tracking-widest">per seat</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="flex items-center gap-2 text-gray-brand bg-background p-3 rounded-2xl border border-black/5">
          <Calendar size={14} className="text-black-brand" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            {new Date(ride.departureDatetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-brand bg-background p-3 rounded-2xl border border-black/5">
          <Users size={14} className="text-black-brand" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            {ride.availableSeats} left
          </span>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lime-brand rounded-xl flex items-center justify-center font-black text-black-brand text-sm shadow-sm">
            {ride.driver?.name?.[0] || "U"}
          </div>
          <div>
            <div className="text-xs font-black text-black-brand">{ride.driver?.name || "Driver"}</div>
            <div className="text-[10px] font-bold text-gray-brand uppercase tracking-widest">Verified</div>
          </div>
        </div>
        
        <Link href={`/rides/${ride.id}`}>
          <Button variant="black" size="sm" className="group-hover:bg-lime-brand group-hover:text-black-brand">
            Details
            <ChevronRight size={14} />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
