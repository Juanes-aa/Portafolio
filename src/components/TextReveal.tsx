import React, { useRef, useEffect, useState, useMemo } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

const TextRevealMobile: React.FC<TextRevealProps> = ({
  text,
  className = '',
  highlightWords = [],
  highlightColor = '#E63946',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = useMemo(() => text.split(' '), [text]);

  return (
    <div
      ref={containerRef}
      className={`text-3xl md:text-5xl font-bold leading-tight ${className}`}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.some(hw =>
          word.toLowerCase().includes(hw.toLowerCase())
        );
        return (
          <span
            key={i}
            className="inline-block mr-[0.25em]"
            style={{
              color:     isHighlight ? highlightColor : 'inherit',
              opacity:   visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const TextRevealDesktop: React.FC<TextRevealProps> = ({
  text,
  className = '',
  highlightWords = [],
  highlightColor = '#E63946',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef     = useRef<HTMLSpanElement[]>([]);
  const words        = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ctx: any;

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          wordsRef.current,
          { opacity: 0, y: 25 },         
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'willChange,transform,opacity',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end:   'top 40%',
              scrub: 0.5,               
            },
          }
        );
      }, el);
    };

    init();
    return () => ctx?.revert();
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`text-3xl md:text-5xl font-bold leading-tight ${className}`}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.some(hw =>
          word.toLowerCase().includes(hw.toLowerCase())
        );
        return (
          <span
            key={i}
            ref={el => { if (el) wordsRef.current[i] = el; }}
            className="inline-block mr-[0.25em] origin-bottom"
            style={{
              color: isHighlight ? highlightColor : 'inherit',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const TextReveal: React.FC<TextRevealProps> = (props) => {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  return mobile
    ? <TextRevealMobile  {...props} />
    : <TextRevealDesktop {...props} />;
};

export default TextReveal;