# 🔗 INTEGRACIÓN COMPLETA - FRONTEND + BACKEND

## 🎯 Objetivo

Conectar tu portafolio con el backend serverless para que el formulario de contacto funcione.

---

## 📋 Dos Escenarios

### Escenario A: Frontend y Backend en el mismo dominio (Recomendado)
✅ Más simple  
✅ Sin problemas de CORS  
✅ Una sola configuración  

### Escenario B: Frontend y Backend en dominios diferentes
⚠️ Requiere configuración de CORS  
⚠️ Dos deploys separados  

---

## 🚀 ESCENARIO A: Mismo Dominio (Monorepo)

### Estructura del Proyecto

```
mi-portafolio/
├── netlify/                    # Backend
│   └── functions/
│       └── contact.js
├── src/                        # Frontend
│   ├── components/
│   ├── hooks/
│   │   └── useContactForm.ts  ← Ya configurado ✅
│   ├── App.tsx
│   └── Contacto.tsx
├── public/
├── netlify.toml               # Config Netlify
├── package.json               # Frontend deps
└── .env                       # Variables backend
```

### Paso 1: Configuración de Netlify

**Archivo:** `netlify.toml` (en la raíz)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### Paso 2: Verificar useContactForm

**Archivo:** `src/hooks/useContactForm.ts`

El código ya está configurado correctamente:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/.netlify/functions'      // ← Producción: mismo dominio
    : 'http://localhost:8888/.netlify/functions'); // ← Desarrollo
```

✅ **No necesitas cambiar nada**

### Paso 3: Testing Local

**Terminal 1 - Backend:**
```bash
cd netlify/functions
npm install
netlify dev
# Servidor: http://localhost:8888
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Servidor: http://localhost:5173
```

**Probar:**
1. Ir a http://localhost:5173/contacto
2. Llenar formulario
3. Enviar
4. ✅ Deberías recibir un email

### Paso 4: Deploy a Netlify

```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Portfolio completo"
git remote add origin https://github.com/TU-USUARIO/portfolio.git
git push -u origin main

# 2. Conectar en Netlify
# - app.netlify.com
# - "New site from Git"
# - Seleccionar repo
# - Build command: npm run build
# - Publish directory: dist
# - Functions directory: netlify/functions

# 3. Configurar variables de entorno en Netlify
# Site settings → Environment variables
# EMAIL_USER = tu-email@gmail.com
# EMAIL_PASS = contraseña-de-aplicacion

# 4. Deploy!
```

**✅ Listo!** Tu formulario funcionará en `https://tu-sitio.netlify.app`

---

## 🌐 ESCENARIO B: Dominios Separados

### Si tienes:
- Frontend: `https://mi-portfolio.com`
- Backend: `https://api-portfolio.netlify.app`

### Paso 1: Configurar CORS en Backend

**Archivo:** `netlify/functions/contact.js` línea 30

```javascript
const headers = {
  'Access-Control-Allow-Origin': 'https://mi-portfolio.com', // ← Tu dominio frontend
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};
```

### Paso 2: Actualizar useContactForm

**Archivo:** `src/hooks/useContactForm.ts` línea 14

```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  'https://api-portfolio.netlify.app/.netlify/functions';
```

### Paso 3: Variables de Entorno (Frontend)

**Archivo:** `.env.production`

```env
VITE_API_URL=https://api-portfolio.netlify.app/.netlify/functions
```

En Netlify (Site settings → Environment variables):
```
Key: VITE_API_URL
Value: https://api-portfolio.netlify.app/.netlify/functions
```

---

## 🧪 Testing Completo

### Test 1: Desarrollo Local

**Backend corriendo:**
```bash
cd backend
npm run dev
```

**Frontend corriendo:**
```bash
cd frontend
npm run dev
```

**Probar:**
```bash
# Abrir navegador en http://localhost:5173/contacto
# Llenar formulario
# Click "Enviar mensaje"
# Verificar email recibido ✅
```

### Test 2: Producción

**Probar en:**
```
https://tu-sitio.netlify.app/contacto
```

