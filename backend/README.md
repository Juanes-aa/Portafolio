# 🚀 Backend Serverless - Portafolio Juan Esteban

Backend gratuito con Netlify Functions para el formulario de contacto del portafolio.

## 📋 Requisitos

- Node.js 16+ instalado
- Cuenta gratuita en [Netlify](https://www.netlify.com/)
- Cuenta de Gmail (o cualquier servicio de email)

---

## ⚡ Instalación Rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` y configura tus credenciales:

```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
```

### 3. Obtener contraseña de aplicación de Gmail

⚠️ **NO uses tu contraseña normal de Gmail**

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Habilita la **verificación en 2 pasos** (si no la tienes)
3. Ve a **Contraseñas de aplicaciones**
4. Selecciona "Correo" y "Otro"
5. Dale un nombre: "Portfolio Backend"
6. Copia la contraseña generada (16 caracteres)
7. Pégala en `.env` en `EMAIL_PASS`

---

## 🧪 Prueba Local

```bash
npm run dev
```

El servidor estará en: `http://localhost:8888`

### Probar la función:

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Este es un mensaje de prueba desde el portafolio"
  }'
```

---

## 🌐 Deploy en Netlify (GRATIS)

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/portfolio-backend.git
   git push -u origin main
   ```

2. **Conecta con Netlify**
   - Ve a [app.netlify.com](https://app.netlify.com/)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona GitHub y autoriza
   - Selecciona tu repositorio
   - Click en "Deploy site"

3. **Configurar variables de entorno en Netlify**
   - En tu sitio de Netlify, ve a "Site settings"
   - Click en "Environment variables"
   - Agrega:
     - `EMAIL_USER`: tu-email@gmail.com
     - `EMAIL_PASS`: tu-contraseña-de-aplicacion
   - Click "Save"

4. **Redeploy**
   - Ve a "Deploys" y click en "Trigger deploy"

### Opción 2: Deploy Manual (CLI)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 🔗 Integración con el Frontend

### 1. Actualizar la URL en tu componente React

En `src/Contacto.tsx`, cambia la línea 167:

```typescript
// Antes (desarrollo local)
const response = await fetch('http://localhost:3001/contact', {

// Después (producción con Netlify)
const response = await fetch('https://TU-SITIO.netlify.app/.netlify/functions/contact', {
```

Reemplaza `TU-SITIO` con el nombre de tu sitio en Netlify.

### 2. Para desarrollo local

Crea un archivo `.env.local` en tu frontend:

```env
VITE_API_URL=http://localhost:8888/.netlify/functions
```

Y usa en tu código:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://TU-SITIO.netlify.app/.netlify/functions';

const response = await fetch(`${API_URL}/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.nombre,
    email: formData.email,
    message: `Asunto: ${formData.asunto}\n\n${formData.mensaje}`
  })
});
```

---

## 📧 Usando otros servicios de email

### Outlook/Hotmail

En `netlify/functions/contact.js`, cambia:

```javascript
service: 'gmail',  // Cambiar a 'outlook'
```

### Otros servicios (SendGrid, Mailgun, etc.)

Configura manualmente:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.tuservicio.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## 🐛 Troubleshooting

### Error: "Variables de entorno no configuradas"

- Verifica que `.env` existe y tiene las variables correctas
- En Netlify, verifica en "Site settings" → "Environment variables"

### Error: "Invalid login"

- Verifica que usas una **contraseña de aplicación**, no tu contraseña normal
- Verifica que la verificación en 2 pasos está habilitada en Gmail

### Los emails no llegan

- Revisa la carpeta de Spam
- Verifica que `EMAIL_USER` es el email correcto
- Revisa los logs en Netlify: "Functions" → Click en tu función

### CORS Error en el frontend

- Verifica que la URL en el frontend es correcta
- Verifica que incluyes `https://` en la URL

---

## 📁 Estructura del Proyecto

```
portfolio-backend/
├── netlify/
│   └── functions/
│       └── contact.js          # Función serverless
├── .env.example                # Ejemplo de variables de entorno
├── .gitignore                 # Archivos ignorados por git
├── netlify.toml               # Configuración de Netlify
├── package.json               # Dependencias
└── README.md                  # Esta documentación
```

---

## 💰 Costos

**¡TOTALMENTE GRATIS!**

Netlify ofrece:
- ✅ 125,000 invocaciones de funciones al mes
- ✅ Deploy automático desde GitHub
- ✅ HTTPS incluido
- ✅ Variables de entorno
- ✅ Sin tarjeta de crédito requerida

---

## 🔒 Seguridad

- ✅ Variables de entorno seguras
- ✅ Validación de datos en el servidor
- ✅ CORS configurado
- ✅ Sanitización de inputs
- ✅ Rate limiting de Netlify incluido

---

## 📞 Soporte

Si tienes problemas, revisa:

1. [Documentación de Netlify Functions](https://docs.netlify.com/functions/overview/)
2. [Documentación de Nodemailer](https://nodemailer.com/)
3. Logs en Netlify Dashboard

---

## ✨ Próximos Pasos

1. [ ] Instalar dependencias
2. [ ] Configurar variables de entorno
3. [ ] Probar localmente
4. [ ] Deploy en Netlify
5. [ ] Actualizar URL en el frontend
6. [ ] ¡Probar el formulario!

---

**Desarrollado por Juan Esteban López Moreno**  
Medellín, Colombia 🇨🇴
