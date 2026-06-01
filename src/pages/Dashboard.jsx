import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import {
  FaHandPaper, FaBullseye, FaUsers, FaClock, FaQuestionCircle,
  FaChevronRight, FaCircle, FaDownload, FaSync, FaTrash, FaFileExport,
  FaChartLine, FaChartBar, FaChartPie, FaBolt, FaCheckCircle,
  FaPlay, FaHistory, FaDatabase
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HolographicBackground from '../components/HolographicBackground';
import Tutorial from '../components/Tutorial';
import { useGesture } from '../context/GestureContext';
import {
  CSV_MONTHLY_TREND, CSV_GESTURE_COUNTS, CSV_ACTION_DIST,
  CSV_SECTOR_DATA, CSV_STATS
} from '../data/csvStats';

/* ── Design tokens ─────────────────────────────────────── */
const E = {
  primary:   '#00CFFF',
  dim:       '#0097BB',
  glow:      'rgba(0,207,255,0.12)',
  glowStr:   'rgba(0,207,255,0.22)',
  border:    'rgba(0,207,255,0.15)',
  borderHov: 'rgba(0,207,255,0.35)',
  bg:        '#050A14',
  surface:   'rgba(0,207,255,0.04)',
  text:      '#E0F7FF',
  muted:     '#4A7080',
  accent2:   '#0054FF',
  accent3:   '#00FFD1',
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

const PIE_COLORS = ['#00CFFF','#a855f7','#22c55e','#f59e0b','#ef4444','#3b82f6','#ec4899'];
const BAR_COLORS = CSV_GESTURE_COUNTS.map(g => g.color);

/* ── Corner ornament ────────────────────────────────────── */
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

/* ── GlowCard ───────────────────────────────────────────── */
const GlowCard = ({ children, className = '', delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity:0, y:16 }}
    animate={{ opacity:1, y:0 }}
    transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}
    whileHover={{ y:-3, boxShadow:`0 8px 32px rgba(0,207,255,0.2), 0 0 0 1px ${E.primary}30`, transition:{ duration:0.2 } }}
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
    <div style={{ position:'absolute', top:0, left:0, right:0, height:1,
      background:`linear-gradient(90deg,transparent,${E.primary}60,transparent)` }} />
    <ScanLine />
    {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} />)}
    {children}
  </motion.div>
);

