import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHandPaper, FaTimes, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const tutorialSteps = [
  {
    title: '¡Bienvenido a HandControl AI!',
    description: 'Aprende a controlar el sistema con gestos de mano en solo 4 pasos.',
    icon: '👋',
    image: null,
    tips: [
      'Asegúrate de tener buena iluminación',
      'Coloca tu mano frente a la cámara',
      'Mantén el fondo despejado'
    ]
  },
  {
    title: 'Gesto: Mano Abierta ✋',
    description: 'Abre tu mano completamente con los dedos extendidos. Este gesto activa el modo de navegación.',
    icon: '✋',
    gesture: 'open_hand',
    tips: [
      'Extiende todos los dedos',
      'Mantén la palma hacia la cámara',
      'Separa los dedos ligeramente'
    ]
  },
  {
    title: 'Gesto: Puño Cerrado ✊',
    description: 'Cierra tu mano en un puño. Este gesto se usa para seleccionar elementos.',
    icon: '✊',
    gesture: 'closed_fist',
    tips: [
      'Cierra todos los dedos',
      'Mantén el pulgar sobre los dedos',
      'Forma un puño firme'
    ]
  },
  {
    title: 'Gesto: Pulgar Arriba 👍',
    description: 'Levanta el pulgar mientras mantienes los demás dedos cerrados. Confirma acciones.',
    icon: '👍',
    gesture: 'thumbs_up',
    tips: [
      'Solo el pulgar extendido',
      'Otros dedos cerrados',
      'Pulgar apuntando hacia arriba'
    ]
  },
  {
    title: 'Gesto: Victoria ✌️',
    description: 'Extiende el índice y el medio formando una "V". Navega entre opciones.',
    icon: '✌️',
    gesture: 'victory',
    tips: [
      'Solo índice y medio extendidos',
      'Forma una "V" clara',
      'Otros dedos cerrados'
    ]
  },
  {
    title: '¡Listo para Comenzar! 🚀',
    description: 'Ya conoces los gestos básicos. Practica en la página de Gestos para dominar el sistema.',
    icon: '🎉',
    tips: [
      'Practica cada gesto varias veces',
      'Revisa las estadísticas en Analytics',
      'Consulta el historial de gestos'
    ]
  }
];

const Tutorial = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    if (onComplete) onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl glass-effect rounded-3xl border-2 border-primary/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full glass-effect border border-gray-600 hover:border-primary transition-colors group"
            >
              <FaTimes className="text-gray-400 group-hover:text-primary transition-colors" />
            </button>

            {/* Content */}
            <div className="p-8 sm:p-12">
              {/* Icon */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="text-8xl text-center mb-6"
              >
                {step.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold text-center mb-4 neon-text"
              >
                {step.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-300 text-center mb-8 max-w-xl mx-auto"
              >
                {step.description}
              </motion.p>

              {/* Tips */}
              <motion.div
                key={`tips-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-2xl p-6 mb-8 border border-primary/20"
              >
                <h3 className="text-sm font-bold text-primary mb-3 flex items-center">
                  <FaHandPaper className="mr-2" />
                  Consejos:
                </h3>
                <ul className="space-y-2">
                  {step.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start space-x-2 text-sm text-gray-300"
                    >
                      <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-500'
                      : 'glass-effect border border-primary/30 hover:border-primary text-white'
                  }`}
                >
                  <FaArrowLeft />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Step Indicator */}
                <div className="flex items-center space-x-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep
                          ? 'bg-primary w-8'
                          : completedSteps.includes(index)
                          ? 'bg-green-400'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-darker rounded-xl font-bold hover:shadow-neon transition-all"
                >
                  <span>
                    {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
                  </span>
                  <FaArrowRight />
                </button>
              </div>

              {/* Skip Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Saltar tutorial
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tutorial;
