import React, { useRef, useEffect, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

const BASE = 'relative px-8 py-4 font-semibold rounded-xl transition-all duration-300 cursor-pointer select-none';
const VARIANTS = {
  primary: 'bg-gradient-to-r from-[#E63946] to-[#9B2226] text-white border border-transparent hover:brightness-110 active:scale-95',
  outline: 'bg-white/5 backdrop-blur-lg text-white border border-white/20 hover:bg-white/10 hover:border-[#E63946]/50 active:scale-95'
};

const MagneticButtonMobile: React.FC<MagneticButtonProps> = ({
  children, className = '', onClick, variant = 'primary', disabled = false
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${BASE} ${VARIANTS[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
  >
    <span className="relative z-10 flex w-full items-center justify-center gap-2 text-center">
      {children}
    </span>
  </button>
);

const MagneticButtonDesktop: React.FC<MagneticButtonProps> = ({
  children, className = '', strength = 0.3,
  onClick, variant = 'primary', disabled = false
}) => {
  const buttonRef  = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    if (disabled) return;
    const btn  = buttonRef.current;
    const cont = contentRef.current;
    if (!btn || !cont) return;

    let gsapInstance: typeof import('gsap')['gsap'] | null = null;
    import('gsap').then(({ gsap }) => { gsapInstance = gsap; });

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (!gsapInstance) return;
        const rect    = btn.getBoundingClientRect();
        const dx      = (e.clientX - (rect.left + rect.width  / 2)) * strength;
        const dy      = (e.clientY - (rect.top  + rect.height / 2)) * strength;
        gsapInstance.to(btn,  { x: dx,         y: dy,         duration: 0.3, ease: 'power2.out' });
        gsapInstance.to(cont, { x: dx * 0.5,   y: dy * 0.5,   duration: 0.3, ease: 'power2.out' });
      });
    };

    const onLeave = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
      gsapInstance?.to([btn, cont], { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, disabled]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE} ${VARIANTS[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <span
        ref={contentRef}
        className="relative z-10 flex w-full items-center justify-center gap-2 text-center"
      >
        {children}
      </span>
    </button>
  );
};

const MagneticButton: React.FC<MagneticButtonProps> = (props) => {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  return mobile
    ? <MagneticButtonMobile  {...props} />
    : <MagneticButtonDesktop {...props} />;
};

export default MagneticButton;