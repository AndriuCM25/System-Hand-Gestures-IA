import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const InitialLoader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('INICIANDO');
  const [isComplete, setIsComplete] = useState(false);
  const onLoadCompleteRef = useRef(onLoadComplete);

  useEffect(() => {
    onLoadCompleteRef.current = onLoadComplete;
  }, [onLoadComplete]);

  useEffect(() => {
    const stages = [
      { progress: 15, text: 'INICIANDO SISTEMA' },
      { progress: 35, text: 'CARGANDO MÓDULOS IA' },
      { progress: 55, text: 'INICIALIZANDO MEDIAPIPE' },
      { progress: 75, text: 'CARGANDO MODELO 3D' },
      { progress: 90, text: 'PREPARANDO INTERFAZ' },
      { progress: 100, text: 'OPTIMIZANDO RECURSOS' },
    ];

    let currentProgress = 0;
    const totalDuration = 12000;
    const incrementInterval = 50;
    const incrementAmount = 100 / (totalDuration / incrementInterval);

    setLoadingStage(stages[0].text);

    const progressTimer = setInterval(() => {
      currentProgress += incrementAmount;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(progressTimer);

        setTimeout(() => {
          setLoadingStage('BIENVENIDO');
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onLoadCompleteRef.current();
            }, 800);
          }, 1500);
        }, 500);
      } else {
        setProgress(Math.floor(currentProgress));
        stages.forEach(stage => {
          if (Math.floor(currentProgress) === stage.progress) {
            setLoadingStage(stage.text);
          }
        });
      }
    }, incrementInterval);

    return () => clearInterval(progressTimer);
  }, []); // ← vacío, corre UNA sola vez

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-[#050A14] overflow-hidden"
        >
          <div className="absolute inset-0 opacity-30">
            <Spline scene="https://prod.spline.design/sjQfmUyh7zfIY0jk/scene.splinecode" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-[#050A14]/80 via-[#050A14]/60 to-[#050A14]/90 backdrop-blur-sm" />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,207,255,0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0,207,255,0.5)',
                    '0 0 40px rgba(0,207,255,0.8)',
                    '0 0 20px rgba(0,207,255,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                style={{
                  background: 'linear-gradient(135deg, #00CFFF 0%, #0080FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                HANDCONTROL
              </motion.h1>
              <p className="text-[#00CFFF] text-sm md:text-base font-mono tracking-[0.3em] uppercase">
                Artificial Intelligence System
              </p>
            </motion.div>

            <motion.div
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border-2 border-[#00CFFF] border-t-transparent rounded-full"
                />
                <p className="text-white text-lg md:text-xl font-bold tracking-wide">
                  {loadingStage}
                </p>
              </div>
            </motion.div>

            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#00CFFF]/60 text-xs font-mono tracking-wider">
                  PROGRESO
                </span>
                <motion.span
                  key={progress}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-[#00CFFF] text-2xl font-black font-mono"
                >
                  {progress}%
                </motion.span>
              </div>

              <div className="relative h-3 bg-[#0A1628] rounded-full border border-[#00CFFF]/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00CFFF]/5 to-transparent" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #00CFFF 0%, #0080FF 100%)',
                    boxShadow: '0 0 20px rgba(0,207,255,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 w-1/2"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    }}
                  />
                </motion.div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00CFFF]/40" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00CFFF]/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00CFFF]/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00CFFF]/40" />
              </div>

              <div className="flex justify-between mt-2 px-1">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div key={mark} className="flex flex-col items-center">
                    <div
                      className={`w-0.5 h-2 rounded-full transition-colors duration-300 ${
                        progress >= mark ? 'bg-[#00CFFF]' : 'bg-[#00CFFF]/20'
                      }`}
                    />
                    <span className="text-[10px] text-[#00CFFF]/40 font-mono mt-1">{mark}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center space-y-1"
            >
              <p className="text-[#00CFFF]/40 text-xs font-mono tracking-wider">
                HANDCONTROL AI v3.0.0
              </p>
              <p className="text-[#00CFFF]/30 text-xs font-mono">
                Powered by MediaPipe & TensorFlow.js
              </p>
            </motion.div>

            <motion.div
              animate={{ y: ['0%', '100vh', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,207,255,0.6), transparent)',
                boxShadow: '0 0 10px rgba(0,207,255,0.8)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;