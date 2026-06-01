/**
 * GesturePage.jsx — MODO PRUEBAS
 *
 * Enciende su propia cámara para testear gestos.
 * NO ejecuta ninguna acción ni navegación (eso es solo la cámara flotante).
 * Solo muestra: gesto detectado, confianza y probabilidades de todas las clases.
 */
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';
import { useTestDetection } from '../hooks/useTestDetection';
import {
  FaFlask, FaVideo, FaVideoSlash, FaHandPaper,
  FaLightbulb, FaHistory, FaCheckCircle, FaExclamationTriangle,
} from 'react-icons/fa';
import { useState, useRef } from 'react';

// ── Catálogo visual de gestos ─────────────────────────────────────────────────
const CATALOG = [
  { display: 'Mano Abierta',   emoji: '✋', color: '#00d9ff', tip: 'Palma abierta hacia cámara, dedos extendidos' },
  { display: 'Puño Cerrado',   emoji: '✊', color: '#ef4444', tip: 'Mano completamente cerrada' },
  { display: 'Pulgar Arriba',  emoji: '👍', color: '#22c55e', tip: 'Solo el pulgar extendido hacia arriba' },
  { display: 'Dos Dedos',      emoji: '✌️', color: '#f59e0b', tip: 'Índice y medio extendidos (forma V)' },
  { display: 'Mano Derecha',   emoji: '👉', color: '#3b82f6', tip: 'Solo índice apuntando a la derecha' },
  { display: 'Mano Izquierda', emoji: '👈', color: '#a855f7', tip: 'Solo índice apuntando a la izquierda' },
  { display: 'Gesto Neutro',   emoji: '🤚', color: '#4A7080', tip: 'Ningún gesto definido' },
];

