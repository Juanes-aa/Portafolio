<div align="center">

# 🎨 Portafolio Personal

### Transformando líneas de código en experiencias que cobran vida

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.1-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14.2-00CE7C?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-FF6B6B?style=for-the-badge)](https://portafolio-eta-olive.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Descripción

Portafolio personal interactivo construido para presentar mi perfil como **Frontend Developer & Creative Coder**. Este proyecto no es una plantilla genérica — combina animaciones fluidas, navegación personalizada, efectos visuales con Three.js y optimizaciones de performance para crear una experiencia web memorable tanto en desktop como en mobile.

### ✨ Características Destacadas

- 🎯 **Hero animado** con efectos de texto SplitText y estadísticas flotantes
- 🔴 **Fondo Ballpit 3D** con física real usando Three.js y cannon-es
- 🧲 **Botones magnéticos** y tarjetas con efecto tilt 3D
- 📱 **Responsive design** optimizado para todos los dispositivos
- ⚡ **Lazy loading** y separación de chunks para carga rápida
- 🎨 **Identidad visual oscura** con acentos rojos (#E63946)
- 📧 **Formulario de contacto** funcional con EmailJS
- 🚀 **Build optimizado** con Vite para producción

---

## 🎯 Secciones del Portafolio

| Sección | Descripción |
|---------|-------------|
| **Hero** | Presentación con nombre, profesión y estadísticas animadas |
| **Sobre Mí** | Perfil profesional con foto y tecnologías principales |
| **Text Reveal** | Mensaje inspirador con efecto de revelación al scroll |
| **Proyectos** | 4 proyectos destacados con demo y GitHub links |
| **Tech Stack** | Grid de habilidades con niveles de dominio |
| **Contacto** | Formulario funcional + información de contacto |

---

## 🛠️ Stack Tecnológico

### Frontend Core
- **React 18.3** - Framework UI
- **TypeScript 5.9** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **TailwindCSS 3.4** - Estilos utility-first
- **React Router DOM 6.22** - Enrutamiento

### Animación & 3D
- **GSAP 3.14** - Animaciones profesionales
- **Three.js 0.160** - Gráficos 3D
- **cannon-es 0.20** - Física para el ballpit
- **@gsap/react 2.1** - Integración GSAP + React

### UI Components
- **Radix UI** - Componentes accesibles primitivos
- **shadcn/ui** - Componentes UI pre-estilizados
- **Lucide React** - Iconos modernos
- **React Icons** - Iconos adicionales

### Contacto
- **EmailJS 4.4** - Envío de emails desde frontend
- **Netlify Functions** (opcional) - Backend serverless
- **Nodemailer** - Envío de emails en backend

---

## 📁 Estructura del Proyecto

```
Portafolio/
├── 📁 src/
│   ├── 📁 components/          # Componentes React personalizados
│   │   ├── Ballpit.tsx        # Fondo 3D con física
│   │   ├── SplitText.tsx      # Texto animado letra por letra
│   │   ├── TextReveal.tsx     # Reveal de texto con scroll
│   │   ├── MagneticButton.tsx # Botón con efecto magnético
│   │   ├── TiltCard.tsx       # Cards con efecto 3D tilt
│   │   ├── CardNav.tsx        # Navegación con cards
│   │   ├── FloatingStats.tsx  # Estadísticas flotantes
│   │   ├── TechBadge.tsx      # Badges de tecnologías
│   │   └── 📁 ui/             # Componentes shadcn/ui (50+)
│   ├── 📁 hooks/              # Custom React Hooks
│   │   ├── use-mobile.ts      # Detección mobile
│   │   └── useContactForm.ts  # Lógica formulario contacto
│   ├── 📁 assets/             # Imágenes y recursos
│   │   └── foto.webp          # Foto de perfil
│   ├── App.tsx                # Página principal (Home)
│   ├── Contacto.tsx           # Página de contacto
│   ├── main.tsx               # Entry point
│   └── index.css              # Estilos globales
├── 📁 backend/                # Backend serverless (opcional)
│   ├── 📁 netlify/
│   │   └── functions/
│   │       └── contact.js     # Función de envío emails
│   └── 📁 frontend-integration/
├── 📁 public/                 # Assets estáticos
├── package.json               # Dependencias
├── vite.config.ts             # Configuración Vite
├── tailwind.config.ts         # Configuración Tailwind
└── tsconfig.json              # Configuración TypeScript
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Juanes-aa/Portafolio.git
cd Portafolio

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Previsualiza build localmente |
| `npm run lint` | Ejecuta ESLint |

---

## 🎨 Personalización

### Archivos principales a modificar

1. **`src/App.tsx`** - Información personal, proyectos, stats
2. **`src/Contacto.tsx`** - Email y enlaces de contacto
3. **`src/assets/foto.webp`** - Tu foto de perfil
4. **`index.html`** - Meta tags y título
5. **`tailwind.config.ts`** - Colores y tema personalizado

### Configurar EmailJS (opcional)

Si quieres usar el formulario de contacto con EmailJS:

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Crea un servicio de email (Gmail, Outlook, etc.)
3. Crea un template de email
4. Agrega tus credenciales en `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 🎯 Proyectos Destacados

| Proyecto | Descripción | Stack |
|----------|-------------|-------|
| 🍽️ **Sistema de Reservas Catering** | Plataforma completa con panel administrativo | HTML, Tailwind, PHP, SQL |
| 🎨 **Proyecto de Maquetación** | Diseño pixel-perfect responsive | HTML, Tailwind |
| 🧮 **CalcIng** | Calculadora científica para ingeniería | React, FastAPI, Python |
| 🎬 **Lumen** | Análisis cinematográfico con IA | React, TypeScript, Groq, Supabase |

---

## ⚡ Optimizaciones de Performance

- **Lazy loading** de Three.js y página de contacto
- **Separación de chunks** para dependencias pesadas
- **Adaptive ball count** según tamaño de pantalla
- **Pixel ratio control** en dispositivos móviles
- **Lazy load** de imágenes con `loading="lazy"`
- **CSS fallback** para mobile en animaciones 3D
- **Prefetch** de rutas para navegación instantánea

---

## 📊 Estadísticas del Proyecto

- **17 años** - Edad del desarrollador
- **4+ proyectos** - En el portafolio
- **100% pasión** - Por el desarrollo web
- **Medellín, CO** - Ubicación

---

## 🤝 Contribuciones

Este es un portafolio personal, pero si encuentras algún bug o tienes sugerencias de mejora, ¡siéntete libre de abrir un issue o hacer un PR!

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👨‍💻 Autor

**Juan Esteban López Moreno**

- 📧 Email: [j8716184m@gmail.com](mailto:j8716184m@gmail.com)
- 🐙 GitHub: [@Juanes-aa](https://github.com/Juanes-aa)
- 📍 Ubicación: Medellín, Colombia 🇨🇴
- 💼 Rol: Frontend Developer & Creative Coder

---

<div align="center">

### ⭐ Si te gusta este portafolio, ¡dale una estrella!

Made with ❤️ and lots of ☕

</div>
