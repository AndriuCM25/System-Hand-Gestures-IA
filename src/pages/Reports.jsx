import { motion } from 'framer-motion';
import { FaFilePdf, FaFileExcel, FaDownload, FaCalendar, FaChartBar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';
import Swal from 'sweetalert2';

const Reports = () => {
  const reportTypes = [
    {
      id: 1,
      title: 'Reporte de Actividad Diaria',
      description: 'Resumen de gestos detectados y precisión del sistema',
      icon: FaChartBar,
      color: 'primary',
      formats: ['PDF', 'Excel']
    },
    {
      id: 2,
      title: 'Reporte de Usuarios',
      description: 'Estadísticas de usuarios activos y sesiones',
      icon: FaCalendar,
      color: 'green',
      formats: ['PDF', 'Excel']
    },
    {
      id: 3,
      title: 'Reporte de Precisión IA',
      description: 'Análisis detallado de confianza y accuracy',
      icon: FaChartBar,
      color: 'yellow',
      formats: ['PDF']
    },
    {
      id: 4,
      title: 'Reporte Mensual Completo',
      description: 'Informe ejecutivo con todas las métricas',
      icon: FaFilePdf,
      color: 'purple',
      formats: ['PDF', 'Excel']
    }
  ];

  const recentReports = [
    {
      name: 'Reporte_Actividad_Mayo_2026.pdf',
      date: '2026-05-28',
      size: '2.4 MB',
      type: 'PDF'
    },
    {
      name: 'Estadisticas_Usuarios_Mayo_2026.xlsx',
      date: '2026-05-27',
      size: '1.8 MB',
      type: 'Excel'
    },
    {
      name: 'Precision_IA_Semanal.pdf',
      date: '2026-05-25',
      size: '1.2 MB',
      type: 'PDF'
    }
  ];

  const handleGenerateReport = (reportTitle, format) => {
    Swal.fire({
      title: 'Generando Reporte',
      html: `
        <div class="text-center">
          <p class="mb-4">Generando ${reportTitle} en formato ${format}...</p>
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-cyan-400 h-2.5 rounded-full animate-pulse" style="width: 70%"></div>
          </div>
        </div>
      `,
      background: '#0a0e27',
      color: '#fff',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      Swal.fire({
        title: '¡Reporte Generado!',
        text: `El reporte ha sido generado exitosamente`,
        icon: 'success',
        background: '#0a0e27',
        color: '#fff',
        confirmButtonColor: '#00d9ff'
      });
    });
  };

  const colorClasses = {
    primary: 'border-primary/30 bg-primary/5',
    green: 'border-green-400/30 bg-green-400/5',
    yellow: 'border-yellow-400/30 bg-yellow-400/5',
    purple: 'border-purple-400/30 bg-purple-400/5',
  };

  const iconColorClasses = {
    primary: 'text-primary',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
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
          <h1 className="text-4xl font-bold neon-text mb-2">Reportes</h1>
          <p className="text-gray-400">Genera y descarga reportes detallados del sistema</p>
        </motion.div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-effect rounded-2xl p-6 border ${colorClasses[report.color]}`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-4 rounded-xl ${colorClasses[report.color]}`}>
                    <Icon className={`text-3xl ${iconColorClasses[report.color]}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-400">{report.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {report.formats.map(format => (
                    <motion.button
                      key={format}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGenerateReport(report.title, format)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${colorClasses[report.color]} hover:bg-white/5 transition-colors`}
                    >
                      {format === 'PDF' ? <FaFilePdf /> : <FaFileExcel />}
                      <span className="text-sm font-medium">Generar {format}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Report Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6 border border-primary/20 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 text-primary">Generar Reporte Personalizado</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Datos
              </label>
              <select className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white">
                <option>Todos los datos</option>
                <option>Solo gestos</option>
                <option>Solo usuarios</option>
                <option>Solo precisión</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Formato
              </label>
              <select className="w-full px-4 py-3 bg-darker border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-white">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerateReport('Reporte Personalizado', 'PDF')}
            className="mt-6 w-full flex items-center justify-center space-x-2 py-4 bg-primary text-darker rounded-lg font-bold text-lg glow-button shadow-neon"
          >
            <FaDownload />
            <span>Generar Reporte</span>
          </motion.button>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-2xl p-6 border border-primary/20"
        >
          <h3 className="text-xl font-bold mb-4 text-primary">Reportes Recientes</h3>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-darker/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {report.type === 'PDF' ? (
                    <FaFilePdf className="text-3xl text-red-400" />
                  ) : (
                    <FaFileExcel className="text-3xl text-green-400" />
                  )}
                  <div>
                    <p className="font-medium text-white">{report.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(report.date).toLocaleDateString()} • {report.size}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-lg glass-effect border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  <FaDownload className="text-primary" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
