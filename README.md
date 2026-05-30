<p align="center">
  <img src="./docs/readme-banner.svg" alt="Banner del portafolio de Juan Esteban Lopez Moreno" width="100%" />
</p>

<h1 align="center">Portafolio | Juan Esteban Lopez Moreno</h1>

<p align="center">
  Portafolio frontend interactivo creado para presentar perfil profesional, proyectos
  destacados y contacto, con animacion, profundidad visual e identidad propia.
</p>

<p align="center">
  <strong>Desarrollador Frontend</strong> | <strong>Desarrollo Creativo</strong> | <strong>Medellin, Colombia</strong>
</p>

<p align="center">
  <a href="https://github.com/Juanes-aa/Portafolio">
    <img src="https://img.shields.io/badge/Repositorio-Portafolio-0f172a?style=for-the-badge&logo=github&logoColor=white&labelColor=111827&color=E63946" alt="Badge del repositorio" />
  </a>
  <img src="https://img.shields.io/badge/React-18-0f172a?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=111827&color=0f172a" alt="Badge de React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-0f172a?style=for-the-badge&logo=typescript&logoColor=3178C6&labelColor=111827&color=0f172a" alt="Badge de TypeScript 5" />
  <img src="https://img.shields.io/badge/Vite-5-0f172a?style=for-the-badge&logo=vite&logoColor=FFD62E&labelColor=111827&color=0f172a" alt="Badge de Vite 5" />
  <img src="https://img.shields.io/badge/GSAP-Animacion-0f172a?style=for-the-badge&logo=greensock&logoColor=88CE02&labelColor=111827&color=0f172a" alt="Badge de GSAP" />
  <img src="https://img.shields.io/badge/Three.js-3D-0f172a?style=for-the-badge&logo=threedotjs&logoColor=white&labelColor=111827&color=0f172a" alt="Badge de Three.js" />
</p>

<p align="center">
  <a href="#resumen"><strong>Resumen</strong></a>
  |
  <a href="#destacados"><strong>Destacados</strong></a>
  |
  <a href="#stack"><strong>Stack</strong></a>
  |
  <a href="#ejecucion-local"><strong>Ejecucion local</strong></a>
  |
  <a href="#mapa-del-proyecto"><strong>Mapa del proyecto</strong></a>
</p>

<p align="center">
  <img src="./docs/readme-preview.svg" alt="Vista previa visual del portafolio" width="100%" />
</p>

## Resumen

Este repositorio contiene el portafolio personal de Juan Esteban Lopez Moreno, pensado como una experiencia web cuidada y no como una simple hoja de vida subida a internet.

El sitio presenta:

- una landing con hero animado, secciones de presentacion, proyectos y stack
- una ruta `/contacto` dedicada para oportunidades profesionales
- proyectos frontend destacados con identidad visual roja y oscura
- una implementacion que busca equilibrio entre impacto visual y rendimiento

> La idea es que el portafolio se sienta vivo, intencional y memorable desde el primer scroll.

## Destacados

| Area | Lo que destaca |
| --- | --- |
| Hero | Animacion de texto, estadisticas flotantes, botones magneticos y una entrada visual con mucha presencia |
| Identidad visual | Fondo oscuro, acentos rojos, cards transluidas y componentes propios en vez de una plantilla generica |
| Rendimiento | Ruta de contacto con carga diferida, division de chunks y alternativa para mobile en los visuales mas pesados |
| Contacto | La pagina visible usa `EmailJS` y el repo incluye ademas una alternativa serverless en `backend/` |

## Stack

### Frontend

- `React 18`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `React Router DOM`

### Animacion e interfaz

- `GSAP`
- `Three.js`
- `cannon-es`
- `Radix UI`
- `shadcn/ui`
- `React Icons`

### Integracion de contacto

- `EmailJS` en [src/Contacto.tsx](src/Contacto.tsx)
- backend opcional con Netlify Functions en [backend/netlify/functions/contact.js](backend/netlify/functions/contact.js)
- `Nodemailer` en la implementacion serverless

## Ejecucion local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

### Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Inicia el servidor local |
| `npm run build` | Genera el build de produccion |
| `npm run preview` | Previsualiza el build local |
| `npm run lint` | Ejecuta ESLint |

## Mapa del proyecto

| Archivo | Funcion |
| --- | --- |
| [src/App.tsx](src/App.tsx) | Landing principal, rutas y carga diferida de contacto |
| [src/Contacto.tsx](src/Contacto.tsx) | Pagina de contacto con validacion y `EmailJS` |
| [src/components/Ballpit.tsx](src/components/Ballpit.tsx) | Fondo 3D con alternativa para mobile y optimizaciones de rendimiento |
| [src/components/CardNav.tsx](src/components/CardNav.tsx) | Navegacion expandible basada en cards |
| [vite.config.ts](vite.config.ts) | Optimizacion del build y estrategia de chunks |
| [backend/netlify/functions/contact.js](backend/netlify/functions/contact.js) | Funcion serverless opcional para contacto |

<details>
<summary><strong>Estructura del proyecto</strong></summary>

```text
Portafolio/
|-- docs/                      # assets visuales del README
|-- public/                    # archivos publicos
|-- src/
|   |-- assets/                # imagenes locales
|   |-- components/            # componentes UI y visuales
|   |-- hooks/                 # hooks del frontend
|   |-- lib/                   # utilidades
|   |-- App.tsx                # experiencia principal
|   |-- Contacto.tsx           # ruta de contacto
|   |-- index.css              # estilos globales
|   `-- main.tsx               # entrypoint
|-- backend/                   # capa serverless opcional
|-- package.json
|-- vite.config.ts
`-- README.md
```

</details>

## Arquitectura de contacto

La pagina de contacto visible hoy usa `EmailJS` directamente desde el frontend.

Si quieres mover el envio a servidor, el repositorio ya incluye una alternativa con Netlify Functions, validacion y `Nodemailer`. Ese flujo parte desde [src/hooks/useContactForm.ts](src/hooks/useContactForm.ts) y continua en [backend/netlify/functions/contact.js](backend/netlify/functions/contact.js).

## Por que el codigo es interesante

- [src/components/Ballpit.tsx](src/components/Ballpit.tsx) no asume que el impacto visual es gratis: tiene alternativa para mobile, importaciones diferidas y controles para no disparar costo innecesario.
- [vite.config.ts](vite.config.ts) separa dependencias pesadas en chunks dedicados para cuidar la carga inicial.
- [src/App.tsx](src/App.tsx) carga la ruta de contacto de forma diferida y hace prefetch para suavizar la navegacion.

## Autor

Juan Esteban Lopez Moreno

- GitHub: [@Juanes-aa](https://github.com/Juanes-aa)
- Email: [j8716184m@gmail.com](mailto:j8716184m@gmail.com)
- Ubicacion: Medellin, Colombia
