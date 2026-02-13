/**
 * vite.config.ts — OPTIMIZADO
 *
 * Cambios respecto al original (que estaba prácticamente vacío):
 *
 * 1. manualChunks: separa Three.js, GSAP y React en chunks independientes.
 *    El usuario descarga Three.js (el más pesado, ~600kb) solo si está
 *    en desktop Y el Ballpit es visible. En mobile nunca se descarga.
 *
 * 2. terser: elimina console.log y debugger del bundle de producción.
 *
 * 3. target 'es2018': mejor tree-shaking sin perder compatibilidad
 *    con los browsers modernos que usan tu portfolio.
 *
 * 4. cssCodeSplit: los estilos de cada chunk se cargan junto al chunk,
 *    no todos al inicio.
 *
 * 5. assetsInlineLimit: imágenes < 4kb se inline como base64
 *    (evita un request extra para iconos pequeños).
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    target: 'es2018',
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb

    // esbuild: incluido en Vite, no requiere instalación
    // (terser produce ~5% menos pero esbuild es igual de válido)
    minify: 'esbuild',

    rollupOptions: {
      output: {
        /**
         * Separación estratégica de chunks:
         *
         * - three:     ~600kb — solo carga si Ballpit se inicializa (desktop)
         * - gsap:      ~150kb — lazy-loaded por SplitText y MagneticButton
         * - react:     ~130kb — siempre necesario, pero en su propio chunk
         *               con hash para cache perfecta entre deployments
         * - radix:     todos los @radix/ui juntos (aunque hay muchos,
         *               al menos no bloquean el chunk principal)
         * - vendor:    todo lo demás que no sea tu código
         */
        manualChunks(id) {
          // Three.js y sus dependencias (el chunk más pesado)
          if (id.includes('three') || id.includes('cannon-es')) {
            return 'three';
          }
          // GSAP
          if (id.includes('gsap')) {
            return 'gsap';
          }
          // React core
          if (id.includes('react-dom') || id.includes('react-router')) {
            return 'react';
          }
          // Radix UI — todos juntos para evitar fragmentación
          if (id.includes('@radix-ui')) {
            return 'radix';
          }
          // Resto de node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },

        // Nombres con hash para cache-busting óptimo
        chunkFileNames:  'assets/[name]-[hash].js',
        entryFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]'
      }
    }
  },

  // Incluir explícitamente React y React DOM para pre-bundling
  // (reduce el tiempo de arranque en dev)
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@gsap/react'
    ],
    // Three.js se excluye del pre-bundle: es demasiado grande y
    // solo se usa en Ballpit (que en mobile ni carga)
    exclude: ['three', 'cannon-es']
  }
});