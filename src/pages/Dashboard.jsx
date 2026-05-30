import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, memo } from 'react';
import {
  FaHandPaper, FaBullseye, FaUsers, FaClock, FaQuestionCircle,
  FaChevronRight, FaCircle, FaDownload, FaSync, FaTrash, FaFileExport,
  FaChartLine, FaChartBar, FaChartPie
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import HolographicBackground from '../components/HolographicBackground';
import Tutorial from '../components/Tutorial';
import { useGesture } from '../context/GestureContext';

/* ── Design tokens ─────────────────────────────────────── */
const E = {
  primary:   '#00CFFF',   // cyan eléctrico
  dim:       '#0097BB',   // cyan apagado
  glow:      'rgba(0,207,255,0.12)',
  glowStr:   'rgba(0,207,255,0.22)',
  border:    'rgba(0,207,255,0.15)',
  borderHov: 'rgba(0,207,255,0.35)',
  bg:        '#050A14',
  surface:   'rgba(0,207,255,0.04)',
  surfaceHov:'rgba(0,207,255,0.07)',
  text:      '#E0F7FF',
  muted:     '#4A7080',
  accent2:   '#0054FF',   // azul eléctrico secundario
  accent3:   '#00FFD1',   // verde cyan
};

const CHART_STYLE = {
  contentStyle: {
    backgroundColor: '#060D1A',
    border: `1px solid ${E.border}`,
    borderRadius: '6px',
    fontSize: '12px',
    color: E.text,
  },
};

/* ── Ornamento: bracket de esquina ──────────────────────── */
const Corner = ({ pos }) => {
  const base = { position:'absolute', width:10, height:10, borderColor: E.primary };
  const sides = {
    tl: { top:0, left:0,  borderTop:'1.5px solid', borderLeft:'1.5px solid' },
    tr: { top:0, right:0, borderTop:'1.5px solid', borderRight:'1.5px solid' },
    bl: { bottom:0, left:0,  borderBottom:'1.5px solid', borderLeft:'1.5px solid' },
    br: { bottom:0, right:0, borderBottom:'1.5px solid', borderRight:'1.5px solid' },
  };
  return <span style={{ ...base, ...sides[pos] }} />;
};

/* ── Línea de scan animada ──────────────────────────────── */
const ScanLine = () => (
  <motion.div
    style={{
      position:'absolute', left:0, right:0, height:1,
      background:`linear-gradient(90deg,transparent,${E.primary}40,transparent)`,
      pointerEvents:'none', zIndex:10,
    }}
    initial={{ top:'0%' }}
    animate={{ top:['0%','100%','0%'] }}
    transition={{ duration:7, repeat:Infinity, ease:'linear' }}
  />
);

/* ── Card con bordes neón ───────────────────────────────── */
const GlowCard = ({ children, className = '', delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity:0, y:16 }}
    animate={{ opacity:1, y:0 }}
    transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}
    whileHover={{ 
      y: -4,
      boxShadow: `0 8px 32px rgba(0,207,255,0.25), 0 0 0 1px ${E.primary}40`,
      transition: { duration: 0.2 }
    }}
    style={{
      position:'relative', overflow:'hidden',
      background: E.surface,
      border: `1px solid ${E.border}`,
      borderRadius:4,
      backdropFilter:'blur(12px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      ...style,
    }}
    className={className}
  >
    {/* top accent */}
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:1,
      background:`linear-gradient(90deg,transparent,${E.primary}60,transparent)`,
    }} />
    <ScanLine />
    {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} />)}
    {children}
  </motion.div>
);

