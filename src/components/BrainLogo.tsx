"use client";

import { Brain, Sparkle, Sparkles } from "lucide-react";

const SIZES = {
  md: { core: "h-12 w-12", icon: 22, ring: 72 },
  lg: { core: "h-16 w-16", icon: 30, ring: 96 },
};

export default function BrainLogo({ size = "md" }: { size?: "md" | "lg" }) {
  const s = SIZES[size];
  const sparkles = [
    { Icon: Sparkle, fill: "#8b5cf6", style: { left: "50%", top: "12%", transform: "translateX(-50%)" } },
    { Icon: Sparkle, fill: "#ec4899", style: { left: "88%", top: "45%", transform: "translateY(-50%)", animationDelay: "0.6s" } },
    { Icon: Sparkles, fill: "#8b5cf6", style: { left: "50%", bottom: "8%", transform: "translateX(-50%)", animationDelay: "1.1s" } },
  ];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: s.ring, height: s.ring }}
      aria-hidden
    >
      <span className="brain-ring" style={{ width: s.ring, height: s.ring }} />
      <span className="brain-ring" style={{ width: s.ring, height: s.ring, animationDelay: "0.8s" }} />
      <span className="spin-slow absolute" style={{ inset: "-10%", animationDuration: "11s" }}>
        {sparkles.map(({ Icon, fill, style }, i) => (
          <Icon key={i} size={13} fill={fill} className="absolute text-transparent twinkle" style={style} />
        ))}
      </span>
      <div
        className={`brain-core relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#fbe5f0] to-[#ece0fa] shadow-[0_18px_40px_-18px_rgba(236,72,153,0.65)] ${s.core}`}
      >
        <Brain size={s.icon} strokeWidth={1.4} className="text-[#a5146b]" />
      </div>
    </div>
  );
}