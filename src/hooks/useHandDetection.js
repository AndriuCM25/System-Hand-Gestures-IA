import { useEffect, useRef, useState, useCallback } from 'react';
import { useGesture } from '../context/GestureContext';

const GESTURES = {
  OPEN_HAND: { name: 'Mano Abierta', action: 'Activar Sistema', color: 'cyan' },
  FIST: { name: 'Puño Cerrado', action: 'Pausar', color: 'red' },
  THUMBS_UP: { name: 'Pulgar Arriba', action: 'Confirmar', color: 'green' },
  PEACE: { name: 'Dos Dedos', action: 'Abrir Menú', color: 'yellow' },
  POINTING_RIGHT: { name: 'Mano Derecha', action: 'Siguiente', color: 'blue' },
  POINTING_LEFT: { name: 'Mano Izquierda', action: 'Anterior', color: 'purple' },
};

export const useHandDetection = () => {
  // TODOS los hooks deben estar al inicio, sin condiciones
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const animationRef = useRef(null);
  const lastGestureTimeRef = useRef(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  
  const { updateGesture, addGestureToHistory, isActive } = useGesture();

  const detectGesture = useCallback((handLandmarks) => {
    if (!handLandmarks || handLandmarks.length === 0) return null;

    const landmarks = handLandmarks[0];
    
    // Calcular si los dedos están extendidos
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleExtended = landmarks[12].y < landmarks[10].y;
    const ringExtended = landmarks[16].y < landmarks[14].y;
    const pinkyExtended = landmarks[20].y < landmarks[18].y;
    
    const extendedFingers = [
      thumbExtended,
      indexExtended,
      middleExtended,
      ringExtended,
      pinkyExtended
    ].filter(Boolean).length;

    // Detectar gestos
    if (extendedFingers === 5) {
      return { ...GESTURES.OPEN_HAND, confidence: 0.95 };
    } else if (extendedFingers === 0) {
      return { ...GESTURES.FIST, confidence: 0.92 };
    } else if (thumbExtended && !indexExtended && !middleExtended) {
      return { ...GESTURES.THUMBS_UP, confidence: 0.88 };
    } else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      return { ...GESTURES.PEACE, confidence: 0.90 };
    } else if (indexExtended && !middleExtended && landmarks[8].x > landmarks[0].x + 0.1) {
      return { ...GESTURES.POINTING_RIGHT, confidence: 0.85 };
    } else if (indexExtended && !middleExtended && landmarks[8].x < landmarks[0].x - 0.1) {
      return { ...GESTURES.POINTING_LEFT, confidence: 0.85 };
    }

    return null;
  }, []);

  const drawConnectors = useCallback((ctx, landmarks, width, height) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d9ff';

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x * width, startPoint.y * height);
      ctx.lineTo(endPoint.x * width, endPoint.y * height);
      ctx.stroke();
    });
  }, []);

  const drawLandmarks = useCallback((ctx, landmarks, width, height) => {
    landmarks.forEach((landmark, index) => {
      ctx.beginPath();
      ctx.arc(
        landmark.x * width,
        landmark.y * height,
        index === 0 || index === 4 || index === 8 || index === 12 || index === 16 || index === 20 ? 6 : 4,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#00d9ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00d9ff';
      ctx.fill();
    });
  }, []);

  const onResults = useCallback((results) => {
    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d', { alpha: false });
    const canvas = canvasRef.current;
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar la imagen del video
    if (results.image) {
      canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    // Dibujar landmarks si hay manos detectadas
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setLandmarks(results.multiHandLandmarks);
      
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, canvas.width, canvas.height);
        drawLandmarks(canvasCtx, landmarks, canvas.width, canvas.height);
      }

      // Detectar gesto con throttle
      const gesture = detectGesture(results.multiHandLandmarks);
      if (gesture && isActive) {
        updateGesture(gesture.name, gesture.confidence);
        
        const now = Date.now();
        if (now - lastGestureTimeRef.current > 2000) {
          addGestureToHistory(gesture);
          lastGestureTimeRef.current = now;
        }
      }
    } else {
      setLandmarks(null);
      updateGesture(null, 0);
    }
    
    canvasCtx.restore();
  }, [isActive, updateGesture, addGestureToHistory, detectGesture, drawConnectors, drawLandmarks]);

  const initializeCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Primero obtener el stream de la cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 30 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
      }

      // Cargar MediaPipe Hands con script dinámico
      try {
        // Cargar el script de MediaPipe
        if (!window.Hands) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const hands = new window.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 2,              // ✅ Detectar 2 manos
          modelComplexity: 1,          // Modelo medio para mejor precisión
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        // Procesar frames con throttle
        let lastFrameTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        const processFrame = async (currentTime) => {
          if (currentTime - lastFrameTime >= frameInterval) {
            if (videoRef.current && videoRef.current.readyState === 4 && handsRef.current) {
              try {
                await handsRef.current.send({ image: videoRef.current });
              } catch (err) {
                console.warn('Error procesando frame:', err);
              }
            }
            lastFrameTime = currentTime;
          }
          animationRef.current = requestAnimationFrame(processFrame);
        };
        
        animationRef.current = requestAnimationFrame(processFrame);
        setIsLoading(false);

      } catch (err) {
        console.error('Error cargando MediaPipe:', err);
        setError('Error al cargar el sistema de IA. Mostrando solo video.');
        setIsLoading(false);
        
        // Fallback: mostrar solo el video sin detección
        const processVideoOnly = () => {
          if (canvasRef.current && videoRef.current && videoRef.current.readyState === 4) {
            const ctx = canvasRef.current.getContext('2d', { alpha: false });
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          animationRef.current = requestAnimationFrame(processVideoOnly);
        };
        processVideoOnly();
      }

    } catch (err) {
      console.error('Error al inicializar la cámara:', err);
      setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      setIsLoading(false);
    }
  }, [onResults]);

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    landmarks,
    initializeCamera,
    stopCamera
  };
};
