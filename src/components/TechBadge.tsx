import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface TechBadgeProps {
  name: string;
  className?: string;
}

/**
 * Badge de tecnología con efecto tilt 3D y glassmorphism
 * Inspirado en el efecto de TiltCard pero optimizado para badges pequeños
 */
const TechBadge: React.FC<TechBadgeProps> = ({ 
  name, 
  className = ''
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const badge = badgeRef.current;
    const glare = glareRef.current;
    if (!badge) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = badge.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Tilt más suave para badges pequeños
      const rotateX = (mouseY / (rect.height / 2)) * -6;
      const rotateY = (mouseX / (rect.width / 2)) * 6;

      gsap.to(badge, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      });

      if (glare) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        
        gsap.to(glare, {
          opacity: 0.35,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 70%)`,
          duration: 0.3
        });
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(badge, {
        scale: 1.05,
        y: -3,
        duration: 0.3,
        ease: 'back.out(1.4)'
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(badge, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      if (glare) {
        gsap.to(glare, { opacity: 0, duration: 0.3 });
      }
    };

    badge.addEventListener('mousemove', handleMouseMove);
    badge.addEventListener('mouseenter', handleMouseEnter);
    badge.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      badge.removeEventListener('mousemove', handleMouseMove);
      badge.removeEventListener('mouseenter', handleMouseEnter);
      badge.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={badgeRef}
      className={`
        relative transform-gpu 
        px-5 py-2.5 rounded-full 
        bg-white/5 backdrop-blur-sm 
        border border-white/10 
        text-white/70 text-sm font-medium 
        hover:text-white/90 hover:border-white/20
        transition-colors cursor-pointer select-none
        ${className}
      `}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span className="relative z-10">{name}</span>
      
      {/* Efecto de brillo/glare */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none opacity-0 rounded-full"
        style={{ mixBlendMode: 'overlay' }}
      />
      
      {/* Glow effect on hover */}
      {isHovered && (
        <>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E63946] via-[#FF6B6B] to-[#E63946] rounded-full blur-sm opacity-40 -z-10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full -z-5" />
        </>
      )}
    </div>
  );
};

export default TechBadge;