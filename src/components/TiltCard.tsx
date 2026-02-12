import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glareEnabled?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = '',
  tiltStrength = 15,
  glareEnabled = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -tiltStrength;
      const rotateY = (mouseX / (rect.width / 2)) * tiltStrength;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      });

      if (glare && glareEnabled) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        
        gsap.to(glare, {
          opacity: 0.3,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(230,57,70,0.3) 0%, transparent 60%)`,
          duration: 0.3
        });
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      if (glare) {
        gsap.to(glare, { opacity: 0, duration: 0.3 });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [tiltStrength, glareEnabled]);

  return (
    <div
      ref={cardRef}
      className={`relative transform-gpu ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glareEnabled && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none opacity-0 rounded-inherit"
          style={{ mixBlendMode: 'overlay' }}
        />
      )}
      {isHovered && (
        <div 
          className="absolute -inset-1 bg-gradient-to-r from-[#E63946] via-[#9B2226] to-[#FF6B6B] rounded-2xl blur-lg opacity-30 -z-10 animate-pulse"
        />
      )}
    </div>
  );
};

export default TiltCard;