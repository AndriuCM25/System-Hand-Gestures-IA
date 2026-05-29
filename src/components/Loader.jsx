import { motion } from 'framer-motion';
import { FaHandPaper } from 'react-icons/fa';

const Loader = ({ message = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 bg-darker/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Hand Icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="mb-6"
        >
          <FaHandPaper className="text-7xl text-primary mx-auto animate-pulse-glow" />
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
        />

        {/* Message */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-xl text-primary font-medium"
        >
          {message}
        </motion.p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
