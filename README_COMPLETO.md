# 📘 HandControl AI - Documentación Completa

## Sistema Inteligente de Navegación por Gestos

**Versión:** 3.1.0  
**Autor:** HandControl AI Team  
**Fecha:** Mayo 2026  
**Licencia:** MIT

---

## 📋 Tabla de Contenidos

### PARTE 1: FRONTEND
1. [Introducción al Frontend](#1-introducción-al-frontend)
2. [Arquitectura Frontend](#2-arquitectura-frontend)
3. [Tecnologías Frontend](#3-tecnologías-frontend)
4. [Componentes Principales](#4-componentes-principales)
5. [Hooks Personalizados](#5-hooks-personalizados)
6. [Context API](#6-context-api)
7. [Páginas y Rutas](#7-páginas-y-rutas)
8. [Sistema de Carga](#8-sistema-de-carga)
9. [Integración 3D](#9-integración-3d)
10. [Detección de Gestos](#10-detección-de-gestos)

### PARTE 2: BACKEND
11. [Introducción al Backend](#11-introducción-al-backend)
12. [Arquitectura Backend](#12-arquitectura-backend)
13. [Tecnologías Backend](#13-tecnologías-backend)
14. [API Endpoints](#14-api-endpoints)
15. [Base de Datos](#15-base-de-datos)
16. [Autenticación](#16-autenticación)
17. [Procesamiento IA](#17-procesamiento-ia)
18. [WebSockets](#18-websockets)

### PARTE 3: INTEGRACIÓN
19. [Comunicación Frontend-Backend](#19-comunicación-frontend-backend)
20. [Flujo de Datos](#20-flujo-de-datos)
21. [Optimizaciones](#21-optimizaciones)
22. [Deployment](#22-deployment)

---

# PARTE 1: FRONTEND

## 1. Introducción al Frontend

### ¿Qué es el Frontend?

El frontend de HandControl AI es la **interfaz de usuario** que los usuarios ven e interactúan. Es una aplicación web moderna construida con React que proporciona:

- 🎨 **Interfaz visual futurista** con efectos 3D
- 📹 **Captura de video** en tiempo real
- 🤖 **Detección de gestos** con IA
- 📊 **Visualización de datos** con gráficos interactivos
- 🎮 **Navegación por gestos** sin tocar la pantalla

### Responsabilidades del Frontend

1. **Interfaz de Usuario (UI)**
   - Renderizar componentes visuales
   - Manejar interacciones del usuario
   - Mostrar información en tiempo real

2. **Captura de Video**
   - Acceder a la cámara web del usuario
   - Procesar frames de video
   - Mostrar preview en tiempo real

3. **Detección de Gestos (Cliente)**
   - Ejecutar MediaPipe en el navegador
   - Detectar landmarks de la mano (21 puntos)
   - Clasificar gestos en tiempo real

4. **Gestión de Estado**
   - Mantener estado global de la aplicación
   - Sincronizar datos entre componentes
   - Persistir datos en localStorage/sessionStorage

5. **Comunicación con Backend**
   - Enviar datos de gestos al servidor
   - Recibir estadísticas y reportes
   - Autenticación de usuarios

---

## 2. Arquitectura Frontend

### Estructura de Carpetas

```
src/
├── assets/                    # Recursos estáticos
│   ├── mano.png              # Logo personalizado
│   ├── hero.png              # Imagen hero
│   └── sounds/               # Efectos de sonido
│
├── components/               # Componentes reutilizables
│   ├── InitialLoader.jsx    # Pantalla de carga inicial
│   ├── SplineRobot.jsx      # Modelo 3D de Spline
│   ├── Loader.jsx           # Loader de navegación
│   ├── Navbar.jsx           # Barra de navegación
│   ├── Sidebar.jsx          # Menú lateral
│   ├── GestureCamera.jsx    # Cámara con detección
│   ├── RobotHand3D.jsx      # Mano 3D animada
│   └── ...
│
├── context/                  # Context API
│   └── GestureContext.jsx   # Estado global de gestos
│
├── hooks/                    # Custom Hooks
│   ├── useHandDetection.js  # Detección de gestos
│   └── useVoiceAssistant.js # Asistente de voz
│
├── pages/                    # Páginas (Lazy loaded)
│   ├── Landing.jsx          # Página de inicio
│   ├── Login.jsx            # Autenticación
│   ├── Dashboard.jsx        # Panel principal
│   ├── GesturePage.jsx      # IA Gestual
│   └── ...
│
├── utils/                    # Utilidades
│   ├── constants.js         # Constantes
│   └── helpers.js           # Funciones auxiliares
│
├── App.jsx                   # Componente raíz
├── main.jsx                  # Punto de entrada
└── index.css                 # Estilos globales
```

### Flujo de Navegación

```
Usuario → Landing Page → Login → Dashboard → IA Gestual
                                    ↓
                          Analytics, History, Reports, Settings
```

### Patrón de Diseño

El frontend utiliza el patrón **Component-Based Architecture**:

- **Componentes Atómicos**: Pequeños y reutilizables (Button, Card, Input)
- **Componentes Moleculares**: Combinación de atómicos (Navbar, Sidebar)
- **Componentes Organismos**: Secciones completas (Dashboard, GesturePage)
- **Templates**: Layouts de página
- **Pages**: Páginas completas con lógica

---

## 3. Tecnologías Frontend

### Core Technologies

#### React 19.2.6
**¿Qué hace?**
- Framework principal para construir la UI
- Maneja el renderizado de componentes
- Gestiona el estado de la aplicación
- Proporciona hooks para lógica reutilizable

**¿Por qué se usa?**
- Componentes reutilizables
- Virtual DOM para rendimiento
- Ecosistema maduro
- Fácil de mantener

**Ejemplo de uso:**
```jsx
function MiComponente() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  );
}
```

---

#### Vite 8.0.14
**¿Qué hace?**
- Build tool ultra rápido
- Hot Module Replacement (HMR)
- Optimización de bundles
- Dev server con recarga instantánea

**¿Por qué se usa?**
- 10x más rápido que Webpack
- Configuración mínima
- Build optimizado para producción
- Soporte nativo para ES modules

**Configuración:**
```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts-vendor': ['recharts']
        }
      }
    }
  }
}
```

#### Tailwind CSS 4.3.0
**¿Qué hace?**
- Framework de CSS utility-first
- Estilos inline con clases predefinidas
- Responsive design automático
- Dark mode integrado

**¿Por qué se usa?**
- Desarrollo rápido
- Consistencia visual
- Bundle pequeño (solo clases usadas)
- Personalizable

**Ejemplo:**
```jsx
<div className="bg-darker border border-primary/20 rounded-xl p-6 
                hover:border-primary transition-all">
  Contenido
</div>
```

---

#### Framer Motion 12.40.0
**¿Qué hace?**
- Librería de animaciones para React
- Animaciones declarativas
- Gestos y transiciones
- Animaciones de layout

**¿Por qué se usa?**
- Animaciones fluidas (60 FPS)
- API simple e intuitiva
- Optimizado para rendimiento
- Efectos visuales impresionantes

**Ejemplo:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenido animado
</motion.div>
```

---

#### React Router DOM 7.16.0
**¿Qué hace?**
- Manejo de rutas en React
- Navegación entre páginas
- Lazy loading de rutas
- Protección de rutas

**¿Por qué se usa?**
- SPA (Single Page Application)
- Navegación sin recargar página
- URLs amigables
- Historial de navegación

**Ejemplo:**
```jsx
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/gesture" element={<GesturePage />} />
</Routes>
```
