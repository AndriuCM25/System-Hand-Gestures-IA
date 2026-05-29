# 🚀 Getting Started - HandControl AI

## Inicio Rápido

### 1. Instalación

```bash
# Clonar o navegar al directorio del proyecto
cd handcontrol-ai

# Instalar dependencias (si no están instaladas)
npm install
```

### 2. Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El proyecto estará disponible en:
# http://localhost:5173
```

### 3. Build para Producción

```bash
# Compilar proyecto
npm run build

# Preview del build
npm run preview
```

## 📱 Navegación del Sistema

### Páginas Principales

1. **Landing Page** (`/`)
   - Página de inicio con información del proyecto
   - Estadísticas impresionantes
   - Casos de uso
   - CTA para iniciar sistema

2. **Login** (`/login`)
   - Sistema de autenticación
   - Roles: Administrador / Operador
   - Diseño futurista con glassmorphism

3. **Dashboard** (`/dashboard`)
   - Vista general del sistema
   - KPIs en tiempo real
   - Gráficos de tendencias
   - Actividad reciente

4. **IA Gestual** (`/gesture`)
   - **PÁGINA PRINCIPAL** del sistema
   - Cámara en tiempo real
   - Detección de gestos
   - Guía de gestos disponibles

5. **Historial** (`/history`)
   - Registro completo de gestos
   - Búsqueda y filtros
   - Exportación a CSV

6. **Analytics** (`/analytics`)
   - Análisis profundo de datos
   - Gráficos de accesibilidad
   - Métricas de rendimiento
   - Insights y proyecciones

7. **Reportes** (`/reports`)
   - Generación de reportes PDF/Excel
   - Reportes personalizados
   - Historial de reportes

8. **Configuración** (`/settings`)
   - Ajustes de IA
   - Configuración de cámara
   - Sonidos y notificaciones
   - Preferencias generales

## 🎮 Cómo Usar el Sistema de Gestos

### Paso 1: Acceder al Módulo de IA

1. Ir a la página de Login (`/login`)
2. Ingresar credenciales (cualquier usuario/contraseña funciona en demo)
3. Navegar a "IA Gestual" desde el sidebar

### Paso 2: Activar la Cámara

1. Click en el botón "Iniciar Sistema"
2. Permitir acceso a la cámara cuando el navegador lo solicite
3. Esperar a que el sistema de IA se inicialice

### Paso 3: Realizar Gestos

Coloca tu mano frente a la cámara y realiza los siguientes gestos:

| Gesto | Cómo Hacerlo | Acción |
|-------|--------------|--------|
| ✋ **Mano Abierta** | Extiende todos los dedos | Activar sistema |
| 👊 **Puño Cerrado** | Cierra la mano completamente | Pausar |
| 👍 **Pulgar Arriba** | Solo pulgar extendido | Confirmar |
| ✌️ **Dos Dedos** | Índice y medio extendidos | Abrir menú |
| 👉 **Apuntar Derecha** | Solo índice extendido hacia derecha | Siguiente |
| 👈 **Apuntar Izquierda** | Solo índice extendido hacia izquierda | Anterior |

### Consejos para Mejor Detección

✅ **Hacer**:
- Usa buena iluminación
- Mantén la mano a 50-100 cm de la cámara
- Realiza gestos claros y definidos
- Mantén el gesto por 1-2 segundos
- Usa un fondo uniforme si es posible

❌ **Evitar**:
- Movimientos bruscos
- Iluminación muy tenue
- Fondos muy complejos
- Gestos ambiguos
- Mano fuera del cuadro

## 🎨 Características Visuales

### Efectos Implementados

- **Glassmorphism**: Efectos de vidrio esmerilado en tarjetas
- **Neon Glow**: Brillos cyan/azul en elementos interactivos
- **Partículas Animadas**: Fondo holográfico con partículas flotantes
- **Scanner Effect**: Línea de escaneo en la cámara
- **Smooth Animations**: Transiciones fluidas con Framer Motion
- **HUD Futurista**: Interfaz tipo ciencia ficción

### Paleta de Colores

```css
Primary: #00d9ff (Cyan)
Secondary: #0099ff (Blue)
Dark: #0a0e27
Darker: #050816
Success: #4ade80 (Green)
Warning: #facc15 (Yellow)
Error: #ef4444 (Red)
```

## 📊 Data Science (Fase 1)

Para implementar la fase de Data Science:

1. Consultar `DATA_SCIENCE.md` para instrucciones detalladas
2. Obtener datasets de accesibilidad
3. Limpiar datos con Pandas
4. Generar los 3 gráficos obligatorios:
   - Líneas (tendencia temporal)
   - Barras (comparación por tipo)
   - Circular (distribución porcentual)

## 🤖 Entrenamiento IA (Fase 2)

Para entrenar tu propio modelo:

1. Consultar `AI_TRAINING.md` para guía completa
2. Usar Google Teachable Machine
3. Capturar 150-300 imágenes por gesto
4. Entrenar modelo
5. Exportar a TensorFlow.js
6. Integrar en el proyecto

**Nota**: El proyecto actual usa MediaPipe Hands para detección en tiempo real, que es más eficiente que clasificación de imágenes.

## 🔧 Troubleshooting

### La cámara no funciona

**Solución**:
- Verificar permisos del navegador
- Usar HTTPS o localhost
- Revisar que no haya otra app usando la cámara
- Probar en otro navegador (Chrome recomendado)

### Los gestos no se detectan

**Solución**:
- Mejorar iluminación
- Acercar/alejar la mano
- Hacer gestos más claros
- Verificar que la mano esté completamente visible

### El build falla

**Solución**:
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar caché de Vite
npm run build -- --force
```

