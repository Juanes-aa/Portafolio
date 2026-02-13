import React, { useRef, useEffect, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glareEnabled?: boolean;
}

const TiltCardMobile: React.FC<TiltCardProps> = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    {children}
  </div>
);

const TiltCardDesktop: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltStrength = 15,
  glareEnabled = true,
}) => {
  const cardRef  = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const card  = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    let gsapInstance: typeof import('gsap')['gsap'] | null = null;
    import('gsap').then(({ gsap }) => { gsapInstance = gsap; });

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (!gsapInstance) return;

        const rect    = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -tiltStrength;
        const rotateY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  tiltStrength;

        gsapInstance.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out',
        });

        if (glare && glareEnabled) {
          const gx = ((e.clientX - rect.left) / rect.width)  * 100;
          const gy = ((e.clientY - rect.top)  / rect.height) * 100;
          glare.style.opacity = '1';
          glare.style.background =
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(230,57,70,0.25) 0%, transparent 60%)`;
        }
      });
    };

    const onEnter = () => {
      gsapInstance?.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    };

    const onLeave = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }

      gsapInstance?.to(card, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 0.5, ease: 'power2.out',
        onComplete: () => { gsapInstance?.set(card, { clearProps: 'rotateX,rotateY,scale' }); },
      });

      if (glare) {
        glare.style.transition = 'opacity 0.3s';
        glare.style.opacity    = '0';
      }
    };

    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.removeEventListener('mousemove',  onMove);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [tiltStrength, glareEnabled]);

  return (
    <div
      ref={cardRef}
      className={`relative transform-gpu ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}

      {/* Glare: siempre en DOM, solo cambia opacity — evita mount/unmount */}
      {glareEnabled && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ opacity: 0, mixBlendMode: 'overlay' }}
        />
      )}

      {/*
       * Glow de borde: siempre en DOM con opacity 0 por defecto.
       * CSS hover lo activa — cero JS, cero nodos dinámicos.
       */}
      <div
        className="
          absolute -inset-1 rounded-2xl -z-10
          bg-gradient-to-r from-[#E63946] via-[#9B2226] to-[#FF6B6B]
          blur-lg opacity-0
          group-hover:opacity-30
          transition-opacity duration-300
        "
        aria-hidden="true"
      />
    </div>
  );
};

const TiltCard: React.FC<TiltCardProps> = (props) => {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  return mobile
    ? <TiltCardMobile  {...props} />
    : <TiltCardDesktop {...props} />;
};

export default TiltCard;