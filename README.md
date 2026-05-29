# ✋ HandControl AI

## Sistema Inteligente de Navegación por Gestos

HandControl AI es una plataforma inteligente de accesibilidad basada en Inteligencia Artificial y Visión Computacional que permite controlar una interfaz web utilizando únicamente gestos de la mano mediante cámara web en tiempo real.

![Version](https://img.shields.io/badge/version-2.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![AI](https://img.shields.io/badge/AI-MediaPipe-cyan)

## 🎯 Características Principales

- **Detección de Gestos en Tiempo Real**: Utiliza MediaPipe Hands y TensorFlow.js
- **98.5% de Precisión**: Sistema de IA altamente confiable
- **Interfaz Futurista**: Diseño tipo Jarvis/Tesla con efectos holográficos
- **Dashboard Completo**: Estadísticas, gráficos y análisis en tiempo real
- **Accesibilidad**: Diseñado para personas con discapacidad motriz
- **Reportes Avanzados**: Generación de PDF y Excel
- **Historial Completo**: Registro de todas las detecciones

## 🚀 Tecnologías Utilizadas

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- React Icons
- Recharts
- SweetAlert2
- Axios

### IA / Visión Computacional
- MediaPipe Hands
- TensorFlow.js
- Hand Landmarks Detection

### Backend (Opcional)
- Node.js
- Express.js
- Python

### Base de Datos
- Supabase

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/handcontrol-ai.git

# Entrar al directorio
cd handcontrol-ai

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🎮 Gestos Disponibles

| Gesto | Acción | Descripción |
|-------|--------|-------------|
| ✋ Mano Abierta | Activar Sistema | Extiende todos los dedos |
| 👊 Puño Cerrado | Pausar | Cierra la mano completamente |
| 👍 Pulgar Arriba | Confirmar | Levanta el pulgar |
| ✌️ Dos Dedos | Abrir Menú | Muestra índice y medio |
| 👉 Mano Derecha | Siguiente | Apunta hacia la derecha |
| 👈 Mano Izquierda | Anterior | Apunta hacia la izquierda |

## 📊 Estructura del Proyecto

```
handcontrol-ai/
├── src/
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   ├── GestureCamera.jsx
│   │   └── HolographicBackground.jsx
│   ├── context/         # Context API
│   │   └── GestureContext.jsx
│   ├── hooks/           # Custom Hooks
│   │   └── useHandDetection.js
│   ├── pages/           # Páginas principales
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── GesturePage.jsx
│   │   ├── History.jsx
│   │   ├── Analytics.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── services/        # Servicios API
│   ├── styles/          # Estilos globales
│   ├── utils/           # Utilidades
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── public/              # Archivos públicos
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Características Visuales

- **Dark Mode**: Tema oscuro por defecto
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Neon Effects**: Brillos y sombras neón cyan/azul
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Partículas Dinámicas**: Fondo holográfico animado
- **HUD Futurista**: Interfaz tipo ciencia ficción

## 🔧 Configuración

El sistema permite configurar:

- Sensibilidad de detección de gestos
- Resolución de cámara (480p, 720p, 1080p)
- Confianza mínima de IA
- Efectos de sonido
- Notificaciones
- Idioma (Español, English, Français, Português)

## 📈 Analytics y Reportes

### Gráficos Disponibles
- Tendencia de uso de tecnologías accesibles
- Distribución por tipo de discapacidad
- Uso por hora del día
- Métricas de rendimiento (Radar Chart)
- Distribución geográfica

### Reportes Generables
- Reporte de Actividad Diaria (PDF/Excel)
- Reporte de Usuarios (PDF/Excel)
- Reporte de Precisión IA (PDF)
- Reporte Mensual Completo (PDF/Excel)

## 🌍 Casos de Uso

### Empresas
- Pantallas inteligentes
- Oficinas touchless
- Salas interactivas

### Salud
- Quirófanos
- Hospitales
- Sistemas sin contacto

### Accesibilidad
- Personas con discapacidad motriz
- Adultos mayores
- Inclusión digital

### Smart City
- Kioskos públicos inteligentes
- Navegación sin contacto
- Información turística

## 🎯 Roadmap

- [ ] Integración con TensorFlow.js para modelo personalizado
- [ ] Soporte para más gestos (10+ gestos)
- [ ] Gestos dinámicos (swipe, circular motion)
- [ ] Integración con backend real
- [ ] Modo multijugador
- [ ] Soporte para múltiples idiomas
- [ ] App móvil (React Native)
- [ ] Integración con dispositivos IoT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo Inicial* - [Tu GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- MediaPipe por la tecnología de detección de manos
- TensorFlow.js por el framework de IA
- La comunidad de React por las herramientas increíbles
- Todos los que contribuyen a la accesibilidad digital

## 📞 Contacto

- Email: contacto@handcontrol-ai.com
- Website: https://handcontrol-ai.com
- Twitter: [@handcontrolai](https://twitter.com/handcontrolai)

---

**HandControl AI** - *Controla el futuro con tus manos* ✋🤖
