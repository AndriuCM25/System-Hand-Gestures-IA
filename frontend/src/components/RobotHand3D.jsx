import { Suspense, useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   Conexiones MediaPipe Hands (21 landmarks)
───────────────────────────────────────────── */
const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];

/* ─────────────────────────────────────────────
   Poses de gestos
   Cada pose define offsets [dx, dy, dz] por
   landmark sobre la posición base.
───────────────────────────────────────────── */
const BASE = [
  [0,0,0],
  [-0.8,0.5,0.2],[-1.2,1,0.3],[-1.4,1.5,0.3],[-1.5,2,0.3],
  [-0.5,2,0],[-0.5,2.8,0],[-0.5,3.5,0],[-0.5,4.2,0],
  [0,2.2,0],[0,3,0],[0,3.8,0],[0,4.5,0],
  [0.5,2,0],[0.5,2.7,0],[0.5,3.4,0],[0.5,4,0],
  [0.9,1.5,0],[0.9,2.2,0],[0.9,2.8,0],[0.9,3.3,0],
];

/* Puño: todos los dedos doblados */
const POSE_FIST = BASE.map((p, i) => {
  if (i === 0) return [...p];
  if (i >= 1 && i <= 4) return [p[0] + 0.3, p[1] - 0.6, p[2] + 0.4];
  const seg = (i - 5) % 4;
  const fi  = Math.floor((i - 5) / 4);
  return [p[0] + (fi - 1.5) * seg * 0.1, p[1] - seg * 0.7, p[2] - seg * 0.35];
});

/* Pulgar arriba: solo pulgar extendido, resto cerrado */
const POSE_THUMB = BASE.map((p, i) => {
  if (i === 0) return [...p];
  if (i >= 1 && i <= 4) return [...p]; // pulgar libre
  const seg = (i - 5) % 4;
  const fi  = Math.floor((i - 5) / 4);
  return [p[0] + (fi - 1.5) * seg * 0.1, p[1] - seg * 0.7, p[2] - seg * 0.3];
});

/* Paz/Victoria: índice y medio extendidos */
const POSE_PEACE = BASE.map((p, i) => {
  if (i === 0) return [...p];
  if (i >= 1 && i <= 4) return [p[0] + 0.3, p[1] - 0.5, p[2] + 0.3]; // pulgar doblado
  const fi  = Math.floor((i - 5) / 4);
  const seg = (i - 5) % 4;
  if (fi === 0 || fi === 1) return [...p]; // índice y medio libres
  return [p[0] + (fi - 1.5) * seg * 0.1, p[1] - seg * 0.65, p[2] - seg * 0.3];
});

/* OK: índice toca pulgar, resto extendidos */
const POSE_OK = BASE.map((p, i) => {
  if (i === 0) return [...p];
  if (i >= 1 && i <= 4) {
    const seg = i - 1;
    return [p[0] + seg * 0.15, p[1] - seg * 0.2, p[2] + seg * 0.1];
  }
  const fi  = Math.floor((i - 5) / 4);
  const seg = (i - 5) % 4;
  if (fi === 0) {
    // índice: punta se curva hacia pulgar
    return [p[0] - seg * 0.3, p[1] - seg * 0.4, p[2] + seg * 0.15];
  }
  return [...p]; // resto extendido
});

/* Mano abierta base */
const POSE_OPEN = BASE.map(p => [...p]);

const GESTURES = [
  { name: 'Open',  pose: POSE_OPEN,  hold: 2.2 },
  { name: 'Fist',  pose: POSE_FIST,  hold: 1.8 },
  { name: 'Thumb', pose: POSE_THUMB, hold: 2.0 },
  { name: 'Peace', pose: POSE_PEACE, hold: 2.0 },
  { name: 'OK',    pose: POSE_OK,    hold: 1.8 },
];

const TOTAL_CYCLE = GESTURES.reduce((s, g) => s + g.hold + 0.6, 0);

