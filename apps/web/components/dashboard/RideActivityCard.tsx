"use client";

import { Card, cn } from "@repo/ui";
import { ChevronRight, Trash2, XCircle, UserCheck } from "lucide-react";
import { Ride, Booking } from "@repo/api-client";
import Link from "next/link";

export interface RideActivityCardProps {
  type: "driver" | "passenger";
  ride?: Ride;
  booking?: Booking;
  onCancel: (id: string) => void;
}

export function RideActivityCard({ type, ride, booking, onCancel }: RideActivityCardProps) {
  const data = type === "driver" ? ride : booking?.ride;
  if (!data) return null;

  const id = type === "driver" ? ride!.id : booking!.id;
  const status = type === "driver" ? ride!.status : booking!.status;

  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all" padding="lg">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-brand/5 rounded-bl-[100px] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
              type === "driver" ? "text-lime-brand bg-lime-brand/10" : "text-white bg-black-brand"
            )}>
              {status} Trip
            </span>
            <span className="text-[10px] font-black text-gray-brand uppercase tracking-widest">
              #{id.slice(-6)}
            </span>
          </div>
          <div className="text-2xl font-black text-black-brand flex items-center gap-3">
            {data.startLocation} 
            <ChevronRight size={18} className="text-gray-300" />
            {data.endLocation}
          </div>
          <div className="text-sm font-bold text-gray-brand mt-1">
            {new Date(data.departureDatetime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(data.departureDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {status !== 'CANCELLED' && (
          <button 
            onClick={() => onCancel(id)}
            className="p-3 text-gray-brand hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            title={type === "driver" ? "Cancel Ride" : "Cancel Booking"}
          >
            {type === "driver" ? <Trash2 size={20} /> : <XCircle size={20} />}
          </button>
        )}
      </div>

      {type === "driver" ? (
        <div className="flex flex-col gap-4">
          <div className="text-xs font-black uppercase tracking-widest text-gray-brand">
            Passengers ({ride!.bookings.length}/{ride!.availableSeats + ride!.bookings.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {ride!.bookings.length > 0 ? (
              ride!.bookings.map((b) => (
                <div key={b.id} className="flex items-center gap-2 bg-background pl-1 pr-3 py-1 rounded-full border border-black/5">
                  <div className="w-6 h-6 bg-lime-brand rounded-full flex items-center justify-center text-[10px] font-black">
                    {b.user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-[10px] font-bold text-black-brand">{b.user?.name}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-brand/50 font-medium italic py-2">No bookings yet</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-background rounded-3xl border border-black/5">
          <div className="w-12 h-12 bg-lime-brand rounded-2xl flex items-center justify-center font-black text-black-brand">
            {data.driver?.name?.[0] || 'D'}
          </div>
          <div>
            <div className="text-[10px] font-black text-gray-brand uppercase tracking-widest mb-0.5">Your Driver</div>
            <div className="text-sm font-black text-black-brand">{data.driver?.name || 'RideMate Driver'}</div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <div className="text-[10px] font-black text-gray-brand uppercase tracking-widest mb-0.5">Seats</div>
            <div className="text-sm font-black text-black-brand">{booking!.seatsBooked}</div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
        {type === "driver" ? (
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-lime-brand" />
            <span className="text-xs font-bold text-black-brand">{ride!.bookings.length} Seats Booked</span>
          </div>
        ) : (
          <Link href={`/rides/${data.id}`} className="w-full py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black-brand hover:bg-black/5 transition-all flex items-center justify-center gap-2">
            View Trip Details
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </Card>
  );
}
