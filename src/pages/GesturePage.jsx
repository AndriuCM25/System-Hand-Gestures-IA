import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GestureCamera from '../components/GestureCamera';
import HolographicBackground from '../components/HolographicBackground';
import { FaHandPaper, FaFistRaised, FaThumbsUp, FaPeace, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const GesturePage = () => {
  const gestures = [
    {
      icon: FaHandPaper,
      name: 'Mano Abierta',
      action: 'Activar Sistema',
      color: 'cyan',
      description: 'Extiende todos los dedos para activar'
    },
    {
      icon: FaFistRaised,
      name: 'Puño Cerrado',
      action: 'Pausar',
      color: 'red',
      description: 'Cierra la mano completamente'
    },
    {
      icon: FaThumbsUp,
      name: 'Pulgar Arriba',
      action: 'Confirmar',
      color: 'green',
      description: 'Levanta el pulgar para confirmar'
    },
    {
      icon: FaPeace,
      name: 'Dos Dedos',
      action: 'Abrir Menú',
      color: 'yellow',
      description: 'Muestra índice y medio'
    },
    {
      icon: FaArrowRight,
      name: 'Mano Derecha',
      action: 'Siguiente',
      color: 'blue',
      description: 'Apunta hacia la derecha'
    },
    {
      icon: FaArrowLeft,
      name: 'Mano Izquierda',
      action: 'Anterior',
      color: 'purple',
      description: 'Apunta hacia la izquierda'
    }
  ];

  const colorClasses = {
    cyan: 'border-cyan-400/30 bg-cyan-400/5 hover:border-cyan-400/50',
    red: 'border-red-400/30 bg-red-400/5 hover:border-red-400/50',
    green: 'border-green-400/30 bg-green-400/5 hover:border-green-400/50',
    yellow: 'border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/50',
    blue: 'border-blue-400/30 bg-blue-400/5 hover:border-blue-400/50',
    purple: 'border-purple-400/30 bg-purple-400/5 hover:border-purple-400/50',
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

      <div className="ml-64 mt-20 p-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold neon-text mb-2">IA Gestual</h1>
          <p className="text-gray-400">Sistema de detección y reconocimiento de gestos en tiempo real</p>
        </motion.div>

        {/* Camera Section */}
        <div className="mb-8">
          <GestureCamera />
        </div>

        {/* Gestures Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Gestos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gestures.map((gesture, index) => {
              const Icon = gesture.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`glass-effect rounded-xl p-6 border transition-all ${colorClasses[gesture.color]}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${colorClasses[gesture.color]}`}>
                      <Icon className={`text-3xl ${iconColorClasses[gesture.color]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{gesture.name}</h3>
                      <p className={`text-sm font-medium mb-2 ${iconColorClasses[gesture.color]}`}>
                        {gesture.action}
                      </p>
                      <p className="text-xs text-gray-400">{gesture.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Instrucciones de Uso</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Preparación</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Asegúrate de tener buena iluminación</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Colócate a 50-100 cm de la cámara</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Usa un fondo uniforme si es posible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Mantén la mano dentro del cuadro</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Consejos</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Realiza gestos claros y definidos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Mantén el gesto por 1-2 segundos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Evita movimientos bruscos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>La precisión mejora con la práctica</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Technical Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="glass-effect rounded-xl p-6 border border-primary/20">
            <h3 className="font-bold text-primary mb-2">Tecnología</h3>
            <p className="text-sm text-gray-300">MediaPipe Hands + TensorFlow.js</p>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-primary/20">
            <h3 className="font-bold text-primary mb-2">Precisión</h3>
            <p className="text-sm text-gray-300">98.5% de confianza promedio</p>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-primary/20">
            <h3 className="font-bold text-primary mb-2">Latencia</h3>
            <p className="text-sm text-gray-300">Detección en tiempo real (&lt;50ms)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GesturePage;
