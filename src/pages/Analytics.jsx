import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaClock, FaGlobe } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';
import StatsCard from '../components/StatsCard';

const Analytics = () => {
  // Datos de accesibilidad (simulados para la demo)
  const accessibilityTrendData = [
    { year: '2018', usuarios: 120 },
    { year: '2019', usuarios: 185 },
    { year: '2020', usuarios: 290 },
    { year: '2021', usuarios: 420 },
    { year: '2022', usuarios: 580 },
    { year: '2023', usuarios: 750 },
  ];

  const disabilityTypeData = [
    { tipo: 'Motriz', cantidad: 450, porcentaje: 35 },
    { tipo: 'Visual', cantidad: 320, porcentaje: 25 },
    { tipo: 'Auditiva', cantidad: 260, porcentaje: 20 },
    { tipo: 'Cognitiva', cantidad: 190, porcentaje: 15 },
    { tipo: 'Múltiple', cantidad: 80, porcentaje: 5 },
  ];

  const usageByHourData = [
    { hora: '00:00', gestos: 45 },
    { hora: '04:00', gestos: 20 },
    { hora: '08:00', gestos: 180 },
    { hora: '12:00', gestos: 320 },
    { hora: '16:00', gestos: 280 },
    { hora: '20:00', gestos: 150 },
  ];

  const performanceData = [
    { metric: 'Precisión', value: 98 },
    { metric: 'Velocidad', value: 95 },
    { metric: 'Confiabilidad', value: 97 },
    { metric: 'Usabilidad', value: 92 },
    { metric: 'Accesibilidad', value: 96 },
  ];

  const geographicData = [
    { pais: 'México', usuarios: 450 },
    { pais: 'España', usuarios: 320 },
    { pais: 'Argentina', usuarios: 280 },
    { pais: 'Colombia', usuarios: 210 },
    { pais: 'Chile', usuarios: 180 },
  ];

  return (
    <div className="min-h-screen relative">
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <div className="ml-64 mt-20 p-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold neon-text mb-2">Analytics & Data Science</h1>
          <p className="text-gray-400">Análisis profundo de datos de accesibilidad y uso del sistema</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={FaUsers}
            title="Usuarios Totales"
            value="1,440"
            subtitle="Usuarios activos"
            color="primary"
            trend={15.3}
          />
          <StatsCard
            icon={FaChartLine}
            title="Crecimiento"
            value="+29%"
            subtitle="Último trimestre"
            color="green"
            trend={8.7}
          />
          <StatsCard
            icon={FaClock}
            title="Tiempo Promedio"
            value="45min"
            subtitle="Por sesión"
            color="yellow"
          />
          <StatsCard
            icon={FaGlobe}
            title="Países"
            value="5"
            subtitle="Cobertura global"
            color="purple"
          />
        </div>

        {/* Main Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Accessibility Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="text-xl font-bold mb-4 text-primary">
              Tendencia de Uso de Tecnologías Accesibles
            </h3>
            <p className="text-sm text-gray-400 mb-4">Crecimiento anual de usuarios</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={accessibilityTrendData}>
                <defs>
                  <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="year" stroke="#00d9ff" />
                <YAxis stroke="#00d9ff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="usuarios"
                  stroke="#00d9ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsuarios)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Disability Types */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="text-xl font-bold mb-4 text-primary">
              Distribución por Tipo de Discapacidad
            </h3>
            <p className="text-sm text-gray-400 mb-4">Usuarios que requieren accesibilidad</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={disabilityTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#00d9ff" />
                <YAxis dataKey="tipo" type="category" stroke="#00d9ff" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="cantidad" fill="#00d9ff" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Main Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Usage by Hour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="text-xl font-bold mb-4 text-primary">Uso por Hora del Día</h3>
            <p className="text-sm text-gray-400 mb-4">Patrones de actividad</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageByHourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="hora" stroke="#00d9ff" />
                <YAxis stroke="#00d9ff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gestos"
                  stroke="#00d9ff"
                  strokeWidth={3}
                  dot={{ fill: '#00d9ff', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="text-xl font-bold mb-4 text-primary">Métricas de Rendimiento</h3>
            <p className="text-sm text-gray-400 mb-4">Evaluación del sistema</p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="metric" stroke="#00d9ff" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#00d9ff" />
                <Radar
                  name="Rendimiento"
                  dataKey="value"
                  stroke="#00d9ff"
                  fill="#00d9ff"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e27',
                    border: '1px solid #00d9ff',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6 border border-primary/20 mb-6"
        >
          <h3 className="text-xl font-bold mb-4 text-primary">Distribución Geográfica</h3>
          <p className="text-sm text-gray-400 mb-4">Usuarios por país</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geographicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="pais" stroke="#00d9ff" />
              <YAxis stroke="#00d9ff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0e27',
                  border: '1px solid #00d9ff',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="usuarios" fill="#00d9ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-xl p-6 border border-green-400/30 bg-green-400/5"
          >
            <h4 className="font-bold text-green-400 mb-2">Insight Positivo</h4>
            <p className="text-sm text-gray-300">
              El uso de tecnologías accesibles ha crecido un 29% en el último año, 
              demostrando la importancia de soluciones inclusivas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-xl p-6 border border-yellow-400/30 bg-yellow-400/5"
          >
            <h4 className="font-bold text-yellow-400 mb-2">Oportunidad</h4>
            <p className="text-sm text-gray-300">
              El 35% de usuarios con discapacidad motriz representa el segmento 
              principal para HandControl AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="glass-effect rounded-xl p-6 border border-primary/30 bg-primary/5"
          >
            <h4 className="font-bold text-primary mb-2">Proyección</h4>
            <p className="text-sm text-gray-300">
              Se espera alcanzar 2,000 usuarios activos para finales de 2026 
              con expansión a 10 países.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
