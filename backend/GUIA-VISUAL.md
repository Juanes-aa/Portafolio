# 🎨 GUÍA VISUAL PASO A PASO

## 🎯 INSTALACIÓN COMPLETA EN 10 MINUTOS

---

## PARTE 1: CONFIGURACIÓN DEL BACKEND (5 min)

### 📦 PASO 1: Extraer archivos
```
1. Descargar portfolio-backend.7z
2. Extraer en tu carpeta de proyectos
3. Abrir terminal en la carpeta extraída
```

```bash
cd portfolio-backend
```

---

### 📥 PASO 2: Instalar dependencias
```bash
npm install
```

**Salida esperada:**
```
added 50 packages, and audited 51 packages in 3s
✓ Instalación completa
```

---

### 🔐 PASO 3: Configurar email

#### 3.1 Crear archivo .env
```bash
cp .env.example .env
```

#### 3.2 Obtener contraseña de Gmail

**EN NAVEGADOR:**
```
1. Ir a: https://myaccount.google.com/apppasswords
2. Si no tienes verificación en 2 pasos:
   - Ir a: https://myaccount.google.com/security
   - Activar "Verificación en dos pasos"
   - Volver a: https://myaccount.google.com/apppasswords
3. En "Seleccionar app": Elegir "Correo"
4. En "Seleccionar dispositivo": Elegir "Otro"
5. Escribir: "Portfolio Backend"
6. Click "Generar"
7. COPIAR la contraseña de 16 caracteres
```

**Ejemplo de contraseña generada:**
```
abcd efgh ijkl mnop
```

#### 3.3 Editar .env
```bash
nano .env
# o usa tu editor favorito: code .env, vim .env, etc.
```

**Contenido del .env:**
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

**Guardar y cerrar** (Ctrl+X, Y, Enter en nano)

---

### 🧪 PASO 4: Probar localmente

#### 4.1 Iniciar servidor de desarrollo
```bash
npm run dev
```

**Salida esperada:**
```
◈ Netlify Dev ◈
◈ Injected .env file env var overrides
◈ Server listening on http://localhost:8888
```

#### 4.2 Probar la función (nueva terminal)

**Abrir NUEVA terminal** y ejecutar:

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prueba Local",
    "email": "test@example.com",
    "message": "Este es un mensaje de prueba desde mi portafolio. Si estás leyendo esto, el backend funciona correctamente!"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Mensaje enviado exitosamente",
  "success": true
}
```

**✅ VERIFICAR:** Deberías recibir un email en tu bandeja de entrada

---

## PARTE 2: DEPLOY EN NETLIFY (5 min)

### 🌐 PASO 5: Crear cuenta en Netlify

```
1. Ir a: https://app.netlify.com/signup
2. Registrarse con GitHub (recomendado)
3. Autorizar Netlify
```

---

### 📤 PASO 6: Subir a GitHub

#### 6.1 Crear repositorio en GitHub
```
1. Ir a: https://github.com/new
2. Nombre: portfolio-backend
3. Descripción: Backend serverless para mi portafolio
4. Público o Privado (tu elección)
5. NO marcar "Add README"
6. Click "Create repository"
```

#### 6.2 Subir código
```bash
# Inicializar git
git init

# Agregar archivos
git add .

# Commit
git commit -m "Backend serverless con Netlify Functions"

# Conectar con GitHub (copia la URL de tu repo)
git remote add origin https://github.com/TU-USUARIO/portfolio-backend.git

# Subir
git branch -M main
git push -u origin main
```

---

### 🚀 PASO 7: Deploy en Netlify

#### 7.1 Importar proyecto
```
EN NETLIFY:
1. Click "Add new site"
2. Click "Import an existing project"
3. Click "Deploy with GitHub"
4. Autorizar si es necesario
5. Buscar "portfolio-backend"
6. Click en tu repositorio
```

#### 7.2 Configurar build
```
CONFIGURACIÓN AUTOMÁTICA:
✓ Build command: (dejar vacío)
✓ Publish directory: (dejar vacío)
✓ Functions directory: netlify/functions

Click "Deploy site"
```

#### 7.3 Esperar deploy
```
PROGRESO:
1. ⏳ Site deploy in progress
2. ⏳ Building
3. ⏳ Processing
4. ✅ Published

