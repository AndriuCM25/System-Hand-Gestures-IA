import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GestureCamera from '../components/GestureCamera';
import HolographicBackground from '../components/HolographicBackground';
import GridScan from '../components/GridScan';
import { 
  FaHandPaper, 
  FaFistRaised, 
  FaThumbsUp, 
  FaPeace, 
  FaArrowRight, 
  FaArrowLeft,
  FaLightbulb,
  FaRocket,
  FaBrain,
  FaEye
} from 'react-icons/fa';

const GesturePage = () => {
  const [selectedGesture, setSelectedGesture] = useState(null);

  const gestures = [
    {
      icon: FaHandPaper,
      name: 'Mano Abierta',
      action: 'Activar Sistema',
      color: 'cyan',
      emoji: '✋',
      description: 'Extiende todos los dedos',
      tip: 'Mantén la palma hacia la cámara'
    },
    {
      icon: FaFistRaised,
      name: 'Puño Cerrado',
      action: 'Pausar',
      color: 'red',
      emoji: '✊',
      description: 'Cierra la mano completamente',
      tip: 'Aprieta bien el puño'
    },
    {
      icon: FaThumbsUp,
      name: 'Pulgar Arriba',
      action: 'Confirmar',
      color: 'green',
      emoji: '👍',
      description: 'Levanta el pulgar',
      tip: 'Cierra los demás dedos'
    },
    {
      icon: FaPeace,
      name: 'Dos Dedos',
      action: 'Abrir Menú',
      color: 'yellow',
      emoji: '✌️',
      description: 'Muestra índice y medio',
      tip: 'Forma una "V" con los dedos'
    },
    {
      icon: FaArrowRight,
      name: 'Mano Derecha',
      action: 'Siguiente',
      color: 'blue',
      emoji: '👉',
      description: 'Apunta hacia la derecha',
      tip: 'Extiende el índice'
    },
    {
      icon: FaArrowLeft,
      name: 'Mano Izquierda',
      action: 'Anterior',
      color: 'purple',
      emoji: '👈',
      description: 'Apunta hacia la izquierda',
      tip: 'Extiende el índice'
    }
  ];

  const colorClasses = {
    cyan: 'border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20 hover:border-cyan-400',
    red: 'border-red-400/50 bg-red-400/10 hover:bg-red-400/20 hover:border-red-400',
    green: 'border-green-400/50 bg-green-400/10 hover:bg-green-400/20 hover:border-green-400',
    yellow: 'border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400/20 hover:border-yellow-400',
    blue: 'border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20 hover:border-blue-400',
    purple: 'border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20 hover:border-purple-400',
  };

  const iconColorClasses = {
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="min-h-screen relative">
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <div className="ml-0 md:ml-64 mt-20 p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <FaBrain className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold neon-text">IA Gestual</h1>
              <p className="text-sm sm:text-base text-gray-400">Detección en tiempo real con MediaPipe</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Camera Section - 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full relative"
            >
              {/* GridScan Background Effect */}
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
                <GridScan
                  sensitivity={0.55}
                  lineThickness={1}
                  linesColor="#2F293A"
                  gridScale={0.1}
                  scanColor="#00d9ff"
                  scanOpacity={0.5}
                  bloomIntensity={0.6}
                  chromaticAberration={0.002}
                  noiseIntensity={0.01}
                  lineJitter={0.1}
                  scanGlow={0.5}
                  scanSoftness={2}
                  enablePost={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              
              {/* Camera Component */}
              <div className="relative z-10">
                <GestureCamera />
              </div>
            </motion.div>
          </div>

          {/* Info Panel - 1 column */}
          <div className="space-y-4">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-xl p-4 border border-primary/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaEye className="text-2xl text-primary" />
                <h3 className="font-bold text-lg">Estado del Sistema</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Manos Detectadas</span>
                  <span className="text-primary font-bold">0-2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Precisión IA</span>
                  <span className="text-green-400 font-bold">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">FPS</span>
                  <span className="text-yellow-400 font-bold">30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Latencia</span>
                  <span className="text-cyan-400 font-bold">&lt;50ms</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl p-4 border border-yellow-400/30 bg-yellow-400/5"
            >
              <div className="flex items-center space-x-2 mb-3">
                <FaLightbulb className="text-xl text-yellow-400" />
                <h3 className="font-bold text-yellow-400">Tips Rápidos</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Buena iluminación</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>50-100 cm de distancia</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Gestos claros y lentos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Mantén 1-2 segundos</span>
                </li>
              </ul>
            </motion.div>

            {/* Technology Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-4 border border-primary/30"
            >
              <div className="flex items-center space-x-2 mb-2">
                <FaRocket className="text-primary" />
                <h3 className="font-bold text-sm">Tecnología</h3>
              </div>
              <p className="text-xs text-gray-400">MediaPipe Hands</p>
              <p className="text-xs text-gray-400">TensorFlow.js</p>
              <p className="text-xs text-gray-400">21 Landmarks Detection</p>
            </motion.div>
          </div>
        </div>

        {/* Gestures Guide - Compact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center space-x-2">
            <FaHandPaper className="text-primary" />
            <span>Gestos Disponibles</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {gestures.map((gesture, index) => {
              const Icon = gesture.icon;
              const isSelected = selectedGesture === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedGesture(isSelected ? null : index)}
                  className={`glass-effect rounded-xl p-4 border-2 transition-all cursor-pointer ${
                    isSelected ? colorClasses[gesture.color] + ' shadow-neon' : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{gesture.emoji}</div>
                    <h3 className="font-bold text-sm mb-1">{gesture.name}</h3>
                    <p className={`text-xs font-medium ${iconColorClasses[gesture.color]}`}>
                      {gesture.action}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Gesture Detail */}
          {selectedGesture !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-4 glass-effect rounded-xl p-6 border-2 ${colorClasses[gestures[selectedGesture].color]}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{gestures[selectedGesture].emoji}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{gestures[selectedGesture].name}</h3>
                  <p className={`text-lg font-medium mb-3 ${iconColorClasses[gestures[selectedGesture].color]}`}>
                    {gestures[selectedGesture].action}
                  </p>
                  <p className="text-gray-300 mb-2">{gestures[selectedGesture].description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <FaLightbulb className="text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Tip:</span>
                    <span className="text-gray-400">{gestures[selectedGesture].tip}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Instructions - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="glass-effect rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-bold text-sm">Preparación</h3>
            </div>
            <p className="text-xs text-gray-400">Buena iluminación y fondo uniforme</p>
          </div>

          <div className="glass-effect rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-bold text-sm">Posición</h3>
            </div>
            <p className="text-xs text-gray-400">50-100 cm de la cámara</p>
          </div>

          <div className="glass-effect rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-bold text-sm">Ejecución</h3>
            </div>
            <p className="text-xs text-gray-400">Gestos claros y definidos</p>
          </div>

          <div className="glass-effect rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              <h3 className="font-bold text-sm">Práctica</h3>
            </div>
            <p className="text-xs text-gray-400">La precisión mejora con el uso</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GesturePage;
