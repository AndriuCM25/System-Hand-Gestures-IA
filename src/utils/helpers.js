// Formatear fecha
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formatear hora
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Formatear porcentaje
export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(1)}%`;
};

// Generar ID único
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calcular distancia euclidiana entre dos puntos
export const calculateDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  const dz = (point1.z || 0) - (point2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Verificar si un dedo está extendido
export const isFingerExtended = (landmarks, fingerTip, fingerPip) => {
  return landmarks[fingerTip].y < landmarks[fingerPip].y;
};

// Contar dedos extendidos
export const countExtendedFingers = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return 0;

  const fingers = [
    isFingerExtended(landmarks, 4, 3),   // Pulgar
    isFingerExtended(landmarks, 8, 6),   // Índice
    isFingerExtended(landmarks, 12, 10), // Medio
    isFingerExtended(landmarks, 16, 14), // Anular
    isFingerExtended(landmarks, 20, 18)  // Meñique
  ];

  return fingers.filter(Boolean).length;
};

// Exportar datos a CSV
export const exportToCSV = (data, filename) => {
  const csv = data.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Validar confianza mínima
export const isConfidenceValid = (confidence, minConfidence = 0.7) => {
  return confidence >= minConfidence;
};

// Obtener color según confianza
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.9) return 'text-green-400';
  if (confidence >= 0.75) return 'text-yellow-400';
  if (confidence >= 0.6) return 'text-orange-400';
  return 'text-red-400';
};

// Calcular estadísticas
export const calculateStats = (data) => {
  if (!data || data.length === 0) {
    return {
      total: 0,
      average: 0,
      min: 0,
      max: 0
    };
  }

  const values = data.map(item => item.confidence || 0);
  const total = values.length;
  const sum = values.reduce((acc, val) => acc + val, 0);
  const average = sum / total;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return { total, average, min, max };
};