**Verificar:**
1. Formulario se muestra correctamente
2. Validación funciona (errores en rojo)
3. Al enviar, muestra "Enviando..."
4. Mensaje de éxito aparece
5. Email llega a tu bandeja ✅

---

## 🔍 Debugging

### Ver logs del backend

**Netlify Dashboard:**
```
Tu sitio → Functions → contact → Logs
```

### Ver errores del frontend

**Consola del navegador (F12):**
```
Network → contact → Response
```

### Error común: "Failed to fetch"

**Causas:**
1. Backend no está corriendo
2. URL incorrecta
3. CORS mal configurado

**Solución:**
```javascript
// En useContactForm.ts, agregar console.log:
console.log('API_URL:', API_URL);
console.log('Calling:', `${API_URL}/contact`);
```

### Error común: "Invalid login"

**Backend:**
```
Variables EMAIL_USER y EMAIL_PASS mal configuradas
```

**Solución:**
1. Verificar .env en local
2. Verificar variables en Netlify
3. Usar contraseña de aplicación, no normal

---

## 📊 Flujo Completo

```
Usuario                Frontend              Backend              Gmail
  |                      |                      |                    |
  |-- Llena formulario -->                      |                    |
  |                      |-- Valida datos ------>                     |
  |                      |                      |                    |
  |                      |-- POST /contact ---->                     |
  |                      |                      |-- Valida datos -->  |
  |                      |                      |-- Envía email ---->|
  |                      |                      |                    |
  |                      |<---- 200 OK ---------                     |
  |<- Mensaje éxito ---  |                      |                    |
  |                      |                      |                    |
  |                                             |                    |
  ✅ Ve confirmación                            |                    |
                                                |                    |
                                                ✅ Email en bandeja  |
```

---

## 🎯 Checklist de Integración

### Backend
- [ ] `netlify/functions/contact.js` existe
- [ ] `netlify.toml` configurado
- [ ] Variables de entorno configuradas
- [ ] Prueba local exitosa (`netlify dev`)
- [ ] Deploy en Netlify exitoso
- [ ] Variables en Netlify configuradas

### Frontend
- [ ] `src/hooks/useContactForm.ts` existe
- [ ] `src/Contacto.tsx` usa el hook
- [ ] URL del backend correcta
- [ ] Prueba local exitosa
- [ ] Deploy exitoso
- [ ] Sin errores en consola

### Testing
- [ ] Formulario se muestra
- [ ] Validación funciona
- [ ] Mensaje se envía
- [ ] Confirmación aparece
- [ ] Email se recibe
- [ ] Sin errores en logs

---

## 🚨 Solución de Problemas

### Problema: CORS Error

**Error en consola:**
```
Access to fetch has been blocked by CORS policy
```

**Solución:**
```javascript
// En contact.js, agregar tu dominio:
'Access-Control-Allow-Origin': 'https://tu-dominio.com'
```

### Problema: 404 Not Found

**Error:**
```
POST https://tu-sitio.netlify.app/.netlify/functions/contact 404
```

**Verificar:**
1. Carpeta `netlify/functions/` existe
2. `netlify.toml` configurado
3. Deploy exitoso con funciones

### Problema: 500 Internal Error

**Verificar:**
1. Logs en Netlify Functions
2. Variables de entorno configuradas
3. Sintaxis correcta en contact.js

---

## 📈 Optimizaciones

### Caché de respuestas

```typescript
// En useContactForm.ts
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

const response = await fetch(`${API_URL}/contact`, {
  signal: controller.signal,
  // ...
});
```

### Retry automático

```typescript
const submitFormWithRetry = async (data: ContactFormData, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await submitForm(data);
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### Rate limiting

Ya incluido por Netlify (125,000 requests/mes)

---

## 🎉 ¡Completado!

Ahora tienes:
- ✅ Frontend y backend integrados
- ✅ Formulario funcionando
- ✅ Emails llegando
- ✅ Todo deployado y funcionando

---

**¿Preguntas?** Revisa:
- README.md del frontend
- README.md del backend
- Logs en Netlify Dashboard

**Desarrollado por Juan Esteban López Moreno**  
Medellín, Colombia 🇨🇴
