/**
 * FloatingGestureCamera.jsx
 *
 * Cámara flotante persistente que sigue al usuario en toda la app.
 * Detecta gestos con el modelo Teachable Machine y navega entre páginas.
 * Se muestra en todas las páginas excepto login y landing.
 *
 * Gestos → Acciones de navegación:
 *   ✋ Mano Abierta   → Dashboard
 *   👍 Pulgar Arriba  → Analytics
 *   ✌️ Dos Dedos      → Historial
 *   👉 Mano Derecha   → Página siguiente
 *   👈 Mano Izquierda → Página anterior
 *   ✊ Puño Cerrado   → (neutral, sin acción)
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGesture } from '../context/GestureContext';
import { useHandDetection } from '../hooks/useHandDetection';
import {
  FaVideo, FaVideoSlash, FaTimes, FaMinus,
  FaHandPaper, FaCheck, FaChevronRight, FaChevronLeft
} from 'react-icons/fa';

// ── Páginas de navegación en orden ────────────────────────────────────────────
const PAGES = ['/dashboard', '/gesture', '/history', '/analytics', '/reports', '/settings'];
const PAGE_NAMES = {
  '/dashboard': 'Dashboard',
  '/gesture':   'IA Gestual',
  '/history':   'Historial',
  '/analytics': 'Analytics',
  '/reports':   'Reportes',
  '/settings':  'Ajustes',
};

// ── Mapeo de gestos a acciones ────────────────────────────────────────────────
const GESTURE_NAV = {
  'Mano Abierta':   { label: 'Dashboard',       emoji: '🏠', color: '#00d9ff', route: '/dashboard' },
  'Pulgar Arriba':  { label: 'Analytics',        emoji: '📊', color: '#22c55e', route: '/analytics' },
  'Dos Dedos':      { label: 'Historial',        emoji: '📋', color: '#f59e0b', route: '/history'   },
  'Mano Derecha':   { label: 'Página siguiente', emoji: '👉', color: '#3b82f6', route: '__next__'   },
  'Mano Izquierda': { label: 'Página anterior',  emoji: '👈', color: '#a855f7', route: '__prev__'   },
  'Puño Cerrado':   { label: 'Neutro',           emoji: '⏸', color: '#6b7280', route: null          },
};

const HOLD_MS = 1500; // tiempo para confirmar navegación

// ── SVG Progress Ring ─────────────────────────────────────────────────────────
const ProgressRing = ({ progress, color, size = 44 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.05s linear' }} />
    </svg>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
const FloatingGestureCamera = () => {
  const [isOpen,       setIsOpen]       = useState(false);
  const [isStarted,    setIsStarted]    = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdGesture,  setHoldGesture]  = useState(null);
  const [feedback,     setFeedback]     = useState(null); // { label, emoji }
  const [loadMsg,      setLoadMsg]      = useState('');

  const holdGestureRef     = useRef(null);
  const progressIntervalRef = useRef(null);
  const lastActionRef      = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentGesture, confidence, cameraActive, setCameraActive } = useGesture();
  const { videoRef, canvasRef, isLoading, error, tmStatus, initializeCamera, stopCamera } = useHandDetection();

  // ── Iniciar / detener cámara ────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setIsStarted(true);
    setCameraActive(true);
    if (!isOpen) setIsOpen(true);
    setLoadMsg('Cargando modelo IA…');
    try {
      await initializeCamera();
      setLoadMsg('');
    } catch {
      setLoadMsg('Error al iniciar. Permite el acceso a la cámara.');
    }
  }, [initializeCamera, isOpen, setCameraActive]);

  const handleStop = useCallback(() => {
    stopCamera();
    setIsStarted(false);
    setCameraActive(false);
    setHoldProgress(0);
    setHoldGesture(null);
    holdGestureRef.current = null;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setLoadMsg('');
  }, [stopCamera, setCameraActive]);

  // ── Resolver ruta del gesto ─────────────────────────────────────────────────
  const resolveRoute = useCallback((gesture) => {
    const info = GESTURE_NAV[gesture];
    if (!info || !info.route) return null;
    if (info.route === '__next__') {
      const i = PAGES.indexOf(location.pathname);
      return PAGES[Math.min(i + 1, PAGES.length - 1)];
    }
    if (info.route === '__prev__') {
      const i = PAGES.indexOf(location.pathname);
      return PAGES[Math.max(i - 1, 0)];
    }
    return info.route;
  }, [location.pathname]);

  // ── Hold-to-navigate logic ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isStarted) return;

    const clearHold = () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      setHoldProgress(0);
      setHoldGesture(null);
      holdGestureRef.current = null;
    };

    // Sin gesto o gesto neutro → limpiar
    if (!currentGesture || !GESTURE_NAV[currentGesture] || GESTURE_NAV[currentGesture].route === null) {
      clearHold();
      return;
    }

    // Mismo gesto → dejar correr el timer
    if (currentGesture === holdGestureRef.current) return;

    // Nuevo gesto detectado → iniciar timer
    clearHold();
    holdGestureRef.current = currentGesture;
    setHoldGesture(currentGesture);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_MS) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;

        const now = Date.now();
        if (now - lastActionRef.current < 2500) return; // cooldown
        lastActionRef.current = now;

        const info   = GESTURE_NAV[currentGesture];
        const target = resolveRoute(currentGesture);

        if (target && target !== location.pathname) {
          navigate(target);
          setFeedback({ label: `${info.emoji} ${info.label} → ${PAGE_NAMES[target] || target}`, color: info.color });
          setTimeout(() => setFeedback(null), 2200);
        }

        setHoldProgress(0);
        setHoldGesture(null);
        holdGestureRef.current = null;
      }
    }, 50);

    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [currentGesture, isStarted, resolveRoute, navigate, location.pathname]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── No mostrar en login / landing ──────────────────────────────────────────
  if (location.pathname === '/' || location.pathname === '/login') return null;

  const gestureInfo    = currentGesture ? GESTURE_NAV[currentGesture] : null;
  const conf           = Math.round(confidence * 100);
  const isHolding      = holdProgress > 0;
  const holdColor      = gestureInfo?.color || '#00d9ff';

  return (
    <>
      {/* ── Toast de feedback al navegar ── */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity:0, y:20, scale:0.9 }}
            animate={{ opacity:1, y:0,  scale:1   }}
            exit={{    opacity:0, y:-20, scale:0.9 }}
            style={{
              position:'fixed', bottom:96, right:24, zIndex:10000,
              background:'linear-gradient(135deg,rgba(0,20,40,0.97),rgba(0,10,30,0.97))',
              border:`1px solid ${feedback.color}60`,
              borderRadius:12, padding:'12px 18px',
              display:'flex', alignItems:'center', gap:10,
              boxShadow:`0 8px 32px ${feedback.color}30`,
              backdropFilter:'blur(16px)',
            }}
          >
            <FaCheck style={{ color: feedback.color, fontSize:14 }} />
            <span style={{ color:'#e2e8f0', fontSize:13, fontFamily:'monospace' }}>{feedback.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Panel flotante ── */}
      <motion.div
        initial={{ opacity:0, scale:0.8 }}
        animate={{ opacity:1, scale:1 }}
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9999,
          display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10,
        }}
      >
        {/* Panel expandido */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              initial={{ opacity:0, scale:0.85, y:20 }}
              animate={{ opacity:1, scale:1,    y:0  }}
              exit={{    opacity:0, scale:0.85, y:20 }}
              transition={{ type:'spring', stiffness:300, damping:24 }}
              style={{
                width:268,
                background:'linear-gradient(135deg,rgba(5,10,20,0.97),rgba(2,6,15,0.97))',
                border:'1px solid rgba(0,207,255,0.25)',
                borderRadius:16,
                overflow:'hidden',
                boxShadow:'0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,207,255,0.1)',
                backdropFilter:'blur(20px)',
              }}
            >
              {/* Header */}
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'12px 14px',
                borderBottom:'1px solid rgba(0,207,255,0.12)',
                background:'rgba(0,207,255,0.04)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {isStarted && (
                    <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.2, repeat:Infinity }}
                      style={{ width:6, height:6, borderRadius:'50%', background:'#00FF96',
                        boxShadow:'0 0 8px #00FF96', display:'inline-block', flexShrink:0 }} />
                  )}
                  <span style={{ fontSize:12, fontFamily:'monospace', color:'#00d9ff',
                    letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    {isStarted ? 'Cámara Activa' : 'Cámara Gestual'}
                  </span>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => setIsOpen(false)} style={btnStyle('#4A7080')}>
                    <FaMinus style={{ fontSize:9 }} />
                  </button>
                  <button onClick={() => { setIsOpen(false); if (isStarted) handleStop(); }} style={btnStyle('#ef4444')}>
                    <FaTimes style={{ fontSize:9 }} />
                  </button>
                </div>
              </div>

              {/* Video + Canvas */}
              <div style={{ position:'relative', width:'100%', aspectRatio:'4/3',
                background:'#000', overflow:'hidden' }}>
                <video ref={videoRef} autoPlay muted playsInline
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                    objectFit:'cover', transform:'scaleX(-1)',
                    display: isStarted ? 'block' : 'none' }} />
                <canvas ref={canvasRef} width={640} height={480}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                    objectFit:'cover', transform:'scaleX(-1)',
                    display: isStarted ? 'block' : 'none' }} />

                {/* Estado sin iniciar */}
                {!isStarted && (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', gap:12,
                    background:'linear-gradient(135deg,#020610,#050A18)' }}>
                    <div style={{ width:56, height:56, borderRadius:'50%',
                      background:'rgba(0,207,255,0.1)',
                      border:'2px dashed rgba(0,207,255,0.3)',
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <FaHandPaper style={{ fontSize:22, color:'rgba(0,207,255,0.5)' }} />
                    </div>
                    <p style={{ fontSize:11, color:'rgba(0,207,255,0.5)', fontFamily:'monospace',
                      textAlign:'center', padding:'0 20px', lineHeight:1.5 }}>
                      Activa la cámara<br/>para navegar con gestos
                    </p>
                  </div>
                )}

                {/* Cargando */}
                {isLoading && (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', gap:10,
                    background:'rgba(0,0,0,0.75)', backdropFilter:'blur(4px)' }}>
                    <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                      style={{ width:32, height:32, border:'3px solid rgba(0,207,255,0.2)',
                        borderTop:'3px solid #00d9ff', borderRadius:'50%' }} />
                    <p style={{ fontSize:10, color:'#00d9ff', fontFamily:'monospace' }}>
                      {loadMsg || 'Iniciando…'}
                    </p>
                  </div>
                )}

                {/* Overlay: Hold progress ring */}
                {isStarted && isHolding && gestureInfo && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                    style={{
                      position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
                      display:'flex', alignItems:'center', gap:8,
                      background:'rgba(0,0,0,0.75)', borderRadius:24,
                      padding:'5px 12px 5px 5px', backdropFilter:'blur(8px)',
                      border:`1px solid ${holdColor}50`,
                    }}>
                    <ProgressRing progress={holdProgress} color={holdColor} size={36} />
                    <span style={{ fontSize:11, color:'#e2e8f0', fontFamily:'monospace' }}>
                      {gestureInfo.emoji} {gestureInfo.label}…
                    </span>
                  </motion.div>
                )}

                {/* Landmark model status badge */}
                {isStarted && !isLoading && tmStatus === 'ready' && (
                  <div style={{ position:'absolute', top:6, right:6,
                    background:'rgba(0,255,100,0.15)', border:'1px solid rgba(0,255,100,0.3)',
                    borderRadius:6, padding:'2px 7px',
                    fontSize:9, fontFamily:'monospace', color:'#00ff96' }}>
                    IA LISTA
                  </div>
                )}
              </div>

              {/* Gesture status bar */}
              <div style={{ padding:'10px 14px', borderTop:'1px solid rgba(0,207,255,0.1)' }}>
                {currentGesture && isStarted ? (
                  <div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:18 }}>{gestureInfo?.emoji || '🤚'}</span>
                        <div>
                          <p style={{ margin:0, fontSize:12, fontWeight:700, color:'#e2e8f0' }}>
                            {currentGesture}
                          </p>
                          {gestureInfo?.label && (
                            <p style={{ margin:0, fontSize:10, color: gestureInfo.color, fontFamily:'monospace' }}>
                              → {gestureInfo.label}
                            </p>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize:12, fontFamily:'monospace', fontWeight:700,
                        color: gestureInfo?.color || '#00d9ff' }}>{conf}%</span>
                    </div>
                    {/* Confidence bar */}
                    <div style={{ height:3, background:'rgba(255,255,255,0.06)',
                      borderRadius:2, overflow:'hidden', marginBottom:6 }}>
                      <motion.div animate={{ width:`${conf}%` }} transition={{ duration:0.2 }}
                        style={{ height:'100%', borderRadius:2,
                          background:`linear-gradient(90deg,${gestureInfo?.color||'#00d9ff'}80,${gestureInfo?.color||'#00d9ff'})` }} />
                    </div>
                    {/* Hold progress bar */}
                    {isHolding && (
                      <div style={{ height:2, background:'rgba(255,255,255,0.04)',
                        borderRadius:2, overflow:'hidden' }}>
                        <motion.div animate={{ width:`${holdProgress}%` }} transition={{ duration:0.05 }}
                          style={{ height:'100%', borderRadius:2, background: holdColor }} />
                      </div>
                    )}
                    {isHolding && (
                      <p style={{ margin:'4px 0 0', fontSize:9, color: holdColor, fontFamily:'monospace',
                        textAlign:'center' }}>
                        Mantén el gesto para navegar… {Math.round(holdProgress)}%
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:8, opacity: isStarted ? 1 : 0.4 }}>
                    <span style={{ fontSize:16 }}>🤚</span>
                    <p style={{ margin:0, fontSize:11, color:'#4A7080', fontFamily:'monospace' }}>
                      {isStarted ? 'Esperando gesto…' : 'Cámara inactiva'}
                    </p>
                  </div>
                )}
              </div>

              {/* Nav hint row */}
              <div style={{
                display:'grid', gridTemplateColumns:'repeat(3,1fr)',
                gap:4, padding:'8px 10px 10px',
                borderTop:'1px solid rgba(0,207,255,0.06)',
              }}>
                {Object.entries(GESTURE_NAV).slice(0, 6).map(([name, info]) => (
                  <div key={name} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                    padding:'5px 4px', borderRadius:6,
                    background: currentGesture === name ? `${info.color}18` : 'transparent',
                    border: `1px solid ${currentGesture === name ? info.color+'50' : 'transparent'}`,
                    transition:'all 0.2s',
                  }}>
                    <span style={{ fontSize:16 }}>{info.emoji}</span>
                    <span style={{ fontSize:8, color: currentGesture === name ? info.color : '#2a4050',
                      fontFamily:'monospace', textAlign:'center', lineHeight:1.2 }}>
                      {info.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Control button */}
              <div style={{ padding:'0 10px 12px' }}>
                {!isStarted ? (
                  <button onClick={handleStart} disabled={isLoading}
                    style={{
                      width:'100%', padding:'9px', borderRadius:8, border:'none',
                      background: isLoading ? 'rgba(0,207,255,0.05)' : 'rgba(0,207,255,0.15)',
                      color: isLoading ? 'rgba(0,207,255,0.3)' : '#00d9ff',
                      fontSize:12, fontFamily:'monospace', fontWeight:700,
                      letterSpacing:'0.1em', textTransform:'uppercase',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition:'all 0.2s',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    }}>
                    <FaVideo style={{ fontSize:11 }} />
                    {isLoading ? 'Iniciando…' : 'Iniciar Cámara'}
                  </button>
                ) : (
                  <button onClick={handleStop} style={{
                    width:'100%', padding:'9px', borderRadius:8, border:'none',
                    background:'rgba(239,68,68,0.12)', color:'#ef4444',
                    fontSize:12, fontFamily:'monospace', fontWeight:700,
                    letterSpacing:'0.1em', textTransform:'uppercase',
                    cursor:'pointer', transition:'all 0.2s',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  }}>
                    <FaVideoSlash style={{ fontSize:11 }} />
                    Detener Cámara
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Botón flotante colapsado ── */}
        <motion.button
          whileHover={{ scale:1.1 }}
          whileTap={{ scale:0.92 }}
          onClick={() => setIsOpen(o => !o)}
          style={{
            width:52, height:52, borderRadius:'50%', border:'none',
            background: isStarted
              ? 'linear-gradient(135deg,rgba(0,207,255,0.25),rgba(0,84,255,0.2))'
              : 'linear-gradient(135deg,rgba(20,30,50,0.9),rgba(10,15,30,0.9))',
            boxShadow: isStarted
              ? '0 4px 24px rgba(0,207,255,0.4), 0 0 0 2px rgba(0,207,255,0.3)'
              : '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
            cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative', flexShrink:0,
          }}
        >
          {isStarted ? (
            <>
              <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:1.5, repeat:Infinity }}
                style={{ position:'absolute', top:4, right:4, width:7, height:7,
                  borderRadius:'50%', background:'#00FF96', boxShadow:'0 0 6px #00FF96' }} />
              <FaVideo style={{ fontSize:18, color:'#00d9ff' }} />
            </>
          ) : (
            <FaHandPaper style={{ fontSize:18, color:'rgba(0,207,255,0.5)' }} />
          )}
        </motion.button>
      </motion.div>
    </>
  );
};

// ── Estilos pequeños ─────────────────────────────────────────────────────────
const btnStyle = (color) => ({
  width:20, height:20, borderRadius:4,
  background:`${color}18`, border:`1px solid ${color}40`,
  color, fontSize:9, cursor:'pointer', display:'flex',
  alignItems:'center', justifyContent:'center',
  transition:'all 0.15s', padding:0,
});

export default FloatingGestureCamera;