/* ── Chart label ────────────────────────────────────────── */
const ChartHeader = ({ label, icon: Icon, color = E.dim, extra }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
      {Icon && <Icon style={{ color, fontSize:13 }} />}
      <p style={{ fontSize:12, fontFamily:'monospace', color, letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>
        {label}
      </p>
    </div>
    {extra}
  </div>
);

/* ── KPI Card ───────────────────────────────────────────── */
const KpiCard = ({ icon: Icon, title, value, sub, trend, delay, color = E.primary }) => (
  <GlowCard delay={delay} style={{ padding:'1.25rem' }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
      <motion.div whileHover={{ scale:1.1, rotate:5 }} transition={{ type:'spring', stiffness:300 }}
        style={{
          width:38, height:38, borderRadius:4,
          background:`linear-gradient(135deg, ${color}22, ${color}11)`,
          border:`1px solid ${color}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 4px 12px ${color}30`,
        }}>
        <Icon style={{ color, fontSize:16 }} />
      </motion.div>
      {trend != null && (
        <motion.span initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:delay+0.3, type:'spring' }}
          style={{
            fontSize:11, fontFamily:'monospace', padding:'2px 8px',
            background: trend > 0 ? 'rgba(0,255,150,0.12)' : 'rgba(255,80,80,0.12)',
            border:`1px solid ${trend > 0 ? 'rgba(0,255,150,0.3)' : 'rgba(255,80,80,0.3)'}`,
            borderRadius:3,
            color: trend > 0 ? '#00FF96' : '#FF5050',
          }}>
          {trend > 0 ? '+' : ''}{trend}%
        </motion.span>
      )}
    </div>
    <p style={{ fontSize:11, fontFamily:'monospace', color: E.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>
      {title}
    </p>
    <motion.p initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:delay+0.2 }}
      style={{ fontSize:26, fontWeight:700, color: E.text, lineHeight:1, marginBottom:4,
        textShadow:`0 0 20px ${color}40` }}>
      {value}
    </motion.p>
    <p style={{ fontSize:11, color: E.muted }}>{sub}</p>
  </GlowCard>
);

/* ── Live Action Item ────────────────────────────────────── */
const ActionItem = memo(({ entry, index }) => {
  const GESTURE_ICONS = {
    'Mano Abierta':  '✋', 'Puño Cerrado': '✊', 'Pulgar Arriba': '👍',
    'Dos Dedos':     '✌️', 'Mano Derecha':  '👉', 'Mano Izquierda': '👈',
  };
  const GESTURE_COLORS = {
    'Mano Abierta':  '#00d9ff', 'Puño Cerrado':   '#ef4444',
    'Pulgar Arriba': '#22c55e', 'Dos Dedos':      '#f59e0b',
    'Mano Derecha':  '#3b82f6', 'Mano Izquierda': '#a855f7',
  };
  const color = GESTURE_COLORS[entry.gesture] || E.primary;
  const icon  = GESTURE_ICONS[entry.gesture]  || '🤚';
  const conf  = Math.round((entry.confidence || 0) * 100);

  return (
    <motion.div
      initial={{ opacity:0, x:-16, scale:0.97 }}
      animate={{ opacity:1, x:0, scale:1 }}
      transition={{ delay: index * 0.04, duration:0.3 }}
      style={{
        display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
        background:`${color}08`,
        border:`1px solid ${color}25`,
        borderRadius:4, marginBottom:6,
      }}
    >
      <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:13, fontWeight:600, color: E.text, margin:0, truncate:true }}>{entry.gesture}</p>
          <span style={{ fontSize:11, fontFamily:'monospace', color, flexShrink:0 }}>{conf}%</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:3 }}>
          <p style={{ fontSize:10, color: E.muted, margin:0 }}>{entry.action}</p>
          <p style={{ fontSize:9, color: E.muted, margin:0, fontFamily:'monospace' }}>
            {new Date(entry.timestamp).toLocaleTimeString()}
          </p>
        </div>
        {/* Confidence bar */}
        <div style={{ marginTop:5, height:2, background:'rgba(255,255,255,0.05)', borderRadius:2, overflow:'hidden' }}>
          <motion.div
            initial={{ width:0 }}
            animate={{ width:`${conf}%` }}
            transition={{ duration:0.5 }}
            style={{ height:'100%', background:`linear-gradient(90deg,${color}80,${color})`, borderRadius:2 }}
          />
        </div>
      </div>
    </motion.div>
  );
});
ActionItem.displayName = 'ActionItem';

/* ── Memoized Charts ────────────────────────────────────── */
const TrendChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor={E.primary} stopOpacity={0.4} />
          <stop offset="95%" stopColor={E.primary} stopOpacity={0}   />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis dataKey="mes" stroke={E.dim} tick={{ fontSize:9, fill:E.muted }} interval={4} />
      <YAxis stroke={E.dim} tick={{ fontSize:10, fill:E.muted }} />
      <Tooltip {...CHART_STYLE} formatter={v => [v, 'Gestos']} />
      <Area type="monotone" dataKey="gestos" stroke={E.primary} strokeWidth={2.5}
        fill="url(#areaGrad)" dot={false} activeDot={{ r:5, fill:E.primary }} />
    </AreaChart>
  </ResponsiveContainer>
));
TrendChart.displayName = 'TrendChart';

const GestureBarChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} barCategoryGap="30%">
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis dataKey="gesto" stroke={E.dim} tick={{ fontSize:9, fill:E.muted }} angle={-20} textAnchor="end" height={50} />
      <YAxis stroke={E.dim} tick={{ fontSize:10, fill:E.muted }} />
      <Tooltip {...CHART_STYLE} formatter={v => [v, 'Detecciones']} />
      <Bar dataKey="cantidad" radius={[5,5,0,0]} isAnimationActive animationDuration={1200}>
        {data.map((entry, i) => <Cell key={i} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
));
GestureBarChart.displayName = 'GestureBarChart';

const ActionPieChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
        outerRadius={78} innerRadius={36} dataKey="value"
        style={{ fontSize:10 }}
        isAnimationActive animationDuration={1400}>
        {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#000" strokeWidth={2} />)}
      </Pie>
      <Tooltip {...CHART_STYLE} />
    </PieChart>
  </ResponsiveContainer>
));
ActionPieChart.displayName = 'ActionPieChart';

const SectorBarChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} layout="vertical" barCategoryGap="20%">
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis type="number" stroke={E.dim} tick={{ fontSize:10, fill:E.muted }} />
      <YAxis dataKey="gesto" type="category" stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} width={72} />
      <Tooltip {...CHART_STYLE} formatter={v => [v, 'Sesiones']} />
      <Bar dataKey="cantidad" radius={[0,5,5,0]} isAnimationActive animationDuration={1400}>
        {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
));
SectorBarChart.displayName = 'SectorBarChart';

