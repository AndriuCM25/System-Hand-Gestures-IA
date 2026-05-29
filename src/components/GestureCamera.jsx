import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStop, FaCamera, FaExclamationTriangle } from 'react-icons/fa';
import { useHandDetection } from '../hooks/useHandDetection';
import { useGesture } from '../context/GestureContext';

const GestureCamera = () => {
  const { videoRef, canvasRef, isLoading, error, initializeCamera, stopCamera } = useHandDetection();
  const { isActive, currentGesture, confidence, activateSystem, deactivateSystem } = useGesture();
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleStartCamera = async () => {
    await initializeCamera();
    setIsCameraOn(true);
    activateSystem();
  };

  const handleStopCamera = () => {
    stopCamera();
    setIsCameraOn(false);
    deactivateSystem();
  };

  const getGestureColor = (gesture) => {
    const colors = {
      'Mano Abierta': 'cyan',
      'Puño Cerrado': 'red',
      'Pulgar Arriba': 'green',
      'Dos Dedos': 'yellow',
      'Mano Derecha': 'blue',
      'Mano Izquierda': 'purple',
    };
    return colors[gesture] || 'cyan';
  };

  const getGestureGlow = (gesture) => {
    const glows = {
      'Mano Abierta': 'shadow-[0_0_30px_rgba(0,217,255,0.8)]',
      'Puño Cerrado': 'shadow-[0_0_30px_rgba(239,68,68,0.8)]',
      'Pulgar Arriba': 'shadow-[0_0_30px_rgba(34,197,94,0.8)]',
      'Dos Dedos': 'shadow-[0_0_30px_rgba(250,204,21,0.8)]',
      'Mano Derecha': 'shadow-[0_0_30px_rgba(59,130,246,0.8)]',
      'Mano Izquierda': 'shadow-[0_0_30px_rgba(168,85,247,0.8)]',
    };
    return glows[gesture] || 'shadow-neon';
  };

  return (
    <div className="space-y-6">
      {/* Camera Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-effect rounded-2xl overflow-hidden border border-primary/30"
      >
        {/* Scanner Effect */}
        {isCameraOn && (
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10"
            animate={{ y: [0, 480, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Video and Canvas */}
        <div className="relative aspect-video bg-darker">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />

          {/* Overlay when camera is off */}
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-darker/90">
              <div className="text-center space-y-4">
                <FaCamera className="text-6xl text-primary/30 mx-auto" />
                <p className="text-gray-400">Cámara desactivada</p>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-darker/90">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto"
                />
                <p className="text-primary">Inicializando IA...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-darker/90">
              <div className="text-center space-y-4 p-6">
                <FaExclamationTriangle className="text-6xl text-red-400 mx-auto" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Corner Decorations */}
          {isCameraOn && (
            <>
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </>
          )}
        </div>

        {/* HUD Overlay */}
        {isCameraOn && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            {/* Status */}
            <div className="glass-effect px-4 py-2 rounded-lg border border-primary/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-mono">SISTEMA ACTIVO</span>
              </div>
            </div>

            {/* FPS Counter */}
            <div className="glass-effect px-4 py-2 rounded-lg border border-primary/30">
              <span className="text-sm text-primary font-mono">MediaPipe AI</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isCameraOn ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartCamera}
            className="flex items-center space-x-3 px-8 py-4 bg-primary text-darker rounded-xl font-bold text-lg glow-button shadow-neon"
          >
            <FaPlay />
            <span>Iniciar Sistema</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStopCamera}
            className="flex items-center space-x-3 px-8 py-4 bg-red-500 text-white rounded-xl font-bold text-lg glow-button shadow-[0_0_20px_rgba(239,68,68,0.6)]"
          >
            <FaStop />
            <span>Detener Sistema</span>
          </motion.button>
        )}
      </div>

      {/* Gesture Detection Display */}
      <AnimatePresence>
        {currentGesture && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`glass-effect rounded-2xl p-6 border-2 ${getGestureGlow(currentGesture)}`}
          >
            <div className="space-y-4">
              {/* Gesture Name */}
              <div className="text-center">
                <h3 className="text-3xl font-bold neon-text mb-2">{currentGesture}</h3>
                <p className="text-gray-400">Gesto detectado</p>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Confianza IA</span>
                  <span className="text-primary font-mono">{(confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-darker rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-neon"
                  />
                </div>
              </div>

              {/* Action Info */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-gray-400">Acción:</span>
                <span className="text-primary font-semibold">
                  {currentGesture === 'Mano Abierta' && 'Sistema Activado'}
                  {currentGesture === 'Puño Cerrado' && 'Sistema en Pausa'}
                  {currentGesture === 'Pulgar Arriba' && 'Confirmación Exitosa'}
                  {currentGesture === 'Dos Dedos' && 'Menú Abierto'}
                  {currentGesture === 'Mano Derecha' && 'Navegación Siguiente'}
                  {currentGesture === 'Mano Izquierda' && 'Navegación Anterior'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestureCamera;