// ── Barra de probabilidad ─────────────────────────────────────────────────────
const ProbBar = ({ pred, isTop }) => {
  const pct = Math.round(pred.probability * 100);
  return (
    <motion.div layout style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 10px', borderRadius: 8,
      background: isTop ? `${pred.color}12` : 'transparent',
      border: `1px solid ${isTop ? pred.color + '40' : 'transparent'}`,
      transition: 'background 0.2s, border 0.2s',
    }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{pred.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: isTop ? 700 : 400,
            color: isTop ? pred.color : '#3a5060' }}>
            {pred.display}
          </span>
          <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
            color: isTop ? pred.color : '#2a3840', flexShrink: 0 }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.15 }}
            style={{ height: '100%', borderRadius: 2,
              background: isTop ? `linear-gradient(90deg,${pred.color}70,${pred.color})` : 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>
    </motion.div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
const GesturePage = () => {
  const {
    videoRef, canvasRef,
    isLoading, isRunning, error, tmStatus,
    currentGesture, confidence, predictions,
    startCamera, stopCamera,
  } = useTestDetection();

  const [localHistory, setLocalHistory] = useState([]);
  const lastSavedRef = useRef(null);
  const lastSavedTimeRef = useRef(0);

  // Guardar gesto en historial local (solo pruebas, sin context)
  if (currentGesture && currentGesture !== lastSavedRef.current) {
    const now = Date.now();
    if (now - lastSavedTimeRef.current > 2000) {
      lastSavedRef.current = currentGesture;
      lastSavedTimeRef.current = now;
      const entry = {
        id: now, gesture: currentGesture, confidence,
        emoji: CATALOG.find(g => g.display === currentGesture)?.emoji || '🤚',
        color: CATALOG.find(g => g.display === currentGesture)?.color || '#00d9ff',
        time: new Date().toLocaleTimeString(),
      };
      setLocalHistory(prev => [entry, ...prev].slice(0, 20));
    }
  }
  if (!currentGesture && lastSavedRef.current) {
    lastSavedRef.current = null;
  }

  const sortedPreds = [...predictions].sort((a, b) => b.probability - a.probability);
  const gestureData = CATALOG.find(g => g.display === currentGesture);
  const conf = Math.round(confidence * 100);

  return (
    <div className="min-h-screen relative" style={{ background: '#050A14' }}>
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <div className="ml-0 md:ml-64 mt-20 p-6 lg:p-8 relative z-10">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12,
                background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaFlask style={{ fontSize: 20, color: '#f59e0b' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#E0F7FF', margin: 0, lineHeight: 1.1 }}>
                  IA Gestual — Pruebas
                </h1>
                <p style={{ fontSize: 12, color: '#4A7080', margin: 0, fontFamily: 'monospace' }}>
                  Solo lectura de gestos · Sin acciones de navegación
                </p>
              </div>
            </div>

            {/* Botón iniciar / detener */}
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={isRunning ? stopCamera : startCamera}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 8, border: 'none',
                background: isRunning
                  ? 'rgba(239,68,68,0.15)'
                  : isLoading
                    ? 'rgba(0,207,255,0.06)'
                    : 'rgba(0,207,255,0.15)',
                color: isRunning ? '#ef4444' : isLoading ? 'rgba(0,207,255,0.4)' : '#00d9ff',
                fontSize: 13, fontFamily: 'monospace', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                border: `1px solid ${isRunning ? 'rgba(239,68,68,0.3)' : 'rgba(0,207,255,0.2)'}`,
              }}
            >
              {isLoading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 12, height: 12, border: '2px solid rgba(0,207,255,0.3)',
                      borderTop: '2px solid #00d9ff', borderRadius: '50%', display: 'inline-block' }} />
                  Cargando…
                </>
              ) : isRunning ? (
                <><FaVideoSlash style={{ fontSize: 12 }} /> Detener Cámara</>
              ) : (
                <><FaVideo style={{ fontSize: 12 }} /> Iniciar Cámara</>
              )}
            </motion.button>
          </div>

          {/* Banner de aviso */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginTop: 14,
            padding: '10px 16px', borderRadius: 8,
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: 12, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#b45309', fontFamily: 'monospace' }}>
              Esta cámara es <strong style={{ color: '#f59e0b' }}>solo para pruebas</strong>.
              La navegación con gestos la controla únicamente la{' '}
              <strong style={{ color: '#f59e0b' }}>cámara flotante</strong> (🤚 abajo a la derecha).
            </span>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              fontSize: 12, color: '#f87171', fontFamily: 'monospace' }}>
              ⚠ {error}
            </div>
          )}
        </motion.div>

        {/* ── Layout principal ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* ── Cámara de pruebas ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
              borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
            {/* Accent top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 2,
              background: 'linear-gradient(90deg,transparent,rgba(0,207,255,0.6),transparent)' }} />

            {/* Header de tarjeta */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid rgba(0,207,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {isRunning && (
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF96',
                      boxShadow: '0 0 8px #00FF96', display: 'inline-block', flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#0097BB',
                  textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {isRunning ? 'Cámara Activa' : 'Cámara de Pruebas'}
                </span>
              </div>
              {tmStatus === 'ready' && (
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#00FF96',
                  background: 'rgba(0,255,100,0.1)', padding: '2px 7px', borderRadius: 4,
                  border: '1px solid rgba(0,255,100,0.25)' }}>
                  MODELO LISTO
                </span>
              )}
            </div>

            {/* Video */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#000' }}>
              <video ref={videoRef} autoPlay muted playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', transform: 'scaleX(-1)',
                  display: isRunning ? 'block' : 'none' }} />
              <canvas ref={canvasRef} width={640} height={480}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', transform: 'scaleX(-1)',
                  display: isRunning ? 'block' : 'none' }} />

              {/* Placeholder sin cámara */}
              {!isRunning && !isLoading && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 14,
                  background: 'linear-gradient(135deg,#020610,#050A18)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(0,207,255,0.08)', border: '2px dashed rgba(0,207,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaHandPaper style={{ fontSize: 26, color: 'rgba(0,207,255,0.3)' }} />
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(0,207,255,0.35)', fontFamily: 'monospace',
                    textAlign: 'center', lineHeight: 1.6 }}>
                    Haz clic en<br/><strong style={{ color: 'rgba(0,207,255,0.6)' }}>Iniciar Cámara</strong><br/>para probar gestos
                  </p>
                </div>
              )}

              {/* Cargando */}
              {isLoading && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 36, height: 36, border: '3px solid rgba(0,207,255,0.15)',
                      borderTop: '3px solid #00d9ff', borderRadius: '50%' }} />
                  <p style={{ fontSize: 11, color: '#00d9ff', fontFamily: 'monospace', textAlign: 'center' }}>
                    Cargando modelo IA…
                  </p>
                </div>
              )}

              {/* Badge gesto actual encima del video */}
              {isRunning && currentGesture && gestureData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    border: `1px solid ${gestureData.color}60`, borderRadius: 20,
                    padding: '6px 14px 6px 10px',
                    boxShadow: `0 4px 20px ${gestureData.color}30`,
                  }}>
                  <span style={{ fontSize: 20 }}>{gestureData.emoji}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: gestureData.color }}>
                      {currentGesture}
                    </p>
                    <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>
                      {conf}% de confianza
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Sin gesto mientras corre */}
              {isRunning && !currentGesture && !isLoading && (
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)', borderRadius: 16, padding: '4px 12px',
                  fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  Esperando gesto…
                </div>
              )}
            </div>

            {/* Gesto actual — resumen debajo del video */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(0,207,255,0.08)' }}>
              <AnimatePresence mode="wait">
                {currentGesture && gestureData ? (
                  <motion.div key={currentGesture}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 36 }}>{gestureData.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: gestureData.color }}>
                          {currentGesture}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)',
                            borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div animate={{ width: `${conf}%` }} transition={{ duration: 0.2 }}
                              style={{ height: '100%', borderRadius: 3,
                                background: `linear-gradient(90deg,${gestureData.color}70,${gestureData.color})` }} />
                          </div>
                          <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700,
                            color: gestureData.color, flexShrink: 0 }}>{conf}%</span>
                        </div>
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FaCheckCircle style={{ color: '#22c55e', fontSize: 10 }} />
                          <span style={{ fontSize: 10, color: '#22c55e', fontFamily: 'monospace' }}>
                            Gesto reconocido correctamente
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24 }}>🤚</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#2a4050', fontFamily: 'monospace' }}>
                      {isRunning ? 'Ningún gesto detectado…' : 'Cámara no iniciada'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Probabilidades en tiempo real ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
                borderRadius: 12, padding: 18, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <FaFlask style={{ color: '#a855f7', fontSize: 12 }} />
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#7c3aed',
                    textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Probabilidades — Modelo
                  </span>
                </div>
                {isRunning && predictions.length > 0 && (
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: 9, fontFamily: 'monospace', color: '#00FF96',
                      background: 'rgba(0,255,100,0.1)', padding: '2px 7px', borderRadius: 4,
                      border: '1px solid rgba(0,255,100,0.2)' }}>
                    EN VIVO
                  </motion.span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {sortedPreds.length > 0 ? (
                  sortedPreds.map((pred, i) => (
                    <ProbBar key={pred.className} pred={pred} isTop={i === 0 && pred.probability >= 0.55} />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#2a4050' }}>
                    <p style={{ fontSize: 12, fontFamily: 'monospace', margin: 0 }}>
                      {isRunning ? 'Cargando modelo…' : 'Inicia la cámara para ver probabilidades'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <FaLightbulb style={{ color: '#f59e0b', fontSize: 12 }} />
                <span style={{ fontSize: 11, color: '#b45309', fontFamily: 'monospace',
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Tips para mejor detección
                </span>
              </div>
              {[
                ['💡', 'Buena iluminación frontal directa'],
                ['📏', '50–100 cm de distancia a la cámara'],
                ['✋', 'Gestos claros y sostenidos'],
                ['⏱', 'La confianza mejora en 1–2 segundos'],
                ['🎯', 'Fondo simple sin mucho movimiento'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: '#4A7080', lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Catálogo + historial ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Catálogo */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
              borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <FaHandPaper style={{ color: '#00d9ff', fontSize: 12 }} />
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#0097BB',
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Catálogo de Gestos del Modelo
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CATALOG.map(g => {
                const isActive = currentGesture === g.display;
                return (
                  <motion.div key={g.display} animate={{ scale: isActive ? 1.02 : 1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                      borderRadius: 8, transition: 'all 0.2s',
                      border: `1px solid ${isActive ? g.color + '50' : 'rgba(255,255,255,0.04)'}`,
                      background: isActive ? `${g.color}12` : 'transparent',
                    }}>
                    <motion.span
                      animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={isActive ? { duration: 0.7, repeat: Infinity } : {}}
                      style={{ fontSize: 20, width: 26, textAlign: 'center', flexShrink: 0 }}>
                      {g.emoji}
                    </motion.span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700,
                        color: isActive ? g.color : '#C0D8E0' }}>
                        {g.display}
                        {isActive && (
                          <span style={{ marginLeft: 6, fontSize: 8, background: g.color,
                            color: '#000', padding: '1px 5px', borderRadius: 3,
                            verticalAlign: 'middle', fontWeight: 900 }}>
                            ✓ DETECTADO
                          </span>
                        )}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: '#3a5060', fontFamily: 'monospace' }}>
                        {g.tip}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Historial de pruebas (local, no afecta el dashboard) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
              borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <FaHistory style={{ color: '#00d9ff', fontSize: 12 }} />
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#0097BB',
                  textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Historial de Sesión (solo pruebas)
                </span>
              </div>
              {localHistory.length > 0 && (
                <button onClick={() => setLocalHistory([])}
                  style={{ fontSize: 9, fontFamily: 'monospace', color: '#4A7080',
                    background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
                    borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>
                  Limpiar
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 340, overflowY: 'auto' }}>
              <AnimatePresence>
                {localHistory.length > 0 ? (
                  localHistory.map((entry, i) => (
                    <motion.div key={entry.id}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i < 3 ? i * 0.03 : 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                        borderRadius: 7,
                        border: `1px solid ${entry.color}20`,
                        background: `${entry.color}08`,
                      }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{entry.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#E0F7FF' }}>
                          {entry.gesture}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace',
                          fontWeight: 700, color: entry.color }}>
                          {Math.round(entry.confidence * 100)}%
                        </p>
                        <p style={{ margin: 0, fontSize: 8, color: '#2a4050', fontFamily: 'monospace' }}>
                          {entry.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: 12, color: '#1a2838', fontFamily: 'monospace', margin: 0 }}>
                      {isRunning ? 'Haz un gesto para registrarlo…' : 'Inicia la cámara de pruebas'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default GesturePage;
