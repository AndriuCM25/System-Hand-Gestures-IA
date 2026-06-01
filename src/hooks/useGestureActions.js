/**
 * useGestureActions.js
 *
 * Escucha el gesto actual del contexto y ejecuta acciones reales en la app:
 *  - Mano Abierta   → ir a /dashboard
 *  - Puño Cerrado   → detener cámara / pausar
 *  - Pulgar Arriba  → ir a /analytics
 *  - Dos Dedos      → toggle sidebar
 *  - Apuntar Derecha → siguiente página
 *  - Apuntar Izquierda → página anterior
 */
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGesture, NAV_PAGES } from '../context/GestureContext';

// Cooldown mínimo entre acciones para evitar disparos múltiples (ms)
const ACTION_COOLDOWN = 2500;

export const useGestureActions = (onPause) => {
  const { currentGesture, confidence, isActive, setSidebarOpen, dispatchGestureAction } = useGesture();
  const navigate   = useNavigate();
  const location   = useLocation();
  const lastActionRef = useRef(0);
  const lastGestureRef = useRef(null);

  const getNextPage = useCallback((currentPath) => {
    const idx = NAV_PAGES.indexOf(currentPath);
    if (idx === -1) return NAV_PAGES[0];
    return NAV_PAGES[(idx + 1) % NAV_PAGES.length];
  }, []);

  const getPrevPage = useCallback((currentPath) => {
    const idx = NAV_PAGES.indexOf(currentPath);
    if (idx === -1) return NAV_PAGES[NAV_PAGES.length - 1];
    return NAV_PAGES[(idx - 1 + NAV_PAGES.length) % NAV_PAGES.length];
  }, []);

  useEffect(() => {
    if (!isActive || !currentGesture || confidence < 0.75) return;

    // Evitar repetir el mismo gesto sin pausa
    const now = Date.now();
    const isSameGesture = lastGestureRef.current === currentGesture;
    if (isSameGesture && now - lastActionRef.current < ACTION_COOLDOWN) return;

    lastGestureRef.current = currentGesture;
    lastActionRef.current  = now;

    const path = location.pathname;

    switch (currentGesture) {
      case 'Mano Abierta':
        dispatchGestureAction(currentGesture, 'Navegar a Dashboard');
        navigate('/dashboard');
        break;

      case 'Puño Cerrado':
        dispatchGestureAction(currentGesture, 'Sistema Pausado');
        if (typeof onPause === 'function') onPause();
        break;

      case 'Pulgar Arriba':
        dispatchGestureAction(currentGesture, 'Navegar a Analítica');
        navigate('/analytics');
        break;

      case 'Dos Dedos':
        dispatchGestureAction(currentGesture, 'Toggle Sidebar');
        setSidebarOpen(prev => !prev);
        break;

      case 'Mano Derecha':
        dispatchGestureAction(currentGesture, `Siguiente → ${getNextPage(path)}`);
        navigate(getNextPage(path));
        break;

      case 'Mano Izquierda':
        dispatchGestureAction(currentGesture, `Anterior ← ${getPrevPage(path)}`);
        navigate(getPrevPage(path));
        break;

      default:
        break;
    }
  }, [
    currentGesture, confidence, isActive,
    navigate, location.pathname,
    setSidebarOpen, dispatchGestureAction,
    getNextPage, getPrevPage, onPause
  ]);
};
