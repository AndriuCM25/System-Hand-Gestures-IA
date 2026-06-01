import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GestureCamera from '../components/GestureCamera';
import HolographicBackground from '../components/HolographicBackground';
import { useGesture } from '../context/GestureContext';
import {
  FaHandPaper, FaFistRaised, FaThumbsUp, FaPeace,
  FaArrowRight, FaArrowLeft, FaLightbulb, FaRocket, FaBrain, FaEye
} from 'react-icons/fa';

// ─── Datos de gestos ──────────────────────────────────────────────────────────
const GESTURES = [
  { name: 'Mano Abierta',   action: 'Ir a Dashboard',    color: 'cyan',   emoji: '✋', icon: FaHandPaper,  tip: 'Palma hacia la cámara, dedos extendidos' },
  { name: 'Puño Cerrado',   action: 'Pausar sistema',     color: 'red',    emoji: '✊', icon: FaFistRaised, tip: 'Cierra la mano completamente' },
  { name: 'Pulgar Arriba',  action: 'Ir a Analítica',     color: 'green',  emoji: '👍', icon: FaThumbsUp,   tip: 'Solo el pulgar hacia arriba' },
  { name: 'Dos Dedos',      action: 'Toggle Sidebar',     color: 'yellow', emoji: '✌️', icon: FaPeace,      tip: 'Índice y medio extendidos (V)' },
  { name: 'Mano Derecha',   action: 'Página siguiente',   color: 'blue',   emoji: '👉', icon: FaArrowRight, tip: 'Solo índice apuntando derecha' },
  { name: 'Mano Izquierda', action: 'Página anterior',    color: 'purple', emoji: '👈', icon: FaArrowLeft,  tip: 'Solo índice apuntando izquierda' },
];

const COLOR = {
  cyan:   { border: 'border-cyan-400',   bg: 'bg-cyan-400/15',   text: 'text-cyan-400',   glow: 'shadow-[0_0_20px_rgba(0,217,255,0.5)]' },
  red:    { border: 'border-red-400',    bg: 'bg-red-400/15',    text: 'text-red-400',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
  green:  { border: 'border-green-400',  bg: 'bg-green-400/15',  text: 'text-green-400',  glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
  yellow: { border: 'border-yellow-400', bg: 'bg-yellow-400/15', text: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
  blue:   { border: 'border-blue-400',   bg: 'bg-blue-400/15',   text: 'text-blue-400',   glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
  purple: { border: 'border-purple-400', bg: 'bg-purple-400/15', text: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]' },
};

// ─── Componente: Lista de gestos (columna derecha) ────────────────────────────
const GestureList = ({ currentGesture, confidence }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.15 }}
    className="glass-effect rounded-2xl border border-primary/30 overflow-hidden h-full flex flex-col"
  >
    {/* Header */}
    <div className="p-4 border-b border-primary/20 flex items-center space-x-3">
      <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
        <FaHandPaper className="text-primary" />
      </div>
      <div>
        <h2 className="font-bold text-base neon-text">Gestos Disponibles</h2>
        <p className="text-xs text-gray-500">7 gestos entrenados</p>
      </div>
    </div>

    {/* Cards de gestos */}
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {GESTURES.map((g, i) => {
        const isActive = currentGesture === g.name;
        const c = COLOR[g.color];
        return (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: isActive ? 0 : 0, scale: isActive ? 1.02 : 1 }}
            transition={{ delay: i * 0.04 }}
            className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-default
              ${isActive
                ? `${c.border} ${c.bg} ${c.glow}`
                : 'border-white/5 bg-white/3 hover:border-white/15'
              }`}
          >
            {/* Badge ACTIVO */}
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
              >
                ACTIVO
              </motion.span>
            )}

            {/* Emoji animado */}
            <motion.span
              animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={isActive ? { duration: 0.6, repeat: Infinity } : {}}
              className="text-2xl flex-shrink-0 w-8 text-center"
            >
              {g.emoji}
            </motion.span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm leading-tight ${isActive ? c.text : 'text-white'}`}>
                {g.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{g.action}</p>
              {isActive && (
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Confianza</span>
                    <span className={`font-bold ${c.text}`}>{(confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 0.2 }}
                      className={`h-full rounded-full bg-current ${c.text}`}
                    />
                  </div>
                </div>
              )}
              {!isActive && (
                <p className="text-[10px] text-gray-600 mt-0.5 italic truncate">{g.tip}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Footer — Gesto neutro */}
    <div className="p-3 border-t border-primary/10">
      <div className={`flex items-center gap-2 p-2 rounded-lg border text-xs
        ${!currentGesture
          ? 'border-primary/30 bg-primary/5 text-primary'
          : 'border-white/5 text-gray-600'}`}
      >
        <span className="text-base">🤚</span>
        <span>Sin gesto / Neutro</span>
        {!currentGesture && <span className="ml-auto font-bold">● AHORA</span>}
      </div>
    </div>
  </motion.div>
);

// ─── Página principal ─────────────────────────────────────────────────────────
const GesturePage = () => {
  const { currentGesture, confidence, isActive } = useGesture();

  return (
    <div className="min-h-screen relative">
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <div className="ml-0 md:ml-64 mt-20 p-4 sm:p-6 lg:p-8 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <FaBrain className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold neon-text">IA Gestual</h1>
              <p className="text-sm text-gray-400">Teachable Machine + MediaPipe · 7 gestos entrenados</p>
            </div>
          </div>
        </motion.div>

        {/* ── Layout principal: cámara+info (izq) | gestos (der) ── */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* Columna izquierda — Cámara + paneles de estado */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <GestureCamera />
            </motion.div>

            {/* Fila de info compacta */}
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Estado del sistema */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-effect rounded-xl p-4 border border-primary/30"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <FaEye className="text-primary" />
                  <h3 className="font-bold text-sm">Estado del Sistema</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cámara</span>
                    <span className={`font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                      {isActive ? '● ACTIVA' : '○ INACTIVA'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Gesto</span>
                    <span className="text-primary font-bold truncate max-w-[130px] text-right">
                      {currentGesture || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Confianza</span>
                    <span className="text-green-400 font-bold">{(confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-darker rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Tips rápidos */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="glass-effect rounded-xl p-4 border border-yellow-400/30 bg-yellow-400/5"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <FaLightbulb className="text-yellow-400" />
                  <h3 className="font-bold text-sm text-yellow-400">Tips</h3>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex gap-2"><span className="text-yellow-400">•</span> Buena iluminación frontal</li>
                  <li className="flex gap-2"><span className="text-yellow-400">•</span> 50–100 cm de la cámara</li>
                  <li className="flex gap-2"><span className="text-yellow-400">•</span> Gestos claros y lentos</li>
                  <li className="flex gap-2"><span className="text-yellow-400">•</span> Mantén 1–2 segundos</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-yellow-400/10 flex items-center gap-2">
                  <FaRocket className="text-primary text-xs" />
                  <span className="text-[10px] text-primary font-semibold">Teachable Machine (7 clases)</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Columna derecha — Lista de gestos disponibles */}
          <div className="lg:sticky lg:top-24" style={{ height: 'calc(100vh - 8rem)' }}>
            <GestureList currentGesture={currentGesture} confidence={confidence} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GesturePage;
