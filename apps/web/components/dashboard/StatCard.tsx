"use client";

import { Card } from "@repo/ui";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col gap-4 group hover:shadow-md transition-all cursor-default"
    >
      <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center group-hover:bg-lime-brand/10 transition-colors">
        <Icon size={22} className="text-black-brand" />
      </div>
      <div>
        <div className="text-3xl font-black text-black-brand tracking-tight">
          {value}
        </div>
        <div className="text-xs text-gray-brand font-black uppercase tracking-widest mt-1">
          {label}
        </div>
      </div>
    </Card>
  );
}
