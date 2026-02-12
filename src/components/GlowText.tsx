import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GlowTextProps {
  text: string;
  className?: string;
  glowColor?: string;
  animate?: boolean;
}

const GlowText: React.FC<GlowTextProps> = ({ 
  text, 
  className = '',
  glowColor = '#E63946',
  animate = true
}) => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!animate || !textRef.current) return;

    gsap.to(textRef.current, {
      textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, [animate, glowColor]);

  return (
    <h2
      ref={textRef}
      className={`relative ${className}`}
      style={{
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
        color: glowColor
      }}
    >
      {text}
      <span 
        className="absolute inset-0 blur-lg opacity-50"
        style={{ color: glowColor }}
        aria-hidden="true"
      >
        {text}
      </span>
    </h2>
  );
};

export default GlowText;