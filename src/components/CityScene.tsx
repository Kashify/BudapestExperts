import { Float, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";

type CitySceneProps = {
  activeService: string;
  activeDistrict: string;
  reducedMotion: boolean;
  scrollProgress: number;
};

const buildings = [
  [-3.1, -1.1, 0.8, 1.5, 0.8],
  [-2.2, -1.35, 0.9, 2.2, 0.9],
  [-1.3, -1.05, 0.65, 1.2, 0.65],
  [-3.2, 0.15, 1.1, 2.7, 0.85],
  [-1.85, 0.3, 0.8, 1.7, 0.75],
  [-2.7, 1.35, 0.7, 1.4, 0.7],
  [-1.35, 1.25, 1.05, 2.1, 0.9],
  [1.25, -1.35, 0.8, 1.4, 0.8],
  [2.15, -1.15, 1.15, 2.3, 0.95],
  [3.2, -1.35, 0.7, 1.1, 0.7],
  [1.45, 0.05, 1.05, 2.8, 0.85],
  [2.7, 0.15, 0.7, 1.65, 0.7],
  [3.55, 0.35, 0.9, 2.1, 0.75],
  [1.2, 1.25, 0.8, 1.7, 0.75],
  [2.25, 1.35, 0.95, 2.5, 0.85],
  [3.3, 1.4, 0.65, 1.3, 0.65],
] as const;

const servicePins: Record<string, [number, number, number]> = {
  "Interior designer": [-2.65, 1.6, 1.2],
  "Housing Broker": [1.5, 2.05, 0.15],
  "Mortgage Advisor": [2.15, 2.1, -1.15],
  Translator: [-1.85, 1.35, 0.3],
  "Real Estate Lawyer": [3.55, 1.75, 0.35],
};

const districtOffsets: Record<string, [number, number, number]> = {
  "All Budapest": [0, 0, 0],
  "I. Castle District": [-0.8, 0, 0.65],
  "V. Belváros-Lipótváros": [0.25, 0, 0.1],
  "VI. Terézváros": [0.8, 0, 0.65],
  "VII. Erzsébetváros": [1.15, 0, 0.2],
  "IX. Ferencváros": [0.7, 0, -0.9],
  "XI. Újbuda": [-1.05, 0, -0.85],
  "XIII. Angyalföld": [0.85, 0, 1.15],
  "XIV. Zugló": [1.35, 0, 1.05],
};

function MiniCity({ activeService, activeDistrict, reducedMotion, scrollProgress }: CitySceneProps) {
  const city = useRef<Group>(null);
  const basePin = servicePins[activeService] ?? servicePins["Interior designer"];
  const districtOffset = districtOffsets[activeDistrict] ?? districtOffsets["All Budapest"];
  const pin: [number, number, number] = [
    Math.max(-3.6, Math.min(3.6, basePin[0] + districtOffset[0])),
    basePin[1],
    Math.max(-1.65, Math.min(1.65, basePin[2] + districtOffset[2])),
  ];

  useFrame((state, delta) => {
    if (!city.current || reducedMotion) return;
    city.current.rotation.y += delta * 0.055;
    city.current.rotation.x = -0.12 + scrollProgress * 0.08;
    city.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06 - 0.25 - scrollProgress * 0.18;
  });

  return (
    <group ref={city} rotation={[-0.12, -0.48, -0.03]} position={[0, -0.25, 0]}>
      <RoundedBox args={[8.7, 0.35, 4.8]} radius={0.28} smoothness={4} position={[0, -0.24, 0]}>
        <meshStandardMaterial color="#e6e9ee" roughness={0.4} metalness={0.18} />
      </RoundedBox>

      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.24, 4.45]} />
        <meshStandardMaterial color="#1c83e5" roughness={0.24} metalness={0.16} />
      </mesh>

      {[-1.1, 0, 1.1].map((z) => (
        <group key={z} position={[0, 0.23, z]}>
          <mesh>
            <boxGeometry args={[1.4, 0.1, 0.18]} />
            <meshStandardMaterial color="#fbfbfc" metalness={0.65} roughness={0.26} />
          </mesh>
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, -0.12, 0]}>
              <boxGeometry args={[0.08, 0.28, 0.08]} />
              <meshStandardMaterial color="#9ea7b3" metalness={0.55} />
            </mesh>
          ))}
        </group>
      ))}

      {buildings.map(([x, z, w, h, d], index) => (
        <RoundedBox
          key={`${x}-${z}`}
          args={[w, h, d]}
          radius={0.1}
          smoothness={3}
          position={[x, h / 2, z]}
        >
          <meshStandardMaterial
            color={index % 4 === 0 ? "#cbd7e3" : "#f7f8fa"}
            roughness={0.34}
            metalness={0.12}
          />
        </RoundedBox>
      ))}

      <Float speed={reducedMotion ? 0 : 2.2} rotationIntensity={0} floatIntensity={0.25}>
        <group position={pin}>
          <mesh>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="#e45436" emissive="#8c1f0b" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.72, 12]} />
            <meshStandardMaterial color="#e45436" />
          </mesh>
          <Html center position={[0, 0.58, 0]} distanceFactor={7.8} style={{ pointerEvents: "none" }}>
            <span className="scene-label">{activeService}</span>
          </Html>
        </group>
      </Float>
    </group>
  );
}

export default function CityScene({ activeService, activeDistrict, reducedMotion, scrollProgress }: CitySceneProps) {
  return (
    <Canvas
      camera={{ position: [8.2, 6.5, 8.8], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label={`Interactive miniature Budapest showing ${activeService}`}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 8, 6]} intensity={3.4} color="#ffffff" />
      <directionalLight position={[-5, 2, -2]} intensity={1.2} color="#91c5ff" />
      <Suspense fallback={null}>
        <MiniCity activeService={activeService} activeDistrict={activeDistrict} reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.25}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.28}
      />
    </Canvas>
  );
}
