import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

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

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title = "Why Choose Us",
  subtitle = "Designed to perform. Built to scale.",
  items
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%"
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16"
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-4 text-white/60">
          {subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              feature-card
              relative p-8 rounded-3xl
              backdrop-blur-xl bg-white/5
              border border-white/10
              shadow-xl
              transition-all duration-300
              hover:-translate-y-3
              hover:shadow-2xl
              group
            "
          >
            {/* Glow */}
            <div
              className="
                absolute inset-0 rounded-3xl opacity-0
                group-hover:opacity-100 transition
                blur-xl
              "
              style={{
                background: item.accent ?? "linear-gradient(135deg,#FF3366,#00D9FF)"
              }}
            />

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
