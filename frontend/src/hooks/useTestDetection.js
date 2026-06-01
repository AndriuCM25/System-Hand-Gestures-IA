/**
 * useTestDetection.js
 *
 * Hook de cámara SOLO para el modo pruebas (GesturePage).
 * - Gestiona su propia cámara y modelo Teachable Machine.
 * - Mantiene estado LOCAL: no actualiza GestureContext.
 * - No ejecuta ninguna acción ni navegación.
 * - Solo devuelve: gesto actual, confianza y probabilidades de todas las clases.
 */
import { useRef, useState, useCallback, useEffect } from 'react';

const TM_MODEL_URL = 'https://teachablemachine.withgoogle.com/models/8nxky5e5v/';
const THRESHOLD    = 0.55; // un poco más permisivo para pruebas

// Mapeo clase → datos de visualización
const CLASS_MAP = {
  'Mano_Abierta':            { display: 'Mano Abierta',   emoji: '✋', color: '#00d9ff' },
  'Puño_Cerrado':            { display: 'Puño Cerrado',   emoji: '✊', color: '#ef4444' },
  'Pulgar_Arriba':           { display: 'Pulgar Arriba',  emoji: '👍', color: '#22c55e' },
  'Dos_Dedos':               { display: 'Dos Dedos',      emoji: '✌️', color: '#f59e0b' },
  'Apuntar_Derecha':         { display: 'Mano Derecha',   emoji: '👉', color: '#3b82f6' },
  'Apuntar_Izquierda':       { display: 'Mano Izquierda', emoji: '👈', color: '#a855f7' },
  'Gesto_Neutro(Sin_Gesto)': { display: 'Gesto Neutro',   emoji: '🤚', color: '#4A7080' },
};

export const useTestDetection = () => {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const tmRef      = useRef(null);
  const handsRef   = useRef(null);
  const animRef    = useRef(null);
  const lastProcRef = useRef(0);
  const frameCountRef = useRef(0);

  const [isLoading,      setIsLoading]      = useState(false);
  const [isRunning,      setIsRunning]      = useState(false);
  const [error,          setError]          = useState(null);
  const [tmStatus,       setTmStatus]       = useState('idle');
  const [currentGesture, setCurrentGesture] = useState(null);
  const [confidence,     setConfidence]     = useState(0);
  const [predictions,    setPredictions]    = useState([]);

  // ── Cargar script CDN ───────────────────────────────────────────────────────
  const loadScript = useCallback((src) => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  }), []);

  // ── Dibujar landmarks en canvas ─────────────────────────────────────────────
  const drawHand = useCallback((ctx, lm, w, h) => {
    const conn = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ];
    ctx.strokeStyle = '#00d9ff'; ctx.lineWidth = 2;
    conn.forEach(([a, b]) => {
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

  // ── Clasificar frame ────────────────────────────────────────────────────────
  const classify = useCallback(async (videoEl) => {
    if (!tmRef.current || !videoEl) return;
    try {
      const preds = await tmRef.current.predict(videoEl);

      // Enriquecer con datos de visualización
      const enriched = preds.map(p => ({
        ...p,
        display: CLASS_MAP[p.className]?.display || p.className,
        emoji:   CLASS_MAP[p.className]?.emoji   || '🤚',
        color:   CLASS_MAP[p.className]?.color   || '#4A7080',
      }));
      setPredictions(enriched);

      // Mejor predicción
      const best = enriched.reduce((a, b) => a.probability > b.probability ? a : b, { probability: 0 });

      if (best.probability >= THRESHOLD && CLASS_MAP[best.className]?.display !== 'Gesto Neutro') {
        setCurrentGesture(best.display);
        setConfidence(best.probability);
      } else {
        setCurrentGesture(null);
        setConfidence(0);
      }
    } catch { /* silencioso */ }
  }, []);

  // ── Callback de MediaPipe ───────────────────────────────────────────────────
  const onResults = useCallback(async (results) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d', { alpha: false });

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks?.length > 0) {
      frameCountRef.current++;
      if (frameCountRef.current % 2 === 0) {
        results.multiHandLandmarks.forEach(lm => drawHand(ctx, lm, canvas.width, canvas.height));
      }
      const now = Date.now();
      if (now - lastProcRef.current > 200 && videoRef.current) {
        lastProcRef.current = now;
        await classify(videoRef.current);
      }
    } else {
      setCurrentGesture(null);
      setConfidence(0);
    }
    ctx.restore();
  }, [classify, drawHand]);

  // ── Iniciar cámara + modelos ────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTmStatus('loading');
    try {
      // 1. Cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width:{ ideal:640 }, height:{ ideal:480 }, facingMode:'user', frameRate:{ ideal:24, max:24 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(res => { videoRef.current.onloadedmetadata = () => { videoRef.current.play(); res(); }; });
      }

      // 2. Modelo TM
      const tmImage = await import('@teachablemachine/image');
      const model   = await tmImage.load(TM_MODEL_URL + 'model.json', TM_MODEL_URL + 'metadata.json');
      tmRef.current = model;
      setTmStatus('ready');

      // 3. MediaPipe (con fallback)
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js');
        const hands = new window.Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${f}` });
        hands.setOptions({ maxNumHands:1, modelComplexity:0, minDetectionConfidence:0.6, minTrackingConfidence:0.6 });
        hands.onResults(onResults);
        handsRef.current = hands;

        let lastFrame = 0;
        const loop = async (t) => {
          if (t - lastFrame >= 50 && videoRef.current?.readyState === 4 && handsRef.current) {
            try { await handsRef.current.send({ image: videoRef.current }); } catch { /* ignore */ }
            lastFrame = t;
          }
          animRef.current = requestAnimationFrame(loop);
        };
        animRef.current = requestAnimationFrame(loop);
      } catch {
        // Fallback sin landmarks
        const fallback = async () => {
          if (canvasRef.current && videoRef.current?.readyState === 4) {
            const ctx = canvasRef.current.getContext('2d', { alpha:false });
            ctx.save();
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.restore();
            const now = Date.now();
            if (now - lastProcRef.current > 200) { lastProcRef.current = now; await classify(videoRef.current); }
          }
          animRef.current = requestAnimationFrame(fallback);
        };
        animRef.current = requestAnimationFrame(fallback);
      }

      setIsRunning(true);
      setIsLoading(false);
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setTmStatus('error');
      setIsLoading(false);
    }
  }, [loadScript, onResults, classify]);

  // ── Detener cámara ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (animRef.current)  { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (handsRef.current) { handsRef.current.close(); handsRef.current = null; }
    tmRef.current = null;
    setIsRunning(false);
    setTmStatus('idle');
    setCurrentGesture(null);
    setConfidence(0);
    setPredictions([]);
  }, []);

  // Limpiar al desmontar
  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef, canvasRef,
    isLoading, isRunning, error, tmStatus,
    currentGesture, confidence, predictions,
    startCamera, stopCamera,
  };
};
