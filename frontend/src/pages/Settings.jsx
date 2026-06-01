import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaVolumeUp, FaMoon, FaSlidersH, FaSave } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';
import Swal from 'sweetalert2';

const Settings = () => {
  const [settings, setSettings] = useState({
    sensitivity: 75,
    cameraResolution: '720p',
    soundEnabled: true,
    soundVolume: 50,
    darkMode: true,
    notifications: true,
    autoSave: true,
    language: 'es',
    minConfidence: 70
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Guardando Configuración',
      text: 'Aplicando cambios...',
      icon: 'info',
      background: '#0a0e27',
      color: '#fff',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      Swal.fire({
        title: '¡Configuración Guardada!',
        text: 'Los cambios se han aplicado correctamente',
        icon: 'success',
        background: '#0a0e27',
        color: '#fff',
        confirmButtonColor: '#00d9ff'
      });
    });
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
          <h1 className="text-4xl font-bold neon-text mb-2">Configuración</h1>
          <p className="text-gray-400">Personaliza el comportamiento del sistema</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IA Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaSlidersH className="text-2xl text-primary" />
              <h3 className="text-xl font-bold text-primary">Configuración de IA</h3>
            </div>

            <div className="space-y-6">
              {/* Sensitivity */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Sensibilidad de Detección
                  </label>
                  <span className="text-sm text-primary font-mono">{settings.sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sensitivity}
                  onChange={(e) => handleChange('sensitivity', e.target.value)}
                  className="w-full h-2 bg-darker rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mayor sensibilidad = detección más rápida pero menos precisa
                </p>
              </div>

              {/* Min Confidence */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Confianza Mínima
                  </label>
                  <span className="text-sm text-primary font-mono">{settings.minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={settings.minConfidence}
                  onChange={(e) => handleChange('minConfidence', e.target.value)}
                  className="w-full h-2 bg-darker rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nivel mínimo de confianza para aceptar un gesto
                </p>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Guardar Historial Automáticamente
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Registra todos los gestos detectados
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleChange('autoSave', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Camera Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaCamera className="text-2xl text-primary" />
              <h3 className="text-xl font-bold text-primary">Configuración de Cámara</h3>
            </div>

            <div className="space-y-6">
              {/* Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolución de Cámara
                </label>
                <select
                  value={settings.cameraResolution}
                  onChange={(e) => handleChange('cameraResolution', e.target.value)}
                  className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                >
                  <option value="480p">480p (640x480)</option>
                  <option value="720p">720p (1280x720) - Recomendado</option>
                  <option value="1080p">1080p (1920x1080)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Mayor resolución requiere más recursos
                </p>
              </div>

              {/* Camera Preview */}
              <div className="p-4 bg-darker/50 rounded-lg border border-primary/20">
                <p className="text-sm text-gray-400 mb-2">Vista Previa</p>
                <div className="aspect-video bg-darker rounded-lg flex items-center justify-center">
                  <FaCamera className="text-4xl text-primary/30" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sound Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaVolumeUp className="text-2xl text-primary" />
              <h3 className="text-xl font-bold text-primary">Configuración de Sonido</h3>
            </div>

            <div className="space-y-6">
              {/* Sound Enabled */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Efectos de Sonido
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Reproducir sonidos al detectar gestos
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Volume */}
              {settings.soundEnabled && (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Volumen
                    </label>
                    <span className="text-sm text-primary font-mono">{settings.soundVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.soundVolume}
                    onChange={(e) => handleChange('soundVolume', e.target.value)}
                    className="w-full h-2 bg-darker rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaMoon className="text-2xl text-primary" />
              <h3 className="text-xl font-bold text-primary">Configuración General</h3>
            </div>

            <div className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Modo Oscuro
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Tema oscuro para reducir fatiga visual
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleChange('darkMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Notificaciones
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Mostrar alertas del sistema
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Idioma
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full flex items-center justify-center space-x-3 py-4 bg-primary text-darker rounded-xl font-bold text-lg glow-button shadow-neon"
          >
            <FaSave />
            <span>Guardar Configuración</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
