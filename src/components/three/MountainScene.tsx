"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
  Procedural Karakoram valley rendered at dusk.
  - Terrain heights are generated in a Web Worker so the main thread never blocks,
    then shaded by a custom shader (pine valley -> rock -> snow, alpenglow on high slopes).
  - Glacier lake: animated turquoise plane in the valley floor.
  - Snowfall: animated entirely in the vertex shader (no per-frame CPU work).
  - Camera eases toward the pointer and flies forward with page scroll (progress ref).
  - Rendering stops whenever `active` is false (hero off-screen).
*/

const SIZE = 160;
const LAKE_Y = 1.1;

// Runs inside the worker. Kept dependency-free so it can be stringified.
function buildHeights(seg: number, size: number) {
  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  };
  const vnoise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  };
  const ridged = (x: number, y: number) => {
    let amp = 0.5, freq = 1, sum = 0, prev = 1;
    for (let i = 0; i < 6; i++) {
      let n = 1 - Math.abs(vnoise(x * freq, y * freq) * 2 - 1);
      n = Math.pow(n, 1.6);
      sum += n * amp * prev;
      prev = n;
      freq *= 2.03;
      amp *= 0.5;
    }
    return sum;
  };
  const smoothstep = (x: number, a: number, b: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const n = seg + 1;
  const out = new Float32Array(n * n);
  for (let iz = 0; iz < n; iz++) {
    // PlaneGeometry rows run +y..-y, which becomes -z..+z after rotateX(-PI/2)
    const z = -size / 2 + (iz / seg) * size;
    for (let ix = 0; ix < n; ix++) {
      const x = -size / 2 + (ix / seg) * size;
      // Valley carved along z so the camera looks up a gorge; taller peaks in the distance.
      const valley = Math.min(1, Math.pow(Math.abs(x) / 26, 1.6));
      const far = smoothstep(-z, -10, 70);
      const r = ridged(x * 0.035 + 10, z * 0.035 + 3);
      const base = vnoise(x * 0.02, z * 0.02) * 4;
      let h = (r * 26 + base) * (0.25 + valley * 0.95) * (0.55 + far * 0.9);
      const dx = x - 6, dz = z + 62;
      h += Math.exp(-(dx * dx + dz * dz) / 380) * 30; // a nod to Rakaposhi / Nanga Parbat
      out[iz * n + ix] = h;
    }
  }
  return out;
}

function heightsInWorker(seg: number): Promise<Float32Array> {
  const code = `const buildHeights = ${buildHeights.toString()};
    onmessage = (e) => { const h = buildHeights(e.data.seg, e.data.size); postMessage(h, [h.buffer]); };`;
  const url = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
  const worker = new Worker(url);
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data as Float32Array);
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    worker.postMessage({ seg, size: SIZE });
  });
}