function lerpPose(a, b, t) {
  return a.map((pa, i) => [
    pa[0] + (b[i][0] - pa[0]) * t,
    pa[1] + (b[i][1] - pa[1]) * t,
    pa[2] + (b[i][2] - pa[2]) * t,
  ]);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/* ─────────────────────────────────────────────
   Landmark
───────────────────────────────────────────── */
const Landmark = memo(({ isKey }) => (
  <mesh>
    <sphereGeometry args={[isKey ? 0.17 : 0.13, 16, 16]} />
    <meshStandardMaterial
      color="#00CFFF"
      emissive="#00CFFF"
      emissiveIntensity={isKey ? 3.5 : 2.5}
      toneMapped={false}
    />
  </mesh>
));
Landmark.displayName = 'Landmark';

/* ─────────────────────────────────────────────
   Connection
───────────────────────────────────────────── */
const Connection = memo(() => (
  <mesh>
    <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
    <meshStandardMaterial
      color="#0054FF"
      emissive="#0054FF"
      emissiveIntensity={2}
      toneMapped={false}
    />
  </mesh>
));
Connection.displayName = 'Connection';

/* ─────────────────────────────────────────────
   HandLandmarks3D
───────────────────────────────────────────── */
function HandLandmarks3D() {
  const groupRef     = useRef();
  const landmarkRefs = useRef([]);
  const connRefs     = useRef([]);

  const currentPose  = useRef(POSE_OPEN.map(p => [...p]));
  const keyLandmarks = [0, 4, 8, 12, 16, 20];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    /* ── Rotación y flotación del grupo ── */
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.5;
      groupRef.current.rotation.x = Math.cos(t * 0.18) * 0.08;
      groupRef.current.position.y = Math.sin(t * 0.45) * 0.25 - 1;
    }

    /* ── Calcular pose objetivo según ciclo ── */
    const cycle = t % TOTAL_CYCLE;
    let elapsed = 0;
    let fromPose = POSE_OPEN;
    let toPose   = POSE_OPEN;
    let alpha    = 1;
    const TRANS  = 0.6;

    for (let i = 0; i < GESTURES.length; i++) {
      const g    = GESTURES[i];
      const next = GESTURES[(i + 1) % GESTURES.length];
      const end  = elapsed + g.hold;

      if (cycle >= elapsed && cycle < end) {
        fromPose = g.pose;
        toPose   = g.pose;
        alpha    = 1;
        break;
      }
      if (cycle >= end && cycle < end + TRANS) {
        fromPose = g.pose;
        toPose   = next.pose;
        alpha    = easeInOut((cycle - end) / TRANS);
        break;
      }
      elapsed += g.hold + TRANS;
    }

    currentPose.current = lerpPose(fromPose, toPose, alpha);

    /* ── Aplicar a landmarks ── */
    currentPose.current.forEach((pos, i) => {
      if (landmarkRefs.current[i]) {
        landmarkRefs.current[i].position.set(pos[0], pos[1], pos[2]);
      }
    });

    /* ── Actualizar conexiones ── */
    HAND_CONNECTIONS.forEach(([s, e], idx) => {
      const mesh = connRefs.current[idx];
      if (!mesh) return;
      const sv = new THREE.Vector3(...currentPose.current[s]);
      const ev = new THREE.Vector3(...currentPose.current[e]);
      const mid = sv.clone().add(ev).multiplyScalar(0.5);
      const dist = sv.distanceTo(ev);
      const dir = ev.clone().sub(sv).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
      mesh.position.copy(mid);
      mesh.quaternion.copy(quat);
      mesh.scale.set(1, dist, 1);
    });
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Landmarks */}
      {BASE.map((pos, i) => (
        <group key={`lm-${i}`} ref={el => landmarkRefs.current[i] = el} position={pos}>
          <Landmark isKey={keyLandmarks.includes(i)} />
        </group>
      ))}

      {/* Conexiones */}
      {HAND_CONNECTIONS.map((_, i) => (
        <group key={`cn-${i}`} ref={el => connRefs.current[i] = el}>
          <Connection />
        </group>
      ))}

      {/* Luces de acento cyan */}
      <pointLight position={[0, 3, 3]}  intensity={4}   color="#00CFFF" distance={12} />
      <pointLight position={[0, 0, 2]}  intensity={2.5} color="#0054FF" distance={10} />
      <pointLight position={[-2, 2, 2]} intensity={1.5} color="#00FFD1" distance={8}  />
    </group>
  );
}

/* ─────────────────────────────────────────────
   Grid tecnológico
───────────────────────────────────────────── */
const TechGrid = memo(() => (
  <group position={[0, -2.8, -3]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 22, 22]} />
      <meshBasicMaterial color="#00CFFF" wireframe transparent opacity={0.07} />
    </mesh>
  </group>
));
TechGrid.displayName = 'TechGrid';

/* ─────────────────────────────────────────────
   Export principal
───────────────────────────────────────────── */
export default function RobotHand3D() {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'transparent' }}>
      <Canvas
        gl={{ antialias:false, alpha:true, powerPreference:'high-performance', stencil:false, depth:true }}
        dpr={[1, 1.5]}
        frameloop="always"
        style={{ background:'transparent' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />

          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" castShadow={false} />
          <pointLight position={[-5, 3, 5]} intensity={1.5} color="#00CFFF" distance={15} />
          <hemisphereLight skyColor="#0054FF" groundColor="#050A14" intensity={0.4} />

          <HandLandmarks3D />
          <TechGrid />

          <Environment preset="studio" />
          <fog attach="fog" args={['#050A14', 18, 38]} />
        </Suspense>
      </Canvas>
    </div>
  );
}