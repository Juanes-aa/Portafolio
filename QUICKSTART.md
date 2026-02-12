# ⚡ INICIO RÁPIDO - FRONTEND

## 🎯 3 Pasos para empezar

### 1️⃣ Instalar (2 minutos)

```bash
cd portfolio-frontend
npm install
```

**Tiempo:** ~2 minutos (depende de tu conexión)

---

### 2️⃣ Configurar (Opcional - solo si usas el backend)

Si vas a probar con el backend local:

```bash
cp .env.example .env.local
```

**Contenido de `.env.local`:**
```env
VITE_API_URL=http://localhost:8888/.netlify/functions
```

⚠️ **Nota:** Si no tienes el backend aún, puedes omitir este paso.

---

### 3️⃣ Ejecutar

```bash
npm run dev
```

**¡Listo!** Abre: http://localhost:5173

---

## 🎨 Lo que verás

✅ Landing page con tu nombre y apellido animados  
✅ Fondo 3D interactivo con burbujas  
✅ Sección "Sobre Mí" con tu foto  
✅ Proyectos (Catering App + Maquetación)  
✅ Skills con porcentajes  
✅ Formulario de contacto  

---

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor dev

# Producción
npm run build        # Construye para producción
npm run preview      # Preview del build

# Código
npm run lint         # Verifica errores
```

---

## 🌐 Deploy Rápido

### Netlify (1 minuto)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod
```

### O desde GitHub

1. Sube tu código a GitHub
2. Ve a [netlify.com](https://app.netlify.com)
3. "New site from Git"
4. Selecciona tu repo
5. Click "Deploy"

---

## 📝 Personalizar tu portafolio

### Cambiar información personal

**Archivo:** `src/App.tsx`

```typescript
// Línea 109-120: Tu nombre
<SplitText text="Tu Nombre" ... />

// Línea 126-135: Tu apellido
<SplitText text="Tu Apellido" ... />

// Línea 141-150: Tu título
<SplitText text="Tu Profesión" ... />

// Línea 178-183: Tus estadísticas
items={[
  { value: "X", label: "Years Old" },
  { value: "Y+", label: "Projects Done" },
  { value: "100%", label: "Passion" }
]}
```

### Cambiar foto de perfil

1. Coloca tu foto en `src/assets/`
2. En `src/App.tsx` línea 11, cambia:
```typescript
import perfil from "./assets/tu-foto.png";
```

### Cambiar proyectos

**Archivo:** `src/App.tsx` líneas 239-310

```typescript
// Proyecto 1
<h3>Nombre de tu proyecto</h3>
<p>Descripción...</p>
{["Tech1", "Tech2"].map(tag => ...)}
<a href="https://github.com/tu-usuario/tu-repo">
```

### Cambiar colores

**Archivo:** `tailwind.config.js`

```javascript
// O usa buscar y reemplazar:
// #E63946 → Tu color primario
// #9B2226 → Tu color secundario
// #FF6B6B → Tu color de acento
```

### Cambiar email de contacto

**Archivo:** `src/Contacto.tsx` línea 87

```typescript
href: 'mailto:tu-email@gmail.com',
```

---

## 🔗 Integrar con el Backend

### Si ya tienes el backend deployado

**Archivo:** `src/hooks/useContactForm.ts` línea 14

```typescript
const API_URL = 'https://TU-SITIO.netlify.app/.netlify/functions';
```

### Si backend y frontend están en el mismo dominio

Ya está configurado automáticamente ✅

---

## ❓ Problemas Comunes

### "Module not found" al instalar

```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 5173 ocupado

```bash
npm run dev -- --port 3000
```

### Errores de TypeScript

```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

### Animaciones lentas

Las animaciones usan GSAP y Three.js. En computadoras lentas:
- Reduce `count` en Ballpit (línea 59 de App.tsx)
- De 60 a 30 burbujas

---

## 🎉 ¡Eso es todo!

Tu portafolio está listo. Ahora:

1. ✅ Personaliza tu información
2. ✅ Cambia colores si quieres
3. ✅ Agrega tus proyectos
4. ✅ Deploy a producción

---

**¿Necesitas ayuda?** Lee el `README.md` completo.
