import { Link, useLocation } from 'react-router-dom';
import { FaHandPaper, FaBell, FaUser, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGesture } from '../context/GestureContext';

const Navbar = () => {
  const location = useLocation();
  const { isActive, userName } = useGesture();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <FaHandPaper className="text-3xl text-primary" />
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold neon-text">HandControl AI</h1>
              <p className="text-xs text-primary/70">Gesture Navigation System</p>
            </div>
          </Link>

          {/* Status Indicator */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isActive ? 'Sistema Activo' : 'Sistema Inactivo'}
              </span>
            </div>

            {/* Icons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
            >
              <FaBell className="text-xl text-primary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
            >
              <FaCog className="text-xl text-primary" />
            </motion.button>

            <Link to="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
              >
                <FaUser className="text-primary" />
                <span className="text-sm font-medium">{userName}</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