/* ── Live Gesture Pulse ─────────────────────────────────── */
const LiveGesturePulse = ({ gesture, confidence }) => {
  if (!gesture) return null;
  const conf = Math.round((confidence || 0) * 100);
  return (
    <motion.div
      initial={{ opacity:0, scale:0.9 }}
      animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.9 }}
      style={{
        display:'flex', alignItems:'center', gap:12, padding:'10px 16px',
        background:'rgba(0,255,150,0.06)',
        border:'1px solid rgba(0,255,150,0.25)',
        borderRadius:6, marginBottom:12,
      }}
    >
      <motion.span animate={{ scale:[1,1.3,1] }} transition={{ duration:1, repeat:Infinity }}
        style={{ width:8, height:8, borderRadius:'50%', background:'#00FF96',
          boxShadow:'0 0 10px #00FF96', flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <p style={{ margin:0, fontSize:14, fontWeight:700, color:'#00FF96' }}>🤖 {gesture}</p>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
          <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' }}>
            <motion.div animate={{ width:`${conf}%` }} transition={{ duration:0.3 }}
              style={{ height:'100%', background:`linear-gradient(90deg,#00cc6a,#00FF96)`, borderRadius:2 }} />
          </div>
          <span style={{ fontSize:11, fontFamily:'monospace', color:'#00FF96', flexShrink:0 }}>{conf}%</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Dashboard principal ────────────────────────────────── */
const Dashboard = () => {
  const { stats, gestureHistory, currentGesture, confidence, isActive } = useGesture();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hasSeenTutorial')) setShowTutorial(true);
  }, []);

  const recentHistory = useMemo(() => gestureHistory.slice(0, 12), [gestureHistory]);

  // Merge CSV stats with live stats for KPIs
  const totalGestos   = CSV_STATS.total + stats.totalGestures;
  const successRate   = CSV_STATS.successRate;
  const avgConf       = CSV_STATS.avgConfidence;
  const avgResp       = CSV_STATS.avgResponseMs;

  const handleDownloadReport = useCallback(() => {
    const report = {
      fecha: new Date().toLocaleString(),
      dataset: { registros: CSV_STATS.total, tasaExito:`${successRate}%`, confianza:`${avgConf}%` },
      sesionActual: { gestosDetectados: stats.totalGestures, historial: gestureHistory.slice(0,20) },
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type:'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `reporte-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }, [stats.totalGestures, gestureHistory]);

  return (
    <div className="min-h-screen relative" style={{ background: E.bg }}>
      <HolographicBackground />
      <Navbar />
      <Sidebar />

      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)}
        onComplete={() => { localStorage.setItem('hasSeenTutorial','true'); setShowTutorial(false); }} />

      <div className="ml-0 md:ml-64 mt-20 relative z-10" style={{ padding:'1.5rem 2rem' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', gap:16, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ color:E.muted, fontFamily:'monospace', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                // Dashboard
              </span>
              <span style={{ flex:1, height:1, background:E.border, maxWidth:120 }} />
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:E.text, margin:0, lineHeight:1.1, letterSpacing:'-0.02em' }}>
              Panel de Control
            </h1>
            <p style={{ fontSize:13, color:E.muted, marginTop:6, fontFamily:'monospace' }}>
              Dataset: {CSV_STATS.total.toLocaleString()} registros · Sesión viva: {stats.totalGestures} gestos
            </p>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            {/* Status indicator */}
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px',
              background: isActive ? 'rgba(0,255,150,0.05)' : 'rgba(255,80,80,0.05)',
              border:`1px solid ${isActive ? 'rgba(0,255,150,0.2)' : 'rgba(255,80,80,0.2)'}`,
              borderRadius:4 }}>
              <span style={{ width:6, height:6, borderRadius:'50%',
                background: isActive ? '#00FF96' : '#FF5050',
                boxShadow:`0 0 6px ${isActive ? '#00FF96' : '#FF5050'}`,
                display:'inline-block' }} className="animate-pulse" />
              <span style={{ fontSize:11, fontFamily:'monospace', color: isActive ? '#00CC78' : '#FF5050', letterSpacing:'0.08em' }}>
                {isActive ? 'IA ACTIVA' : 'IA EN ESPERA'}
              </span>
            </div>

            <button onClick={handleDownloadReport} style={{
              display:'flex', alignItems:'center', gap:6, padding:'6px 14px',
              background:E.surface, border:`1px solid ${E.border}`, borderRadius:4,
              color:E.dim, fontSize:12, fontFamily:'monospace', cursor:'pointer', transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=E.primary; e.currentTarget.style.color=E.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=E.border;  e.currentTarget.style.color=E.dim; }}>
              <FaDownload style={{ fontSize:11 }} /> Reporte
            </button>

            <button onClick={() => setShowTutorial(true)} style={{
              display:'flex', alignItems:'center', gap:6, padding:'6px 14px',
              background:E.surface, border:`1px solid ${E.border}`, borderRadius:4,
              color:E.dim, fontSize:12, fontFamily:'monospace', cursor:'pointer', transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=E.primary; e.currentTarget.style.color=E.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=E.border;  e.currentTarget.style.color=E.dim; }}>
              <FaQuestionCircle style={{ fontSize:11 }} /> Tutorial
            </button>
          </div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))', gap:14, marginBottom:'1.75rem' }}>
          <KpiCard icon={FaHandPaper} title="Total Gestos"       value={totalGestos.toLocaleString()} sub="Dataset + sesión viva"  trend={12.5} delay={0}    color="#00CFFF" />
          <KpiCard icon={FaCheckCircle} title="Tasa de Éxito"   value={`${successRate}%`}             sub="Detecciones correctas"  trend={2.3}  delay={0.05} color="#22c55e" />
          <KpiCard icon={FaBolt}      title="Confianza Prom."    value={`${avgConf}%`}                 sub="Certeza del modelo"     trend={1.8}  delay={0.1}  color="#a855f7" />
          <KpiCard icon={FaClock}     title="Resp. Promedio"     value={`${avgResp} ms`}               sub="Tiempo de respuesta"                 delay={0.15} color="#f59e0b" />
          <KpiCard icon={FaDatabase}  title="Sesión Actual"      value={stats.totalGestures}           sub="Gestos en esta sesión"               delay={0.2}  color="#3b82f6" />
        </div>

        {/* ── Charts Row 1: Trend + Gesture counts ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:14, marginBottom:'1.75rem' }}>

          <GlowCard delay={0.25} style={{ padding:'1.25rem' }}>
            <ChartHeader label="Tendencia Diaria — Enero 2024" icon={FaChartLine}
              extra={<span style={{ fontSize:10, fontFamily:'monospace', color:E.muted }}>Ene 1-30</span>} />
            <TrendChart data={CSV_MONTHLY_TREND} />
          </GlowCard>

          <GlowCard delay={0.3} style={{ padding:'1.25rem' }}>
            <ChartHeader label="Gestos Más Detectados" icon={FaChartBar}
              extra={<span style={{ fontSize:10, fontFamily:'monospace', color:E.muted }}>5 000 registros</span>} />
            <GestureBarChart data={CSV_GESTURE_COUNTS} />
          </GlowCard>
        </div>

        {/* ── Charts Row 2: Pie + Sector ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:'1.75rem' }}>

          <GlowCard delay={0.35} style={{ padding:'1.25rem' }}>
            <ChartHeader label="Distribución de Acciones" icon={FaChartPie} />
            <ActionPieChart data={CSV_ACTION_DIST} />
          </GlowCard>

          <GlowCard delay={0.4} style={{ padding:'1.25rem' }}>
            <ChartHeader label="Uso por Sector Industrial" icon={FaDatabase} />
            <SectorBarChart data={CSV_SECTOR_DATA} />
          </GlowCard>
        </div>

        {/* ── Live History ── */}
        <GlowCard delay={0.45} style={{ padding:'1.25rem' }}>
          <ChartHeader label="Acciones en Tiempo Real" icon={FaHistory}
            extra={
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                {gestureHistory.length > 0 && (
                  <span style={{ fontSize:10, fontFamily:'monospace',
                    background:'rgba(0,207,255,0.1)', color:E.primary,
                    padding:'2px 8px', borderRadius:3, border:`1px solid ${E.border}` }}>
                    {gestureHistory.length} acciones
                  </span>
                )}
                <span style={{ fontSize:11, fontFamily:'monospace', color: isActive ? '#00FF96' : E.muted }}>
                  {isActive ? '● EN VIVO' : '○ En espera'}
                </span>
              </div>
            }
          />

          {/* Gesto activo ahora mismo */}
          <AnimatePresence>
            {currentGesture && <LiveGesturePulse gesture={currentGesture} confidence={confidence} />}
          </AnimatePresence>

          {/* Historial reciente */}
          <div style={{ maxHeight:340, overflowY:'auto', overflowX:'hidden' }}>
            <AnimatePresence>
              {recentHistory.length > 0 ? (
                recentHistory.map((entry, i) => <ActionItem key={entry.id} entry={entry} index={i} />)
              ) : (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ textAlign:'center', padding:'3rem 0' }}>
                  <FaHandPaper style={{ fontSize:36, color:E.muted, marginBottom:12, opacity:0.3 }} />
                  <p style={{ fontSize:13, color:E.muted, margin:0 }}>Sin gestos detectados aún</p>
                  <p style={{ fontSize:11, color:E.muted, marginTop:6, opacity:0.6 }}>
                    Ve a <strong style={{ color:E.primary }}>IA Gestual</strong> y activa la cámara para detectar gestos
                  </p>
                  <motion.a href="/gesture" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:6, marginTop:14,
                      padding:'8px 20px', background:`${E.primary}15`,
                      border:`1px solid ${E.border}`, borderRadius:4,
                      color:E.primary, fontSize:12, fontFamily:'monospace',
                      cursor:'pointer', textDecoration:'none',
                    }}>
                    <FaPlay style={{ fontSize:10 }} /> Ir a IA Gestual
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlowCard>

      </div>
    </div>
  );
};

export default Dashboard;