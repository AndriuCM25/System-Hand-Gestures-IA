import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaHandPaper, FaBullseye, FaUsers, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import HolographicBackground from '../components/HolographicBackground';
import Tutorial from '../components/Tutorial';
import { useGesture } from '../context/GestureContext';

const Dashboard = () => {
  const { stats, gestureHistory } = useGesture();
  const [showTutorial, setShowTutorial] = useState(false);

  // Mostrar tutorial solo la primera vez
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  // Datos para gráficos
  const lineData = [
    { mes: 'Ene', gestos: 1200 },
    { mes: 'Feb', gestos: 1900 },
    { mes: 'Mar', gestos: 2400 },
    { mes: 'Abr', gestos: 2100 },
    { mes: 'May', gestos: 2800 },
    { mes: 'Jun', gestos: 3200 },
  ];

  const barData = [
    { gesto: 'Mano Abierta', cantidad: 450 },
    { gesto: 'Puño', cantidad: 320 },
    { gesto: 'Pulgar', cantidad: 280 },
    { gesto: 'Dos Dedos', cantidad: 190 },
    { gesto: 'Derecha', cantidad: 150 },
  ];

  const pieData = [
    { name: 'Activar', value: 35 },
    { name: 'Pausar', value: 25 },
    { name: 'Confirmar', value: 20 },
    { name: 'Menú', value: 12 },
    { name: 'Navegar', value: 8 },
  ];

  const COLORS = ['#00d9ff', '#0099ff', '#00ffaa', '#ffaa00', '#ff00aa'];

  return (
    <div className="min-h-screen relative">
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      {/* Tutorial Modal */}
      <Tutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />

      <div className="ml-0 md:ml-64 mt-20 p-4 sm:p-6 md:p-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold neon-text mb-2">Dashboard Principal</h1>
            <p className="text-sm sm:text-base text-gray-400">Monitoreo en tiempo real del sistema HandControl AI</p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center space-x-2 px-4 py-2 glass-effect border border-primary/30 rounded-xl hover:border-primary transition-colors"
          >
            <FaQuestionCircle className="text-primary" />
            <span className="text-sm font-medium">Ver Tutorial</span>
          </button>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            icon={FaHandPaper}
            title="Gestos Detectados"
            value={stats.totalGestures.toLocaleString()}
            subtitle="Total acumulado"
            color="primary"
            trend={12.5}
          />
          <StatsCard
            icon={FaBullseye}
            title="Precisión IA"
            value={`${stats.accuracy}%`}
            subtitle="Confianza promedio"
            color="green"
            trend={2.3}
          />
          <StatsCard
            icon={FaClock}
            title="Sesiones Activas"
            value={stats.activeSessions}
            subtitle="En este momento"
            color="yellow"
          />
          <StatsCard
            icon={FaUsers}
            title="Usuarios"
            value={stats.users}
            subtitle="Conectados ahora"
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-primary">Tendencia de Gestos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="mes" stroke="#00d9ff" style={{ fontSize: '12px' }} />
                <YAxis stroke="#00d9ff" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="gestos"
                  stroke="#00d9ff"
                  strokeWidth={3}
                  dot={{ fill: '#00d9ff', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-primary">Gestos Más Usados</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="gesto"
                  stroke="#00d9ff"
                  angle={-15}
                  textAnchor="end"
                  height={80}
                  style={{ fontSize: '11px' }}
                />
                <YAxis stroke="#00d9ff" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="cantidad" fill="#00d9ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Pie Chart and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-primary">Distribución de Acciones</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '11px' }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-primary">Actividad Reciente</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {gestureHistory.length > 0 ? (
                gestureHistory.slice(0, 10).map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-darker/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                      <div>
                        <p className="text-sm sm:text-base font-medium text-white">{entry.gesture}</p>
                        <p className="text-xs text-gray-400">{entry.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-primary font-mono">
                        {(entry.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaHandPaper className="text-3xl sm:text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm sm:text-base">No hay actividad reciente</p>
                  <p className="text-xs sm:text-sm mt-1">Inicia el sistema de gestos para ver datos</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;