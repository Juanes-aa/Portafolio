import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import {
  GoMail,
  GoLocation,
  GoArrowRight,
  GoCheck,
  GoX
} from 'react-icons/go';
import { FaGithub } from 'react-icons/fa';

import Ballpit from './components/Ballpit';
import CardNav from './components/CardNav';
import MagneticButton from './components/MagneticButton';
import SplitText from './components/SplitText';
import type { CardNavItem } from './components/CardNav';

/* ===================== TYPES ===================== */
interface FormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  asunto?: string;
  mensaje?: string;
}

/* ===================== COMPONENT ===================== */
const Contacto: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  /* ===================== NAV ===================== */
  const items: CardNavItem[] = [
    {
      label: 'About',
      bgColor: '#E63946',
      textColor: '#fff',
      links: [
        { label: 'Who am I', href: '#about', ariaLabel: 'About me' },
        { label: 'Skills', href: '#skills', ariaLabel: 'My skills' }
      ]
    },
    {
      label: 'Projects',
      bgColor: '#9B2226',
      textColor: '#fff',
      links: [
        { label: 'Catering App', href: '#projects', ariaLabel: 'Catering project' },
        { label: 'Maquetación', href: '#projects', ariaLabel: 'Layout project' }
      ]
    },
    {
      label: 'Contact',
      bgColor: '#FF6B6B',
      textColor: '#0A0118',
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/Juanes-aa',
          ariaLabel: 'GitHub Profile',
          external: true
        },
        {
          label: 'Email',
          href: 'mailto:j8716184m@gmail.com',
          ariaLabel: 'Email me',
          external: true
        }
      ]
    }
  ];

  const bubbleColors = [0xE63946, 0x9B2226, 0xFF6B6B, 0x660708];

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    if (submitStatus === 'success' && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }

    if (submitStatus === 'error' && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [submitStatus]);

  /* ===================== VALIDATION ===================== */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===================== HANDLERS ===================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // ⚠️ REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES DE EMAILJS
      const SERVICE_ID = 'service_6dzknyp';      // ← Pega tu Service ID aquí
      const TEMPLATE_ID = 'template_p5cxlhb';    // ← Pega tu Template ID aquí
      const PUBLIC_KEY = '6J2wb_FALKLIkaalY';      // ← Pega tu Public Key aquí

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_name: 'Juan Esteban',           // Tu nombre (quien recibe)
          from_name: formData.nombre,         // Nombre de quien envía
          from_email: formData.email,         // Email de quien envía
          subject: formData.asunto,           // Asunto
          message: formData.mensaje,          // Mensaje
          reply_to: formData.email,           // Email para responder
        },
        PUBLIC_KEY
      );

      setSubmitStatus('success');
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      
    } catch (err) {
      console.error('Error al enviar:', err);
      setSubmitStatus('error');
      setErrorMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===================== DATA ===================== */
  const contactInfo = [
    {
      icon: GoMail,
      label: 'Email',
      value: 'j8716184m@gmail.com',
      href: 'mailto:j8716184m@gmail.com'
    },
    {
      icon: FaGithub,
      label: 'GitHub',
      value: '@Juanes-aa',
      href: 'https://github.com/Juanes-aa'
    },
    {
      icon: GoLocation,
      label: 'Ubicación',
      value: 'Medellín, Colombia',
      href: '#'
    }
  ];

  const asuntos = ['Proyecto Web', 'Colaboración', 'Freelance', 'Consulta', 'Otro'];

  /* ===================== MEMOIZED BALLPIT ===================== */
  // Memoizar el componente Ballpit para que no se reinicie con cada cambio del formulario
  const ballpitComponent = useMemo(() => (
    <Ballpit
      count={60}
      gravity={0.01}
      friction={0.9975}
      wallBounce={0.95}
      followCursor={false}
      colors={bubbleColors}
    />
  ), []); // Array vacío = solo se crea una vez

  /* ===================== RENDER ===================== */
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      
      {/* Ballpit Background */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        {ballpitComponent}
      </div>

      {/* Efectos de luz */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E63946] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#9B2226] rounded-full blur-[150px] opacity-10 animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#660708] rounded-full blur-[120px] opacity-5 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Ruido */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg '%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat"
        }}
      />

      <CardNav
        logoAlt="Juan Esteban LM"
        items={items}
        menuColor="#E63946"
        buttonBgColor="#E63946"
        buttonTextColor="#fff"
        ease="power4.out"
        buttonLabel="Inicio"
        onButtonClick={() => navigate('/')}
      />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header - CENTRADO */}
          <div className="text-center mb-16 flex flex-col items-center justify-center">
            <div className="mb-6">
              <SplitText
                text="Hablemos de tu"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white/90 tracking-tight"
                delay={0.03}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
              />
            </div>
            <div className="mb-6">
              <SplitText
                text="próximo proyecto"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#E63946] tracking-tight"
                delay={0.05}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
              />
            </div>
            
            <p className="text-white/50 text-lg max-w-2xl">
              Estoy emocionado por escuchar sobre tus ideas. Completa el formulario 
              y me pondré en contacto contigo lo antes posible.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white/90 mb-6">
                  Información de contacto
                </h3>
                
                <div className="space-y-4">
                  {contactInfo.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#E63946]/20 flex items-center justify-center group-hover:bg-[#E63946]/30 transition-colors">
                        <item.icon className="w-6 h-6 text-[#E63946]" />
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">{item.label}</p>
                        <p className="text-white/90 font-medium">{item.value}</p>
                      </div>
                      <GoArrowRight className="w-5 h-5 text-white/30 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability Card */}
              <div className="bg-gradient-to-br from-[#E63946]/20 to-[#9B2226]/20 backdrop-blur-lg rounded-2xl p-6 border border-[#E63946]/20">
                <h4 className="text-lg font-bold text-white/90 mb-2">
                  Disponibilidad
                </h4>
                <p className="text-white/60 text-sm mb-4">
                  Actualmente estoy disponible para proyectos freelance y colaboraciones 
                  en Medellín y remotamente.
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-400 text-sm font-medium">Disponible ahora</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10">
                {submitStatus === 'success' ? (
                  <div ref={successRef} className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <GoCheck className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white/90 mb-2">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-white/60 mb-6">
                      Gracias por contactarme. Te responderé lo antes posible.
                    </p>
                    <MagneticButton
                      onClick={() => setSubmitStatus('idle')}
                      variant="outline"
                    >
                      Enviar otro mensaje
                    </MagneticButton>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div ref={errorRef} className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                      <GoX className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white/90 mb-2">
                      Error al enviar
                    </h3>
                    <p className="text-white/60 mb-6">
                      {errorMessage}
                    </p>
                    <MagneticButton
                      onClick={() => setSubmitStatus('idle')}
                      variant="outline"
                    >
                      Intentar nuevamente
                    </MagneticButton>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div>
                        <label htmlFor="nombre" className="block text-white/70 text-sm font-medium mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                            errors.nombre ? 'border-red-500' : 'border-white/10'
                          } text-white placeholder-white/30 focus:outline-none focus:border-[#E63946]/50 focus:ring-2 focus:ring-[#E63946]/20 transition-all`}
                        />
                        {errors.nombre && (
                          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                            <GoX className="w-4 h-4" /> {errors.nombre}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-white/70 text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                            errors.email ? 'border-red-500' : 'border-white/10'
                          } text-white placeholder-white/30 focus:outline-none focus:border-[#E63946]/50 focus:ring-2 focus:ring-[#E63946]/20 transition-all`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                            <GoX className="w-4 h-4" /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Asunto */}
                    <div>
                      <label htmlFor="asunto" className="block text-white/70 text-sm font-medium mb-2">
                        Asunto
                      </label>
                      <select
                        id="asunto"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.asunto ? 'border-red-500' : 'border-white/10'
                        } text-white focus:outline-none focus:border-[#E63946]/50 focus:ring-2 focus:ring-[#E63946]/20 transition-all appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-[#1a1a1a]">Selecciona un asunto</option>
                        {asuntos.map((asunto) => (
                          <option key={asunto} value={asunto} className="bg-[#1a1a1a]">
                            {asunto}
                          </option>
                        ))}
                      </select>
                      {errors.asunto && (
                        <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                          <GoX className="w-4 h-4" /> {errors.asunto}
                        </p>
                      )}
                    </div>

                    {/* Mensaje */}
                    <div>
                      <label htmlFor="mensaje" className="block text-white/70 text-sm font-medium mb-2">
                        Mensaje
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="Cuéntame sobre tu proyecto..."
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.mensaje ? 'border-red-500' : 'border-white/10'
                        } text-white placeholder-white/30 focus:outline-none focus:border-[#E63946]/50 focus:ring-2 focus:ring-[#E63946]/20 transition-all resize-none`}
                      />
                      {errors.mensaje && (
                        <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                          <GoX className="w-4 h-4" /> {errors.mensaje}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <MagneticButton
                      onClick={() => {}}
                      className="w-full !py-4 text-lg"
                      strength={0.2}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Enviar mensaje
                          <GoArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </MagneticButton>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-white/10 text-center">
            <p className="text-white/30 text-sm">
              Medellín, Colombia • 2024 • Juan Esteban López Moreno
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Contacto;