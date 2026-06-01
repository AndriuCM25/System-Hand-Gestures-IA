/**
 * GestureActionToast.jsx
 * Notificación visual en pantalla cuando un gesto dispara una acción.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '../context/GestureContext';

const GESTURE_META = {
  'Mano Abierta':    { emoji: '✋', color: '#00d9ff', label: 'Dashboard' },
  'Puño Cerrado':    { emoji: '✊', color: '#ef4444', label: 'Pausando' },
  'Pulgar Arriba':   { emoji: '👍', color: '#22c55e', label: 'Analítica' },
  'Dos Dedos':       { emoji: '✌️', color: '#facc15', label: 'Sidebar' },
  'Mano Derecha':    { emoji: '👉', color: '#3b82f6', label: 'Siguiente →' },
  'Mano Izquierda':  { emoji: '👈', color: '#a855f7', label: '← Anterior' },
};

const GestureActionToast = () => {
  const { subscribeToActions } = useGesture();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsub = subscribeToActions(({ gesture, action }) => {
      const meta = GESTURE_META[gesture] || { emoji: '🤚', color: '#00d9ff', label: action };
      setToast({ gesture, action, ...meta, id: Date.now() });
    });
    return unsub;
  }, [subscribeToActions]);

  // Auto-cerrar el toast después de 2.5 s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 80,  scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{ borderColor: toast.color, boxShadow: `0 0 24px ${toast.color}66` }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
                     flex items-center gap-4 px-6 py-4 rounded-2xl border-2
                     bg-[#0a0f1e]/95 backdrop-blur-md min-w-[260px]"
        >
          {/* Emoji grande */}
          <motion.span
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="text-4xl select-none"
          >
            {toast.emoji}
          </motion.span>

          {/* Textos */}
          <div className="flex-1">
            <p className="font-bold text-white text-base leading-tight">{toast.gesture}</p>
            <p className="text-sm mt-0.5" style={{ color: toast.color }}>{toast.action}</p>
          </div>

          {/* Barra de progreso */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
            style={{ background: toast.color }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 2.5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GestureActionToast;
