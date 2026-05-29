// Gestos disponibles en el sistema
export const GESTURES = {
  OPEN_HAND: {
    id: 'open_hand',
    name: 'Mano Abierta',
    action: 'Activar Sistema',
    color: 'cyan',
    icon: '✋'
  },
  FIST: {
    id: 'fist',
    name: 'Puño Cerrado',
    action: 'Pausar',
    color: 'red',
    icon: '👊'
  },
  THUMBS_UP: {
    id: 'thumbs_up',
    name: 'Pulgar Arriba',
    action: 'Confirmar',
    color: 'green',
    icon: '👍'
  },
  PEACE: {
    id: 'peace',
    name: 'Dos Dedos',
    action: 'Abrir Menú',
    color: 'yellow',
    icon: '✌️'
  },
  POINTING_RIGHT: {
    id: 'pointing_right',
    name: 'Mano Derecha',
    action: 'Siguiente',
    color: 'blue',
    icon: '👉'
  },
  POINTING_LEFT: {
    id: 'pointing_left',
    name: 'Mano Izquierda',
    action: 'Anterior',
    color: 'purple',
    icon: '👈'
  }
};

// Configuración de MediaPipe
export const MEDIAPIPE_CONFIG = {
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
};

// Colores del tema
export const THEME_COLORS = {
  primary: '#00d9ff',
  secondary: '#0099ff',
  dark: '#0a0e27',
  darker: '#050816',
  success: '#4ade80',
  warning: '#facc15',
  error: '#ef4444',
  info: '#3b82f6'
};

// Configuración de cámara
export const CAMERA_RESOLUTIONS = {
  '480p': { width: 640, height: 480 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 }
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  CAMERA_PERMISSION_DENIED: 'No se pudo acceder a la cámara. Por favor, verifica los permisos.',
  CAMERA_NOT_FOUND: 'No se encontró ninguna cámara disponible.',
  GESTURE_DETECTED: 'Gesto detectado correctamente',
  SYSTEM_ACTIVATED: 'Sistema activado',
  SYSTEM_PAUSED: 'Sistema en pausa',
  LOADING: 'Cargando sistema de IA...'
};

// Estadísticas por defecto
export const DEFAULT_STATS = {
  totalGestures: 0,
  accuracy: 98.5,
  activeSessions: 1,
  users: 1
};
