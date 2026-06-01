/**
 * useHandDetection.js
 * Detecta gestos usando:
 *  1. Teachable Machine (clasificación por imagen — modelo entrenado)
 *  2. MediaPipe Hands (landmarks visuales en canvas)
 *
 * FIX: Se importa @teachablemachine/image directamente desde npm
 *      para evitar conflictos de versión con TF cargado por CDN.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useGesture } from '../context/GestureContext';

// ─── URL del modelo Teachable Machine ────────────────────────────────────────
const TM_MODEL_URL = 'https://teachablemachine.withgoogle.com/models/8nxky5e5v/';

// ─── Mapeo clase TM → datos de UI ────────────────────────────────────────────
const CLASS_MAP = {
  'Mano_Abierta':          { name: 'Mano Abierta',   action: 'Activar Sistema', color: 'cyan',   icon: '✋' },
  'Puño_Cerrado':          { name: 'Puño Cerrado',    action: 'Pausar',          color: 'red',    icon: '✊' },
  'Pulgar_Arriba':         { name: 'Pulgar Arriba',   action: 'Confirmar',       color: 'green',  icon: '👍' },
  'Dos_Dedos':             { name: 'Dos Dedos',       action: 'Abrir Menú',      color: 'yellow', icon: '✌️' },
  'Apuntar_Derecha':       { name: 'Mano Derecha',    action: 'Siguiente',       color: 'blue',   icon: '👉' },
  'Apuntar_Izquierda':     { name: 'Mano Izquierda',  action: 'Anterior',        color: 'purple', icon: '👈' },
  'Gesto_Neutro(Sin_Gesto)': { name: null, action: null, color: null, icon: null },
};

const CONFIDENCE_THRESHOLD = 0.85; // Umbral mínimo para reportar gesto (aumentado para evitar falsos positivos)

export const useHandDetection = () => {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const handsRef    = useRef(null);
  const tmModelRef  = useRef(null);
  const animationRef = useRef(null);
  const lastGestureTimeRef  = useRef(0);
  const lastProcessTimeRef  = useRef(0);
  const frameSkipCounterRef = useRef(0);

  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);
  const [landmarks,  setLandmarks]  = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [tmStatus,   setTmStatus]   = useState('idle'); // idle | loading | ready | error

  const { updateGesture, addGestureToHistory, isActive, activateSystem } = useGesture();

  // ─── Cargar script externo (MediaPipe) ───────────────────────────────────
  const loadScript = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }, []);

  // ─── Cargar modelo Teachable Machine (sin CDN de TF) ────────────────────
  const loadTMModel = useCallback(async () => {
    setTmStatus('loading');
    try {
      // Carga dinámica para evitar conflictos con el bundle de Vite
      const tmImage = await import('@teachablemachine/image');

      const model = await tmImage.load(
        TM_MODEL_URL + 'model.json',
        TM_MODEL_URL + 'metadata.json'
      );

      tmModelRef.current = model;
      setModelReady(true);
      setTmStatus('ready');
      console.log('✅ Modelo TM cargado:', model.getTotalClasses(), 'clases');
      return model;
    } catch (err) {
      console.error('❌ Error cargando modelo TM:', err);
      setTmStatus('error');
      throw err;
    }
  }, []);

  // ─── Clasificar frame con el modelo TM ──────────────────────────────────
  const classifyGesture = useCallback(async (videoEl) => {
    if (!tmModelRef.current || !videoEl) return null;
    try {
      const predictions = await tmModelRef.current.predict(videoEl);
      let best = { className: '', probability: 0 };
      predictions.forEach(p => { if (p.probability > best.probability) best = p; });

      if (best.probability < CONFIDENCE_THRESHOLD) return null;
      const cfg = CLASS_MAP[best.className];
      if (!cfg?.name) return null; // gesto neutro

      return { name: cfg.name, confidence: best.probability, action: cfg.action, color: cfg.color, icon: cfg.icon };
    } catch {
      return null;
    }
  }, []);

  // ─── Dibujar esqueleto de mano ───────────────────────────────────────────
  const drawHand = useCallback((ctx, lm, w, h) => {
    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17]
    ];
    ctx.strokeStyle = '#00d9ff'; ctx.lineWidth = 2; ctx.shadowBlur = 0;
    connections.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(lm[a].x * w, lm[a].y * h);
      ctx.lineTo(lm[b].x * w, lm[b].y * h);
      ctx.stroke();
    });
    ctx.fillStyle = '#00d9ff';
    lm.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, [0,4,8,12,16,20].includes(i) ? 5 : 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, []);

  // ─── Callback de resultados MediaPipe ────────────────────────────────────
  const onResults = useCallback(async (results) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks?.length > 0) {
      setLandmarks(results.multiHandLandmarks);

      // Dibujar cada dos frames
      frameSkipCounterRef.current++;
      if (frameSkipCounterRef.current % 2 === 0) {
        results.multiHandLandmarks.forEach(lm => drawHand(ctx, lm, canvas.width, canvas.height));
      }

      // Clasificar gesto cada 200 ms (siempre, independiente de isActive)
      const now = Date.now();
      if (now - lastProcessTimeRef.current > 200 && videoRef.current) {
        lastProcessTimeRef.current = now;
        const gesture = await classifyGesture(videoRef.current);

        if (gesture) {
          updateGesture(gesture.name, gesture.confidence);
          // Auto-activar el sistema al detectar el primer gesto
          if (!isActive) activateSystem();
          // Guardar en historial máx cada 2 s
          if (now - lastGestureTimeRef.current > 2000) {
            addGestureToHistory(gesture);
            lastGestureTimeRef.current = now;
          }
        } else {
          updateGesture(null, 0);
        }
      }
    } else {
      setLandmarks(null);
      updateGesture(null, 0);
    }
    ctx.restore();
  }, [updateGesture, addGestureToHistory, isActive, activateSystem, classifyGesture, drawHand]);

  // ─── Inicializar cámara + modelos ────────────────────────────────────────
  const initializeCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user', frameRate: { ideal: 24, max: 24 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(resolve => {
          videoRef.current.onloadedmetadata = () => { videoRef.current.play(); resolve(); };
        });
      }

      // 2. Modelo TM (import dinámico — sin CDN de TF)
      await loadTMModel();

      // 3. MediaPipe Hands (CDN — solo para landmarks visuales)
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js');

        const hands = new window.Hands({
          locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${f}`
        });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        hands.onResults(onResults);
        handsRef.current = hands;

        // 4. Loop de frames
        let lastFrameTime = 0;
        const frameInterval = 1000 / 20; // 20 FPS

        const processFrame = async (t) => {
          if (t - lastFrameTime >= frameInterval) {
            if (videoRef.current?.readyState === 4 && handsRef.current) {
              try { await handsRef.current.send({ image: videoRef.current }); }
              catch { /* silencioso */ }
            }
            lastFrameTime = t;
          }
          animationRef.current = requestAnimationFrame(processFrame);
        };
        animationRef.current = requestAnimationFrame(processFrame);
        setIsLoading(false);

      } catch (mpErr) {
        console.warn('MediaPipe no disponible, usando solo TM:', mpErr);
        setError(null); // No mostrar error al usuario, el fallback funciona
        setIsLoading(false);

        // Fallback: clasificar sin landmarks (solo con el modelo TM)
        const fallback = async () => {
          if (canvasRef.current && videoRef.current?.readyState === 4) {
            const ctx = canvasRef.current.getContext('2d', { alpha: false });
            ctx.save();
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.restore();
            const now = Date.now();
            if (now - lastProcessTimeRef.current > 400) {
              lastProcessTimeRef.current = now;
              const g = await classifyGesture(videoRef.current);
              if (g) {
                updateGesture(g.name, g.confidence);
                if (!isActive) activateSystem();
                if (now - lastGestureTimeRef.current > 2000) {
                  addGestureToHistory(g);
                  lastGestureTimeRef.current = now;
                }
              } else updateGesture(null, 0);
            }
          }
          animationRef.current = requestAnimationFrame(fallback);
        };
        fallback();
      }
    } catch (err) {
      console.error('Error iniciando cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsLoading(false);
    }
  }, [onResults, loadScript, loadTMModel, isActive, classifyGesture, updateGesture, addGestureToHistory]);

  // ─── Detener cámara ──────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (handsRef.current) { handsRef.current.close(); handsRef.current = null; }
    tmModelRef.current = null;
    setModelReady(false);
    setLandmarks(null);
    setTmStatus('idle');
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return { videoRef, canvasRef, isLoading, error, landmarks, modelReady, tmStatus, initializeCamera, stopCamera };
};
