import { Canvas, useFrame } from '@react-three/fiber';
import { Gltf, Environment, Float, Sparkles, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { EffectComposer, ChromaticAberration, Noise, Vignette, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const TREE_MODEL_URL = `${import.meta.env.BASE_URL}3dlocalasset/tree_-_scaniverse_3d_gaussian_splat_ply.glb`;

function ScrollEffects({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const chromaRef = useRef<any>(null);
  const noiseRef = useRef<any>(null);
  const bloomRef = useRef<any>(null);
  const prevScroll = useRef(0);

  useFrame((state, delta) => {
    const scroll = scrollRef.current;
    const scrollSpeed = Math.min(Math.abs(scroll - prevScroll.current) / (delta || 0.016), 5);
    prevScroll.current = scroll;

    // Phase transitions at 0.25, 0.55, 0.85
    const phase1 = Math.exp(-Math.pow((scroll - 0.25) * 40, 2));
    const phase2 = Math.exp(-Math.pow((scroll - 0.55) * 40, 2));
    const phase3 = Math.exp(-Math.pow((scroll - 0.85) * 40, 2));
    const phaseIntensity = Math.max(phase1, phase2, phase3);

    // Combine speed and phase proximity for a futuristic "warp" transition
    const dynamicIntensity = Math.min(scrollSpeed * 0.8 + phaseIntensity * 1.5, 2);

    if (chromaRef.current) {
      const offset = THREE.MathUtils.lerp(0.001, 0.05, dynamicIntensity);
      chromaRef.current.offset.x = offset;
      chromaRef.current.offset.y = offset;
    }
    
    if (noiseRef.current) {
      noiseRef.current.opacity = THREE.MathUtils.lerp(0.04, 0.3, dynamicIntensity);
    }

    if (bloomRef.current) {
      bloomRef.current.intensity = THREE.MathUtils.lerp(0.5, 2.5, dynamicIntensity);
    }
  });

  return (
    <EffectComposer>
      <Bloom ref={bloomRef} luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={0.5} />
      <Noise ref={noiseRef} opacity={0.04} blendFunction={BlendFunction.SCREEN} />
      <ChromaticAberration 
        ref={chromaRef} 
        blendFunction={BlendFunction.NORMAL} 
        offset={new THREE.Vector2(0.001, 0.001)} 
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}

function SpaceBackground() {
  return (
    <div className="absolute inset-0 bg-black -z-10">
      <motion.div
        className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[30%] left-[30%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[100px]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function CameraRig({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const vec = new THREE.Vector3();

  useFrame((state) => {
    // Scroll controls zoom distance (radius) and base height
    // Start: Radius 12, Height 2
    // End: Radius 3, Height 0.5
    const radius = THREE.MathUtils.lerp(12, 3, scrollRef.current);
    const baseY = THREE.MathUtils.lerp(2, 0.5, scrollRef.current);

    // Mouse controls rotation (azimuth) and slight height/tilt
    // state.pointer.x goes from -1 to 1. Multiply by PI for full 180 deg left/right (total 360 range)
    const azimuth = state.pointer.x * Math.PI; 
    
    // Calculate position on a circle/sphere slice
    // x = r * sin(theta)
    // z = r * cos(theta)
    const x = radius * Math.sin(azimuth);
    const z = radius * Math.cos(azimuth);
    
    // Add mouse Y influence to height for "movement by mouse movement too"
    // Invert Y so moving mouse up moves camera up
    const y = baseY + (state.pointer.y * 2);

    // Smoothly interpolate camera position
    state.camera.position.lerp(vec.set(x, y, z), 0.1);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Jellyfish({ position, scale = 1, color = "#a7f3d0" }: { position: [number, number, number], scale?: number, color?: string }) {
  const { scene, animations } = useGLTF("https://files.peachworlds.com/website/566e4164-161a-4ca5-8724-20be1744eed6/dff62667-7a94-4084-bc4d-2667d81b8cf2-jelly-v2.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, clone);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Play all animations
    Object.values(actions).forEach((action) => {
      if (action) {
        action.play();
        // Randomize start time so they don't all pulse in sync
        action.time = Math.random() * action.getClip().duration;
      }
    });
  }, [actions]);

  useEffect(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Clone material to avoid affecting other instances
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
             mesh.material = material.clone();
             (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(color);
             (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
             (mesh.material as THREE.MeshStandardMaterial).toneMapped = false;
        }
      }
    });
  }, [clone, color]);

  useFrame((state) => {
    if (groupRef.current) {
      // Mouse interaction: move slightly based on mouse position
      // state.pointer.x/y are -1 to 1
      const targetX = state.pointer.x * 2; // Movement range
      const targetY = state.pointer.y * 2;
      
      // Smoothly interpolate to target offset relative to the floating position
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      
      // Add some rotation based on movement for a more organic feel
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, state.pointer.x * 0.2, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.2, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
      <group ref={groupRef} scale={scale}>
        <primitive object={clone} />
        {/* Removed pointLight for performance optimization */}
      </group>
    </Float>
  )
}

function GlowingTree({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const { scene } = useGLTF(TREE_MODEL_URL);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useEffect(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
             mesh.material = material.clone();
             // Avatar Hometree style: subtle green bioluminescence
             (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color("#4ade80");
             (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
             (mesh.material as THREE.MeshStandardMaterial).toneMapped = false;
        }
      }
    });
  }, [clone]);

  return (
    <group position={position} scale={scale}>
      <primitive object={clone} />
      {/* Internal glow to enhance the emissive effect */}
      <pointLight position={[0, 2, 0]} color="#4ade80" intensity={1} distance={5} decay={2} />
    </group>
  );
}

function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Phase 1: Left side, slide in from left
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
  const x1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [-100, 0, 0, -100]);
  const skewX1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [-10, 0, 0, 10]);
  const scale1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [0.8, 1, 1, 0.8]);

  // Phase 2: Right side, slide in from right
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [100, 0, 0, 100]);
  const skewX2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [10, 0, 0, -10]);
  const scale2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0.8, 1, 1, 0.8]);
  
  // Phase 3: Left side, slide in from left
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
  const x3 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [-100, 0, 0, -100]);
  const skewX3 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [-10, 0, 0, 10]);
  const scale3 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0.8, 1, 1, 0.8]);

  // Phase 4: Center, scale up
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);
  const scale4 = useTransform(scrollYProgress, [0.7, 0.85, 1], [0.5, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.7, 0.85, 1], [100, 0, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Phase 1: Intro - Left Aligned */}
      <motion.div 
        style={{ opacity: opacity1, x: x1, scale: scale1, skewX: skewX1 }} 
        className="absolute top-[20%] left-[5%] md:left-[10%] max-w-xl text-left z-50"
      >
        <h2 className="text-6xl md:text-9xl font-serif text-white tracking-widest uppercase font-bold leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          Strategy
        </h2>
        <p className="text-white/90 text-sm mt-4 font-mono uppercase tracking-[0.5em] pl-2 border-l-2 border-white/50 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          Brand Foundation
        </p>
      </motion.div>

      {/* Phase 2: Roots - Right Aligned */}
      <motion.div 
        style={{ opacity: opacity2, x: x2, scale: scale2, skewX: skewX2 }} 
        className="absolute top-[40%] right-[5%] md:right-[10%] max-w-xl text-right z-50"
      >
        <h2 className="text-5xl md:text-8xl font-serif text-white tracking-widest uppercase font-bold leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          Design
        </h2>
        <p className="text-white/90 text-sm mt-4 font-mono uppercase tracking-[0.5em] pr-2 border-r-2 border-white/50 inline-block drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          Visual Identity
        </p>
      </motion.div>

      {/* Phase 3: Glow - Left Aligned */}
      <motion.div 
        style={{ opacity: opacity3, x: x3, scale: scale3, skewX: skewX3 }} 
        className="absolute bottom-[30%] left-[5%] md:left-[10%] max-w-xl text-left z-50"
      >
        <h2 className="text-5xl md:text-8xl font-serif text-white tracking-widest uppercase font-bold leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          Digital
        </h2>
        <p className="text-white/90 text-sm mt-4 font-mono uppercase tracking-[0.5em] pl-2 border-l-2 border-white/50 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          Immersive Web
        </p>
      </motion.div>

      {/* Phase 4: Future - Center Aligned */}
      <motion.div 
        style={{ opacity: opacity4, y: y4, scale: scale4 }} 
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-50"
      >
        <h2 className="text-5xl md:text-9xl font-serif text-white tracking-widest uppercase font-bold leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]">
          Experience
        </h2>
        <p className="text-white/90 text-sm mt-6 font-mono uppercase tracking-[0.8em] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
          Future Ready
        </p>
      </motion.div>
    </div>
  );
}