/* ── KPI Card ───────────────────────────────────────────── */
const KpiCard = ({ icon: Icon, title, value, sub, trend, delay, onAction }) => (
  <GlowCard delay={delay} style={{ padding:'1.25rem' }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{
          width:38, height:38, borderRadius:4,
          background:`linear-gradient(135deg, rgba(0,207,255,0.2), rgba(0,84,255,0.1))`,
          border:`1px solid ${E.border}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: `0 4px 12px rgba(0,207,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}>
        <Icon style={{ color: E.primary, fontSize:16, filter: 'drop-shadow(0 0 4px rgba(0,207,255,0.8))' }} />
      </motion.div>
      {trend != null && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring' }}
          style={{
            fontSize:11, fontFamily:'monospace', padding:'2px 8px',
            background: trend > 0 ? 'rgba(0,255,150,0.12)' : 'rgba(255,80,80,0.12)',
            border: `1px solid ${trend > 0 ? 'rgba(0,255,150,0.3)' : 'rgba(255,80,80,0.3)'}`,
            borderRadius:3,
            color: trend > 0 ? '#00FF96' : '#FF5050',
            boxShadow: trend > 0 ? '0 2px 8px rgba(0,255,150,0.2)' : '0 2px 8px rgba(255,80,80,0.2)',
          }}>
          {trend > 0 ? '+' : ''}{trend}%
        </motion.span>
      )}
    </div>
    <p style={{ fontSize:11, fontFamily:'monospace', color: E.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>
      {title}
    </p>
    <motion.p 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay + 0.2 }}
      style={{ 
        fontSize:28, 
        fontWeight:700, 
        color: E.text, 
        lineHeight:1, 
        marginBottom:4,
        textShadow: `0 0 20px ${E.primary}40, 0 0 40px ${E.primary}20`,
      }}>
      {value}
    </motion.p>
    <p style={{ fontSize:11, color: E.muted, marginBottom: 12 }}>{sub}</p>
    {onAction && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction}
        style={{
          width: '100%',
          padding: '6px 12px',
          background: `linear-gradient(135deg, ${E.primary}20, ${E.accent2}10)`,
          border: `1px solid ${E.border}`,
          borderRadius: 4,
          color: E.primary,
          fontSize: 11,
          fontFamily: 'monospace',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = E.primary}
        onMouseLeave={e => e.currentTarget.style.borderColor = E.border}
      >
        Ver Detalles →
      </motion.button>
    )}
  </GlowCard>
);

/* ── Charts memoizados ──────────────────────────────────── */
const MemoizedLineChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data}>
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={E.primary} stopOpacity={0.3} />
          <stop offset="95%" stopColor={E.primary} stopOpacity={0} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis dataKey="mes" stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} />
      <YAxis stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} />
      <Tooltip {...CHART_STYLE} />
      <defs>
        <linearGradient id="colorGestos" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={E.primary} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={E.primary} stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      <Line
        type="monotone" dataKey="gestos"
        stroke={E.primary} strokeWidth={3}
        fill="url(#colorGestos)"
        dot={{ fill:E.primary, r:4, strokeWidth:2, stroke:'#000', filter:'url(#glow)' }}
        activeDot={{ r:6, fill:E.primary, stroke:'#000', strokeWidth:2, filter:'url(#glow)' }}
        isAnimationActive={true}
        animationDuration={1500}
        animationEasing="ease-in-out"
      />
    </LineChart>
  </ResponsiveContainer>
));
MemoizedLineChart.displayName = 'MemoizedLineChart';

const MemoizedBarChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} barCategoryGap="35%">
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={E.primary} stopOpacity={1} />
          <stop offset="100%" stopColor={E.accent2} stopOpacity={0.8} />
        </linearGradient>
        <filter id="barShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={E.primary} floodOpacity="0.4"/>
        </filter>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis dataKey="gesto" stroke={E.dim} angle={-12} textAnchor="end" height={60} tick={{ fontSize:10, fill:E.muted }} />
      <YAxis stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} />
      <Tooltip {...CHART_STYLE} />
      <Bar 
        dataKey="cantidad" 
        fill="url(#barGradient)" 
        radius={[6,6,0,0]} 
        isAnimationActive={true}
        animationDuration={1200}
        animationEasing="ease-out"
        style={{ filter: 'url(#barShadow)' }}
      />
    </BarChart>
  </ResponsiveContainer>
));
MemoizedBarChart.displayName = 'MemoizedBarChart';

