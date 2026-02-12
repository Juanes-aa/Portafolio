# ⚡ INICIO RÁPIDO - 5 Minutos

## 🎯 Lo que vas a lograr

Tener un formulario de contacto funcionando 100% GRATIS con Netlify.

---

## 📋 Paso 1: Preparar el Backend (2 min)

```bash
# 1. Ir a la carpeta del backend
cd portfolio-backend

# 2. Instalar dependencias
npm install

# 3. Configurar email
cp .env.example .env
nano .env  # o usa tu editor favorito
```

En `.env`, configura:
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Contraseña de aplicación de Gmail
```

### 🔑 Obtener contraseña de Gmail (1 min)

1. Ve a: https://myaccount.google.com/apppasswords
2. Genera una contraseña para "Correo"
3. Cópiala en `.env`

---

## 🧪 Paso 2: Probar Localmente (1 min)

```bash
npm run dev
```

Abre otro terminal y prueba:

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "message": "Mensaje de prueba desde mi portafolio"
  }'
```

✅ Si recibes un email, ¡funciona!

---

## 🚀 Paso 3: Deploy en Netlify (2 min)

### Opción A: Desde GitHub (Recomendado)

```bash
# 1. Crear repo en GitHub
git init
git add .
git commit -m "Backend para portafolio"
git remote add origin https://github.com/TU-USUARIO/portfolio-backend.git
git push -u origin main

# 2. En Netlify (https://app.netlify.com)
# - "Add new site" → "Import from Git"
# - Selecciona tu repo
# - Deploy!

# 3. Configurar variables de entorno en Netlify
# - Site settings → Environment variables
# - Add: EMAIL_USER = tu-email@gmail.com
# - Add: EMAIL_PASS = tu-contraseña-de-aplicación
# - Save

# 4. Redeploy
# - Deploys → Trigger deploy
```

### Opción B: Deploy Manual

```bash
netlify login
netlify deploy --prod
```

---

## 🎨 Paso 4: Conectar con el Frontend

### Opción Fácil (Copiar y Pegar)

En `src/Contacto.tsx` línea 167, cambia:

```typescript
// ❌ Antes
const response = await fetch('http://localhost:3001/contact', {

// ✅ Después - Reemplaza TU-SITIO por el nombre de tu sitio en Netlify
const response = await fetch('https://TU-SITIO.netlify.app/.netlify/functions/contact', {
```

### Opción Avanzada (Mejor)

1. Copia `frontend-integration/useContactForm.ts` a `src/hooks/`
2. Actualiza `Contacto.tsx` según `frontend-integration/INTEGRATION.md`

---

## ✅ Verificación Final

1. ✅ Backend corriendo en Netlify
2. ✅ Variables de entorno configuradas
3. ✅ Frontend actualizado con la URL
4. ✅ Prueba enviando un mensaje desde tu portafolio
5. ✅ Verifica que el email llegó a tu bandeja

---

## 🎉 ¡Listo!

Tu formulario de contacto está funcionando:
- ✅ 100% Gratis
- ✅ Sin servidor
- ✅ HTTPS incluido
- ✅ Emails profesionales

---

## 🆘 Problemas?

### "Invalid login" al enviar email
→ Usa contraseña de aplicación, no tu contraseña normal

### "Failed to fetch"
→ Verifica la URL en el frontend

### Emails no llegan
→ Revisa spam, verifica EMAIL_USER en Netlify

### Más ayuda
→ Lee el `README.md` completo

---

**¡Éxito! 🚀**

*Desarrollado por Juan Esteban López Moreno*