const terrainVert = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vFog;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFog = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const terrainFrag = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uFog;
  uniform vec3 uFogHigh;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vFog;

  float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }

  void main() {
    vec3 n = normalize(vNormal);
    float slope = 1.0 - n.y;
    float y = vPos.y;

    vec3 pine   = vec3(0.04, 0.20, 0.13);
    vec3 meadow = vec3(0.16, 0.30, 0.16);
    vec3 rock   = vec3(0.26, 0.22, 0.21);
    vec3 rockDk = vec3(0.12, 0.11, 0.12);
    vec3 snow   = vec3(0.93, 0.95, 1.0);

    float grain = h(floor(vPos.xz * 3.0)) * 0.06;
    vec3 col = mix(pine, meadow, smoothstep(1.0, 5.0, y) * (1.0 - slope));
    col = mix(col, mix(rock, rockDk, slope), smoothstep(4.0, 11.0, y + slope * 6.0));
    float snowLine = 11.0 + sin(vPos.x * 0.15) * 2.0 + grain * 20.0;
    float snowAmt = smoothstep(snowLine, snowLine + 4.0, y + (1.0 - slope) * 7.0) * smoothstep(0.85, 0.35, slope);
    col = mix(col, snow, snowAmt);
    col += grain;

    float diff = max(dot(n, normalize(uSunDir)), 0.0);
    vec3 sun = vec3(1.0, 0.62, 0.36) * 1.55;
    vec3 sky = vec3(0.32, 0.42, 0.62) * 0.55;
    vec3 lit = col * (sky + sun * diff);
    lit += vec3(1.0, 0.45, 0.25) * pow(diff, 3.0) * snowAmt * smoothstep(18.0, 40.0, y) * 0.55;

    float fogF = smoothstep(18.0, 150.0, vFog);
    vec3 fogCol = mix(uFog, uFogHigh, smoothstep(0.0, 40.0, y));
    lit = mix(lit, fogCol, fogF);
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }
`;

function Terrain({ heights, seg }: { heights: Float32Array; seg: number }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(SIZE, SIZE, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, heights[i]);
    g.computeVertexNormals();
    return g;
  }, [heights, seg]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: terrainVert,
        fragmentShader: terrainFrag,
        uniforms: {
          uSunDir: { value: new THREE.Vector3(-0.6, 0.45, -0.5) },
          uFog: { value: new THREE.Color("#c98a6e") },
          uFogHigh: { value: new THREE.Color("#8d8fb0") },
        },
      }),
    [],
  );

  return <mesh geometry={geo} material={mat} position={[0, 0, -40]} />;
}

function Lake() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying float vDepth;
          void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vDepth = -mv.z; gl_Position = projectionMatrix * mv; }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime; varying vec2 vUv; varying float vDepth;
          void main(){
            float w = sin(vUv.x*180.0 + uTime*1.2)*0.5+0.5;
            w *= sin(vUv.y*90.0 - uTime*0.8)*0.5+0.5;
            vec3 deep = vec3(0.04,0.33,0.38);
            vec3 shallow = vec3(0.30,0.72,0.74);
            vec3 glow = vec3(1.0,0.62,0.40);
            vec3 c = mix(deep, shallow, smoothstep(0.0,1.0,vUv.y));
            c += glow * pow(w,8.0) * 0.35 * smoothstep(0.3,1.0,vUv.y);
            float fog = smoothstep(20.0,140.0,vDepth);
            c = mix(c, vec3(0.79,0.54,0.43), fog);
            gl_FragColor = vec4(c, 0.96);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  );
  useFrame((_, dt) => {
    (mesh.current!.material as THREE.ShaderMaterial).uniforms.uTime.value += dt;
  });
  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position={[0, LAKE_Y, -40]} material={mat}>
      <planeGeometry args={[SIZE, SIZE]} />
    </mesh>
  );
}

function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: /* glsl */ `varying vec3 vW; void main(){ vW = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          varying vec3 vW;
          void main(){
            float y = vW.y;
            vec3 horizon = vec3(0.98,0.66,0.47);
            vec3 mid = vec3(0.55,0.55,0.72);
            vec3 top = vec3(0.04,0.10,0.18);
            vec3 c = mix(horizon, mid, smoothstep(-0.02,0.18,y));
            c = mix(c, top, smoothstep(0.15,0.7,y));
            vec3 sunDir = normalize(vec3(-0.6,0.08,-1.0));
            float s = max(dot(normalize(vW), sunDir),0.0);
            c += vec3(1.0,0.55,0.3) * pow(s, 24.0) * 0.8 + vec3(1.0,0.7,0.5)*pow(s,4.0)*0.15;
            gl_FragColor = vec4(c,1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  );
  return (
    <mesh material={mat}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

/** Snowfall animated on the GPU: each flake falls and wraps using only a time uniform. */
function Snow({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rnd = (i: number, k: number) => {
      const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd(i, 1) - 0.5) * 70;
      pos[i * 3 + 1] = rnd(i, 2) * 30;
      pos[i * 3 + 2] = (rnd(i, 3) - 0.5) * 70 - 10;
      seed[i] = rnd(i, 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uScale: { value: 380 } },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uTime; uniform float uScale;
          void main(){
            vec3 p = position;
            float speed = 0.6 + aSeed * 1.4;
            p.y = mod(p.y - uTime * speed, 30.0);
            p.x += sin(uTime * 0.6 + aSeed * 40.0) * 0.5;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 0.22 * uScale / -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          void main(){
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(1.0, 1.0, 1.0, smoothstep(0.5, 0.0, d) * 0.85);
          }
        `,
      }),
    [],
  );

  useFrame((state, dt) => {
    const m = points.current!.material as THREE.ShaderMaterial;
    m.uniforms.uTime.value += dt;
    m.uniforms.uScale.value = state.size.height * 0.45;
  });

  return <points ref={points} geometry={geo} material={mat} />;
}

function CameraRig({ progress }: { progress: React.RefObject<number> }) {
  const look = useRef(new THREE.Vector3());
  useFrame((state, dt) => {
    const { camera, pointer } = state;
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;
    const k = 1 - Math.pow(0.001, Math.min(dt, 0.1));
    const tx = pointer.x * 3.2 + Math.sin(t * 0.15) * 0.8;
    const ty = 6 + pointer.y * 1.2 + p * 9;
    const tz = 34 - p * 38;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;
    look.current.set(pointer.x * 4, 9 + p * 6, -60);
    camera.lookAt(look.current);
  });
  return null;
}

type Props = {
  progress: React.RefObject<number>;
  active: boolean;
  lowPower: boolean;
  onReady?: () => void;
};

export default function MountainScene({ progress, active, lowPower, onReady }: Props) {
  const seg = lowPower ? 120 : 200;
  const [heights, setHeights] = useState<Float32Array | null>(null);

  useEffect(() => {
    let alive = true;
    heightsInWorker(seg).then((h) => alive && setHeights(h));
    return () => {
      alive = false;
    };
  }, [seg]);

  return (
    <Canvas
      frameloop={active && heights ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.5]}
      camera={{ position: [0, 6, 34], fov: 55, near: 0.1, far: 900 }}
      gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
    >
      {heights && (
        <>
          <Sky />
          <Terrain heights={heights} seg={seg} />
          <Lake />
          <Snow count={lowPower ? 450 : 1100} />
          <CameraRig progress={progress} />
          <ReadySignal onReady={onReady} />
        </>
      )}
    </Canvas>
  );
}

/** Fires once after the first frame with the full scene has rendered. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    requestAnimationFrame(() => onReady?.());
  });
  return null;
}
