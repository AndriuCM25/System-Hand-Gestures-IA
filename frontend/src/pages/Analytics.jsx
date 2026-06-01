import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  FaUpload, FaChartBar, FaCheckCircle, FaClock,
  FaBolt, FaHandPaper, FaIndustry, FaCamera,
  FaLightbulb, FaExclamationTriangle, FaFileCsv, FaTimes
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';

// ─── Colores vibrantes por categoría ─────────────────────────────────────────
const COLORS = ['#00d9ff','#a855f7','#22c55e','#f59e0b','#ef4444','#3b82f6','#ec4899','#14b8a6'];
const TOOLTIP_STYLE = { backgroundColor:'#0a0e27', border:'1px solid #00d9ff33', borderRadius:8, color:'#e2e8f0' };

// ─── Parsear CSV ──────────────────────────────────────────────────────────────
const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split(',');
    return headers.reduce((obj, h, i) => { obj[h] = (vals[i] || '').trim(); return obj; }, {});
  });
};

// ─── Procesar datos del CSV ───────────────────────────────────────────────────
const processData = (rows) => {
  const total    = rows.length;
  const success  = rows.filter(r => r.detection_success === 'True').length;
  const avgConf  = rows.reduce((s, r) => s + parseFloat(r.confidence_score || 0), 0) / total;
  const avgResp  = rows.reduce((s, r) => s + parseFloat(r.response_time_ms || 0), 0) / total;

  // Gestos por tipo
  const gestureCounts = {};
  rows.forEach(r => { gestureCounts[r.gesture_type] = (gestureCounts[r.gesture_type] || 0) + 1; });
  const gestureData = Object.entries(gestureCounts).map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count);

  // Confianza promedio por gesto
  const gestureConf = {};
  const gestureConfCount = {};
  rows.forEach(r => {
    gestureConf[r.gesture_type] = (gestureConf[r.gesture_type] || 0) + parseFloat(r.confidence_score || 0);
    gestureConfCount[r.gesture_type] = (gestureConfCount[r.gesture_type] || 0) + 1;
  });
  const confidenceData = Object.keys(gestureConf).map(k => ({
    name: k, confianza: +(gestureConf[k] / gestureConfCount[k] * 100).toFixed(1)
  })).sort((a,b)=>b.confianza-a.confianza);

  // Sector industrial
  const sectorCounts = {};
  rows.forEach(r => { sectorCounts[r.industry_sector] = (sectorCounts[r.industry_sector] || 0) + 1; });
  const sectorData = Object.entries(sectorCounts).map(([name, total]) => ({ name, total })).sort((a,b)=>b.total-a.total);

  // Tipo de dispositivo
  const deviceCounts = {};
  rows.forEach(r => { deviceCounts[r.device_type] = (deviceCounts[r.device_type] || 0) + 1; });
  const deviceData = Object.entries(deviceCounts).map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count);

  // Condición de iluminación
  const lightCounts = {};
  rows.forEach(r => { lightCounts[r.lighting_condition] = (lightCounts[r.lighting_condition] || 0) + 1; });
  const lightingData = Object.entries(lightCounts).map(([name, count]) => ({ name, count }));

  // Tipos de error
  const errorCounts = {};
  rows.forEach(r => { errorCounts[r.error_type] = (errorCounts[r.error_type] || 0) + 1; });
  const errorData = Object.entries(errorCounts).filter(([k]) => k !== 'none')
    .map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count);

  // Tiempo de respuesta por gesto
  const respByGesture = {};
  const respByGestureCount = {};
  rows.forEach(r => {
    respByGesture[r.gesture_type] = (respByGesture[r.gesture_type] || 0) + parseFloat(r.response_time_ms || 0);
    respByGestureCount[r.gesture_type] = (respByGestureCount[r.gesture_type] || 0) + 1;
  });
  const responseData = Object.keys(respByGesture).map(k => ({
    name: k, ms: +(respByGesture[k] / respByGestureCount[k]).toFixed(0)
  })).sort((a,b)=>a.ms-b.ms);

  // Acciones disparadas
  const actionCounts = {};
  rows.forEach(r => { actionCounts[r.action_triggered] = (actionCounts[r.action_triggered] || 0) + 1; });
  const actionData = Object.entries(actionCounts).map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count);

  // Éxito por sector
  const sectorSuccess = {};
  const sectorTotal2 = {};
  rows.forEach(r => {
    sectorTotal2[r.industry_sector] = (sectorTotal2[r.industry_sector] || 0) + 1;
    if (r.detection_success === 'True') sectorSuccess[r.industry_sector] = (sectorSuccess[r.industry_sector] || 0) + 1;
  });
  const successBySector = Object.keys(sectorTotal2).map(k => ({
    name: k,
    tasa: +((sectorSuccess[k] || 0) / sectorTotal2[k] * 100).toFixed(1)
  })).sort((a,b)=>b.tasa-a.tasa);

  return { total, success, successRate: +(success/total*100).toFixed(1), avgConf: +(avgConf*100).toFixed(1), avgResp: +avgResp.toFixed(0),
    gestureData, confidenceData, sectorData, deviceData, lightingData, errorData, responseData, actionData, successBySector };
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, unit='', color='#00d9ff', delay=0 }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
    className="glass-effect rounded-2xl p-5 border border-white/10 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${color}20` }}>
      <Icon style={{ color, fontSize:20 }} />
    </div>
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}<span className="text-sm font-normal ml-1" style={{ color }}>{unit}</span></p>
    </div>
  </motion.div>
);

