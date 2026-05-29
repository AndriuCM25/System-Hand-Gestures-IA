import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaHandPaper, FaUser, FaLock, FaArrowRight, FaFingerprint,
  FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle,
  FaBrain, FaGlobe, FaBolt, FaRobot
} from 'react-icons/fa';
import HolographicBackground from '../components/HolographicBackground';
import GridScan from '../components/GridScan';
import { useGesture } from '../context/GestureContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import Swal from 'sweetalert2';

/* ── Design tokens ─────────────────────────────────────── */
const E = {
  primary:   '#00CFFF',
  dim:       '#0097BB',
  glow:      'rgba(0,207,255,0.12)',
  glowStr:   'rgba(0,207,255,0.25)',
  border:    'rgba(0,207,255,0.15)',
  borderHov: 'rgba(0,207,255,0.40)',
  bg:        '#050A14',
  surface:   'rgba(0,207,255,0.04)',
  text:      '#E0F7FF',
  muted:     '#3A6070',
};

/* ── Partícula flotante ─────────────────────────────────── */
const Particle = ({ style }) => (
  <motion.div
    style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background: E.primary, opacity:0.5, ...style }}
    animate={{ y:[-10,-90], opacity:[0,0.6,0], scale:[0.5,1,0] }}
    transition={{ duration:3 + Math.random()*2, repeat:Infinity, delay:Math.random()*4 }}
  />
);

/* ── Scan line ──────────────────────────────────────────── */
const ScanLine = () => (
  <motion.div
    style={{
      position:'absolute', left:0, right:0, height:1,
      background:`linear-gradient(90deg,transparent,${E.primary}50,transparent)`,
      pointerEvents:'none', zIndex:10,
    }}
    initial={{ top:'0%' }}
    animate={{ top:['0%','100%','0%'] }}
    transition={{ duration:6, repeat:Infinity, ease:'linear' }}
  />
);

/* ── Corner brackets ────────────────────────────────────── */
const Corner = ({ pos }) => {
  const base = { position:'absolute', width:10, height:10, borderColor: E.primary };
  const sides = {
    tl: { top:0, left:0,   borderTop:'1.5px solid', borderLeft:'1.5px solid' },
    tr: { top:0, right:0,  borderTop:'1.5px solid', borderRight:'1.5px solid' },
    bl: { bottom:0, left:0,  borderBottom:'1.5px solid', borderLeft:'1.5px solid' },
    br: { bottom:0, right:0, borderBottom:'1.5px solid', borderRight:'1.5px solid' },
  };
  return <span style={{ ...base, ...sides[pos] }} />;
};

/* ── Glitch text ────────────────────────────────────────── */
const GlitchText = ({ text, style }) => {
  const [g, setG] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setG(true);
      setTimeout(() => setG(false), 120);
    }, 3500 + Math.random()*2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ position:'relative', display:'inline-block', ...style }}>
      <span style={{ opacity: g ? 0 : 1, transition:'opacity 0.04s' }}>{text}</span>
      {g && <>
        <span style={{ position:'absolute', inset:0, color:'#FF3366', transform:'translate(2px,-1px)' }} aria-hidden>{text}</span>
        <span style={{ position:'absolute', inset:0, color:'#00FFD1', transform:'translate(-2px,1px)' }} aria-hidden>{text}</span>
      </>}
    </span>
  );
};

/* ── Check item ─────────────────────────────────────────── */
const CheckItem = ({ ok, label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color: ok ? '#00FF96' : E.muted, fontFamily:'monospace', transition:'color 0.3s' }}>
    {ok ? <FaCheckCircle style={{ color:'#00FF96', flexShrink:0 }} /> : <FaTimesCircle style={{ flexShrink:0 }} />}
    {label}
  </div>
);

