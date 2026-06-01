import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStop, FaCamera, FaVideo, FaTimes, FaExpandArrowsAlt } from 'react-icons/fa';
import { useHandDetection } from '../hooks/useHandDetection';
import { useGesture } from '../context/GestureContext';
import { useGestureActions } from '../hooks/useGestureActions';

const GESTURE_CONFIG = {
  'Mano Abierta': { color: 'cyan', glow: 'shadow-[0_0_15px_rgba(0,217,255,0.8)]', icon: '✋' },
  'Puño Cerrado': { color: 'red', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.8)]', icon: '✊' },
  'Pulgar Arriba': { color: 'green', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.8)]', icon: '👍' },
  'Dos Dedos': { color: 'yellow', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.8)]', icon: '✌️' },
  'Mano Derecha': { color: 'blue', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.8)]', icon: '👉' },
  'Mano Izquierda': { color: 'purple', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.8)]', icon: '👈' }
};

const FloatingCamera = () => {
  const { videoRef, canvasRef, isLoading, error, modelReady, initializeCamera, stopCamera } = useHandDetection();
  const { isActive, currentGesture, confidence, activateSystem, deactivateSystem } = useGesture();
  
  // Controls if the floating widget is minimized or expanded
  const [isExpanded, setIsExpanded] = useState(true);
  // Controls if the camera system is currently turned on
  const [isCameraOn, setIsCameraOn] = useState(false);
  // Controls if the widget is visible at all
  const [isVisible, setIsVisible] = useState(false);

  // Escuchar si se abre desde otro lado (ej: botón en Navbar)
  useEffect(() => {
    const handleOpen = () => {
      setIsVisible(true);
      setIsExpanded(true);
    };
    window.addEventListener('open-floating-camera', handleOpen);
    return () => window.removeEventListener('open-floating-camera', handleOpen);
  }, []);

  const handleStopCamera = useCallback(() => {
    stopCamera();
    setIsCameraOn(false);
    deactivateSystem();
  }, [stopCamera, deactivateSystem]);

  // Activa las acciones globales
  useGestureActions(handleStopCamera);

  const handleStartCamera = async () => {
    await initializeCamera();
    setIsCameraOn(true);
    activateSystem();
  };

  const gestureConfig = useMemo(() => {
    return currentGesture ? GESTURE_CONFIG[currentGesture] : null;
  }, [currentGesture]);

  if (!isVisible) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      className={`fixed bottom-6 right-6 z-[9999] glass-effect rounded-2xl overflow-hidden border border-primary/30 shadow-neon flex flex-col transition-all duration-300 ${isExpanded ? 'w-72' : 'w-auto'}`}
    >
      {/* Header (Drag Handle) */}
      <div className="bg-darker/80 p-2 flex items-center justify-between cursor-move border-b border-primary/20">
        <div className="flex items-center space-x-2 px-2">
          <FaVideo className="text-primary text-xs" />
          <span className="text-xs font-bold text-gray-200">IA Navegación</span>
          {isCameraOn && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2" />}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-gray-400 hover:text-white p-1 transition-colors"
          >
            <FaExpandArrowsAlt className="text-xs" />
          </button>
          <button 
            onClick={() => {
              handleStopCamera();
              setIsVisible(false);
            }} 
            className="text-gray-400 hover:text-red-400 p-1 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>

      {/* Camera Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="flex flex-col"
          >
            <div className="relative aspect-video bg-black overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: 'none' }}
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'auto' }}
              />

              {/* Status Overlays */}
              {!isCameraOn && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-darker/90 backdrop-blur-sm">
                  <FaCamera className="text-3xl text-primary/50 mb-2" />
                  <p className="text-xs text-gray-400">Cámara inactiva</p>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-darker/90 backdrop-blur-sm">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mb-2" />
                  <p className="text-xs text-primary font-semibold">Cargando IA...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-darker/90 backdrop-blur-sm p-4 text-center">
                  <p className="text-xs text-red-400 mb-2">{error}</p>
                </div>
              )}

              {/* Gesture Detection HUD inside video */}
              {isCameraOn && gestureConfig && (
                <div className="absolute bottom-2 left-2 right-2 flex items-center bg-black/60 rounded-lg p-2 border border-primary/30 backdrop-blur-sm">
                  <span className="text-2xl mr-2">{gestureConfig.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{currentGesture}</p>
                    <div className="h-1 bg-darker rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary" style={{ width: `${confidence * 100}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-3 bg-darker/50">
              {!isCameraOn ? (
                <button
                  onClick={handleStartCamera}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  <FaPlay className="text-xs" />
                  <span>Activar Sistema</span>
                </button>
              ) : (
                <button
                  onClick={handleStopCamera}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg font-bold text-sm hover:bg-red-500/30 transition-colors"
                >
                  <FaStop className="text-xs" />
                  <span>Detener</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingCamera;
