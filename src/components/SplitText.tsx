import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: { opacity?: number; y?: number; x?: number; scale?: number };
  to?: { opacity?: number; y?: number; x?: number; scale?: number };
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0.03,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 },
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    
    const chars = containerRef.current.querySelectorAll('.split-char, .split-word');
    if (chars.length === 0) return;

    // Reset para reanimación si es necesario
    gsap.set(chars, { opacity: 1 });
    
    gsap.fromTo(
      chars,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay,
        onComplete: () => {
          hasAnimated.current = true;
          onLetterAnimationComplete?.();
        }
      }
    );
  }, [delay, duration, ease, from, to, onLetterAnimationComplete]);

  const renderContent = () => {
    if (splitType === 'chars') {
      return text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char inline-block will-change-transform"
          style={{ 
            opacity: 0,
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            backfaceVisibility: 'hidden'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }
    
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="split-word inline-block mr-[0.25em] will-change-transform"
        style={{ opacity: 0 }}
      >
        {word}
      </span>
    ));
  };

  const Tag = tag as React.ElementType;
  
  return (
    <Tag
      ref={containerRef as any}
      className={`split-text-container relative z-50 inline-block ${className}`}
    >
      {renderContent()}
    </Tag>
  );
};

export default SplitText;