/* ── Init screen ────────────────────────────────────────── */
const InitScreen = ({ onDone }) => {
  const steps = [
    'Verificando módulos de seguridad...',
    'Cargando modelos MediaPipe...',
    'Inicializando HandControl AI...',
    'Sistema listo.',
  ];
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        const n = p + 1;
        if (n === 25) setStep(0);
        if (n === 50) setStep(1);
        if (n === 75) setStep(2);
        if (n === 96) setStep(3);
        if (n >= 100) { clearInterval(iv); setTimeout(onDone, 400); }
        return Math.min(n, 100);
      });
    }, 16);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.97 }}
      style={{
        position:'absolute', inset:0, zIndex:50,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        background:'rgba(5,10,20,0.97)', backdropFilter:'blur(8px)',
      }}
    >
      {/* Hexagon spinner */}
      <div style={{ position:'relative', width:100, height:100, marginBottom:28 }}>
        <motion.svg viewBox="0 0 100 100" style={{ width:'100%', height:'100%' }}
          animate={{ rotate:360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
          <polygon points="50,4 92,27 92,73 50,96 8,73 8,27"
            fill="none" stroke={E.primary} strokeWidth="1.5" strokeDasharray="250" strokeDashoffset="60" />
          <polygon points="50,16 82,33 82,67 50,84 18,67 18,33"
            fill="none" stroke={E.primary} strokeWidth="0.7" opacity="0.25" />
        </motion.svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FaHandPaper style={{ fontSize:26, color: E.primary }} />
        </div>
      </div>

      <p style={{ color: E.primary, fontFamily:'monospace', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20, minHeight:16 }}>
        {steps[step]}
      </p>

      <div style={{ width:220, height:1, background:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden', position:'relative' }}>
        <motion.div style={{ position:'absolute', left:0, top:0, bottom:0, background: E.primary, width:`${progress}%` }} />
      </div>
      <p style={{ fontSize:11, fontFamily:'monospace', color: E.muted, marginTop:6 }}>{progress}%</p>
    </motion.div>
  );
};

/* ── Futuristic input ───────────────────────────────────── */
const FuturisticInput = ({ icon: Icon, name, type, value, onChange, placeholder, extra }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <div style={{
        position:'relative', display:'flex', alignItems:'center', gap:10,
        padding:'10px 14px',
        background: focused ? 'rgba(0,207,255,0.06)' : E.surface,
        border: `1px solid ${focused ? E.primary : E.border}`,
        borderRadius:3,
        boxShadow: focused ? `0 0 16px rgba(0,207,255,0.12), inset 0 0 8px rgba(0,207,255,0.04)` : 'none',
        transition:'all 0.25s',
      }}>
        <AnimatePresence>
          {focused && ['tl','tr','bl','br'].map(p => (
            <motion.span key={p} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <Corner pos={p} />
            </motion.span>
          ))}
        </AnimatePresence>

        <Icon style={{ color: focused ? E.primary : E.muted, fontSize:13, flexShrink:0, transition:'color 0.2s' }} />
        <input
          name={name} type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex:1, background:'transparent',
            color: E.text, fontSize:13,
            fontFamily:'monospace', letterSpacing:'0.04em',
            outline:'none', border:'none',
          }}
        />
        {extra}
      </div>
    </div>
  );
};

