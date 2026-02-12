# 🎨 Portafolio Juan Esteban López Moreno

Portafolio personal moderno construido con React, TypeScript, Tailwind CSS y animaciones GSAP.

![Portfolio Preview](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Características

- ⚛️ **React 18** con TypeScript
- 🎨 **Tailwind CSS** para estilos
- 🎭 **GSAP** para animaciones avanzadas
- 🎪 **Three.js** para efectos 3D (Ballpit)
- 🧩 **shadcn/ui** componentes UI
- 📱 **Responsive Design** completo
- 🚀 **Vite** como build tool
- 📬 **Formulario de contacto** con backend serverless

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno (Opcional)

Si vas a probar con el backend local:

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
VITE_API_URL=http://localhost:8888/.netlify/functions
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🚀 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Ejecuta el linter |

## 📁 Estructura del Proyecto

```
portfolio-frontend/
├── public/                 # Archivos estáticos
│   └── vite.svg
├── src/
│   ├── assets/            # Imágenes y assets
│   │   ├── foto.png       # Foto de perfil
│   │   └── react.svg
│   ├── components/        # Componentes React
│   │   ├── ui/            # Componentes UI de shadcn
│   │   ├── Ballpit.tsx    # Animación 3D de fondo
│   │   ├── CardNav.tsx    # Navegación con cards
│   │   ├── MagneticButton.tsx
│   │   ├── SplitText.tsx
│   │   ├── TextReveal.tsx
│   │   ├── TiltCard.tsx
│   │   ├── FloatingStats.tsx
│   │   ├── FeatureSection.tsx
│   │   └── GlowText.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── use-mobile.ts
│   │   └── useContactForm.ts
│   ├── lib/               # Utilidades
│   │   └── utils.ts
│   ├── App.tsx            # Componente principal
│   ├── Contacto.tsx       # Página de contacto
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary Red | `#E63946` | Acentos principales |
| Dark Red | `#9B2226` | Gradientes |
| Light Red | `#FF6B6B` | Hover states |
| Deep Red | `#660708` | Detalles |
| Background | `#0a0a0a` | Fondo principal |

## 🔧 Tecnologías

### Core
- React 18.2
- TypeScript 5.3
- Vite 5.1

### Styling
- Tailwind CSS 3.4
- PostCSS
- Autoprefixer

### Animaciones
- GSAP 3.12
- Three.js 0.160
- Cannon-es (física)

### UI Components
- Radix UI (primitivos)
- shadcn/ui
- Lucide React (iconos)
- React Icons

### Routing
- React Router DOM 6.22

### Forms & Validation
- Custom hook useContactForm
- Client + Server validation

## 📬 Formulario de Contacto

El formulario de contacto se integra con un backend serverless en Netlify Functions.

### Configuración

1. **Actualizar URL del backend**

En `src/hooks/useContactForm.ts`, la URL se configura automáticamente:
- Desarrollo: `http://localhost:8888/.netlify/functions`
- Producción: `/.netlify/functions`

2. **Variables de entorno** (opcional)

Crear `.env.local`:
```env
VITE_API_URL=https://tu-sitio.netlify.app/.netlify/functions
```

### Uso en componentes

```typescript
import { useContactForm } from './hooks/useContactForm';

const MiComponente = () => {
  const { submitForm, isSubmitting, submitStatus } = useContactForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm({
      name: 'Juan',
      email: 'juan@example.com',
      message: 'Hola!'
    });
  };
};
```

## 🌐 Deploy

### Netlify (Recomendado)

1. **Conectar con GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

2. **Configurar en Netlify**
- Ir a [app.netlify.com](https://app.netlify.com)
- "New site from Git"
- Seleccionar tu repositorio
- Build command: `npm run build`
- Publish directory: `dist`
- Deploy!

3. **Variables de entorno** (si usas backend en el mismo sitio)
- Site settings → Environment variables
- Agregar: `VITE_API_URL=/.netlify/functions`

### Vercel

```bash
npm install -g vercel
vercel
```

### Build manual

```bash
npm run build
```

Los archivos estarán en `/dist`

## 🔒 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend | `/.netlify/functions` |

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🎯 Características Principales

### 🏠 Home Page
- Animación de texto character-by-character
- Fondo interactivo con física (Ballpit)
- Estadísticas flotantes
- Navegación con cards animadas
- Secciones: About, Projects, Skills, Contact

### 📧 Página de Contacto
- Formulario validado
- Animaciones con GSAP
- Feedback visual
- Integración con backend serverless
- Diseño profesional

### 🎨 Componentes Reutilizables
- `MagneticButton` - Botones con efecto magnético
- `SplitText` - Animación de texto
- `TiltCard` - Cards con efecto tilt 3D
- `TextReveal` - Reveal de texto con scroll
- `FloatingStats` - Estadísticas animadas

## 🐛 Troubleshooting

### Error: "Cannot find module '@/...'"

Verifica que `tsconfig.json` tiene:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Animaciones no funcionan

Instala GSAP:
```bash
npm install gsap
```

### Three.js errores

```bash
npm install three @types/three cannon-es
```

### Formulario no envía

1. Verifica que el backend está corriendo
2. Revisa la URL en `useContactForm.ts`
3. Verifica CORS en el backend

## 📝 Personalización

### Cambiar colores

Edita `tailwind.config.js` y `src/index.css`

### Cambiar información personal

- `src/App.tsx` - Información home
- `src/Contacto.tsx` - Email y datos de contacto
- `index.html` - Meta tags

### Agregar sección

```tsx
<section id="nueva-seccion" className="relative z-10 py-32 px-6">
  {/* Tu contenido */}
</section>
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**Juan Esteban López Moreno**
- GitHub: [@Juanes-aa](https://github.com/Juanes-aa)
- Email: j8716184m@gmail.com
- Ubicación: Medellín, Colombia 🇨🇴

## 🙏 Agradecimientos

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Desarrollado con ❤️ en Medellín, Colombia**

¿Tienes preguntas? [Contáctame](mailto:j8716184m@gmail.com)
