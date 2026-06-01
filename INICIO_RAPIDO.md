# 🚀 INICIO RÁPIDO - HandControl AI v3.0.0

## ⚡ Empezar en 3 Pasos

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Iniciar Desarrollo
```bash
npm run dev
```

### 3️⃣ Abrir en Navegador
```
http://localhost:5173
```

---

## 🎯 Comandos Disponibles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo
```

### Producción
```bash
npm run build        # Compilar para producción
npm run preview      # Vista previa de producción
```

### Utilidades
```bash
npm run lint         # Verificar código
npm run clean        # Limpiar cache
```

---

## 📱 Probar en Diferentes Dispositivos

### Desktop
- Abrir en navegador normal
- Resolución recomendada: 1920x1080

### Mobile
- Abrir DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Seleccionar dispositivo móvil

### Tablet
- Usar DevTools
- Seleccionar iPad o similar

---

## 🎮 Probar Gestos

### 1. Ir a la Página de Gestos
```
http://localhost:5173/gesture
```

### 2. Permitir Acceso a Cámara
- Click en "Iniciar Sistema"
- Permitir acceso a cámara

### 3. Probar Gestos
- ✋ Mano Abierta - Activar
- 👊 Puño Cerrado - Pausar
- 👍 Pulgar Arriba - Confirmar
- ✌️ Dos Dedos - Menú
- 👉 Mano Derecha - Siguiente
- 👈 Mano Izquierda - Anterior

---

## 📊 Ver Dashboard

### 1. Login
```
http://localhost:5173/login
```

### 2. Credenciales Demo
- Usuario: `admin_demo` o `operator_demo`
- Contraseña: `demo123`

### 3. Explorar
- Dashboard con estadísticas
- Gráficos en tiempo real
- Historial de gestos
- Analytics

---

## 🔧 Verificar Performance

### 1. Abrir DevTools
```
F12 o Ctrl+Shift+I
```

### 2. Ir a Lighthouse
```
Lighthouse tab → Generate report
```

### 3. Verificar Métricas
- Performance: ~92
- Accessibility: ~95
- Best Practices: ~100
- SEO: ~100

---

## 📚 Documentación

### Guías Principales
- `README.md` - Información general
- `RESUMEN_EJECUTIVO.md` - Resumen de mejoras
- `MEJORAS_PRODUCCION.md` - Detalles técnicos

### Guías Específicas
- `GETTING_STARTED.md` - Guía completa
- `DEPLOYMENT.md` - Deploy a producción
- `CHANGELOG_V3.md` - Cambios v3.0.0

---

## 🐛 Solución de Problemas

### Error: Puerto en Uso
```bash
# Cambiar puerto en vite.config.js
server: {
  port: 3000
}
```

### Error: Cámara No Funciona
- Verificar permisos del navegador
- Usar HTTPS o localhost
- Verificar que la cámara no esté en uso

### Error: Build Falla
```bash
# Limpiar cache y reinstalar
npm run clean
rm -rf node_modules
npm install
npm run build
```

---

## 🎨 Personalizar

### Cambiar Colores
```css
/* src/index.css */
:root {
  --primary: #00d9ff;
  --secondary: #0099ff;
}
```

### Cambiar Logo
```jsx
/* src/components/Navbar.jsx */
<FaHandPaper className="text-3xl text-primary" />
```

### Cambiar Gestos
```javascript
/* src/hooks/useHandDetection.js */
const GESTURES = {
  // Agregar nuevos gestos aquí
}
```

---

## 📱 Responsive Testing

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Probar en Chrome DevTools
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

### Dispositivos Recomendados
- iPhone 12 Pro (390x844)
- iPad Air (820x1180)
- Desktop (1920x1080)

---

## 🚀 Deploy Rápido

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

### GitHub Pages
```bash
npm run build
# Push carpeta dist/ a gh-pages branch
```

---

## 🎯 Checklist Inicial

- [ ] Instalar dependencias (`npm install`)
- [ ] Iniciar desarrollo (`npm run dev`)
- [ ] Probar en navegador
- [ ] Permitir acceso a cámara
- [ ] Probar gestos
- [ ] Verificar responsive
- [ ] Revisar dashboard
- [ ] Verificar performance

---

## 💡 Tips

### Performance
- Usar Chrome para mejor performance
- Cerrar otras pestañas
- Usar modo incógnito para testing

### Desarrollo
- Usar React DevTools
- Verificar console para errores
- Usar Lighthouse regularmente

### Testing
- Probar en diferentes navegadores
- Probar en diferentes dispositivos
- Probar con diferentes resoluciones

---

## 📞 Ayuda

### Documentación
- Ver `README.md` para más info
- Ver `RESUMEN_EJECUTIVO.md` para resumen
- Ver `MEJORAS_PRODUCCION.md` para detalles

### Problemas Comunes
- Cámara no funciona → Verificar permisos
- Página lenta → Verificar performance
- Errores de build → Limpiar cache

---

## 🎉 ¡Listo!

**HandControl AI v3.0.0** está listo para usar.

### Próximos Pasos
1. Explorar la aplicación
2. Probar todos los gestos
3. Revisar el dashboard
4. Verificar responsive
5. Deployar a producción

---

**¡Disfruta de HandControl AI! 🚀**

*Desarrollado con ❤️ por HandControl AI Team*