useGLTF.preload(TREE_MODEL_URL);

export function TreeSection() {
  const containerRef = useRef(null);
  const scrollRef = useRef(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollRef.current = latest;
  });

  return (
    <section ref={containerRef} className="h-[1000vh] w-full bg-black relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-auto">
        <SpaceBackground />
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 2, 12], fov: 45 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <CameraRig scrollRef={scrollRef} />
              <ambientLight intensity={0.2} color="#a7f3d0" />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <GlowingTree position={[0, -1, 0]} scale={4} />
              </Float>
              
              {/* Jellyfish Swarm */}
              <Jellyfish position={[2, 0, 2]} scale={0.01} color="#00ff00BF" />
              <Jellyfish position={[-2, 1, 1]} scale={0.02} color="#00ff00BF" />
              <Jellyfish position={[1.5, -1.5, -1]} scale={0.01} color="#00ff00BF" />
              <Jellyfish position={[-1.5, -0.5, 2.5]} scale={0.02} color="#00ff00BF" />
              <Jellyfish position={[0, 2.5, -2]} scale={0.01} color="#00ff00BF" />
              <Jellyfish position={[-3, 0.5, -1]} scale={0.02} color="#00ff00BF" />
              <Jellyfish position={[2.5, 1.5, 0]} scale={0.01} color="#00ff00BF" />

              {/* Particle Background */}
              <Sparkles 
                count={500} 
                scale={12} 
                size={6} 
                speed={0.4} 
                opacity={0.5} 
                color="#4ade80" 
              />
              <Sparkles 
                count={200} 
                scale={20} 
                size={10} 
                speed={0.2} 
                opacity={0.2} 
                color="#ffffff" 
              />
              
              <Environment preset="city" />
              <ScrollEffects scrollRef={scrollRef} />
            </Suspense>
          </Canvas>
        </div>
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