/* ── Login principal ────────────────────────────────────── */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useGesture();
  const { welcome, isSupported } = useVoiceAssistant();

  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState({ username:'', password:'', role:'admin' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checks, setChecks] = useState({ length:false, uppercase:false, number:false, special:false });
  const [strength, setStrength] = useState(0);

  const particles = Array.from({ length:16 }, (_, i) => ({
    left: `${6 + (i * 6) % 90}%`,
    bottom: `${(i * 9) % 45}%`,
  }));

  useEffect(() => {
    const pw = formData.password;
    const c = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    };
    setChecks(c);
    setStrength(Object.values(c).filter(Boolean).length);
  }, [formData.password]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const strengthBar = ['#1a2a30','#FF4444','#FFAA00','#4499FF','#00FF96'];
  const strengthLabel = ['','Débil','Media','Buena','Fuerte'];

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      Swal.fire({
        title:'Campos requeridos', text:'Completa usuario y contraseña',
        icon:'error', background:'#060D1A', color: E.text, confirmButtonColor: E.primary,
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(formData.username, formData.role);
      Swal.fire({
        title:'✓ Acceso Concedido',
        html:`<p style="color:#7ab;font-size:13px">Bienvenido <span style="color:${E.primary};font-weight:bold">${formData.username}</span><br>Iniciando HandControl AI…</p>`,
        icon:'success', background:'#060D1A', color: E.text,
        confirmButtonColor: E.primary, timer:2400, showConfirmButton:false,
      });
      if (isSupported) setTimeout(() => welcome(formData.username), 500);
      setTimeout(() => navigate('/dashboard'), 2400);
    }, 1400);
  };

  const quickAccess = role => setFormData({
    username: role === 'admin' ? 'admin@handcontrol.ai' : 'operator_demo',
    password:'Demo123!', role,
  });

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', background: E.bg, padding:'0 1rem' }}>

      {/* GridScan */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        <GridScan
          sensitivity={0.65} lineThickness={1.2} linesColor="#080F1A"
          gridScale={0.08} scanColor={E.primary} scanOpacity={0.35}
          bloomIntensity={0.5} chromaticAberration={0.003} noiseIntensity={0.012}
          lineJitter={0.12} scanGlow={0.4} scanSoftness={2.5} enablePost={true}
          style={{ width:'100%', height:'100%' }}
        />
      </div>
      <HolographicBackground />

      {/* Glow ambiental */}
      <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }}>
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:700, height:700, borderRadius:'50%',
          background:`radial-gradient(circle,rgba(0,80,180,0.08) 0%,transparent 70%)`,
        }} />
        <div style={{
          position:'absolute', top:'20%', right:'15%',
          width:300, height:300, borderRadius:'50%',
          background:`radial-gradient(circle,rgba(0,207,255,0.05) 0%,transparent 70%)`,
        }} />
      </div>

      {/* Partículas */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>
        {particles.map((s, i) => <Particle key={i} style={s} />)}
      </div>

      {/* Boot screen */}
      <AnimatePresence>
        {!ready && <InitScreen onDone={() => setReady(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
            style={{ position:'relative', zIndex:10, width:'100%', maxWidth:980, margin:'0 auto' }}
          >
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}
              className="lg:grid-cols-2 grid-cols-1">

              {/* ── LEFT: Branding ── */}
              <div className="hidden lg:flex" style={{ flexDirection:'column', gap:24 }}>

                {/* Logo */}
                <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}>
                  <div style={{ position:'relative', display:'inline-flex', marginBottom:20 }}>
                    <div style={{
                      position:'absolute', inset:-8,
                      background:`rgba(0,207,255,0.08)`,
                      borderRadius:16, filter:'blur(12px)',
                    }} />
                    <div style={{
                      position:'relative', width:72, height:72,
                      background:`linear-gradient(135deg,#003D6B,#00619B)`,
                      borderRadius:12,
                      border:`1px solid ${E.border}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <FaHandPaper style={{ fontSize:30, color: E.primary }} />
                    </div>
                    <motion.div
                      animate={{ rotate:360 }} transition={{ duration:14, repeat:Infinity, ease:'linear' }}
                      style={{
                        position:'absolute', inset:-6,
                        border:`1px dashed rgba(0,207,255,0.25)`,
                        borderRadius:18,
                      }}
                    />
                  </div>

                  <h1 style={{ fontSize:40, fontWeight:900, color: E.text, lineHeight:1, margin:0, letterSpacing:'-0.03em' }}>
                    HAND<GlitchText text="CONTROL" style={{ color: E.primary }} />
                  </h1>
                  <p style={{ fontSize:11, fontFamily:'monospace', color: E.muted, letterSpacing:'0.14em', textTransform:'uppercase', marginTop:6 }}>
                    Biometric AI Authentication System
                  </p>
                </motion.div>

                {/* Feature cards */}
                {[
                  { icon: FaBrain,    color:'#00CFFF', delay:0.15, title:'IA Avanzada',     desc:'Reconocimiento gestual con MediaPipe y TensorFlow en tiempo real.' },
                  { icon: FaShieldAlt,color:'#00FF96', delay:0.22, title:'Seguridad Total',  desc:'Encriptación SSL y autenticación multifactor integrada.' },
                  { icon: FaGlobe,    color:'#4499FF', delay:0.30, title:'Control Remoto',   desc:'Interfaz accesible desde cualquier dispositivo en la red.' },
                ].map(({ icon: Icon, color, delay, title, desc }) => (
                  <motion.div
                    key={title}
                    initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} transition={{ delay }}
                    style={{
                      position:'relative', display:'flex', alignItems:'flex-start', gap:14,
                      padding:'14px 16px',
                      background: E.surface,
                      border: `1px solid ${E.border}`,
                      borderRadius:3, overflow:'hidden',
                      transition:'border-color 0.2s',
                      cursor:'default',
                    }}
                    whileHover={{ borderColor: E.borderHov }}
                  >
                    <ScanLine />
                    <div style={{
                      width:36, height:36, borderRadius:4, flexShrink:0,
                      background:`${color}12`, border:`1px solid ${color}25`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon style={{ color, fontSize:14 }} />
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color: E.text, margin:0, marginBottom:3 }}>{title}</p>
                      <p style={{ fontSize:11, color: E.muted, margin:0, lineHeight:1.5 }}>{desc}</p>
                    </div>
                    {['tl','br'].map(p => <Corner key={p} pos={p} />)}
                  </motion.div>
                ))}

                {/* Status bar */}
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
                  style={{
                    display:'flex', alignItems:'center', gap:8, padding:'7px 14px',
                    background:'rgba(0,255,150,0.04)',
                    border:'1px solid rgba(0,255,150,0.12)',
                    borderRadius:3,
                  }}
                >
                  <span style={{
                    width:5, height:5, borderRadius:'50%',
                    background:'#00FF96', display:'inline-block',
                  }} className="animate-pulse" />
                  <span style={{ fontSize:10, fontFamily:'monospace', color:'rgba(0,204,100,0.7)', letterSpacing:'0.1em' }}>
                    SISTEMA OPERACIONAL — v2.4.1
                  </span>
                </motion.div>
              </div>

              {/* ── RIGHT: Form ── */}
              <motion.div
                initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.12 }}
                style={{
                  position:'relative',
                  background: E.surface,
                  border: `1px solid ${E.border}`,
                  borderRadius:4, padding:'2rem', overflow:'hidden',
                  backdropFilter:'blur(16px)',
                }}
              >
                {/* Top accent */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${E.primary}70,transparent)` }} />
                <ScanLine />
                {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} />)}

                {/* Header */}
                <div style={{ marginBottom:'1.75rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ color: E.muted, fontFamily:'monospace', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                      // Auth Portal
                    </span>
                    <span style={{ flex:1, height:1, background: E.border }} />
                  </div>
                  <h2 style={{ fontSize:22, fontWeight:800, color: E.text, margin:0, letterSpacing:'-0.02em' }}>
                    Acceso al Sistema
                  </h2>
                  <p style={{ fontSize:12, color: E.muted, marginTop:5, fontFamily:'monospace' }}>
                    Introduce tus credenciales para continuar
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>

                  {/* Role toggle */}
                  <div style={{ display:'flex', border:`1px solid ${E.border}`, borderRadius:3, overflow:'hidden', marginBottom:4 }}>
                    {['admin','operator'].map(r => (
                      <button
                        key={r} type="button"
                        onClick={() => setFormData({ ...formData, role:r })}
                        style={{
                          flex:1, padding:'9px',
                          background: formData.role === r ? 'rgba(0,207,255,0.12)' : 'transparent',
                          color: formData.role === r ? E.primary : E.muted,
                          border:'none', borderRight: r === 'admin' ? `1px solid ${E.border}` : 'none',
                          fontFamily:'monospace', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase',
                          cursor:'pointer', transition:'all 0.2s',
                        }}
                      >
                        {r === 'admin' ? '⬡ Admin' : '⬡ Operador'}
                      </button>
                    ))}
                  </div>

                  <FuturisticInput icon={FaUser}  name="username" type="text"     value={formData.username} onChange={handleChange} placeholder="usuario@handcontrol.ai" />
                  <FuturisticInput
                    icon={FaLock} name="password" type={showPassword ? 'text' : 'password'}
                    value={formData.password} onChange={handleChange} placeholder="Contraseña segura"
                    extra={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ background:'none', border:'none', cursor:'pointer', color: E.muted, padding:0, fontSize:12, transition:'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = E.primary}
                        onMouseLeave={e => e.currentTarget.style.color = E.muted}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    }
                  />

                  {/* Strength */}
                  {formData.password && (
                    <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}>
                      <div style={{ display:'flex', gap:4, marginBottom:8 }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{
                            flex:1, height:2, borderRadius:4,
                            background: i <= strength ? strengthBar[strength] : 'rgba(255,255,255,0.05)',
                            transition:'background 0.3s',
                          }} />
                        ))}
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
                        <CheckItem ok={checks.length}    label="8+ caracteres" />
                        <CheckItem ok={checks.uppercase} label="Mayúscula" />
                        <CheckItem ok={checks.number}    label="Número" />
                        <CheckItem ok={checks.special}   label="Carácter especial" />
                      </div>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit" disabled={isLoading}
                    whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                    style={{
                      padding:'13px',
                      background: isLoading ? 'rgba(0,207,255,0.03)' : 'rgba(0,207,255,0.07)',
                      border: `1px solid ${isLoading ? 'rgba(0,207,255,0.1)' : E.primary}`,
                      borderRadius:3,
                      color: isLoading ? 'rgba(0,207,255,0.3)' : E.primary,
                      fontFamily:'monospace', fontSize:12, fontWeight:700,
                      letterSpacing:'0.14em', textTransform:'uppercase',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      transition:'all 0.25s',
                      boxShadow: isLoading ? 'none' : `0 0 20px rgba(0,207,255,0.1)`,
                    }}
                    onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background='rgba(0,207,255,0.12)'; e.currentTarget.style.boxShadow=`0 0 28px rgba(0,207,255,0.2)`; }}}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(0,207,255,0.07)'; e.currentTarget.style.boxShadow=`0 0 20px rgba(0,207,255,0.1)`; }}
                  >
                    {isLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                          style={{ display:'inline-block', width:13, height:13, border:'2px solid rgba(0,207,255,0.2)', borderTopColor: E.primary, borderRadius:'50%' }}
                        />
                        Autenticando...
                      </>
                    ) : (
                      <>
                        <FaFingerprint />
                        Iniciar Sesión
                        <FaArrowRight style={{ fontSize:10 }} />
                      </>
                    )}
                  </motion.button>

                  {/* Quick access */}
                  <div style={{ display:'flex', gap:8, paddingTop:4 }}>
                    {[
                      { role:'admin',    label:'Admin demo',    icon: FaRobot },
                      { role:'operator', label:'Operador demo', icon: FaBolt  },
                    ].map(({ role, label, icon: Icon }) => (
                      <button
                        key={role} type="button" onClick={() => quickAccess(role)}
                        style={{
                          flex:1, padding:'8px',
                          background:'transparent', border:`1px solid rgba(0,207,255,0.08)`,
                          borderRadius:3, color: E.muted,
                          fontFamily:'monospace', fontSize:11, letterSpacing:'0.06em',
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                          transition:'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.color = E.dim; e.currentTarget.style.background = E.surface; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,207,255,0.08)'; e.currentTarget.style.color = E.muted; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Icon style={{ fontSize:10 }} />
                        ⚡ {label}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Footer */}
                <div style={{ marginTop:'1.5rem', paddingTop:'1rem', borderTop:`1px solid rgba(0,207,255,0.06)`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:10, fontFamily:'monospace', color: E.muted, letterSpacing:'0.1em' }}>
                    HANDCONTROL AI © 2024
                  </span>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:'#00FF96', display:'inline-block' }} className="animate-pulse" />
                    <span style={{ fontSize:10, fontFamily:'monospace', color: E.muted }}>Secure connection</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;