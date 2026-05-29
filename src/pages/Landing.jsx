import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHandPaper, FaBrain, FaRocket, FaCity, FaShieldAlt,
  FaGlobe, FaMicrochip, FaEye, FaArrowRight, FaChevronDown
} from 'react-icons/fa';
import HolographicBackground from '../components/HolographicBackground';
import RobotHand3D from '../components/RobotHand3D';

/* ── Tokens ─────────────────────────────────────────────── */
const E = {
  primary:    '#00CFFF',
  dim:        '#0097BB',
  border:     'rgba(0,207,255,0.14)',
  borderHov:  'rgba(0,207,255,0.38)',
  surface:    'rgba(0,207,255,0.04)',
  surfaceHov: 'rgba(0,207,255,0.08)',
  bg:         '#050A14',
  text:       '#E0F7FF',
  muted:      '#3A6070',
  glow:       'rgba(0,207,255,0.12)',
};

/* ── Ornamentos ─────────────────────────────────────────── */
const Corner = ({ pos, size = 10 }) => {
  const base = { position:'absolute', width:size, height:size, borderColor: E.primary };
  const s = {
    tl: { top:0, left:0,   borderTop:'1.5px solid', borderLeft:'1.5px solid' },
    tr: { top:0, right:0,  borderTop:'1.5px solid', borderRight:'1.5px solid' },
    bl: { bottom:0, left:0,  borderBottom:'1.5px solid', borderLeft:'1.5px solid' },
    br: { bottom:0, right:0, borderBottom:'1.5px solid', borderRight:'1.5px solid' },
  };
  return <span style={{ ...base, ...s[pos] }} />;
};

const ScanLine = ({ duration = 7 }) => (
  <motion.div
    style={{
      position:'absolute', left:0, right:0, height:1,
      background:`linear-gradient(90deg,transparent,${E.primary}45,transparent)`,
      pointerEvents:'none', zIndex:5,
    }}
    initial={{ top:'0%' }}
    animate={{ top:['0%','100%','0%'] }}
    transition={{ duration, repeat:Infinity, ease:'linear' }}
  />
);

const GlowCard = ({ children, delay = 0, style = {}, hover = true }) => (
  <motion.div
    initial={{ opacity:0, y:18 }}
    whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true }}
    transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}
    whileHover={hover ? { y:-4, borderColor: E.borderHov } : undefined}
    style={{
      position:'relative', overflow:'hidden',
      background: E.surface,
      border:`1px solid ${E.border}`,
      borderRadius:4,
      backdropFilter:'blur(14px)',
      transition:'border-color 0.25s',
      ...style,
    }}
  >
    <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${E.primary}55,transparent)` }} />
    <ScanLine />
    {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} />)}
    {children}
  </motion.div>
);

/* ── Section label ──────────────────────────────────────── */
const SectionLabel = ({ label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:12 }}>
    <span style={{ flex:1, height:1, background: E.border, maxWidth:60 }} />
    <span style={{ fontSize:10, fontFamily:'monospace', color: E.muted, letterSpacing:'0.18em', textTransform:'uppercase' }}>
      // {label}
    </span>
    <span style={{ flex:1, height:1, background: E.border, maxWidth:60 }} />
  </div>
);

/* ── Stat card ──────────────────────────────────────────── */
const StatCard = ({ value, label, delay }) => (
  <GlowCard delay={delay} style={{ padding:'1.5rem 1rem', textAlign:'center' }}>
    <p style={{ fontSize:38, fontWeight:900, color: E.primary, margin:0, lineHeight:1, letterSpacing:'-0.03em', fontFamily:'monospace' }}>
      {value}
    </p>
    <p style={{ fontSize:11, color: E.muted, margin:0, marginTop:6, textTransform:'uppercase', letterSpacing:'0.1em' }}>
      {label}
    </p>
  </GlowCard>
);

/* ── Benefit card ───────────────────────────────────────── */
const BenefitCard = ({ icon: Icon, title, description, delay }) => (
  <GlowCard delay={delay} style={{ padding:'1.5rem' }}>
    <div style={{
      width:40, height:40, borderRadius:4, marginBottom:14,
      background:'rgba(0,207,255,0.08)', border:`1px solid ${E.border}`,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <Icon style={{ color: E.primary, fontSize:16 }} />
    </div>
    <h3 style={{ fontSize:15, fontWeight:700, color: E.text, margin:0, marginBottom:6, letterSpacing:'-0.01em' }}>
      {title}
    </h3>
    <p style={{ fontSize:12, color: E.muted, margin:0, lineHeight:1.6 }}>
      {description}
    </p>
  </GlowCard>
);

/* ── Use case card ──────────────────────────────────────── */
const UseCaseCard = ({ title, items, delay, dir }) => (
  <motion.div
    initial={{ opacity:0, x: dir < 0 ? -20 : 20 }}
    whileInView={{ opacity:1, x:0 }}
    viewport={{ once:true }}
    transition={{ delay, duration:0.5 }}
    style={{
      position:'relative', overflow:'hidden',
      background: E.surface, border:`1px solid ${E.border}`,
      borderRadius:4, padding:'1.5rem',
      backdropFilter:'blur(12px)',
    }}
  >
    <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${E.primary}50,transparent)` }} />
    {['tl','br'].map(p => <Corner key={p} pos={p} />)}
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
      <span style={{ width:4, height:4, borderRadius:'50%', background: E.primary, display:'inline-block' }} />
      <h3 style={{ fontSize:13, fontWeight:700, color: E.primary, margin:0, fontFamily:'monospace', letterSpacing:'0.1em', textTransform:'uppercase' }}>
        {title}
      </h3>
    </div>
    <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color: E.text }}>
          <FaArrowRight style={{ fontSize:9, color: E.dim, flexShrink:0 }} />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