### Errores de Tailwind CSS

**Solución**:
- El proyecto usa Tailwind CSS v4
- Verificar que `@tailwindcss/postcss` esté instalado
- Revisar `postcss.config.js` y `tailwind.config.js`

## 📦 Estructura de Archivos Importante

```
handcontrol-ai/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── GestureCamera.jsx    # ⭐ Componente principal de cámara
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── context/
│   │   └── GestureContext.jsx   # ⭐ Estado global de gestos
│   ├── hooks/
│   │   └── useHandDetection.js  # ⭐ Lógica de detección
│   ├── pages/
│   │   ├── GesturePage.jsx      # ⭐ Página principal de IA
│   │   ├── Dashboard.jsx
│   │   └── ...
│   └── utils/
│       ├── constants.js         # Constantes del sistema
│       └── helpers.js           # Funciones auxiliares
├── public/                  # Archivos estáticos
├── DATA_SCIENCE.md         # Guía de Data Science
├── AI_TRAINING.md          # Guía de entrenamiento IA
├── DEPLOYMENT.md           # Guía de deployment
└── README.md               # Documentación principal
```

## 🎯 Próximos Pasos

1. **Explorar el Sistema**
   - Navegar por todas las páginas
   - Probar el sistema de gestos
   - Revisar los gráficos y estadísticas

2. **Personalizar**
   - Modificar colores en `tailwind.config.js`
   - Agregar más gestos en `useHandDetection.js`
   - Personalizar textos y contenido

3. **Implementar Backend** (Opcional)
   - Crear API con Node.js/Express
   - Conectar con Supabase
   - Guardar datos reales

4. **Deploy**
   - Seguir guía en `DEPLOYMENT.md`
   - Deploy en Vercel/Netlify
   - Configurar dominio personalizado

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- [Recharts](https://recharts.org/)

## 💡 Tips para la Presentación

1. **Demo en Vivo**
   - Preparar buena iluminación
   - Practicar los gestos antes
   - Tener backup de video por si falla

2. **Storytelling**
   - Empezar con el problema (accesibilidad)
   - Mostrar datos (Data Science)
   - Presentar la solución (HandControl AI)
   - Demo impactante
   - Conclusiones y futuro

3. **Aspectos a Destacar**
   - Interfaz futurista y profesional
   - IA en tiempo real
   - Impacto social (accesibilidad)
   - Escalabilidad
   - Casos de uso reales

## 🆘 Soporte

Si encuentras problemas:

1. Revisar la documentación en los archivos `.md`
2. Verificar la consola del navegador para errores
3. Revisar los logs del servidor de desarrollo
4. Consultar la documentación oficial de las librerías

---

**¡Listo para controlar el futuro con tus manos!** ✋🤖

Desarrollado con ❤️ usando React, Vite, Tailwind CSS, MediaPipe y TensorFlow.js
