import { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStop, FaCamera, FaExclamationTriangle, FaVideo, FaCheckCircle } from 'react-icons/fa';
import { useHandDetection } from '../hooks/useHandDetection';
import { useGesture } from '../context/GestureContext';
import { useGestureActions } from '../hooks/useGestureActions';

// Configuración de gestos — mapeada a las clases del modelo Teachable Machine
const GESTURE_CONFIG = {
  'Mano Abierta': {
    color: 'cyan',
    glow: 'shadow-[0_0_30px_rgba(0,217,255,0.8)]',
    action: 'Sistema Activado',
    icon: '✋'
  },
  'Puño Cerrado': {
    color: 'red',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.8)]',
    action: 'Sistema en Pausa',
    icon: '✊'
  },
  'Pulgar Arriba': {
    color: 'green',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.8)]',
    action: 'Confirmación Exitosa',
    icon: '👍'
  },
  'Dos Dedos': {
    color: 'yellow',
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.8)]',
    action: 'Menú Abierto',
    icon: '✌️'
  },
  'Mano Derecha': {
    color: 'blue',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.8)]',
    action: 'Navegación Siguiente',
    icon: '👉'
  },
  'Mano Izquierda': {
    color: 'purple',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.8)]',
    action: 'Navegación Anterior',
    icon: '👈'
  }
};

// Componente memoizado para el overlay de estado
const StatusOverlay = memo(({ isCameraOn }) => {
  if (!isCameraOn) return null;
  
  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 z-20">
      {/* Status */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-effect px-3 sm:px-4 py-2 rounded-lg border border-primary/30"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm text-green-400 font-mono">SISTEMA ACTIVO</span>
        </div>
      </motion.div>

      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-effect px-3 sm:px-4 py-2 rounded-lg border border-primary/30"
      >
        <div className="flex items-center space-x-2">
          <FaVideo className="text-primary text-xs" />
          <span className="text-xs sm:text-sm text-primary font-mono">TM Model + MediaPipe</span>
        </div>
      </motion.div>
    </div>
  );
});

StatusOverlay.displayName = 'StatusOverlay';

// Componente memoizado para las esquinas decorativas
const CornerDecorations = memo(() => (
  <>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-2 sm:top-4 left-2 sm:left-4 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-primary"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-primary"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-primary"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-primary"
    />
  </>
));

CornerDecorations.displayName = 'CornerDecorations';

const GestureCamera = () => {
  const { videoRef, canvasRef, isLoading, error, modelReady, initializeCamera, stopCamera } = useHandDetection();
  const { isActive, currentGesture, confidence, activateSystem, deactivateSystem } = useGesture();
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleStopCamera = useCallback(() => {
    stopCamera();
    setIsCameraOn(false);
    deactivateSystem();
  }, [stopCamera, deactivateSystem]);

  // ← Activa las acciones reales por gesto (navegación, sidebar, pausa)
  useGestureActions(handleStopCamera);

  const handleStartCamera = async () => {
    await initializeCamera();
    setIsCameraOn(true);
    activateSystem();
  };

  // Memoizar configuración del gesto actual
  const gestureConfig = useMemo(() => {
    return currentGesture ? GESTURE_CONFIG[currentGesture] : null;
  }, [currentGesture]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Camera Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-effect rounded-xl sm:rounded-2xl overflow-hidden border border-primary/30 shadow-neon"
      >
        {/* Scanner Effect */}
        {isCameraOn && !isLoading && !error && (
          <motion.div
            className="absolute inset-x-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10 pointer-events-none"
            animate={{ y: [0, '100%', 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Video and Canvas */}
        <div className="relative aspect-video bg-darker rounded-xl sm:rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'none' }}
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'auto' }}
          />

          {/* Overlay when camera is off */}
          {!isCameraOn && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-darker/90 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center space-y-4 p-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <FaCamera className="text-4xl sm:text-5xl text-primary/50" />
                </div>
                <div>
                  <p className="text-base sm:text-lg text-gray-400 mb-2">Cámara desactivada</p>
                  <p className="text-xs sm:text-sm text-gray-500">Presiona el botón para iniciar</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-darker/95 backdrop-blur-sm"
            >
              <div className="text-center space-y-4 p-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto"
                />
                <div>
                  <p className="text-base sm:text-lg text-primary font-semibold mb-1">Inicializando IA...</p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {modelReady ? '✅ Modelo cargado · Iniciando cámara...' : 'Cargando modelo entrenado + MediaPipe'}
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Overlay */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-darker/95 backdrop-blur-sm"
            >
              <div className="text-center space-y-4 p-4 sm:p-6 max-w-md">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-4xl sm:text-5xl text-red-400" />
                </div>
                <div>
                  <p className="text-base sm:text-lg text-red-400 font-semibold mb-2">Error de Cámara</p>
                  <p className="text-xs sm:text-sm text-gray-400">{error}</p>
                </div>
                <button
                  onClick={handleStopCamera}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          )}

          {/* Corner Decorations */}
          {isCameraOn && !isLoading && !error && <CornerDecorations />}
        </div>

        {/* HUD Overlay */}
        <StatusOverlay isCameraOn={isCameraOn && !isLoading && !error} />
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        {!isCameraOn ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartCamera}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-base sm:text-lg glow-button shadow-neon-strong disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlay className="text-sm sm:text-base" />
            <span>Iniciar Sistema</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStopCamera}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-base sm:text-lg glow-button shadow-[0_0_20px_rgba(239,68,68,0.6)]"
          >
            <FaStop className="text-sm sm:text-base" />
            <span>Detener Sistema</span>
          </motion.button>
        )}
      </div>

      {/* Gesture Detection Display */}
      <AnimatePresence mode="wait">
        {gestureConfig && (
          <motion.div
            key={currentGesture}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 ${gestureConfig.glow}`}
          >
            <div className="space-y-4">
              {/* Gesture Name */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl sm:text-5xl mb-2"
                >
                  {gestureConfig.icon}
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold neon-text mb-1">{currentGesture}</h3>
                <p className="text-xs sm:text-sm text-gray-400">Gesto detectado</p>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Confianza IA</span>
                  <span className="text-primary font-mono font-bold">{(confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-3 bg-darker rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-neon"
                  />
                </div>
              </div>

              {/* Action Info */}
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm bg-darker/50 rounded-lg p-3">
                <FaCheckCircle className="text-primary flex-shrink-0" />
                <span className="text-gray-400">Acción:</span>
                <span className="text-primary font-semibold">{gestureConfig.action}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {isCameraOn && !currentGesture && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-effect rounded-xl p-4 border border-primary/20 text-center"
        >
          <p className="text-sm text-gray-400">
            Muestra tu mano frente a la cámara para detectar gestos
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GestureCamera;
