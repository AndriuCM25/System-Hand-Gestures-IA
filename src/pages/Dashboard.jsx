import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, memo } from 'react';
import {
  FaHandPaper, FaBullseye, FaUsers, FaClock, FaQuestionCircle,
  FaChevronRight, FaCircle
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
    style={{
      position:'relative', overflow:'hidden',
      background: E.surface,
      border: `1px solid ${E.border}`,
      borderRadius:4,
      backdropFilter:'blur(12px)',
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
const KpiCard = ({ icon: Icon, title, value, sub, trend, delay }) => (
  <GlowCard delay={delay} style={{ padding:'1.25rem' }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
      <div style={{
        width:38, height:38, borderRadius:4,
        background:`rgba(0,207,255,0.1)`,
        border:`1px solid ${E.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon style={{ color: E.primary, fontSize:16 }} />
      </div>
      {trend != null && (
        <span style={{
          fontSize:11, fontFamily:'monospace', padding:'2px 8px',
          background: trend > 0 ? 'rgba(0,255,150,0.08)' : 'rgba(255,80,80,0.08)',
          border: `1px solid ${trend > 0 ? 'rgba(0,255,150,0.2)' : 'rgba(255,80,80,0.2)'}`,
          borderRadius:3,
          color: trend > 0 ? '#00FF96' : '#FF5050',
        }}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p style={{ fontSize:11, fontFamily:'monospace', color: E.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>
      {title}
    </p>
    <p style={{ fontSize:28, fontWeight:700, color: E.text, lineHeight:1, marginBottom:4 }}>
      {value}
    </p>
    <p style={{ fontSize:11, color: E.muted }}>{sub}</p>
  </GlowCard>
);

/* ── Charts memoizados ──────────────────────────────────── */
const MemoizedLineChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis dataKey="mes" stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} />
      <YAxis stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} />
      <Tooltip {...CHART_STYLE} />
      <Line
        type="monotone" dataKey="gestos"
        stroke={E.primary} strokeWidth={2}
        dot={{ fill:E.primary, r:3, strokeWidth:0 }}
        activeDot={{ r:5, fill:E.primary }}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
));
MemoizedLineChart.displayName = 'MemoizedLineChart';

const MemoizedBarChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} barCategoryGap="35%">
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,207,255,0.07)" />
      <XAxis dataKey="gesto" stroke={E.dim} angle={-12} textAnchor="end" height={60} tick={{ fontSize:10, fill:E.muted }} />
      <YAxis stroke={E.dim} tick={{ fontSize:11, fill:E.muted }} />
      <Tooltip {...CHART_STYLE} />
      <Bar dataKey="cantidad" fill={E.primary} radius={[3,3,0,0]} isAnimationActive={false} opacity={0.85} />
    </BarChart>
  </ResponsiveContainer>
));
MemoizedBarChart.displayName = 'MemoizedBarChart';

const COLORS = ['#00CFFF','#0054FF','#00FFD1','#4477FF','#00A8CC'];

const MemoizedPieChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={data} cx="50%" cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
        outerRadius={72} dataKey="value"
        style={{ fontSize:10 }} isAnimationActive={false}
      >
        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
      </Pie>
      <Tooltip {...CHART_STYLE} />
    </PieChart>
  </ResponsiveContainer>
));
MemoizedPieChart.displayName = 'MemoizedPieChart';

/* ── Activity item ──────────────────────────────────────── */
const ActivityItem = memo(({ entry }) => (
  <motion.div
    initial={{ opacity:0, x:-12 }}
    animate={{ opacity:1, x:0 }}
    style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'10px 12px',
      background: E.surface,
      border: `1px solid ${E.border}`,
      borderRadius:4,
      transition:'border-color 0.2s',
    }}
    whileHover={{ borderColor: E.borderHov }}
  >
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <span style={{
        width:6, height:6, borderRadius:'50%',
        background: E.primary,
        boxShadow:`0 0 6px ${E.primary}`,
        flexShrink:0,
        display:'inline-block',
      }} />
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

  useEffect(() => {
    if (!localStorage.getItem('hasSeenTutorial')) setShowTutorial(true);
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
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

          {/* Status + Tutorial */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
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
          <KpiCard icon={FaHandPaper} title="Gestos Detectados"  value={stats.totalGestures.toLocaleString()} sub="Total acumulado"   trend={12.5} delay={0}    />
          <KpiCard icon={FaBullseye} title="Precisión IA"        value={`${stats.accuracy}%`}                 sub="Confianza promedio" trend={2.3}  delay={0.05} />
          <KpiCard icon={FaClock}    title="Sesiones Activas"    value={stats.activeSessions}                 sub="En este momento"    delay={0.1}  />
          <KpiCard icon={FaUsers}    title="Usuarios"            value={stats.users}                          sub="Conectados ahora"   delay={0.15} />
        </div>

        {/* ── Charts row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:14, marginBottom:'1.75rem' }}>
          <GlowCard delay={0.2} style={{ padding:'1.25rem' }}>
            <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>
              ▸ Tendencia de Gestos
            </p>
            <MemoizedLineChart data={lineData} />
          </GlowCard>

          <GlowCard delay={0.25} style={{ padding:'1.25rem' }}>
            <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>
              ▸ Gestos Más Usados
            </p>
            <MemoizedBarChart data={barData} />
          </GlowCard>
        </div>

        {/* ── Pie + Activity ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:14 }}>
          <GlowCard delay={0.3} style={{ padding:'1.25rem' }}>
            <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>
              ▸ Distribución de Acciones
            </p>
            <MemoizedPieChart data={pieData} />
          </GlowCard>

          <GlowCard delay={0.35} style={{ padding:'1.25rem' }}>
            <p style={{ fontSize:12, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>
              ▸ Actividad Reciente
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:260, overflowY:'auto' }}>
              {recentHistory.length > 0 ? (
                recentHistory.map(entry => <ActivityItem key={entry.id} entry={entry} />)
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