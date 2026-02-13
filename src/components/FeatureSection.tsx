import React, { useRef, useEffect, useState } from 'react';

export interface FeatureItem {
  title: string;
  description: string;
  accent?: string;
}

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
}

const FeatureSectionMobile: React.FC<FeatureSectionProps> = ({
  title = 'Why Choose Us',
  subtitle = 'Designed to perform. Built to scale.',
  items,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-bold text-white">{title}</h2>
        <p className="mt-4 text-white/60">{subtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl"
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const FeatureSectionDesktop: React.FC<FeatureSectionProps> = ({
  title = 'Why Choose Us',
  subtitle = 'Designed to perform. Built to scale.',
  items,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ctx: any;

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll('.feature-card'),
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            clearProps: 'willChange,transform,opacity',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
            },
          }
        );
      }, el);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-16">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white">{title}</h2>
        <p className="mt-4 text-white/60">{subtitle}</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              feature-card
              relative p-8 rounded-3xl
              backdrop-blur-xl bg-white/5
              border border-white/10 shadow-xl
              transition-transform duration-300
              hover:-translate-y-3 hover:shadow-2xl
              group
            "
          >
            {/*
             * Glow: blur-xl solo cuando es visible (group-hover).
             * En el original blur-xl estaba activo siempre aunque
             * opacity fuera 0 — seguía creando una capa GPU.
             */}
            <div
              className="
                absolute inset-0 rounded-3xl
                opacity-0 group-hover:opacity-60
                transition-opacity duration-300
                group-hover:blur-xl
              "
              style={{
                background: item.accent ?? 'linear-gradient(135deg,#E63946,#9B2226)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FeatureSection: React.FC<FeatureSectionProps> = (props) => {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  return mobile
    ? <FeatureSectionMobile  {...props} />
    : <FeatureSectionDesktop {...props} />;
};

export default FeatureSection;