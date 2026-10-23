"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/*
  Real-photo hero rendered in WebGL.
  - Full-screen quad showing the active destination photo, "cover"-fitted to the viewport.
  - Slide changes use an organic, noise-edged sweep between two photos.
  - Pointer parallax with fake depth: the foreground (bottom) shifts more than the sky (top).
  - The photo slowly pushes in as the page scrolls (progress ref).
  - Soft light motes drift through the frame for depth.
  - Frames are only rendered while `active` (hero on screen).
*/

const photoVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); // 1x1 plane -> full clip space
  }
`;

const photoFrag = /* glsl */ `
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uFromAR;
  uniform float uToAR;
  uniform float uMix;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  // Map screen UV to image UV like CSS object-fit: cover, with zoom and a parallax shift.
  vec2 cover(vec2 uv, float imageAR, float zoom, vec2 shift) {
    float screenAR = uRes.x / uRes.y;
    vec2 s = screenAR > imageAR ? vec2(1.0, imageAR / screenAR) : vec2(screenAR / imageAR, 1.0);
    return clamp((uv - 0.5) * s / zoom + 0.5 + shift, 0.001, 0.999);
  }

  void main() {
    vec2 parallax = uMouse * mix(0.022, 0.008, vUv.y); // foreground moves more than the sky
    float zoom = 1.1 + uScroll * 0.22;

    float n = fbm(vUv * 2.5 + vec2(0.0, uTime * 0.03));
    float edge = vUv.x * 0.6 + n * 0.7;                      // left-to-right sweep, noisy edge
    float m = smoothstep(edge - 0.12, edge + 0.12, uMix * 1.5 - 0.1);
    vec2 warp = vec2(0.0, (n - 0.5) * 0.08);

    vec4 a = texture2D(uFrom, cover(vUv + warp * m, uFromAR, zoom + m * 0.06, parallax));
    vec4 b = texture2D(uTo, cover(vUv - warp * (1.0 - m), uToAR, zoom + (1.0 - m) * 0.06, parallax));
    vec3 col = mix(a.rgb, b.rgb, m);

    float vig = smoothstep(1.15, 0.35, length(vUv - vec2(0.5, 0.55)));
    col *= mix(0.72, 1.0, vig);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const aspect = (t: THREE.Texture) => {
  const img = t.image as { width: number; height: number } | undefined;
  return img ? img.width / img.height : 16 / 9;
};

function Photo({
  images,
  index,
  progress,
  onReady,
}: {
  images: string[];
  index: number;
  progress: React.RefObject<number>;
  onReady?: () => void;
}) {
  const textures = useTexture(images, (loaded) => {
    (Array.isArray(loaded) ? loaded : [loaded]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
  });
  const [first] = useState(index); // slide shown when the scene mounts
  const mesh = useRef<THREE.Mesh>(null);
  const shown = useRef(index);
  const mouse = useRef(new THREE.Vector2());
  const fired = useRef(false);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: photoVert,
        fragmentShader: photoFrag,
        depthWrite: false,
        uniforms: {
          uFrom: { value: textures[first] },
          uTo: { value: textures[first] },
          uFromAR: { value: aspect(textures[first]) },
          uToAR: { value: aspect(textures[first]) },
          uMix: { value: 1 },
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uRes: { value: new THREE.Vector2(1, 1) },
        },
      }),
    // Created once; slide changes are animated through the uniforms below.
    [textures, first],
  );

  // Sweep to the newly selected photo.
  useEffect(() => {
    if (index === shown.current) return;
    const u = (mesh.current!.material as THREE.ShaderMaterial).uniforms;
    u.uFrom.value = textures[shown.current];
    u.uFromAR.value = aspect(textures[shown.current]);
    u.uTo.value = textures[index];
    u.uToAR.value = aspect(textures[index]);
    shown.current = index;
    const tween = gsap.fromTo(u.uMix, { value: 0 }, { value: 1, duration: 1.8, ease: "power2.inOut" });
    return () => {
      tween.kill();
      u.uMix.value = 1;
    };
  }, [index, textures]);

  useFrame((state, dt) => {
    const u = (mesh.current!.material as THREE.ShaderMaterial).uniforms;
    mouse.current.lerp(state.pointer, 1 - Math.pow(0.002, dt));
    u.uMouse.value.copy(mouse.current);
    u.uTime.value += dt;
    u.uScroll.value = progress.current ?? 0;
    u.uRes.value.set(state.size.width, state.size.height);
    if (!fired.current) {
      fired.current = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <mesh ref={mesh} material={mat} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/** Warm light motes drifting upward; positions live in clip space, animated in the shader. */
function Motes({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rnd = (i: number, k: number) => {
      const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rnd(i, 1) * 2 - 1;
      pos[i * 3 + 1] = rnd(i, 2) * 2 - 1;
      seed[i] = rnd(i, 3);
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
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uPx: { value: 1 } },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uTime; uniform vec2 uMouse; uniform float uPx;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float depth = aSeed;
            p.y = mod(p.y + uTime * (0.012 + 0.03 * depth) + 1.0, 2.0) - 1.0;
            p.x += sin(uTime * 0.3 + aSeed * 30.0) * 0.02 + uMouse.x * 0.035 * depth;
            p.y += uMouse.y * 0.02 * depth;
            gl_Position = vec4(p.xy, 0.0, 1.0);
            gl_PointSize = (1.2 + depth * 3.2) * uPx;
            vAlpha = (0.12 + depth * 0.4) * smoothstep(-1.0, -0.6, p.y);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main() {
            float r = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(1.0, 0.92, 0.8, smoothstep(0.5, 0.0, r) * vAlpha);
          }
        `,
      }),
    [],
  );

  useFrame((state, dt) => {
    const u = (points.current!.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value += dt;
    u.uMouse.value.copy(state.pointer);
    u.uPx.value = state.viewport.dpr;
  });

  return <points ref={points} geometry={geo} material={mat} frustumCulled={false} />;
}

type Props = {
  images: string[];
  index: number;
  progress: React.RefObject<number>;
  active: boolean;
  lowPower: boolean;
  onReady?: () => void;
};

export default function HeroScene({ images, index, progress, active, lowPower, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Photo images={images} index={index} progress={progress} onReady={onReady} />
        <Motes count={lowPower ? 50 : 90} />
      </Suspense>
    </Canvas>
  );
}
