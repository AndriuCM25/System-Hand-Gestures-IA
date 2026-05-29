import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaHandPaper,
  FaBrain,
  FaRocket,
  FaCity,
  FaChartLine,
  FaShieldAlt,
  FaGlobe,
  FaUsers,
  FaMicrochip,
  FaEye
} from 'react-icons/fa';
import HolographicBackground from '../components/HolographicBackground';
import RobotHand3D from '../components/RobotHand3D';

const Landing = () => {
  const benefits = [
    {
      icon: FaHandPaper,
      title: 'Navegación Touchless',
      description: 'Control total sin contacto físico mediante gestos inteligentes'
    },
    {
      icon: FaBrain,
      title: 'IA en Tiempo Real',
      description: 'Procesamiento instantáneo con MediaPipe y TensorFlow.js'
    },
    {
      icon: FaShieldAlt,
      title: 'Accesibilidad Inteligente',
      description: 'Diseñado para personas con discapacidad motriz'
    },
    {
      icon: FaCity,
      title: 'Integración Smart City',
      description: 'Compatible con kioskos y pantallas públicas'
    },
    {
      icon: FaRocket,
      title: 'Control Gestual Avanzado',
      description: 'Detección precisa de múltiples gestos simultáneos'
    },
    {
      icon: FaGlobe,
      title: 'Solución Global',
      description: 'Implementado en 5 países y 150 empresas'
    }
  ];

  const stats = [
    { value: '98%', label: 'Precisión IA' },
    { value: '20K+', label: 'Gestos Procesados' },
    { value: '150+', label: 'Empresas' },
    { value: '5', label: 'Países' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HolographicBackground />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full glass-effect border border-primary/30 mb-4 sm:mb-6"
              >
                <FaMicrochip className="text-primary animate-pulse text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-medium">Powered by AI & Computer Vision</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
                <span className="neon-text">HandControl</span>
                <br />
                <span className="text-primary">AI</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-3 sm:mb-4">
                Sistema Inteligente de Navegación por Gestos
              </p>
              
              <p className="text-base sm:text-lg text-primary/80 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Controla la tecnología sin tocar la pantalla. Experimenta el futuro de la interacción humano-computadora con IA en tiempo real.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
                {[
                  { icon: FaEye, text: '98% Precisión' },
                  { icon: FaBrain, text: 'IA en Tiempo Real' },
                  { icon: FaShieldAlt, text: '100% Seguro' },
                  { icon: FaRocket, text: 'Ultra Rápido' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="text-primary text-lg sm:text-xl flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link to="/login" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-darker rounded-xl font-bold text-base sm:text-lg glow-button shadow-neon-strong flex items-center justify-center space-x-2"
                  >
                    <FaRocket />
                    <span>Iniciar Sistema</span>
                  </motion.button>
                </Link>
                
                <Link to="/gesture" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 glass-effect border-2 border-primary rounded-xl font-bold text-base sm:text-lg text-primary hover:bg-primary/10 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaHandPaper />
                    <span>Ver Demo</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right - 3D Robot Hand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] order-first lg:order-last"
            >
              <RobotHand3D />
              
              {/* Overlay Info - Flotante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 glass-effect rounded-xl p-3 sm:p-4 border border-primary/30 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Sistema de IA</p>
                    <p className="text-sm sm:text-base font-bold text-primary">MediaPipe + TensorFlow.js</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm text-green-400">Online</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center border border-primary/20 hover:border-primary/50 transition-all"
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 neon-text">
              Tecnología de Vanguardia
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
              Solución empresarial para el futuro de la interacción humano-computadora
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-effect rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-primary/20 hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-2xl sm:text-3xl text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-white group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 neon-text">
              Casos de Uso Reales
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                title: 'Empresas',
                items: ['Pantallas inteligentes', 'Oficinas touchless', 'Salas interactivas']
              },
              {
                title: 'Salud',
                items: ['Quirófanos', 'Hospitales', 'Sistemas sin contacto']
              },
              {
                title: 'Accesibilidad',
                items: ['Discapacidad motriz', 'Adultos mayores', 'Inclusión digital']
              },
              {
                title: 'Smart City',
                items: ['Kioskos públicos', 'Navegación sin contacto', 'Información turística']
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-primary/20"
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary">{useCase.title}</h3>
                <ul className="space-y-2">
                  {useCase.items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm sm:text-base text-gray-300">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6 mb-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center border-2 border-primary/30"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 neon-text">
              ¿Listo para el Futuro?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Únete a las empresas que ya están transformando la interacción digital
            </p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-primary text-darker rounded-xl font-bold text-lg sm:text-xl glow-button shadow-neon-strong"
              >
                Comenzar Ahora
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
