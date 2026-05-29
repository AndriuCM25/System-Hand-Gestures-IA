import { createContext, useContext, useState, useEffect } from 'react';

const GestureContext = createContext();

export const useGesture = () => {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGesture must be used within a GestureProvider');
  }
  return context;
};

export const GestureProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [gestureHistory, setGestureHistory] = useState([]);
  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState('admin');
  const [stats, setStats] = useState({
    totalGestures: 0,
    accuracy: 98.5,
    activeSessions: 1,
    users: 1
  });

  const addGestureToHistory = (gesture) => {
    const newEntry = {
      id: Date.now(),
      gesture: gesture.name,
      action: gesture.action,
      confidence: gesture.confidence,
      timestamp: new Date().toISOString(),
      user: userName
    };
    
    setGestureHistory(prev => [newEntry, ...prev].slice(0, 50));
    setStats(prev => ({
      ...prev,
      totalGestures: prev.totalGestures + 1
    }));
  };

  const activateSystem = () => {
    setIsActive(true);
  };

  const deactivateSystem = () => {
    setIsActive(false);
    setCurrentGesture(null);
    setConfidence(0);
  };

  const updateGesture = (gesture, conf) => {
    setCurrentGesture(gesture);
    setConfidence(conf);
  };

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
    gestureHistory,
    stats,
    userName,
    userRole,
    activateSystem,
    deactivateSystem,
    updateGesture,
    addGestureToHistory,
    login,
    logout
  };

  return (
    <GestureContext.Provider value={value}>
      {children}
    </GestureContext.Provider>
  );
};
