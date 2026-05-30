Portafolio de Juan Esteban Lopez Moreno
Portafolio personal construido para presentar el perfil de Juan Esteban como Frontend Developer y Creative Coder. El proyecto funciona como una experiencia web interactiva donde se muestran su presentacion profesional, habilidades, proyectos destacados y una pagina de contacto pensada para oportunidades laborales, freelance y colaboraciones.

No es una plantilla generica de portfolio. La app combina animaciones, navegacion personalizada, efectos visuales con Three.js y decisiones de performance para que la experiencia siga siendo fluida tanto en desktop como en mobile.

Que muestra este proyecto

Una landing principal con hero animado, seccion "Sobre mi", proyectos recientes, stack tecnico y llamado a la accion.

Una ruta /contacto dedicada para captar leads y facilitar el contacto profesional.

Dos proyectos destacados dentro del portafolio: un sistema de reservas para catering y un proyecto de maquetacion responsive.

Una identidad visual oscura con acentos rojos, componentes interactivos y microinteracciones personalizadas.


Caracteristicas principales

React + TypeScript + Vite como base del frontend.

Animaciones con GSAP y componentes visuales propios como SplitText, MagneticButton, TiltCard y TextReveal.

Fondo Ballpit con Three.js y cannon-es, optimizado para no penalizar la experiencia en mobile.

Navegacion superior expandible con tarjetas y accesos a secciones internas o enlaces externos.

Carga diferida de la pagina de contacto para reducir el peso del bundle inicial.

Build optimizado con separacion de chunks para three, gsap, react y dependencias de UI.


Arquitectura del contacto
Actualmente la pagina Contacto.tsx envia mensajes usando EmailJS desde el frontend.

Ademas, el repositorio incluye una alternativa serverless en contact.js junto con el hook useContactForm.ts. Esa parte sirve como base para mover el formulario a Netlify Functions si quieres usar envio desde backend en lugar de EmailJS.

Stack tecnico
Frontend

React 18

TypeScript

Vite

Tailwind CSS

React Router DOM


Animacion e interfaz

GSAP

Three.js

cannon-es

Radix UI

shadcn/ui

React Icons


Integracion de contacto

EmailJS

Netlify Functions opcional en backend/

Nodemailer en la implementacion serverless


Estructura del proyecto
text



Portafolio/
|-- public/                     # favicon y assets publicos
|-- src/
|   |-- assets/                # imagenes del portfolio
|   |-- components/            # componentes visuales y de navegacion
|   |-- hooks/                 # hooks de soporte, incluido contacto serverless
|   |-- lib/                   # utilidades
|   |-- App.tsx                # landing principal y rutas
|   |-- Contacto.tsx           # pagina de contacto con EmailJS
|   |-- index.css              # estilos base y ajustes globales
|   `-- main.tsx               # entrypoint
|-- backend/                   # alternativa serverless con Netlify Functions
|-- package.json
|-- vite.config.ts
`-- README.md



Ejecucion local
bash



npm install
npm run dev



La aplicacion queda disponible en http://localhost:5173.

Scripts
Comando	Descripcion
npm run dev	Inicia el entorno de desarrollo
npm run build	Genera el build de produccion
npm run preview	Previsualiza el build localmente
npm run lint	Ejecuta ESLint

Si quieres usar la alternativa serverless
Entra a backend/.
Instala sus dependencias.
Configura las variables EMAIL_USER y EMAIL_PASS.
Levanta Netlify localmente con el script definido en backend/package.json.

Esa capa no es la que consume hoy la pagina principal de contacto, pero ya esta incluida en el repositorio como base de integracion.

Lo mas destacable del codigo

En Ballpit.tsx hay una estrategia clara de optimizacion: fallback visual en mobile, lazy import de Three.js y control del pixelRatio.

En vite.config.ts el build separa dependencias pesadas para mejorar carga inicial y cache.

En App.tsx la ruta de contacto se carga de forma diferida y se hace prefetch para mejorar la navegacion.


Autor
Juan Esteban Lopez Moreno


GitHub: @Juanes-aa

Email: j8716184m@gmail.com

Ubicacion: Medellin, Colombia
