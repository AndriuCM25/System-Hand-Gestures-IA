import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Conexiones de MediaPipe Hands (21 landmarks)
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],         // Pulgar
  [0, 5], [5, 6], [6, 7], [7, 8],         // Índice
  [0, 9], [9, 10], [10, 11], [11, 12],    // Medio
  [0, 13], [13, 14], [14, 15], [15, 16],  // Anular
  [0, 17], [17, 18], [18, 19], [19, 20],  // Meñique
  [5, 9], [9, 13], [13, 17]               // Palma
];

function HandLandmarks3D() {
  const groupRef = useRef();
  const landmarksRef = useRef([]);
  const linesRef = useRef([]);

  // Posiciones anatómicas de los 21 landmarks (mano abierta)
  const baseLandmarks = useMemo(() => [
    [0, 0, 0],                                                                   // 0: Muñeca
    [-0.8, 0.5, 0.2], [-1.2, 1, 0.3], [-1.4, 1.5, 0.3], [-1.5, 2, 0.3],       // 1-4: Pulgar
    [-0.5, 2, 0], [-0.5, 2.8, 0], [-0.5, 3.5, 0], [-0.5, 4.2, 0],             // 5-8: Índice
    [0, 2.2, 0], [0, 3, 0], [0, 3.8, 0], [0, 4.5, 0],                         // 9-12: Medio
    [0.5, 2, 0], [0.5, 2.7, 0], [0.5, 3.4, 0], [0.5, 4, 0],                   // 13-16: Anular
    [0.9, 1.5, 0], [0.9, 2.2, 0], [0.9, 2.8, 0], [0.9, 3.3, 0],               // 17-20: Meñique
  ], []);

  // Animación de landmarks con movimiento de dedos
  const animatedLandmarks = useMemo(() => baseLandmarks.map(pos => [...pos]), [baseLandmarks]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotación y flotación del grupo completo
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
      groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.4;
    }

    // Animar dedos (abrir y cerrar)
    const fingerWave = Math.sin(t * 0.8) * 0.5 + 0.5; // 0 a 1

    // Actualizar posiciones de landmarks
    baseLandmarks.forEach((basePos, index) => {
      if (index === 0) {
        // Muñeca no se mueve
        animatedLandmarks[index] = [...basePos];
      } else if (index >= 1 && index <= 4) {
        // Pulgar - movimiento lateral
        const segment = index - 1;
        const bendAmount = fingerWave * segment * 0.15;
        animatedLandmarks[index] = [
          basePos[0] + bendAmount,
          basePos[1] - bendAmount * 0.3,
          basePos[2]
        ];
      } else {
        // Otros dedos - flexión hacia abajo
        const segmentIndex = (index - 5) % 4; // 0-3

        if (segmentIndex === 0) {
          // Base del dedo (knuckle)
          animatedLandmarks[index] = [...basePos];
        } else {
          // Segmentos del dedo
          const bendAmount = fingerWave * segmentIndex * 0.4;
          animatedLandmarks[index] = [
            basePos[0],
            basePos[1] - bendAmount,
            basePos[2] - bendAmount * 0.2
          ];
        }
      }

      // Actualizar posición del landmark visual
      if (landmarksRef.current[index]) {
        landmarksRef.current[index].position.set(...animatedLandmarks[index]);
      }
    });

    // Actualizar líneas de conexión
    HAND_CONNECTIONS.forEach((connection, idx) => {
      const [start, end] = connection;
      const startPos = new THREE.Vector3(...animatedLandmarks[start]);
      const endPos = new THREE.Vector3(...animatedLandmarks[end]);
      const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      const distance = startPos.distanceTo(endPos);
      const direction = new THREE.Vector3().subVectors(endPos, startPos);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );

      if (linesRef.current[idx]) {
        linesRef.current[idx].position.copy(midPoint);
        linesRef.current[idx].quaternion.copy(quaternion);
        linesRef.current[idx].scale.y = distance;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Landmarks - Puntos rojos */}
      {baseLandmarks.map((pos, index) => (
        <mesh
          key={`landmark-${index}`}
          ref={(el) => (landmarksRef.current[index] = el)}
          position={pos}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Conexiones - Líneas verdes */}
      {HAND_CONNECTIONS.map((connection, index) => {
        const [start, end] = connection;
        const startPos = new THREE.Vector3(...baseLandmarks[start]);
        const endPos = new THREE.Vector3(...baseLandmarks[end]);
        const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
        const distance = startPos.distanceTo(endPos);
        const direction = new THREE.Vector3().subVectors(endPos, startPos);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize()
        );

        return (
          <mesh
            key={`connection-${index}`}
            ref={(el) => (linesRef.current[index] = el)}
            position={midPoint}
            quaternion={quaternion}
          >
            <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Luces para resaltar landmarks */}
      <pointLight position={[0, 2, 2]} intensity={3} color="#00ff00" distance={10} />
      <pointLight position={[0, 0, 2]} intensity={2} color="#ff0000" distance={8} />
    </group>
  );
}

// Grid de fondo tecnológico
function TechGrid() {
  return (
    <group position={[0, -2, -3]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshBasicMaterial
          color="#00d9ff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

// Línea de escaneo animada
function ScannerLine() {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 3;
    }
  });

  return (
    <mesh ref={lineRef} position={[0, 0, 0]}>
      <boxGeometry args={[8, 0.05, 0.05]} />
      <meshBasicMaterial
        color="#00ff00"
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function RobotHand3D() {
  return (
    <div className="w-full h-full relative" style={{ background: 'transparent' }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />

          {/* ILUMINACIÓN */}
          <ambientLight intensity={0.4} />

          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            color="#ffffff"
          />

          <pointLight
            position={[-5, 3, 5]}
            intensity={1.5}
            color="#00d9ff"
            distance={15}
          />

          <pointLight
            position={[5, -2, 3]}
            intensity={1.2}
            color="#00ff00"
            distance={12}
          />

          <hemisphereLight
            skyColor="#ffffff"
            groundColor="#0a0e27"
            intensity={0.3}
          />

          {/* Mano con landmarks animada */}
          <HandLandmarks3D />

          {/* Grid de fondo */}
          <TechGrid />

          {/* Línea de escaneo */}
          <ScannerLine />

          {/* ENTORNO */}
          <Environment preset="studio" />

          {/* Niebla sutil */}
          <fog attach="fog" args={['#0a0e27', 15, 35]} />
        </Suspense>
      </Canvas>

      {/* Leyenda informativa */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="inline-flex items-center space-x-4 px-6 py-3 glass-effect rounded-xl border border-primary/30 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-neon-red" />
            <span className="text-xs font-medium text-gray-300">21 Landmarks</span>
          </div>
          <div className="w-px h-5 bg-gray-600" />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-neon-green" />
            <span className="text-xs font-medium text-gray-300">Conexiones</span>
          </div>
          <div className="w-px h-5 bg-gray-600" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">MediaPipe Style</span>
          </div>
        </div>
      </div>
    </div>
  );
}