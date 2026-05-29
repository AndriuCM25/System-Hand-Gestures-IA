import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHandPaper, FaUser, FaLock, FaArrowRight, FaMicrophone } from 'react-icons/fa';
import HolographicBackground from '../components/HolographicBackground';
import { useGesture } from '../context/GestureContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useGesture();
  const { welcome, isSupported } = useVoiceAssistant();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación
    if (!formData.username || !formData.password) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos',
        icon: 'error',
        background: '#0a0e27',
        color: '#fff',
        confirmButtonColor: '#00d9ff'
      });
      return;
    }

    // Login exitoso
    login(formData.username, formData.role);
    
    Swal.fire({
      title: 'Acceso Concedido',
      html: `
        <div class="text-center">
          <p class="text-lg mb-2">Bienvenido <span class="text-cyan-400 font-bold">${formData.username}</span></p>
          <p class="text-sm text-gray-400">Iniciando sistema HandControl AI...</p>
        </div>
      `,
      icon: 'success',
      background: '#0a0e27',
      color: '#fff',
      confirmButtonColor: '#00d9ff',
      timer: 2500,
      showConfirmButton: false
    });

    // Asistente de voz
    if (isSupported) {
      setTimeout(() => {
        welcome(formData.username);
      }, 500);
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <HolographicBackground />

      <div className="container mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="inline-block mb-4"
            >
              <FaHandPaper className="text-6xl text-primary animate-pulse-glow" />
            </motion.div>
            <h1 className="text-4xl font-bold neon-text mb-2">HandControl AI</h1>
            <p className="text-gray-400">Sistema de Autenticación</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-8 border border-primary/30"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-primary" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                    placeholder="Ingresa tu usuario"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-primary" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                >
                  <option value="admin">Administrador</option>
                  <option value="operator">Operador</option>
                </select>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-primary/30 bg-darker text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-400">Recordarme</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-primary text-darker rounded-lg font-bold text-lg glow-button shadow-neon"
              >
                <span>Iniciar Sesión</span>
                <FaArrowRight />
              </motion.button>

              {/* Voice Assistant Indicator */}
              {isSupported && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center space-x-2 text-sm text-primary/70 mt-4"
                >
                  <FaMicrophone className="animate-pulse" />
                  <span>Asistente de voz activado</span>
                </motion.div>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark text-gray-400">O continúa con</span>
              </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 glass-effect border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                Demo Admin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 glass-effect border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                Demo Operador
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6 text-sm text-gray-400"
          >
            <p>¿No tienes una cuenta? <a href="#" className="text-primary hover:underline">Solicitar acceso</a></p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
