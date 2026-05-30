import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBrain, FaRocket, FaCity, FaShieldAlt,
  FaGlobe, FaMicrochip, FaEye, FaArrowRight, FaChevronDown
} from 'react-icons/fa';
import HolographicBackground from '../components/HolographicBackground';
import SplineRobot from '../components/SplineRobot';
import manoLogo from '../assets/mano.png';

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

  // Custom icon component for mano.png
  const HandIcon = () => (
    <img 
      src={manoLogo} 
      alt="Hand" 
      style={{ width: '16px', height: '16px', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(0,207,255,0.5))' }}
    />
  );

  const benefits = [
    { icon: HandIcon, title:'Navegación Touchless',     description:'Control total sin contacto físico mediante gestos inteligentes reconocidos al instante.' },
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

        {/* Glow ambiental mejorado */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ 
              position:'absolute', 
              top:'50%', 
              left:'50%', 
              transform:'translate(-50%,-50%)', 
              width:1000, 
              height:1000, 
              borderRadius:'50%', 
              background:'radial-gradient(circle,rgba(0,80,180,0.12) 0%,rgba(0,207,255,0.08) 40%,transparent 70%)',
              filter: 'blur(60px)'
            }} 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ 
              position:'absolute', 
              top:'30%', 
              right:'10%', 
              width:600, 
              height:600, 
              borderRadius:'50%', 
              background:'radial-gradient(circle,rgba(0,207,255,0.1) 0%,transparent 70%)',
              filter: 'blur(50px)'
            }} 
          />
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
              {/* Badge mejorado */}
              <motion.div
                initial={{ opacity:0, y:14 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.2 }}
                style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  padding:'8px 18px', borderRadius:50,
                  background:`linear-gradient(135deg, rgba(0,207,255,0.1) 0%, rgba(0,80,255,0.08) 100%)`,
                  border:`1px solid ${E.border}`,
                  marginBottom:24,
                  boxShadow: `0 4px 16px rgba(0,207,255,0.15), inset 0 1px 0 rgba(255,255,255,0.05)`
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <FaMicrochip style={{ color: E.primary, fontSize:14 }} />
                </motion.div>
                <span style={{ fontSize:11, fontFamily:'monospace', color: E.primary, letterSpacing:'0.08em', fontWeight: 600 }}>
                  Powered by AI & Computer Vision
                </span>
              </motion.div>

              <h1 style={{ 
                fontSize:'clamp(2.8rem,5.5vw,4.8rem)', 
                fontWeight:900, 
                lineHeight:1, 
                margin:0, 
                marginBottom:18, 
                letterSpacing:'-0.04em', 
                color: E.text,
                textShadow: `0 0 40px rgba(0,207,255,0.3)`
              }}>
                HAND
                <span style={{ 
                  color: E.primary, 
                  display:'block',
                  background: `linear-gradient(135deg, ${E.primary} 0%, #0080FF 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  CONTROL AI
                </span>
              </h1>

              <p style={{ 
                fontSize:'clamp(1.1rem,1.6vw,1.35rem)', 
                color:'rgba(224,247,255,0.7)', 
                marginBottom:10, 
                fontWeight:600,
                letterSpacing: '-0.01em'
              }}>
                Sistema Inteligente de Navegación por Gestos
              </p>
              <p style={{ 
                fontSize:14, 
                color: E.muted, 
                marginBottom:32, 
                maxWidth:460, 
                lineHeight:1.8, 
                fontFamily:'monospace' 
              }}>
                Controla la tecnología sin tocar la pantalla. Experimenta el futuro de la interacción humano-computadora con IA avanzada.
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
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }} className="justify-center lg:justify-start">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale:1.05, boxShadow: '0 0 40px rgba(0,207,255,0.5)' }} 
                    whileTap={{ scale:0.97 }}
                    style={{
                      padding:'14px 32px',
                      background: `linear-gradient(135deg, ${E.primary} 0%, #0080FF 100%)`,
                      border:'none', 
                      borderRadius:6,
                      color:'#020A12', 
                      fontWeight:900, 
                      fontSize:14,
                      fontFamily:'monospace', 
                      letterSpacing:'0.1em', 
                      textTransform:'uppercase',
                      cursor:'pointer', 
                      display:'flex', 
                      alignItems:'center', 
                      gap:10,
                      boxShadow:`0 4px 20px rgba(0,207,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <FaRocket style={{ fontSize:13 }} />
                    </motion.div>
                    Iniciar Sistema
                  </motion.button>
                </Link>

                <Link to="/gesture">
                  <motion.button
                    whileHover={{ 
                      scale:1.05, 
                      background:'rgba(0,207,255,0.15)',
                      borderColor: E.primary,
                      boxShadow: `0 0 20px rgba(0,207,255,0.3)`
                    }}
                    whileTap={{ scale:0.97 }}
                    style={{
                      padding:'14px 32px',
                      background:'rgba(0,207,255,0.05)',
                      border:`2px solid ${E.primary}80`,
                      borderRadius:6,
                      color: E.primary, 
                      fontWeight:800, 
                      fontSize:14,
                      fontFamily:'monospace', 
                      letterSpacing:'0.1em', 
                      textTransform:'uppercase',
                      cursor:'pointer', 
                      display:'flex', 
                      alignItems:'center', 
                      gap:10,
                      transition:'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <img 
                      src={manoLogo} 
                      alt="Hand" 
                      style={{ width: '13px', height: '13px', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(0,207,255,0.6))' }}
                    />
                    Ver Demo
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT: Spline 3D Robot */}
            <motion.div
              initial={{ opacity:0, scale:0.85 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.9, delay:0.25 }}
              style={{ position:'relative', height:'clamp(450px,60vw,700px)' }}
              className="order-first lg:order-last"
            >
              {/* Glow effect behind Spline */}
              <div style={{
                position: 'absolute',
                inset: '-20%',
                background: 'radial-gradient(circle, rgba(0,207,255,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                border: `2px solid ${E.border}`,
                background: 'linear-gradient(135deg, rgba(0,20,40,0.4) 0%, rgba(0,10,30,0.6) 100%)',
                boxShadow: `0 8px 32px rgba(0,207,255,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
                zIndex: 1
              }}>
                {/* Corner decorations */}
                {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} size={16} />)}
                
                {/* Scan line effect */}
                <ScanLine duration={8} />
                
                {/* Spline container */}
                <div style={{ 
                  position: 'absolute',
                  inset: 0,
                  background: 'transparent'
                }}>
                  <SplineRobot />
                </div>
                
                {/* Overlay gradient for better integration */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(5,10,20,0.1) 100%)',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />
              </div>

              {/* Floating info pill */}
              <motion.div
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:1.2 }}
                style={{
                  position:'absolute', bottom:20, left:20, right:20,
                  background:'rgba(5,10,20,0.95)',
                  border:`2px solid ${E.primary}40`,
                  borderRadius:8, padding:'12px 16px',
                  backdropFilter:'blur(20px)',
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(0,207,255,0.1)`,
                  zIndex: 3
                }}
              >
                <div>
                  <p style={{ fontSize:10, color: E.muted, margin:0, fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.08em' }}>Modelo 3D Interactivo</p>
                  <p style={{ fontSize:14, fontWeight:700, color: E.primary, margin:0, marginTop:3, fontFamily:'monospace', textShadow: `0 0 10px ${E.primary}40` }}>Spline + MediaPipe AI</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width:8, height:8, borderRadius:'50%', background:'#00FF96', display:'inline-block', boxShadow: '0 0 10px #00FF96' }} 
                  />
                  <span style={{ fontSize:12, color:'#00CC78', fontFamily:'monospace', fontWeight: 600 }}>Live</span>
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