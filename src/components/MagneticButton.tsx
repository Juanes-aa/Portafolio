import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.3,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (disabled) return;

    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button || !content) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(content, {
        x: deltaX * 0.5,
        y: deltaY * 0.5,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, content], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  const baseStyles =
    "relative px-8 py-4 font-semibold rounded-xl overflow-hidden transition-all duration-300";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#E63946] to-[#9B2226] text-white hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] border border-transparent",
    outline:
      "bg-white/5 backdrop-blur-lg text-white border border-white/20 hover:bg-white/10 hover:border-[#E63946]/50"
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <span
        ref={contentRef}
        className="relative z-10 flex w-full items-center justify-center gap-2 text-center"
      >
        {children}
      </span>


      {!disabled && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B6B] to-[#E63946] opacity-0 hover:opacity-100 transition-opacity duration-300" />

          <div
            className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(230,57,70,0.3), transparent, rgba(230,57,70,0.3))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              padding: '1px'
            }}
          />
        </>
      )}
    </button>
  );
};

export default MagneticButton;
