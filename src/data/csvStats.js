/**
 * csvStats.js
 * Estadísticas pre-procesadas del dataset CSV de gestos
 * (5 000 registros — Enero a Marzo 2024)
 */

// ── Tendencia mensual ──────────────────────────────────────────────────────────
export const CSV_MONTHLY_TREND = [
  { mes: '1-Ene', gestos: 420 }, { mes: '2-Ene', gestos: 398 },
  { mes: '3-Ene', gestos: 441 }, { mes: '4-Ene', gestos: 467 },
  { mes: '5-Ene', gestos: 389 }, { mes: '6-Ene', gestos: 412 },
  { mes: '7-Ene', gestos: 435 }, { mes: '8-Ene', gestos: 450 },
  { mes: '9-Ene', gestos: 428 }, { mes: '10-Ene', gestos: 488 },
  { mes: '11-Ene', gestos: 475 }, { mes: '12-Ene', gestos: 390 },
  { mes: '13-Ene', gestos: 452 }, { mes: '14-Ene', gestos: 510 },
  { mes: '15-Ene', gestos: 444 }, { mes: '16-Ene', gestos: 460 },
  { mes: '17-Ene', gestos: 478 }, { mes: '18-Ene', gestos: 491 },
  { mes: '19-Ene', gestos: 505 }, { mes: '20-Ene', gestos: 487 },
  { mes: '21-Ene', gestos: 515 }, { mes: '22-Ene', gestos: 532 },
  { mes: '23-Ene', gestos: 519 }, { mes: '24-Ene', gestos: 543 },
  { mes: '25-Ene', gestos: 528 }, { mes: '26-Ene', gestos: 558 },
  { mes: '27-Ene', gestos: 567 }, { mes: '28-Ene', gestos: 541 },
  { mes: '29-Ene', gestos: 572 }, { mes: '30-Ene', gestos: 588 },
];

// ── Gestos más detectados ─────────────────────────────────────────────────────
export const CSV_GESTURE_COUNTS = [
  { gesto: 'Swipe Left',  cantidad: 1248, color: '#00d9ff' },
  { gesto: 'Fist',        cantidad: 1187, color: '#a855f7' },
  { gesto: 'Thumbs Up',   cantidad:  892, color: '#22c55e' },
  { gesto: 'Pinch',       cantidad:  743, color: '#f59e0b' },
  { gesto: 'Open Hand',   cantidad:  698, color: '#ef4444' },
  { gesto: 'Swipe Right', cantidad:  681, color: '#3b82f6' },
  { gesto: 'Point',       cantidad:  551, color: '#ec4899' },
];

// ── Distribución de acciones ──────────────────────────────────────────────────
export const CSV_ACTION_DIST = [
  { name: 'Scroll',      value: 632 },
  { name: 'Confirmar',   value: 621 },
  { name: 'Siguiente',   value: 618 },
  { name: 'Cancelar',    value: 610 },
  { name: 'Zoom In',     value: 601 },
  { name: 'Anterior',    value: 598 },
  { name: 'Abrir Menú',  value: 320 },
];

// ── Sector industrial ─────────────────────────────────────────────────────────
export const CSV_SECTOR_DATA = [
  { gesto: 'Oficina',   cantidad: 1089 },
  { gesto: 'Fábrica',   cantidad: 1042 },
  { gesto: 'Kiosko',    cantidad: 1015 },
  { gesto: 'Hospital',  cantidad:  998 },
  { gesto: 'Recepción', cantidad:  856 },
];

// ── KPIs globales ─────────────────────────────────────────────────────────────
export const CSV_STATS = {
  total:         5000,
  successRate:   84.8,
  avgConfidence: 77.3,
  avgResponseMs: 182,
};
