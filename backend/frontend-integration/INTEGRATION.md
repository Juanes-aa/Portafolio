# 🎨 Guía de Integración Frontend

## 📁 Archivos a copiar a tu proyecto frontend

### 1. Hook personalizado

**Ubicación:** `src/hooks/useContactForm.ts`

Copia el archivo `useContactForm.ts` a tu carpeta `src/hooks/` en el proyecto frontend.

### 2. Variables de entorno (Opcional para desarrollo)

**Ubicación:** `.env.local` (raíz del proyecto frontend)

```env
VITE_API_URL=http://localhost:8888/.netlify/functions
```

⚠️ **Importante:** Solo necesario si quieres probar localmente con el backend de Netlify.

---

## 🔧 Actualización de Contacto.tsx

### Opción A: Usar el hook personalizado (Recomendado)

```typescript
import { useContactForm } from './hooks/useContactForm';

const Contacto: React.FC = () => {
  const { isSubmitting, submitStatus, errorMessage, submitForm, resetForm } = useContactForm();
  
  // ... resto del código
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await submitForm({
      name: formData.nombre,
      email: formData.email,
      message: `Asunto: ${formData.asunto}\n\n${formData.mensaje}`
    });

    if (submitStatus === 'success') {
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    }
  };
};
```

### Opción B: Cambio mínimo (Solo cambiar la URL)

En la línea 167 de `src/Contacto.tsx`, reemplaza:

```typescript
// ❌ Antes
const response = await fetch('http://localhost:3001/contact', {

// ✅ Después
const API_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';
const response = await fetch(`${API_URL}/contact`, {
```

---

## 🚀 Configuración del proyecto completo

### 1. Estructura de carpetas recomendada

```
tu-proyecto/
├── backend/                    # Carpeta del backend
│   ├── netlify/
│   │   └── functions/
│   │       └── contact.js
│   ├── .env
│   ├── netlify.toml
│   └── package.json
│
├── src/                        # Frontend
│   ├── hooks/
│   │   └── useContactForm.ts   # ← Copiar aquí
│   ├── components/
│   ├── Contacto.tsx            # ← Actualizar
│   └── ...
│
├── .env.local                  # ← Solo para desarrollo local
└── package.json
```

### 2. Deploy conjunto en Netlify

**Opción 1: Mismo repositorio (Monorepo)**

En `netlify.toml`:

```toml
[build]
  base = "/"
  publish = "dist"
  command = "npm run build"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Opción 2: Repositorios separados**

- Frontend: Deploy normal en Netlify
- Backend: Deploy como funciones serverless

---

## 🧪 Probar localmente (Frontend + Backend)

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run dev
# Servidor en http://localhost:8888
```

### Terminal 2 - Frontend

```bash
npm run dev
# Servidor en http://localhost:5173
```

Crea `.env.local` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:8888/.netlify/functions
```

---

## 📦 Deploy en producción

### Si usas el mismo dominio (Recomendado)

1. Sube todo el código (frontend + carpeta netlify/) a GitHub
2. Conecta con Netlify
3. Netlify automáticamente:
   - Construye el frontend
   - Despliega las funciones
   - Todo en el mismo dominio

### Si usas dominios separados

Actualiza la URL en el hook:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  'https://tu-backend.netlify.app/.netlify/functions';
```

Y agrega CORS en `contact.js`:

```javascript
'Access-Control-Allow-Origin': 'https://tu-frontend.com'
```

---

## ✅ Checklist de integración

- [ ] Copiar `useContactForm.ts` a `src/hooks/`
- [ ] Actualizar `Contacto.tsx` con el nuevo código
- [ ] Crear `.env.local` para desarrollo (opcional)
- [ ] Probar localmente
- [ ] Verificar que funciona en desarrollo
- [ ] Deploy a producción
- [ ] Configurar variables de entorno en Netlify
- [ ] Probar el formulario en producción

---

## 🆘 Problemas comunes

### Error: "Module not found: useContactForm"

Verifica que copiaste el archivo a `src/hooks/useContactForm.ts`

### Error: "Failed to fetch"

- Verifica que el backend está corriendo (`npm run dev` en la carpeta backend)
- Verifica la URL en `.env.local`
- Revisa la consola del navegador para más detalles

### Formulario no envía en producción

- Verifica que configuraste las variables de entorno en Netlify
- Revisa los logs de la función en Netlify Dashboard

---

## 💡 Tips

1. **En desarrollo:** Usa `.env.local` con la URL local
2. **En producción:** Netlify maneja todo automáticamente
3. **Seguridad:** Nunca expongas tu `.env` en Git
4. **Testing:** Prueba primero localmente antes de deployar

---

**¿Necesitas ayuda?** Revisa el README.md principal del backend.