const COLORS = ['#00CFFF','#0054FF','#00FFD1','#4477FF','#00A8CC'];

const MemoizedPieChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <defs>
        {COLORS.map((color, i) => (
          <radialGradient key={i} id={`pieGradient${i}`}>
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </radialGradient>
        ))}
        <filter id="pieShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>
      <Pie
        data={data} cx="50%" cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
        outerRadius={72} 
        innerRadius={35}
        dataKey="value"
        style={{ fontSize:10, filter: 'url(#pieShadow)' }} 
        isAnimationActive={true}
        animationDuration={1500}
        animationBegin={0}
      >
        {data.map((_, i) => (
          <Cell 
            key={i} 
            fill={`url(#pieGradient${i % COLORS.length})`}
            stroke="#000"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip {...CHART_STYLE} />
    </PieChart>
  </ResponsiveContainer>
));
MemoizedPieChart.displayName = 'MemoizedPieChart';

/* ── Activity item ──────────────────────────────────────── */
const ActivityItem = memo(({ entry, onClick }) => (
  <motion.div
    initial={{ opacity:0, x:-12 }}
    animate={{ opacity:1, x:0 }}
    whileHover={{ scale: 1.02, x: 4 }}
    onClick={() => onClick && onClick(entry)}
    style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'10px 12px',
      background: E.surface,
      border: `1px solid ${E.border}`,
      borderRadius:4,
      transition:'all 0.2s',
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <motion.span 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width:6, height:6, borderRadius:'50%',
          background: E.primary,
          boxShadow:`0 0 6px ${E.primary}`,
          flexShrink:0,
          display:'inline-block',
        }} 
      />
      <div>
        <p style={{ fontSize:13, fontWeight:600, color: E.text, margin:0 }}>{entry.gesture}</p>
        <p style={{ fontSize:11, color: E.muted, margin:0, marginTop:1 }}>{entry.action}</p>
      </div>
    </div>
    <div style={{ textAlign:'right' }}>
      <p style={{ fontSize:12, fontFamily:'monospace', color: E.primary, margin:0 }}>
        {(entry.confidence * 100).toFixed(1)}%
      </p>
      <p style={{ fontSize:10, color: E.muted, margin:0, marginTop:1 }}>
        {new Date(entry.timestamp).toLocaleTimeString()}
      </p>
    </div>
  </motion.div>
));
ActivityItem.displayName = 'ActivityItem';

