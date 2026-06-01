import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GestureProvider } from './context/GestureContext';
import Loader from './components/Loader';
import InitialLoader from './components/InitialLoader';
import GestureActionToast from './components/GestureActionToast';
import FloatingGestureCamera from './components/FloatingGestureCamera';

const Landing     = lazy(() => import('./pages/Landing'));
const Login       = lazy(() => import('./pages/Login'));
const Dashboard   = lazy(() => import('./pages/Dashboard'));
const GesturePage = lazy(() => import('./pages/GesturePage'));
const History     = lazy(() => import('./pages/History'));
const Analytics   = lazy(() => import('./pages/Analytics'));
const Reports     = lazy(() => import('./pages/Reports'));
const Settings    = lazy(() => import('./pages/Settings'));

function App() {
  // Siempre muestra el loader al montar (cada recarga de página)
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <GestureProvider>
      {!loaderDone ? (
        <InitialLoader onLoadComplete={() => setLoaderDone(true)} />
      ) : (
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"          element={<Landing />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gesture"   element={<GesturePage />} />
              <Route path="/history"   element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports"   element={<Reports />} />
              <Route path="/settings"  element={<Settings />} />
            </Routes>
          </Suspense>

          {/* ── Cámara flotante global — navega con gestos en todas las páginas ── */}
          <FloatingGestureCamera />

          {/* Toast global de acciones por gesto */}
          <GestureActionToast />
        </Router>
      )}
    </GestureProvider>
  );
}

export default App;