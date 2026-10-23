"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* A low-poly floating "north Pakistan" island: peaks, pines, a turquoise lake and a compass ring. */

function jitter(geo: THREE.BufferGeometry, amt: number, seed = 1) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    const r = s - Math.floor(s);
    pos.setXYZ(i, pos.getX(i) + (r - 0.5) * amt, pos.getY(i) + (r - 0.5) * amt * 0.6, pos.getZ(i) + (r - 0.5) * amt);
  }
  geo.computeVertexNormals();
  return geo;
}

function Peak({ position, scale = 1, seed = 1 }: { position: [number, number, number]; scale?: number; seed?: number }) {
  const rock = useMemo(() => jitter(new THREE.ConeGeometry(1, 2.2, 7, 3), 0.18, seed), [seed]);
  const cap = useMemo(() => jitter(new THREE.ConeGeometry(0.42, 0.9, 7, 1), 0.05, seed + 3), [seed]);
  return (
    <group position={position} scale={scale}>
      <mesh geometry={rock} position-y={1.1} castShadow>
        <meshStandardMaterial color="#5b4d47" flatShading roughness={0.9} />
      </mesh>
      <mesh geometry={cap} position-y={1.85}>
        <meshStandardMaterial color="#f7f4ec" flatShading roughness={0.6} />
      </mesh>
    </group>
  );
}

function Pine({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <mesh position-y={0.1}>
        <cylinderGeometry args={[0.03, 0.04, 0.2, 5]} />
        <meshStandardMaterial color="#4a3426" />
      </mesh>
      <mesh position-y={0.38}>
        <coneGeometry args={[0.16, 0.5, 6]} />
        <meshStandardMaterial color="#0a7a43" flatShading />
      </mesh>
    </group>
  );
}

function Island() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const base = useMemo(() => jitter(new THREE.CylinderGeometry(2.6, 0.6, 1.9, 9, 3), 0.25, 7), []);
  const top = useMemo(() => jitter(new THREE.CylinderGeometry(2.62, 2.6, 0.22, 9, 1), 0.05, 4), []);

  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * (0.15 + state.pointer.x * 0.35);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.15, 0.05);
    if (ring.current) ring.current.rotation.z += dt * 0.4;
  });

  const pines: [number, number, number][] = [
    [1.4, 0.11, 1.2], [1.8, 0.11, 0.4], [-1.6, 0.11, 1.1], [-0.6, 0.11, 1.9],
    [0.4, 0.11, 2.0], [-2.0, 0.11, 0.2], [1.1, 0.11, 1.8], [-1.1, 0.11, 1.6],
  ];

  return (
    <group ref={group}>
      <mesh geometry={base} position-y={-1.05}>
        <meshStandardMaterial color="#6f4f3a" flatShading roughness={1} />
      </mesh>
      <mesh geometry={top}>
        <meshStandardMaterial color="#1f9a5b" flatShading />
      </mesh>
      {/* glacier lake */}
      <mesh position={[0.7, 0.12, 0.9]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.7, 9]} />
        <meshStandardMaterial color="#4fc7bc" emissive="#126e72" emissiveIntensity={0.35} roughness={0.15} metalness={0.2} />
      </mesh>
      <Peak position={[-0.6, 0.1, -0.7]} scale={1.15} seed={2} />
      <Peak position={[0.8, 0.1, -1.0]} scale={0.85} seed={5} />
      <Peak position={[-1.7, 0.1, -0.2]} scale={0.6} seed={9} />
      {pines.map((p, i) => (
        <Pine key={i} position={p} s={0.8 + (i % 3) * 0.2} />
      ))}
      {/* compass ring */}
      <mesh ref={ring} rotation-x={Math.PI / 2} position-y={-0.2}>
        <torusGeometry args={[3.3, 0.02, 8, 90]} />
        <meshBasicMaterial color="#f7a95c" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 3.3, -0.2, Math.sin((i * Math.PI) / 2) * 3.3]}>
          <octahedronGeometry args={[0.1]} />
          <meshBasicMaterial color={i === 0 ? "#f7a95c" : "#8fe0d6"} />
        </mesh>
      ))}
    </group>
  );
}

export default function FloatingIsland({ active = true, lowPower = false }: { active?: boolean; lowPower?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.5]}
      camera={{ position: [0, 3.4, 10.5], fov: 38 }}
      gl={{ alpha: true, antialias: !lowPower }}
    >
      <ambientLight intensity={0.55} color="#bcd7ff" />
      <directionalLight position={[-5, 6, 4]} intensity={2.2} color="#ffd2a1" />
      <directionalLight position={[5, 2, -4]} intensity={0.6} color="#4fc7bc" />
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.9}>
        <Island />
      </Float>
    </Canvas>
  );
}
