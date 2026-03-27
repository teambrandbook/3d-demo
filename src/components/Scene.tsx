import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Float, Stars, useAnimations, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, N8AO, DepthOfField } from '@react-three/postprocessing';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const models = {
  jellyfish: "https://files.peachworlds.com/website/566e4164-161a-4ca5-8724-20be1744eed6/dff62667-7a94-4084-bc4d-2667d81b8cf2-jelly-v2.glb",
  particle: "https://files.peachworlds.com/website/3c643e19-ea8e-4832-b3af-3c728c259ad7/particle.glb",
  hdr: "https://files.peachworlds.com/website/fff76a6a-75d3-471d-8dcf-35935115362f/kloofendal-48d-partly-cloudy-puresky-2k-2-.hdr"
};

function ScrollBlur() {
  const ref = useRef<any>(null);
  const lastScroll = useRef(0);

  useFrame(() => {
    const scrollY = window.scrollY;
    const scrollDelta = Math.abs(scrollY - lastScroll.current);
    lastScroll.current = scrollY;

    if (ref.current) {
      // Calculate target blur based on scroll speed
      const targetBokeh = Math.min(scrollDelta * 0.2, 8); 
      // Smoothly interpolate
      ref.current.bokehScale = THREE.MathUtils.lerp(ref.current.bokehScale, targetBokeh, 0.1);
    }
  });

  return (
    <DepthOfField
      ref={ref}
      target={[0, 0, 0]}
      focalLength={0.1}
      bokehScale={0}
      height={700}
    />
  );
}

function Model({ url, position, rotation, scale = 1, playAnimation = false }: { url: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; playAnimation?: boolean }) {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (playAnimation && actions && animations.length > 0) {
      // Play the first available animation (usually 'Idle' or 'Animation')
      const action = actions[animations[0].name];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
      return () => {
        action?.fadeOut(0.5);
      };
    }
  }, [actions, animations, playAnimation]);

  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />;
}

function FloatingModels() {
  const group = useRef<THREE.Group>(null);
  const jellyfishRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

    if (group.current) {
      // Scroll interaction: Move the entire group up as user scrolls down
      // We use a larger range to make the movement more noticeable
      const targetY = -scrollProgress * 15;
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);
    }

    if (jellyfishRef.current) {
      // Mouse Parallax for Jellyfish
      // Rotate based on mouse position
      const targetRotationX = -mouse.y * 0.5; // Look up/down
      const targetRotationY = mouse.x * 0.5;  // Look left/right
      
      jellyfishRef.current.rotation.x = THREE.MathUtils.lerp(jellyfishRef.current.rotation.x, targetRotationX, 0.1);
      jellyfishRef.current.rotation.y = THREE.MathUtils.lerp(jellyfishRef.current.rotation.y, targetRotationY + Math.PI / 4, 0.1); // Add base rotation

      // Move slightly based on mouse position (parallax)
      const targetX = mouse.x * 1;
      const targetY = mouse.y * 1;
      
      jellyfishRef.current.position.x = THREE.MathUtils.lerp(jellyfishRef.current.position.x, targetX, 0.05);
      jellyfishRef.current.position.y = THREE.MathUtils.lerp(jellyfishRef.current.position.y, targetY, 0.05);
    }

    if (particlesRef.current) {
      // Background particles move in opposite direction for depth
      const targetX = -mouse.x * 0.5;
      const targetY = -mouse.y * 0.5;

      particlesRef.current.position.x = THREE.MathUtils.lerp(particlesRef.current.position.x, targetX, 0.02);
      particlesRef.current.position.y = THREE.MathUtils.lerp(particlesRef.current.position.y, -5 + targetY, 0.02); // Keep base Y offset
    }
  });

  return (
    <group ref={group}>
      {/* Jellyfish - Main character */}
      <group ref={jellyfishRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
          <Model 
            url={models.jellyfish} 
            position={[0, 0, 0]} 
            scale={0.1} 
            rotation={[0, Math.PI / 4, 0]} // Base rotation handled in useFrame now, but keeping initial here is fine or we can remove
            playAnimation={true}
          />
        </Float>
      </group>

      {/* Background Elements */}
      <group ref={particlesRef}>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Model 
            url={models.particle} 
            position={[0, -5, -4]} 
            scale={0.8} 
          />
        </Float>
      </group>
    </group>
  );
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 40 }} 
        dpr={[1, 2]}
        eventSource={document.body}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <Environment files={models.hdr} />
          <ambientLight intensity={0.3} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00F0FF" />
          
          <FloatingModels />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <EffectComposer>
            <N8AO
              halfRes
              color="black"
              aoRadius={2}
              intensity={1}
              aoSamples={6}
              denoiseSamples={4}
            />
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} intensity={0.5} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ScrollBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload models
Object.values(models).forEach((url) => {
  if (url.endsWith('.glb')) useGLTF.preload(url);
});
