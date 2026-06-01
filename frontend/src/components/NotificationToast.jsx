import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const NotificationToast = ({ type = 'info', message, onClose, duration = 3000 }) => {
  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
    warning: FaExclamationCircle
  };

  const colors = {
    success: 'border-green-400/50 bg-green-400/10 text-green-400',
    error: 'border-red-400/50 bg-red-400/10 text-red-400',
    info: 'border-primary/50 bg-primary/10 text-primary',
    warning: 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400'
  };

  const Icon = icons[type];

  // Auto close
  if (duration > 0) {
    setTimeout(() => {
      onClose && onClose();
    }, duration);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`fixed top-24 right-6 z-50 glass-effect rounded-xl p-4 border ${colors[type]} min-w-[300px] max-w-md shadow-2xl`}
      >
        <div className="flex items-start space-x-3">
          <Icon className="text-2xl flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm font-medium">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationToast;
