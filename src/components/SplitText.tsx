import React, { useRef, useEffect, useState, useMemo } from 'react';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

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

const SplitTextMobile: React.FC<SplitTextProps> = ({
  text, className = '', delay = 0.03, duration = 0.6,
  splitType = 'chars', tag = 'p'
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = splitType === 'chars' ? text.split('') : text.split(' ');
  const Tag   = tag as React.ElementType;

  return (
    <Tag ref={containerRef as any} className={`inline-block ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity ${duration * 0.7}s ease ${i * delay}s, transform ${duration * 0.7}s ease ${i * delay}s`,
            whiteSpace: item === ' ' ? 'pre' : 'normal',
          }}
        >
          {item === ' ' ? '\u00A0' : item}
        </span>
      ))}
    </Tag>
  );
};

const SplitTextDesktop: React.FC<SplitTextProps> = ({
  text, className = '', delay = 0.03, duration = 0.8,
  ease = 'power3.out', splitType = 'chars',
  from = { opacity: 0, y: 50 }, to = { opacity: 1, y: 0 },
  tag = 'p', onLetterAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const animated     = useRef(false);

  const items = useMemo(
    () => splitType === 'chars' ? text.split('') : text.split(' '),
    [text, splitType]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animated.current) return;

    const obs = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        const { gsap } = await import('gsap');
        const chars = el.querySelectorAll<HTMLElement>('.sc');
        if (!chars.length) return;

        const ctx = gsap.context(() => {
          gsap.fromTo(chars, { ...from }, {
            ...to,
            duration,
            ease,
            stagger: delay,
            clearProps: 'willChange,transform,opacity',
            onComplete: () => {
              animated.current = true;
              onLetterAnimationComplete?.();
            }
          });
        }, el);

        return () => ctx.revert();
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, duration, ease, from, to, onLetterAnimationComplete]);

  const Tag = tag as React.ElementType;

  return (
    <Tag ref={containerRef as any} className={`inline-block ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          className="sc inline-block"
          style={{
            opacity: 0,
            whiteSpace: item === ' ' ? 'pre' : 'normal',
          }}
        >
          {item === ' ' ? '\u00A0' : item}
        </span>
      ))}
    </Tag>
  );
};

const SplitText: React.FC<SplitTextProps> = (props) => {
  const [mobile] = useState(() => isMobile());
  return mobile
    ? <SplitTextMobile  {...props} />
    : <SplitTextDesktop {...props} />;
};

export default SplitText;