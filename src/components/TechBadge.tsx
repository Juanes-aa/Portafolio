import React, { useRef, useEffect, useState } from 'react';

interface TechBadgeProps {
  name: string;
  className?: string;
}

const TechBadgeMobile: React.FC<TechBadgeProps> = ({ name, className = '' }) => (
  <div
    className={`
      px-5 py-2.5 rounded-full
      bg-white/5 backdrop-blur-sm
      border border-white/10
      text-white/70 text-sm font-medium
      select-none
      ${className}
    `}
  >
    <span>{name}</span>
  </div>
);

const TechBadgeDesktop: React.FC<TechBadgeProps> = ({ name, className = '' }) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const badge = badgeRef.current;
    const glare = glareRef.current;
    const glow  = glowRef.current;
    if (!badge) return;

    let gsapInstance: typeof import('gsap')['gsap'] | null = null;
    import('gsap').then(({ gsap }) => { gsapInstance = gsap; });

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (!gsapInstance) return;

        const rect    = badge.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -6;
        const rotateY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  6;

        gsapInstance.to(badge, {
          rotateX, rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out',
        });

        if (glare) {
          const gx = ((e.clientX - rect.left) / rect.width)  * 100;
          const gy = ((e.clientY - rect.top)  / rect.height) * 100;
          glare.style.opacity    = '1';
          glare.style.background =
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.25) 0%, transparent 70%)`;
        }
      });
    };

    const onEnter = () => {
      gsapInstance?.to(badge, { scale: 1.05, y: -3, duration: 0.3, ease: 'back.out(1.4)' });
      if (glow) { glow.style.transition = 'opacity 0.3s'; glow.style.opacity = '1'; }
    };

    const onLeave = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }

      gsapInstance?.to(badge, {
        rotateX: 0, rotateY: 0, scale: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
        onComplete: () => { gsapInstance?.set(badge, { clearProps: 'rotateX,rotateY,scale,y' }); },
      });

      if (glare) { glare.style.transition = 'opacity 0.3s'; glare.style.opacity = '0'; }
      if (glow)  { glow.style.transition  = 'opacity 0.3s'; glow.style.opacity  = '0'; }
    };

    badge.addEventListener('mousemove',  onMove);
    badge.addEventListener('mouseenter', onEnter);
    badge.addEventListener('mouseleave', onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      badge.removeEventListener('mousemove',  onMove);
      badge.removeEventListener('mouseenter', onEnter);
      badge.removeEventListener('mouseleave', onLeave);
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

      {/* Glare: siempre en DOM, opacity controlada por JS */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{ opacity: 0, mixBlendMode: 'overlay' }}
      />

      {/* Glow: siempre en DOM, opacity controlada por JS — sin animate-pulse */}
      <div
        ref={glowRef}
        className="absolute -inset-0.5 bg-gradient-to-r from-[#E63946] via-[#FF6B6B] to-[#E63946] rounded-full blur-sm -z-10"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
    </div>
  );
};

const TechBadge: React.FC<TechBadgeProps> = (props) => {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  return mobile
    ? <TechBadgeMobile  {...props} />
    : <TechBadgeDesktop {...props} />;
};

export default TechBadge;