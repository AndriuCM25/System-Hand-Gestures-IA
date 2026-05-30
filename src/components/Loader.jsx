import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import manoLogo from '../assets/mano.png';

const Loader = ({ message = 'Cargando...' }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('INICIANDO');

  useEffect(() => {
    // Etapas de carga - DURACIÓN REAL DE 10 SEGUNDOS
    const stages = [
      { progress: 25, text: 'INICIANDO PÁGINA' },
      { progress: 50, text: 'CARGANDO RECURSOS' },
      { progress: 75, text: 'PREPARANDO INTERFAZ' },
      { progress: 100, text: 'OPTIMIZANDO' },
    ];

    let currentProgress = 0;
    const totalDuration = 10000; // 10 segundos
    const incrementInterval = 50; // Actualizar cada 50ms
    const incrementAmount = 100 / (totalDuration / incrementInterval);

    // Iniciar primera etapa
    setLoadingStage(stages[0].text);

    // Animar progreso
    const progressTimer = setInterval(() => {
      currentProgress += incrementAmount;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(progressTimer);
        
        // Mostrar "BIENVENIDO"
        setTimeout(() => {
          setLoadingStage('BIENVENIDO');
        }, 300);
      } else {
        setProgress(Math.floor(currentProgress));
        
        // Cambiar etapa según el progreso
        stages.forEach(stage => {
          if (Math.floor(currentProgress) === stage.progress) {
            setLoadingStage(stage.text);
          }
        });
      }
    }, incrementInterval);

    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050A14] z-[9999] overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 opacity-25">
        <Spline scene="https://prod.spline.design/sjQfmUyh7zfIY0jk/scene.splinecode" />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050A14]/70 via-[#050A14]/50 to-[#050A14]/80 backdrop-blur-sm" />

      {/* Glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,207,255,0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Logo animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <img
              src={manoLogo}
              alt="HandControl AI"
              className="w-24 h-24 object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(0,207,255,0.8))',
              }}
            />
            {/* Glow pulsante */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,207,255,0.4) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black tracking-tight mb-2"
          style={{
            background: 'linear-gradient(135deg, #00CFFF 0%, #0080FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          HANDCONTROL AI
        </motion.h1>

        {/* Loading Stage */}
        <motion.div
          key={loadingStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border-2 border-[#00CFFF] border-t-transparent rounded-full"
            />
            <p className="text-white text-base md:text-lg font-bold tracking-wide">
              {loadingStage}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-sm">
          {/* Progress percentage */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#00CFFF]/60 text-xs font-mono tracking-wider uppercase">
              Progreso
            </span>
            <motion.span
              key={progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-[#00CFFF] text-xl font-black font-mono"
            >
              {progress}%
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2.5 bg-[#0A1628] rounded-full border border-[#00CFFF]/20 overflow-hidden">
            {/* Progress fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00CFFF 0%, #0080FF 100%)',
                boxShadow: '0 0 15px rgba(0,207,255,0.6)',
              }}
            >
              {/* Animated shine effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 w-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                }}
              />
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00CFFF]/50" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#00CFFF]/50" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#00CFFF]/50" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#00CFFF]/50" />
          </div>

          {/* Progress segments */}
          <div className="flex justify-between mt-2 px-0.5">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div key={mark} className="flex flex-col items-center">
                <div
                  className={`w-0.5 h-1.5 rounded-full transition-colors duration-300 ${
                    progress >= mark ? 'bg-[#00CFFF]' : 'bg-[#00CFFF]/20'
                  }`}
                />
                <span className="text-[9px] text-[#00CFFF]/40 font-mono mt-1">
                  {mark}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-[#00CFFF]/40 text-xs font-mono tracking-wider">
            v3.0.0 • MediaPipe AI
          </p>
        </motion.div>

        {/* Scan line effect */}
        <motion.div
          animate={{
            y: ['0%', '100vh', '0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,207,255,0.5), transparent)',
            boxShadow: '0 0 8px rgba(0,207,255,0.6)',
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
