import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FaHome,
  FaHistory,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import manoLogo from '../assets/mano.png';

// Custom component for the hand logo icon
const HandLogoIcon = ({ className }) => (
  <img 
    src={manoLogo} 
    alt="IA Gestual" 
    className={className}
    style={{ width: '1.25rem', height: '1.25rem', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(0,207,255,0.4))' }}
  />
);

const menuItems = [
  { path: '/dashboard', icon: FaHome, label: 'Dashboard', color: 'cyan' },
  { path: '/gesture', icon: HandLogoIcon, label: 'IA Gestual', color: 'green', isCustomIcon: true },
  { path: '/history', icon: FaHistory, label: 'Historial', color: 'yellow' },
  { path: '/analytics', icon: FaChartBar, label: 'Analytics', color: 'purple' },
  { path: '/reports', icon: FaFileAlt, label: 'Reportes', color: 'blue' },
  { path: '/settings', icon: FaCog, label: 'Configuración', color: 'gray' },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="md:hidden fixed left-4 bottom-6 z-50 w-14 h-14 flex items-center justify-center glass-effect rounded-full border-2 border-primary/50 hover:border-primary transition-all shadow-neon"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes className="text-primary text-xl" /> : <FaBars className="text-primary text-xl" />}
        </motion.div>
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (window.innerWidth < 768 ? -300 : 0),
          width: isCollapsed && window.innerWidth >= 768 ? 80 : 256
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-20 bottom-0 glass-effect border-r border-primary/20 z-40 ${
          isOpen || window.innerWidth >= 768 ? 'block' : 'hidden'
        }`}
      >
        <div className="flex flex-col h-full p-3 sm:p-4 overflow-hidden">
          {/* Collapse Button - Desktop only */}
          <div className="hidden md:flex justify-end mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCollapse}
              className="p-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
            >
              {isCollapsed ? (
                <FaChevronRight className="text-primary" />
              ) : (
                <FaChevronLeft className="text-primary" />
              )}
            </motion.button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path} onClick={closeSidebar}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: isCollapsed ? 0 : 10, scale: 1.02 }}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 sm:px-4 py-3 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-primary/20 border border-primary/50 shadow-neon'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {item.isCustomIcon ? (
                      <Icon className={`flex-shrink-0 ${isActive ? 'brightness-125' : 'brightness-75 group-hover:brightness-125'} transition-all`} />
                    ) : (
                      <Icon className={`text-lg sm:text-xl flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'} transition-colors`} />
                    )}
                    {!isCollapsed && (
                      <span className={`font-medium text-sm sm:text-base ${isActive ? 'text-primary' : 'text-gray-300 group-hover:text-white'} transition-colors`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"
                      />
                    )}
                    {isActive && isCollapsed && (
                      <motion.div
                        className="absolute right-0 w-1 h-8 bg-primary rounded-l-full"
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
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 sm:px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all group`}
              title={isCollapsed ? 'Cerrar Sesión' : ''}
            >
              <FaSignOutAlt className="text-lg sm:text-xl text-red-400 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm sm:text-base text-red-400">Cerrar Sesión</span>
              )}
            </motion.button>
          </Link>

          {/* System Info */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 sm:p-4 rounded-xl glass-effect border border-primary/20"
            >
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between items-center">
                  <span>Versión:</span>
                  <span className="text-primary font-mono">v3.0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estado:</span>
                  <span className="text-green-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span>Operativo</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>IA:</span>
                  <span className="text-primary font-mono">MediaPipe</span>
                </div>
              </div>
            </motion.div>
          )}

          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-center"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
