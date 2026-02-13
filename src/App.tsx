/**
 * App.tsx — OPTIMIZADO
 *
 * Cambios:
 * 1. Contacto pasa a ser lazy-loaded: no se incluye en el bundle inicial
 * 2. Suspense con fallback mínimo (no bloquea el render inicial)
 * 3. Prefetch de /contacto al montar HomePage (cuando el usuario lee el hero,
 *    el chunk de Contacto ya está descargado antes de que haga click)
 * 4. ✨ NUEVO: Valores de repulsión ajustados para movimiento más sutil
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// ── Imports directos (forman parte del bundle principal) ──────────────────────
import Ballpit         from './components/Ballpit';
import CardNav         from './components/CardNav';
import SplitText       from './components/SplitText';
import TechBadge       from './components/TechBadge';
import FloatingStats   from './components/FloatingStats';
import MagneticButton  from './components/MagneticButton';
import TextReveal      from './components/TextReveal';
import TiltCard        from './components/TiltCard';
import type { CardNavItem } from './components/CardNav';
import perfil from './assets/foto.webp';

// ── Lazy: Contacto solo carga cuando se navega a /contacto ────────────────────
const Contacto = lazy(() => import('./Contacto'));

// ── Skeleton minimalista para Suspense ────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const bubbleColors = [0xE63946, 0x9B2226, 0xFF6B6B, 0x660708];

const HomePage = () => {
  const navigate = useNavigate();

  // Prefetch de Contacto mientras el usuario lee el hero
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./Contacto'); // descarga el chunk en background
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Count dinámico basado en tamaño de pantalla (solo afecta desktop ya que mobile usa CSS fallback)
  const getBallCount = () => {
    if (typeof window === 'undefined') return 70;
    const width = window.innerWidth;
    if (width >= 1920) return 80;  // Pantallas grandes (2K, 4K)
    if (width >= 1280) return 70;  // Desktop estándar
    return 60;                      // Laptops pequeñas
  };

  const [ballCount] = useState(getBallCount);

  const items: CardNavItem[] = [
    {
      label: 'About',
      bgColor: '#E63946',
      textColor: '#fff',
      links: [
        { label: 'Who am I', href: '#about',  ariaLabel: 'About me'  },
        { label: 'Skills',   href: '#skills', ariaLabel: 'My skills' }
      ]
    },
    {
      label: 'Projects',
      bgColor: '#9B2226',
      textColor: '#fff',
      links: [
        { label: 'Catering App', href: '#projects', ariaLabel: 'Catering project' },
        { label: 'Maquetación',  href: '#projects', ariaLabel: 'Layout project'   }
      ]
    },
    {
      label: 'Contact',
      bgColor: '#FF6B6B',
      textColor: '#0A0118',
      links: [
        { label: 'Contact Page', href: '/contacto',                       ariaLabel: 'Contact Page'   },
        { label: 'GitHub',       href: 'https://github.com/Juanes-aa',    ariaLabel: 'GitHub Profile' },
        { label: 'Email',        href: 'mailto:j8716184m@gmail.com',      ariaLabel: 'Email me'       }
      ]
    }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0a]">

      {/* BALLPIT — Count adaptativo: 80 bolas en pantallas grandes, 70 en desktop, 60 en laptops */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <Ballpit
          count={ballCount}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
          colors={bubbleColors}
          repelRadius={1.5}
          repelStrength={0.15}
          cursorLightColor={0xFFDBAA}
          cursorLightIntensity={180}
          cursorLightDistance={8}
        />
      </div>

      {/* LUCES — en mobile se simplifican */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#E63946] rounded-full blur-[120px] opacity-10 animate-pulse" />
        {/* Las luces extra solo en sm+ para no sobrecargar mobile */}
        <div className="hidden sm:block absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#9B2226] rounded-full blur-[120px] opacity-10 animate-pulse delay-700" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#660708] rounded-full blur-[120px] opacity-5 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* NAVBAR */}
      <CardNav
        logoAlt="Juan Esteban LM"
        items={items}
        menuColor="#E63946"
        buttonBgColor="#E63946"
        buttonTextColor="#fff"
        ease="power4.out"
        onContactClick={() => navigate('/contacto')}
      />

      {/* HERO */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 text-center pt-28 sm:pt-32 pb-16 sm:pb-20">

        <div className="mb-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-[#FF6B6B]/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E63946]/70" />
          </span>
          Available for projects • Medellín, CO
        </div>

        <SplitText
          text="Juan Esteban"
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white/90 tracking-tight leading-tight break-words"
          delay={0.05}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 100, scale: 0.5 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          tag="h1"
        />

        <SplitText
          text="López Moreno"
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-[#E63946]/90 tracking-tight leading-tight break-words -mt-2 mb-4"
          delay={0.08}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 100, scale: 0.5 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          tag="span"
        />

        <div className="max-w-3xl mt-2 mb-4 px-2">
          <SplitText
            text="Frontend Developer & Creative Coder"
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/50 tracking-wide"
            delay={0.03}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            tag="p"
          />
        </div>

        <p className="text-white/30 text-xs sm:text-sm md:text-base italic mb-10 max-w-xl px-4">
          "Transformando líneas de código en experiencias que cobran vida"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full px-4 justify-center items-center">
          <MagneticButton
            onClick={() => window.open('https://github.com/Juanes-aa', '_blank')}
            className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 !bg-[#E63946] hover:!bg-[#FF6B6B]"
          >
            Ver GitHub →
          </MagneticButton>

          <MagneticButton
            onClick={() => navigate('/contacto')}
            variant="outline"
            className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
          >
            Contáctame
          </MagneticButton>
        </div>

        <div className="w-full flex justify-center px-4">
          <FloatingStats
            items={[
              { value: '17',   label: 'Years Old'    },
              { value: '2+',   label: 'Projects Done'},
              { value: '100%', label: 'Passion'      }
            ]}
          />
        </div>
      </main>

      {/* ABOUT */}
      <section id="about" className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <TiltCard className="bg-white/5 sm:backdrop-blur-lg rounded-2xl p-2 border border-white/10 aspect-square flex items-center justify-center overflow-hidden max-w-sm mx-auto md:max-w-none">
            <img
              src={perfil}
              alt="Juan Esteban López Moreno"
              className="w-full h-full rounded-xl object-cover"
              loading="lazy"       // ← lazy load de la foto
              decoding="async"
              width={400}
              height={400}
            />
          </TiltCard>

          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white/90">
              Sobre <span className="text-[#E63946]">Mí</span>
            </h2>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-6">
              Técnico en Desarrollo de Software recién graduado de Medellín, Colombia.
              Apasionado por crear interfaces web funcionales y visualmente impactantes.
            </p>

            <p className="text-white/40 leading-relaxed mb-8 text-sm sm:text-base">
              He desarrollado proyectos completos desde cero, incluyendo sistemas de reservas
              con panel administrativo y maquetaciones pixel-perfect.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['React', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind', 'GSAP'].map(tech => (
                <TechBadge key={tech} name={tech} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEXT REVEAL */}
      <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TextReveal
            text="Transformamos ideas en realidades digitales impresionantes que cautivan audiencias"
            highlightWords={['Transformamos', 'impresionantes', 'cautivan']}
            highlightColor="#E63946"
            className="text-white/70 text-center text-xl sm:text-2xl md:text-4xl leading-relaxed"
          />
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white/90">
              Proyectos <span className="text-[#E63946]">Recientes</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg">Trabajos que demuestran mis habilidades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                emoji: '🍽️',
                title: 'Sistema de Reservas Catering',
                desc:  'Plataforma completa para reservar servicios de catering con panel administrativo.',
                tags:  ['HTML', 'Tailwind CSS', 'PHP', 'SQL'],
                href:  'https://github.com/Juanes-aa/mideliz',
                from:  'from-[#E63946]/30', to: 'to-[#9B2226]/30'
              },
              {
                emoji: '🎨',
                title: 'Proyecto de Maquetación',
                desc:  'Diseño web pixel-perfect con enfoque en responsive y experiencia de usuario.',
                tags:  ['HTML', 'Tailwind CSS'],
                href:  'https://github.com/Juanes-aa/quipux',
                from:  'from-[#9B2226]/30', to: 'to-[#660708]/30'
              }
            ].map(project => (
              <TiltCard
                key={project.title}
                className="bg-white/5 sm:backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 group"
              >
                <div className={`h-48 bg-gradient-to-br ${project.from} ${project.to} flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                    {project.emoji}
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white/90">{project.title}</h3>
                  <p className="text-white/50 mb-4 leading-relaxed text-sm sm:text-base">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#E63946]/20 text-[#FF6B6B]">{tag}</span>
                    ))}
                  </div>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#E63946] hover:text-[#FF6B6B] transition-colors"
                  >
                    Ver en GitHub →
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-14 md:mb-16 text-white/90">
            Tech <span className="text-[#E63946]">Stack</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'React',       level: '85%' },
              { name: 'TypeScript',  level: '75%' },
              { name: 'HTML/CSS',    level: '90%' },
              { name: 'Tailwind',    level: '80%' },
              { name: 'GSAP',        level: '70%' },
              { name: 'Git',         level: '80%' },
              { name: 'Responsive',  level: '95%' },
              { name: 'UI/UX',       level: '70%' }
            ].map(skill => (
              <div
                key={skill.name}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/10 hover:border-[#E63946]/50 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#E63946] mb-1">{skill.level}</div>
                <div className="text-white/60 text-xs sm:text-sm">{skill.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-8 text-white/90 leading-tight">
            ¿Tienes un <span className="text-[#E63946]">proyecto</span>?
          </h2>
          <p className="text-white/50 text-base sm:text-xl mb-10 sm:mb-12 max-w-2xl mx-auto">
            Estoy disponible para crear tu próxima experiencia web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full px-4 justify-center items-center">
            <MagneticButton
              onClick={() => navigate('/contacto')}
              className="w-full sm:w-auto !bg-[#E63946] hover:!bg-[#FF6B6B] text-sm sm:text-lg px-8 sm:px-10 py-3 sm:py-5"
              strength={0.4}
            >
              Ir a Contacto →
            </MagneticButton>
            <MagneticButton
              onClick={() => window.open('https://github.com/Juanes-aa', '_blank')}
              variant="outline"
              className="w-full sm:w-auto text-sm sm:text-lg px-8 sm:px-10 py-3 sm:py-5"
              strength={0.4}
            >
              GitHub Profile
            </MagneticButton>
          </div>
          <div className="text-white/30 text-xs sm:text-sm">
            Medellín, Colombia • 2024 • Juan Esteban López Moreno
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Rutas ────────────────────────────────────────────────────────────────────
const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route
      path="/contacto"
      element={
        <Suspense fallback={<PageLoader />}>
          <Contacto />
        </Suspense>
      }
    />
  </Routes>
);

export default App;