/* ── Landing ────────────────────────────────────────────── */
const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset:['start start','end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  const benefits = [
    { icon: FaHandPaper, title:'Navegación Touchless',     description:'Control total sin contacto físico mediante gestos inteligentes reconocidos al instante.' },
    { icon: FaBrain,     title:'IA en Tiempo Real',        description:'Procesamiento instantáneo con MediaPipe y TensorFlow.js directamente en el navegador.' },
    { icon: FaShieldAlt, title:'Accesibilidad Inteligente',description:'Diseñado y optimizado para personas con diversidad funcional motriz.' },
    { icon: FaCity,      title:'Integración Smart City',   description:'Compatible con kioskos públicos y pantallas interactivas urbanas.' },
    { icon: FaRocket,    title:'Control Gestual Avanzado', description:'Detección precisa de múltiples gestos simultáneos con mínima latencia.' },
    { icon: FaGlobe,     title:'Solución Global',          description:'Implementado en 5 países y más de 150 empresas en distintos sectores.' },
  ];

  const stats   = [
    { value:'98%', label:'Precisión IA' },
    { value:'20K+',label:'Gestos procesados' },
    { value:'150+',label:'Empresas' },
    { value:'5',   label:'Países' },
  ];

  const useCases = [
    { title:'Empresas',      items:['Pantallas inteligentes','Oficinas touchless','Salas interactivas'],         dir:-1 },
    { title:'Salud',         items:['Quirófanos','Hospitales','Sistemas sin contacto'],                          dir:1  },
    { title:'Accesibilidad', items:['Discapacidad motriz','Adultos mayores','Inclusión digital'],                dir:-1 },
    { title:'Smart City',    items:['Kioskos públicos','Navegación sin contacto','Información turística'],       dir:1  },
  ];

  const quickFeatures = [
    { icon: FaEye,      text:'98% Precisión' },
    { icon: FaBrain,    text:'IA en tiempo real' },
    { icon: FaShieldAlt,text:'100% Seguro' },
    { icon: FaRocket,   text:'Ultra rápido' },
  ];

  return (
    <div style={{ minHeight:'100vh', background: E.bg, overflowX:'hidden' }}>
      <HolographicBackground />

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section ref={heroRef} style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'5rem 1.5rem 3rem' }}>

        {/* Glow ambiental */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,80,180,0.07) 0%,transparent 68%)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY, width:'100%', maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }} className="lg:grid-cols-2 grid-cols-1">

            {/* LEFT */}
            <motion.div
              initial={{ opacity:0, x:-32 }}
              animate={{ opacity:1, x:0 }}
              transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
              style={{ textAlign:'left' }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity:0, y:14 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.2 }}
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'6px 14px', borderRadius:40,
                  background:'rgba(0,207,255,0.06)',
                  border:`1px solid ${E.border}`,
                  marginBottom:20,
                }}
              >
                <FaMicrochip style={{ color: E.primary, fontSize:12 }} className="animate-pulse" />
                <span style={{ fontSize:11, fontFamily:'monospace', color: E.dim, letterSpacing:'0.08em' }}>
                  Powered by AI & Computer Vision
                </span>
              </motion.div>

              <h1 style={{ fontSize:'clamp(2.6rem,5vw,4.2rem)', fontWeight:900, lineHeight:1, margin:0, marginBottom:16, letterSpacing:'-0.04em', color: E.text }}>
                HAND
                <span style={{ color: E.primary, display:'block' }}>CONTROL AI</span>
              </h1>

              <p style={{ fontSize:'clamp(1rem,1.5vw,1.2rem)', color:'rgba(224,247,255,0.6)', marginBottom:8, fontWeight:500 }}>
                Sistema Inteligente de Navegación por Gestos
              </p>
              <p style={{ fontSize:13, color: E.muted, marginBottom:28, maxWidth:420, lineHeight:1.7, fontFamily:'monospace' }}>
                Controla la tecnología sin tocar la pantalla. Experimenta el futuro de la interacción humano-computadora.
              </p>

              {/* Quick features */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 12px', marginBottom:28, maxWidth:340 }}>
                {quickFeatures.map(({ icon: Icon, text }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity:0, y:10 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.35 + i * 0.08 }}
                    style={{ display:'flex', alignItems:'center', gap:7 }}
                  >
                    <div style={{ width:22, height:22, borderRadius:4, background:'rgba(0,207,255,0.08)', border:`1px solid ${E.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon style={{ color: E.primary, fontSize:9 }} />
                    </div>
                    <span style={{ fontSize:12, color: E.text, fontFamily:'monospace' }}>{text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }} className="justify-center lg:justify-start">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    style={{
                      padding:'12px 26px',
                      background: E.primary,
                      border:'none', borderRadius:4,
                      color:'#020A12', fontWeight:800, fontSize:13,
                      fontFamily:'monospace', letterSpacing:'0.1em', textTransform:'uppercase',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:7,
                      boxShadow:`0 0 24px rgba(0,207,255,0.3)`,
                    }}
                  >
                    <FaRocket style={{ fontSize:11 }} />
                    Iniciar Sistema
                  </motion.button>
                </Link>

                <Link to="/gesture">
                  <motion.button
                    whileHover={{ scale:1.02, background:'rgba(0,207,255,0.08)' }}
                    whileTap={{ scale:0.97 }}
                    style={{
                      padding:'12px 26px',
                      background:'transparent',
                      border:`1px solid ${E.primary}`,
                      borderRadius:4,
                      color: E.primary, fontWeight:700, fontSize:13,
                      fontFamily:'monospace', letterSpacing:'0.1em', textTransform:'uppercase',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:7,
                      transition:'background 0.2s',
                    }}
                  >
                    <FaHandPaper style={{ fontSize:11 }} />
                    Ver Demo
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT: Robot hand */}
            <motion.div
              initial={{ opacity:0, scale:0.85 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.9, delay:0.25 }}
              style={{ position:'relative', height:'clamp(340px,50vw,560px)' }}
              className="order-first lg:order-last"
            >
              <RobotHand3D />

              {/* Floating info pill */}
              <motion.div
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:1 }}
                style={{
                  position:'absolute', bottom:16, left:16, right:16,
                  background:'rgba(5,10,20,0.85)',
                  border:`1px solid ${E.border}`,
                  borderRadius:4, padding:'10px 14px',
                  backdropFilter:'blur(16px)',
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
                }}
              >
                <div>
                  <p style={{ fontSize:10, color: E.muted, margin:0, fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.08em' }}>Sistema de IA</p>
                  <p style={{ fontSize:13, fontWeight:700, color: E.primary, margin:0, marginTop:2, fontFamily:'monospace' }}>MediaPipe + TensorFlow.js</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#00FF96', display:'inline-block' }} className="animate-pulse" />
                  <span style={{ fontSize:11, color:'#00CC78', fontFamily:'monospace' }}>Online</span>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y:[0,8,0] }}
          transition={{ duration:2, repeat:Infinity }}
          style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)' }}
          className="hidden md:block"
        >
          <div style={{ width:20, height:32, border:`1px solid ${E.border}`, borderRadius:12, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:5 }}>
            <motion.div
              animate={{ y:[0,10,0] }}
              transition={{ duration:2, repeat:Infinity }}
              style={{ width:3, height:6, background: E.primary, borderRadius:3 }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          STATS
      ═══════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:10, padding:'4rem 1.5rem' }}>
        {/* Divider */}
        <div style={{ width:'100%', maxWidth:1200, margin:'0 auto 2.5rem', height:1, background:`linear-gradient(90deg,transparent,${E.border},transparent)` }} />

        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionLabel label="Métricas" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
            {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          BENEFITS
      ═══════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:10, padding:'3rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionLabel label="Tecnología" />
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:900, color: E.text, margin:0, letterSpacing:'-0.03em' }}>
              Tecnología de Vanguardia
            </h2>
            <p style={{ fontSize:13, color: E.muted, marginTop:8, fontFamily:'monospace' }}>
              Solución empresarial para el futuro de la interacción humano-computadora
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12 }}>
            {benefits.map((b, i) => <BenefitCard key={i} {...b} delay={i * 0.07} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          USE CASES
      ═══════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:10, padding:'3rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionLabel label="Casos de uso" />
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:900, color: E.text, margin:0, letterSpacing:'-0.03em' }}>
              Casos de Uso Reales
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12 }}>
            {useCases.map((uc, i) => <UseCaseCard key={i} {...uc} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:10, padding:'3rem 1.5rem 5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, scale:0.97 }}
            whileInView={{ opacity:1, scale:1 }}
            viewport={{ once:true }}
            style={{
              position:'relative', overflow:'hidden',
              background:'rgba(0,30,60,0.5)',
              border:`1px solid ${E.border}`,
              borderRadius:6, padding:'4rem 2rem',
              textAlign:'center',
              backdropFilter:'blur(16px)',
            }}
          >
            {/* Glow center */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,80,180,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${E.primary}70,transparent)` }} />
            <ScanLine duration={9} />
            {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} size={14} />)}

            <motion.p
              initial={{ opacity:0, y:10 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              style={{ fontSize:10, fontFamily:'monospace', color: E.muted, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:14 }}
            >
              // Próximo paso
            </motion.p>
            <motion.h2
              initial={{ opacity:0, y:12 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:0.1 }}
              style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:900, color: E.text, margin:0, marginBottom:12, letterSpacing:'-0.04em' }}
            >
              ¿Listo para el <span style={{ color: E.primary }}>Futuro</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity:0 }}
              whileInView={{ opacity:1 }}
              viewport={{ once:true }}
              transition={{ delay:0.2 }}
              style={{ fontSize:13, color: E.muted, maxWidth:480, margin:'0 auto 2rem', lineHeight:1.7, fontFamily:'monospace' }}
            >
              Únete a las empresas que ya están transformando la interacción digital con HandControl AI.
            </motion.p>

            <Link to="/login">
              <motion.button
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                style={{
                  padding:'14px 36px',
                  background: E.primary,
                  border:'none', borderRadius:4,
                  color:'#020A12', fontWeight:800, fontSize:13,
                  fontFamily:'monospace', letterSpacing:'0.12em', textTransform:'uppercase',
                  cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8,
                  boxShadow:`0 0 30px rgba(0,207,255,0.35)`,
                }}
              >
                <FaRocket style={{ fontSize:11 }} />
                Comenzar Ahora
                <FaArrowRight style={{ fontSize:10 }} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Landing;