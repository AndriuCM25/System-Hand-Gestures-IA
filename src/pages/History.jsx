import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaDownload, FaTrash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';
import { useGesture } from '../context/GestureContext';

const History = () => {
  const { gestureHistory } = useGesture();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGesture, setFilterGesture] = useState('all');

  const filteredHistory = gestureHistory.filter(entry => {
    const matchesSearch = entry.gesture.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterGesture === 'all' || entry.gesture === filterGesture;
    return matchesSearch && matchesFilter;
  });

  const uniqueGestures = [...new Set(gestureHistory.map(entry => entry.gesture))];

  const handleExport = () => {
    const csv = [
      ['Fecha', 'Hora', 'Gesto', 'Acción', 'Confianza', 'Usuario'],
      ...gestureHistory.map(entry => {
        const date = new Date(entry.timestamp);
        return [
          date.toLocaleDateString(),
          date.toLocaleTimeString(),
          entry.gesture,
          entry.action,
          `${(entry.confidence * 100).toFixed(1)}%`,
          entry.user
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-gestos-${Date.now()}.csv`;
    a.click();
  };

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
          <h1 className="text-4xl font-bold neon-text mb-2">Historial de Gestos</h1>
          <p className="text-gray-400">Registro completo de todas las detecciones realizadas</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6 border border-primary/20 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary" />
              <input
                type="text"
                placeholder="Buscar por gesto o acción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary" />
              <select
                value={filterGesture}
                onChange={(e) => setFilterGesture(e.target.value)}
                className="pl-12 pr-8 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white appearance-none"
              >
                <option value="all">Todos los gestos</option>
                {uniqueGestures.map(gesture => (
                  <option key={gesture} value={gesture}>{gesture}</option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-darker rounded-lg font-bold hover:shadow-neon transition-all"
            >
              <FaDownload />
              <span>Exportar</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-4 border border-primary/20"
          >
            <p className="text-sm text-gray-400 mb-1">Total Registros</p>
            <p className="text-3xl font-bold text-primary">{gestureHistory.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="glass-effect rounded-xl p-4 border border-primary/20"
          >
            <p className="text-sm text-gray-400 mb-1">Filtrados</p>
            <p className="text-3xl font-bold text-primary">{filteredHistory.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-4 border border-primary/20"
          >
            <p className="text-sm text-gray-400 mb-1">Confianza Promedio</p>
            <p className="text-3xl font-bold text-green-400">
              {gestureHistory.length > 0
                ? ((gestureHistory.reduce((acc, e) => acc + e.confidence, 0) / gestureHistory.length) * 100).toFixed(1)
                : 0}%
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="glass-effect rounded-xl p-4 border border-primary/20"
          >
            <p className="text-sm text-gray-400 mb-1">Gestos Únicos</p>
            <p className="text-3xl font-bold text-yellow-400">{uniqueGestures.length}</p>
          </motion.div>
        </div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl border border-primary/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Hora</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Gesto</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Acción</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Confianza</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((entry, index) => {
                    const date = new Date(entry.timestamp);
                    return (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                          {date.toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                            {entry.gesture}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {entry.action}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-2 bg-darker rounded-full overflow-hidden max-w-[100px]">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-green-400"
                                style={{ width: `${entry.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono text-primary">
                              {(entry.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {entry.user}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <FaSearch className="text-4xl mx-auto mb-3 opacity-30" />
                        <p>No se encontraron registros</p>
                        <p className="text-sm mt-1">
                          {gestureHistory.length === 0
                            ? 'Inicia el sistema de gestos para generar datos'
                            : 'Intenta con otros filtros de búsqueda'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