Tiempo estimado: 1-2 minutos
```

---

### 🔧 PASO 8: Configurar variables de entorno

```
EN NETLIFY:
1. Click en tu sitio recién creado
2. Click "Site settings" (en la parte superior)
3. En el menú izquierdo: "Environment variables"
4. Click "Add a variable"
```

**Agregar EMAIL_USER:**
```
Key: EMAIL_USER
Value: tu-email@gmail.com
Scopes: [X] Same value for all deploy contexts
Click "Create variable"
```

**Agregar EMAIL_PASS:**
```
Key: EMAIL_PASS
Value: abcd efgh ijkl mnop (tu contraseña de aplicación)
Scopes: [X] Same value for all deploy contexts
Click "Create variable"
```

---

### 🔄 PASO 9: Redeploy

```
EN NETLIFY:
1. Click "Deploys" (en la parte superior)
2. Click "Trigger deploy"
3. Click "Deploy site"
4. Esperar ~1 minuto
5. ✅ Deploy completo
```

---

### ✅ PASO 10: Obtener URL del backend

```
EN NETLIFY:
1. En la página principal de tu sitio
2. Ver el nombre: algo como "graceful-unicorn-123456"
3. Tu URL será: https://graceful-unicorn-123456.netlify.app

O puedes usar un dominio personalizado:
1. Site settings → Domain management
2. Add custom domain
```

---

## PARTE 3: INTEGRACIÓN CON FRONTEND (2 min)

### 📝 PASO 11: Actualizar frontend

#### Opción A: Cambio Rápido (1 línea)

**Archivo:** `src/Contacto.tsx`  
**Línea:** 167

```typescript
// ❌ ANTES
const response = await fetch('http://localhost:3001/contact', {

// ✅ DESPUÉS
const response = await fetch('https://TU-SITIO.netlify.app/.netlify/functions/contact', {
```

Reemplaza `TU-SITIO` con el nombre de tu sitio en Netlify.

---

#### Opción B: Integración Completa (recomendada)

**Copiar archivos:**
```
Desde: portfolio-backend/frontend-integration/
Hacia: tu-proyecto-frontend/

1. useContactForm.ts → src/hooks/useContactForm.ts
2. Seguir instrucciones en INTEGRATION.md
```

---

### 🧪 PASO 12: Probar en producción

```
1. Deploy tu frontend actualizado
2. Ir a tu portafolio en producción
3. Llenar formulario de contacto
4. Enviar
5. ✅ Verificar que recibes el email
```

---

## 🎉 ¡COMPLETADO!

### Checklist Final

- [X] Backend instalado localmente
- [X] Variables de entorno configuradas
- [X] Prueba local exitosa
- [X] Código en GitHub
- [X] Deploy en Netlify
- [X] Variables en Netlify configuradas
- [X] URL obtenida
- [X] Frontend actualizado
- [X] Formulario probado en producción
- [X] Email recibido correctamente

---

## 📊 RESULTADO

### Lo que tienes ahora:

✅ **Backend serverless** funcionando 24/7
✅ **Emails profesionales** con diseño HTML
✅ **100% gratis** - Sin costos mensuales
✅ **Auto-scaling** - Maneja miles de requests
✅ **HTTPS** - Seguridad incluida
✅ **Deploy automático** - Push y listo
✅ **Monitoreo** - Logs en Netlify
✅ **Sin mantenimiento** - Cero configuración de servidor

---

## 🔧 COMANDOS ÚTILES

### Durante desarrollo:
```bash
# Iniciar servidor local
npm run dev

# Ver logs
netlify functions:list
netlify functions:invoke contact
```

### Deploy:
```bash
# Deploy manual
netlify deploy --prod

# Ver estado
netlify status

# Ver logs
netlify logs
```

---

## 📸 CAPTURAS ESPERADAS

### Email recibido:
```
De: tu-email@gmail.com
Para: tu-email@gmail.com
Asunto: 🔔 Nuevo mensaje de contacto - Portafolio

[Email HTML con diseño profesional]
- Gradiente rojo (#E63946 → #9B2226)
- Nombre del contacto
- Email del contacto  
- Mensaje formateado
- Footer con tu marca
```

### Panel de Netlify:
```
✅ Functions deployed: 1
✅ contact.js - Active
✅ Last deployed: 2 minutes ago
✅ Status: Published
```

---

## 🆘 SOLUCIÓN RÁPIDA DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| "Invalid login" | Usa contraseña de aplicación, no normal |
| "Failed to fetch" | Verifica URL en frontend |
| "Module not found" | `npm install` en backend |
| No llegan emails | Revisa spam, verifica variables en Netlify |
| CORS error | Actualiza headers en contact.js |

---

## 📞 SIGUIENTE NIVEL

### Mejoras opcionales:

1. **Dominio personalizado**
   - Site settings → Domain management
   - Agregar tu dominio

2. **Notificaciones**
   - Site settings → Build & deploy → Deploy notifications
   - Email/Slack cuando hay deploy

3. **Analytics**
   - Netlify Analytics (básico gratis)
   - Google Analytics (si quieres)

4. **Backup automático**
   - Ya está en GitHub
   - Branches para testing

---

**¡Felicidades! Tu portafolio ahora tiene un sistema de contacto profesional.** 🎉

---

**Desarrollado por Juan Esteban López Moreno**  
**Medellín, Colombia 🇨🇴**
