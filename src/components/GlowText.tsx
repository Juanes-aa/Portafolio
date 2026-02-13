import React from 'react';

interface GlowTextProps {
  text: string;
  className?: string;
  glowColor?: string;
  animate?: boolean;
}

const GlowText: React.FC<GlowTextProps> = ({
  text,
  className = '',
  glowColor = '#E63946',
  animate = true,
}) => {
  return (
    <>
      {/* Inyectar keyframes dinámicos con el color correcto */}
      {animate && (
        <style>{`
          @keyframes glow-pulse {
            0%, 100% {
              text-shadow:
                0 0 10px ${glowColor}80,
                0 0 20px ${glowColor}60,
                0 0 30px ${glowColor}40;
            }
            50% {
              text-shadow:
                0 0 20px ${glowColor},
                0 0 40px ${glowColor}cc,
                0 0 60px ${glowColor}80;
            }
          }
        `}</style>
      )}

      <h2
        className={`relative ${className}`}
        style={{
          color: glowColor,
          textShadow: `0 0 10px ${glowColor}80, 0 0 20px ${glowColor}60`,
          animation: animate ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
        }}
      >
        {text}

        {/* Capa de blur decorativa — sin cambios visuales */}
        <span
          className="absolute inset-0 blur-lg opacity-50 pointer-events-none"
          style={{ color: glowColor }}
          aria-hidden="true"
        >
          {text}
        </span>
      </h2>
    </>
  );
};

export default GlowText;