/* ── Dashboard principal ────────────────────────────────── */
const Dashboard = () => {
  const { stats, gestureHistory } = useGesture();
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('hasSeenTutorial')) setShowTutorial(true);
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  // Funciones para los botones
  const handleExportData = (chartType) => {
    const data = chartType === 'line' ? lineData : chartType === 'bar' ? barData : pieData;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartType}-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleViewDetails = (entry) => {
    alert(`Detalles del Gesto:\n\nGesto: ${entry.gesture}\nAcción: ${entry.action}\nConfianza: ${(entry.confidence * 100).toFixed(1)}%\nHora: ${new Date(entry.timestamp).toLocaleString()}`);
  };

  const handleClearHistory = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el historial?')) {
      localStorage.removeItem('gestureHistory');
      window.location.reload();
    }
  };

  const handleDownloadReport = () => {
    const report = {
      fecha: new Date().toLocaleString(),
      estadisticas: stats,
      historial: gestureHistory.slice(0, 50),
      graficos: {
        tendencia: lineData,
        masUsados: barData,
        distribucion: pieData
      }
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-handcontrol-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lineData = useMemo(() => [
    { mes:'Ene', gestos:1200 }, { mes:'Feb', gestos:1900 },
    { mes:'Mar', gestos:2400 }, { mes:'Abr', gestos:2100 },
    { mes:'May', gestos:2800 }, { mes:'Jun', gestos:3200 },
  ], []);

  const barData = useMemo(() => [
    { gesto:'Mano Abierta', cantidad:450 }, { gesto:'Puño', cantidad:320 },
    { gesto:'Pulgar', cantidad:280 },       { gesto:'Dos Dedos', cantidad:190 },
    { gesto:'Derecha', cantidad:150 },
  ], []);

  const pieData = useMemo(() => [
    { name:'Activar', value:35 },  { name:'Pausar', value:25 },
    { name:'Confirmar', value:20 },{ name:'Menú', value:12 },
    { name:'Navegar', value:8 },
  ], []);

  const recentHistory = useMemo(() => gestureHistory.slice(0, 10), [gestureHistory]);

  return (
    <div className="min-h-screen relative" style={{ background: E.bg }}>
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} onComplete={handleTutorialComplete} />

      <div className="ml-0 md:ml-64 mt-20 relative z-10" style={{ padding:'1.5rem 2rem' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', gap:16, flexWrap:'wrap' }}
        >
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ color: E.muted, fontFamily:'monospace', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                // Dashboard
              </span>
              <span style={{ flex:1, height:1, background: E.border, maxWidth:120 }} />
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color: E.text, margin:0, lineHeight:1.1, letterSpacing:'-0.02em' }}>
              Panel de Control
            </h1>
            <p style={{ fontSize:13, color: E.muted, marginTop:6, fontFamily:'monospace' }}>
              Monitoreo en tiempo real — HandControl AI
            </p>
          </div>

          {/* Status + Tutorial + Actions */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <div style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'6px 14px',
              background:'rgba(0,255,150,0.05)',
              border:'1px solid rgba(0,255,150,0.15)',
              borderRadius:4,
            }}>
              <span style={{
                width:6, height:6, borderRadius:'50%',
                background:'#00FF96',
                boxShadow:'0 0 6px #00FF96',
                display:'inline-block',
              }} className="animate-pulse" />
              <span style={{ fontSize:11, fontFamily:'monospace', color:'#00CC78', letterSpacing:'0.08em' }}>
                SISTEMA ONLINE
              </span>
            </div>

            <button
              onClick={handleRefreshData}
              style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 14px',
                background: E.surface,
                border: `1px solid ${E.border}`,
                borderRadius:4,
                color: E.dim,
                fontSize:12, fontFamily:'monospace',
                cursor:'pointer',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = E.primary; e.currentTarget.style.color = E.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; }}
            >
              <FaSync style={{ fontSize:12 }} />
              Actualizar
            </button>

            <button
              onClick={handleDownloadReport}
              style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 14px',
                background: E.surface,
                border: `1px solid ${E.border}`,
                borderRadius:4,
                color: E.dim,
                fontSize:12, fontFamily:'monospace',
                cursor:'pointer',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = E.primary; e.currentTarget.style.color = E.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; }}
            >
              <FaDownload style={{ fontSize:12 }} />
              Reporte
            </button>

            <button
              onClick={() => setShowTutorial(true)}
              style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 14px',
                background: E.surface,
                border: `1px solid ${E.border}`,
                borderRadius:4,
                color: E.dim,
                fontSize:12, fontFamily:'monospace',
                cursor:'pointer',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = E.primary; e.currentTarget.style.color = E.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; }}
            >
              <FaQuestionCircle style={{ fontSize:12 }} />
              Tutorial
            </button>
          </div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:'1.75rem' }}>
          <KpiCard icon={FaHandPaper} title="Gestos Detectados"  value={stats.totalGestures.toLocaleString()} sub="Total acumulado"   trend={12.5} delay={0} onAction={() => alert('Total de gestos detectados desde el inicio del sistema')} />
          <KpiCard icon={FaBullseye} title="Precisión IA"        value={`${stats.accuracy}%`}                 sub="Confianza promedio" trend={2.3}  delay={0.05} onAction={() => alert('Precisión promedio del sistema de IA basada en confianza de detección')} />
          <KpiCard icon={FaClock}    title="Sesiones Activas"    value={stats.activeSessions}                 sub="En este momento"    delay={0.1} onAction={() => alert('Número de sesiones activas en este momento')} />
          <KpiCard icon={FaUsers}    title="Usuarios"            value={stats.users}                          sub="Conectados ahora"   delay={0.15} onAction={() => alert('Usuarios conectados actualmente al sistema')} />
        </div>

        {/* ── Charts row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:14, marginBottom:'1.75rem' }}>
          <GlowCard delay={0.2} style={{ padding:'1.25rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>
                ▸ Tendencia de Gestos
              </p>
              <button
                onClick={() => handleExportData('line')}
                style={{
                  padding:'4px 8px',
                  background: E.surface,
                  border: `1px solid ${E.border}`,
                  borderRadius:4,
                  color: E.dim,
                  fontSize:10,
                  cursor:'pointer',
                  transition:'all 0.2s',
                  display:'flex',
                  alignItems:'center',
                  gap:4,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = E.primary; e.currentTarget.style.color = E.primary; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; }}
              >
                <FaFileExport style={{ fontSize:10 }} />
                Exportar
              </button>
            </div>
            <MemoizedLineChart data={lineData} />
          </GlowCard>

          <GlowCard delay={0.25} style={{ padding:'1.25rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>
                ▸ Gestos Más Usados
              </p>
              <button
                onClick={() => handleExportData('bar')}
                style={{
                  padding:'4px 8px',
                  background: E.surface,
                  border: `1px solid ${E.border}`,
                  borderRadius:4,
                  color: E.dim,
                  fontSize:10,
                  cursor:'pointer',
                  transition:'all 0.2s',
                  display:'flex',
                  alignItems:'center',
                  gap:4,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = E.primary; e.currentTarget.style.color = E.primary; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; }}
              >
                <FaFileExport style={{ fontSize:10 }} />
                Exportar
              </button>
            </div>
            <MemoizedBarChart data={barData} />
          </GlowCard>
        </div>

        {/* ── Pie + Activity ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:14 }}>
          <GlowCard delay={0.3} style={{ padding:'1.25rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>
                ▸ Distribución de Acciones
              </p>
              <button
                onClick={() => handleExportData('pie')}
                style={{
                  padding:'4px 8px',
                  background: E.surface,
                  border: `1px solid ${E.border}`,
                  borderRadius:4,
                  color: E.dim,
                  fontSize:10,
                  cursor:'pointer',
                  transition:'all 0.2s',
                  display:'flex',
                  alignItems:'center',
                  gap:4,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = E.primary; e.currentTarget.style.color = E.primary; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; }}
              >
                <FaFileExport style={{ fontSize:10 }} />
                Exportar
              </button>
            </div>
            <MemoizedPieChart data={pieData} />
          </GlowCard>

          <GlowCard delay={0.35} style={{ padding:'1.25rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>
                ▸ Actividad Reciente
              </p>
              <button
                onClick={handleClearHistory}
                style={{
                  padding:'4px 8px',
                  background: 'rgba(255,80,80,0.1)',
                  border: `1px solid rgba(255,80,80,0.3)`,
                  borderRadius:4,
                  color: '#FF5050',
                  fontSize:10,
                  cursor:'pointer',
                  transition:'all 0.2s',
                  display:'flex',
                  alignItems:'center',
                  gap:4,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.2)'; e.currentTarget.style.borderColor = '#FF5050'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)'; }}
              >
                <FaTrash style={{ fontSize:10 }} />
                Limpiar
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:260, overflowY:'auto' }}>
              {recentHistory.length > 0 ? (
                recentHistory.map(entry => <ActivityItem key={entry.id} entry={entry} onClick={handleViewDetails} />)
              ) : (
                <div style={{ textAlign:'center', padding:'2.5rem 0' }}>
                  <FaHandPaper style={{ fontSize:32, color: E.muted, marginBottom:10, opacity:0.4 }} />
                  <p style={{ fontSize:13, color: E.muted }}>Sin actividad reciente</p>
                  <p style={{ fontSize:11, color: E.muted, marginTop:4 }}>Inicia el sistema de gestos para ver datos</p>
                </div>
              )}
            </div>
          </GlowCard>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;