// ─── Chart wrapper ────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, icon: Icon, children, delay=0, colSpan=1 }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
    className={`glass-effect rounded-2xl p-6 border border-primary/20 ${colSpan===2?'lg:col-span-2':''}`}>
    <div className="flex items-center gap-3 mb-1">
      {Icon && <Icon className="text-primary text-lg flex-shrink-0" />}
      <h3 className="font-bold text-base text-white">{title}</h3>
    </div>
    {subtitle && <p className="text-xs text-gray-500 mb-4 ml-7">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    {children}
  </motion.div>
);

// ─── Zona de carga CSV ────────────────────────────────────────────────────────
const CSVDropZone = ({ onLoad }) => {
  const inputRef  = useRef();
  const [drag, setDrag] = useState(false);

  const handle = (file) => {
    if (!file || !file.name.endsWith('.csv')) return;
    const reader = new FileReader();
    reader.onload = (e) => onLoad(e.target.result);
    reader.readAsText(file);
  };

  return (
    <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-4
        cursor-pointer transition-all duration-300 text-center
        ${drag ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-white/15 hover:border-primary/50 hover:bg-white/3'}`}
    >
      <input ref={inputRef} type="file" accept=".csv" className="hidden"
        onChange={e => handle(e.target.files[0])} />

      <motion.div animate={drag ? { scale:1.2, rotate:10 } : { scale:1, rotate:0 }}
        className="w-20 h-20 bg-primary/15 rounded-2xl flex items-center justify-center">
        <FaFileCsv className="text-4xl text-primary" />
      </motion.div>

      <div>
        <p className="text-lg font-bold text-white mb-1">Sube tu dataset CSV</p>
        <p className="text-sm text-gray-400">Arrastra aquí o haz clic para seleccionar</p>
        <p className="text-xs text-gray-600 mt-2">Columnas: gesture_type, confidence_score, industry_sector, device_type…</p>
      </div>

      <div className="flex gap-3 mt-2 flex-wrap justify-center">
        {['gesture_type','confidence_score','industry_sector','detection_success','response_time_ms'].map(col => (
          <span key={col} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
            {col}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const Analytics = () => {
  const [data,     setData]     = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleCSV = useCallback((text) => {
    setLoading(true);
    setTimeout(() => {
      const rows = parseCSV(text);
      setData(processData(rows));
      setLoading(false);
    }, 600);
  }, []);

  const handleFile = useCallback((e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = ev => handleCSV(ev.target.result);
    reader.readAsText(f);
  }, [handleCSV]);

  return (
    <div className="min-h-screen relative">
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <div className="ml-0 md:ml-64 mt-20 p-4 sm:p-6 lg:p-8 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold neon-text">Analytics & Data Science</h1>
              <p className="text-gray-400 mt-1">Carga tu dataset CSV y visualiza los datos al instante</p>
            </div>
            {data && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-xl border border-green-400/30">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">{fileName}</span>
                </div>
                <button onClick={() => { setData(null); setFileName(''); }}
                  className="glass-effect p-2 rounded-xl border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors">
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upload zone o spinner */}
        <AnimatePresence mode="wait">
          {!data && !loading && (
            <motion.div key="upload" exit={{ opacity:0, y:-20 }} className="mb-8">
              <CSVDropZone onLoad={(text) => { handleCSV(text); }} />
              {/* También file input tradicional */}
              <div className="mt-4 flex justify-center">
                <label className="flex items-center gap-2 cursor-pointer glass-effect px-6 py-3 rounded-xl
                  border border-primary/40 text-primary hover:bg-primary/10 transition-all font-semibold text-sm">
                  <FaUpload />
                  Seleccionar archivo CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
                </label>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="flex flex-col items-center justify-center py-24 gap-4">
              <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full" />
              <p className="text-primary font-semibold">Procesando dataset...</p>
            </motion.div>
          )}

          {data && !loading && (
            <motion.div key="charts" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={FaHandPaper}  label="Total Registros"   value={data.total.toLocaleString()} color="#00d9ff" delay={0.0} />
                <KpiCard icon={FaCheckCircle} label="Tasa de Éxito"   value={data.successRate} unit="%" color="#22c55e" delay={0.05} />
                <KpiCard icon={FaBolt}        label="Confianza Prom."  value={data.avgConf} unit="%" color="#a855f7" delay={0.1} />
                <KpiCard icon={FaClock}       label="Resp. Promedio"   value={data.avgResp} unit="ms" color="#f59e0b" delay={0.15} />
              </div>

              {/* Fila 1: Gestos + Confianza */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Gestos por Tipo" subtitle={`${data.gestureData.length} tipos detectados`} icon={FaHandPaper} delay={0.2}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.gestureData} margin={{ bottom:40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:11 }} angle={-30} textAnchor="end" interval={0} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize:11 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" radius={[6,6,0,0]}>
                        {data.gestureData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Confianza Promedio por Gesto" subtitle="Porcentaje de certeza del modelo" icon={FaBolt} delay={0.25}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.confidenceData} margin={{ bottom:40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:11 }} angle={-30} textAnchor="end" interval={0} />
                      <YAxis domain={[70,100]} stroke="#94a3b8" tick={{ fontSize:11 }} unit="%" />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Confianza']} />
                      <Bar dataKey="confianza" radius={[6,6,0,0]}>
                        {data.confidenceData.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Fila 2: Sector + Dispositivo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Sector Industrial" subtitle="Uso por industria" icon={FaIndustry} delay={0.3}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.sectorData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis type="number" stroke="#94a3b8" tick={{ fontSize:11 }} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize:12 }} width={85} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="total" radius={[0,6,6,0]}>
                        {data.sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Tipo de Dispositivo" subtitle="Cámara utilizada" icon={FaCamera} delay={0.35}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.deviceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis type="number" stroke="#94a3b8" tick={{ fontSize:11 }} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize:11 }} width={110} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" radius={[0,6,6,0]}>
                        {data.deviceData.map((_, i) => <Cell key={i} fill={COLORS[(i+3) % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Fila 3: Iluminación + Tiempo respuesta */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Condición de Iluminación" subtitle="Entorno de detección" icon={FaLightbulb} delay={0.4}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.lightingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:13 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize:11 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" radius={[6,6,0,0]}>
                        {data.lightingData.map((_, i) => <Cell key={i} fill={COLORS[(i+4) % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Tiempo de Respuesta por Gesto" subtitle="Milisegundos promedio" icon={FaClock} delay={0.45}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.responseData} margin={{ bottom:40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:11 }} angle={-30} textAnchor="end" interval={0} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize:11 }} unit="ms" />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} ms`, 'Respuesta']} />
                      <Bar dataKey="ms" radius={[6,6,0,0]} fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Fila 4: Tasa éxito por sector + Acciones + Errores */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Éxito por Sector" subtitle="% detección correcta" icon={FaCheckCircle} delay={0.5} colSpan={2}>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data.successBySector}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:12 }} />
                      <YAxis domain={[80,100]} stroke="#94a3b8" tick={{ fontSize:11 }} unit="%" />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Tasa éxito']} />
                      <Bar dataKey="tasa" radius={[6,6,0,0]}>
                        {data.successBySector.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Tipos de Error" subtitle="Errores registrados" icon={FaExclamationTriangle} delay={0.55}>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data.errorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize:11 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" radius={[6,6,0,0]} fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Fila 5: Acciones disparadas */}
              <ChartCard title="Acciones Disparadas por el Sistema" subtitle="Distribución de comandos ejecutados" icon={FaChartBar} delay={0.6}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.actionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize:13 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize:11 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" radius={[6,6,0,0]}>
                      {data.actionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Analytics;
