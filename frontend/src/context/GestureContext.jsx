import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { gesturesAPI } from '../services/api';
import { supabase } from '../lib/supabase';

const GestureContext = createContext();

export const useGesture = () => {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGesture must be used within a GestureProvider');
  }
  return context;
};

// Orden de navegación entre páginas (para Siguiente / Anterior)
export const NAV_PAGES = [
  '/dashboard',
  '/gesture',
  '/history',
  '/analytics',
  '/reports',
  '/settings'
];

export const GestureProvider = ({ children }) => {
  const [isActive, setIsActive]             = useState(false);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [confidence, setConfidence]         = useState(0);
  const [gestureHistory, setGestureHistory] = useState([]);
  const [predictions, setPredictions]       = useState([]);   // todas las clases TM
  const [userName, setUserName]             = useState('Usuario');
  const [userRole, setUserRole]             = useState('admin');
  const [lastAction, setLastAction]         = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [cameraActive, setCameraActive]     = useState(false); // cámara flotante activa
  const [stats, setStats] = useState({
    totalGestures: 0,
    accuracy: 98.5,
    activeSessions: 1,
    users: 1
  });

  // Listeners externos que se suscriben a acciones de gestos
  const actionListenersRef = useRef([]);

  const subscribeToActions = useCallback((fn) => {
    actionListenersRef.current.push(fn);
    // Devuelve función para desuscribirse
    return () => {
      actionListenersRef.current = actionListenersRef.current.filter(l => l !== fn);
    };
  }, []);

  const dispatchGestureAction = useCallback((gesture, action) => {
    const event = { gesture, action, ts: Date.now() };
    setLastAction(event);
    actionListenersRef.current.forEach(fn => fn(event));
  }, []);

  const addGestureToHistory = useCallback((gesture) => {
    const newEntry = {
      id: Date.now(),
      gesture: gesture.name,
      action: gesture.action,
      confidence: gesture.confidence,
      timestamp: new Date().toISOString(),
      user: userName
    };
    setGestureHistory(prev => [newEntry, ...prev].slice(0, 50));
    setStats(prev => ({ ...prev, totalGestures: prev.totalGestures + 1 }));

    // Guardar en Supabase si hay sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) gesturesAPI.save(gesture.name, gesture.action, gesture.confidence).catch(() => {});
    });
  }, [userName]);
  const activateSystem = () => setIsActive(true);

  const deactivateSystem = () => {
    setIsActive(false);
    setCurrentGesture(null);
    setConfidence(0);
  };

  const updateGesture = useCallback((gesture, conf) => {
    setCurrentGesture(gesture);
    setConfidence(conf);
  }, []);

  const updatePredictions = useCallback((preds) => {
    setPredictions(preds || []);
  }, []);

  const login = (name, role = 'admin') => {
    setUserName(name || 'Usuario');
    setUserRole(role);
  };

  const logout = () => {
    setUserName('Usuario');
    setUserRole('admin');
    setIsActive(false);
    setCurrentGesture(null);
    setConfidence(0);
  };

  const value = {
    isActive,
    currentGesture,
    confidence,
    predictions,
    gestureHistory,
    stats,
    userName,
    userRole,
    lastAction,
    sidebarOpen,
    setSidebarOpen,
    cameraActive,
    setCameraActive,
    activateSystem,
    deactivateSystem,
    updateGesture,
    updatePredictions,
    addGestureToHistory,
    login,
    logout,
    subscribeToActions,
    dispatchGestureAction,
  };

  return (
    <GestureContext.Provider value={value}>
      {children}
    </GestureContext.Provider>
  );
};
