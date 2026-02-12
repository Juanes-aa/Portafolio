import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className = '',
  highlightWords = [],
  highlightColor = '#E63946'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsRef.current,
        {
          opacity: 0.1,
          y: 30,
          rotateX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  const words = text.split(' ');

  return (
    <div 
      ref={containerRef} 
      className={`text-3xl md:text-5xl font-bold leading-tight perspective-1000 ${className}`}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.some(hw => 
          word.toLowerCase().includes(hw.toLowerCase())
        );
        
        return (
          <span
            key={i}
            ref={el => { if (el) wordsRef.current[i] = el; }}
            className="inline-block mr-[0.25em] origin-bottom will-change-transform"
            style={{ 
              color: isHighlight ? highlightColor : 'inherit',
              backfaceVisibility: 'hidden'
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export default TextReveal;