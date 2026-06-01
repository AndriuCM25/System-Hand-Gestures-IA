# 🚀 Guía de Deployment

## Opciones de Deployment

### 1. Vercel (Recomendado)

**Ventajas**:
- Deploy automático desde Git
- SSL gratuito
- CDN global
- Optimización automática

**Pasos**:

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

**Configuración** (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Netlify

**Pasos**:

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy

# 4. Deploy a producción
netlify deploy --prod
```

**Configuración** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

**Pasos**:

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agregar scripts en package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 3. Configurar base en vite.config.js
export default defineConfig({
  base: '/handcontrol-ai/',
  // ...
})

# 4. Deploy
npm run deploy
```

### 4. Docker

**Dockerfile**:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Comandos**:

```bash
# Build
docker build -t handcontrol-ai .

# Run
docker run -p 80:80 handcontrol-ai
```

## Variables de Entorno

Crear archivo `.env`:

```env
# API Configuration
VITE_API_URL=https://api.handcontrol-ai.com
VITE_API_KEY=your_api_key_here

# Supabase (si se usa)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REPORTS=true
```

## Optimizaciones de Producción

### 1. Vite Config

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts'],
          'animations': ['framer-motion'],
          'ai': ['@mediapipe/hands', '@tensorflow/tfjs']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 2. Lazy Loading

```javascript
// App.jsx
import { lazy, Suspense } from 'react';
import Loader from './components/Loader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const GesturePage = lazy(() => import('./pages/GesturePage'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gesture" element={<GesturePage />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. Image Optimization

```bash
# Instalar plugin
npm install vite-plugin-imagemin -D
```

```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: { plugins: [{ removeViewBox: false }] }
    })
  ]
});
```

## Performance

### Lighthouse Score Objetivo

- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >90
- **SEO**: >90

### Optimizaciones

1. **Code Splitting**: ✅ Implementado
2. **Lazy Loading**: ✅ Recomendado
3. **Image Optimization**: ⚠️ Pendiente
4. **Caching**: ✅ Automático con Vite
5. **Compression**: ✅ Gzip/Brotli en servidor

## Monitoreo

### 1. Google Analytics

```javascript
// src/utils/analytics.js
export const initGA = () => {
  if (import.meta.env.VITE_GA_TRACKING_ID) {
    // Inicializar GA
  }
};

export const logPageView = () => {
  // Log page view
};
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE
});
```

## CI/CD

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Seguridad

### Headers de Seguridad

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Checklist Pre-Deploy

- [ ] Todas las dependencias instaladas
- [ ] Build exitoso sin errores
- [ ] Tests pasando (si existen)
- [ ] Variables de entorno configuradas
- [ ] Imágenes optimizadas
- [ ] Meta tags SEO configurados
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] SSL/HTTPS habilitado
- [ ] Dominio personalizado configurado (opcional)

## Post-Deploy

1. **Verificar funcionalidad**
   - Probar todos los gestos
   - Verificar cámara funciona
   - Revisar todas las páginas

2. **Performance**
   - Ejecutar Lighthouse
   - Verificar tiempos de carga
   - Revisar métricas Core Web Vitals

3. **Monitoreo**
   - Configurar alertas
   - Revisar logs
   - Monitorear errores

## Soporte

Para problemas de deployment:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Vite Docs](https://vitejs.dev/guide/)

---

**Nota**: Asegúrate de probar en diferentes navegadores y dispositivos antes del deploy final.
