import { Link, useLocation } from 'react-router-dom';
import { FaBell, FaUser, FaCog, FaBars, FaVideo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGesture } from '../context/GestureContext';
import { useState } from 'react';
import manoLogo from '../assets/mano.png';

const Navbar = () => {
  const location = useLocation();
  const { isActive, userName } = useGesture();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative w-8 h-8 sm:w-10 sm:h-10"
            >
              <img 
                src={manoLogo} 
                alt="HandControl AI Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,207,255,0.6)]"
              />
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold neon-text">HandControl AI</h1>
              <p className="text-xs text-primary/70 hidden md:block">Gesture Navigation System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold neon-text">HandControl</h1>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            {/* Status Indicator - Hidden on small mobile */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse shadow-neon-green' : 'bg-red-500'}`} />
              <span className="text-xs sm:text-sm font-medium">
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Floating Camera Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.dispatchEvent(new Event('open-floating-camera'))}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-effect border border-primary/50 text-primary hover:bg-primary/20 transition-colors"
              title="Abrir Cámara Global"
            >
              <FaVideo className="text-sm" />
              <span className="text-xs font-bold">Cámara</span>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
              >
                <FaBell className="text-base sm:text-xl text-primary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 sm:w-80 glass-effect rounded-xl border border-primary/30 p-4 shadow-neon"
                >
                  <h3 className="text-sm font-bold text-primary mb-3">Notificaciones</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="p-2 bg-darker/50 rounded-lg text-xs">
                      <p className="text-white font-medium">Sistema iniciado</p>
                      <p className="text-gray-400">Hace 5 minutos</p>
                    </div>
                    <div className="p-2 bg-darker/50 rounded-lg text-xs">
                      <p className="text-white font-medium">Nuevo gesto detectado</p>
                      <p className="text-gray-400">Hace 10 minutos</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Settings - Hidden on mobile */}
            <Link to="/settings" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
              >
                <FaCog className="text-xl text-primary" />
              </motion.button>
            </Link>

            {/* User Profile */}
            <Link to="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors border border-primary/20"
              >
                <FaUser className="text-primary text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{userName}</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
