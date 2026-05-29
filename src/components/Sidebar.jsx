import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FaHome,
  FaHandPaper,
  FaHistory,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const menuItems = [
  { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
  { path: '/gesture', icon: FaHandPaper, label: 'IA Gestual' },
  { path: '/history', icon: FaHistory, label: 'Historial' },
  { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
  { path: '/reports', icon: FaFileAlt, label: 'Reportes' },
  { path: '/settings', icon: FaCog, label: 'Configuración' },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed left-4 top-24 z-50 w-12 h-12 flex items-center justify-center glass-effect rounded-xl border border-primary/30 hover:border-primary transition-colors"
      >
        {isOpen ? <FaTimes className="text-primary" /> : <FaBars className="text-primary" />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 top-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: isOpen ? 0 : -300 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:translate-x-0 md:animate-none fixed left-0 top-20 bottom-0 w-64 glass-effect border-r border-primary/20 z-40 md:block"
        style={{ 
          transform: 'translateX(0)',
          animation: 'none'
        }}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path} onClick={closeSidebar}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/20 border border-primary/50 shadow-neon'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`text-xl ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                    <span className={`font-medium ${isActive ? 'text-primary' : 'text-gray-300'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <Link to="/" onClick={closeSidebar}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
            >
              <FaSignOutAlt className="text-xl text-red-400" />
              <span className="font-medium text-red-400">Cerrar Sesión</span>
            </motion.button>
          </Link>

          {/* System Info */}
          <div className="mt-4 p-4 rounded-lg glass-effect border border-primary/20">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Versión:</span>
                <span className="text-primary">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-green-400">Operativo</span>
              </div>
              <div className="flex justify-between">
                <span>IA:</span>
                <span className="text-primary">MediaPipe</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar (always visible) */}
      <style jsx>{`
        @media (min-width: 768px) {
          aside {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
