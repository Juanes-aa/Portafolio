import React, { useState } from "react";

export interface FloatingStat {
  value: string;
  label: string;
}

export interface FloatingStatsProps {
  items: FloatingStat[];
  className?: string;
}

const FloatingStats: React.FC<FloatingStatsProps> = ({
  items,
  className = ""
}) => {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  return (
    <div
      className={`
        relative w-full max-w-4xl mx-auto
        grid grid-cols-1 sm:grid-cols-3 gap-4
        px-6 py-6
        rounded-2xl
        bg-white/5
        border border-white/10
        shadow-2xl
        ${!mobile ? 'backdrop-blur-xl' : ''}
        ${className}
      `}
    >
      {items.map((stat, i) => (
        <div
          key={i}
          className={`text-center ${!mobile ? 'transition-transform duration-300 hover:scale-105' : ''}`}
        >
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#E63946] to-[#FF6B6B] bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className={`text-xs text-white/40 mt-1 ${!mobile ? 'group-hover:text-white/60 transition-colors' : ''}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingStats;