import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';

interface ParallaxShapeProps {
  className?: string;
  depth?: number; // 1 is normal scroll, 0 is static, >1 is faster, <1 is slower (parallax)
  rotation?: number;
  blur?: boolean;
}

export function ParallaxShape({ 
  className, 
  depth = 0.2, 
  rotation = 0,
  blur = true 
}: ParallaxShapeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Map scroll progress (0 to 1) to a Y translation
  // If depth is 0.2, it moves 20% of the scroll distance (slower than foreground)
  // If depth is -0.2, it moves in reverse
  const y = useTransform(scrollYProgress, [0, 1], [0, 500 * depth]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotation]);
  
  // Add some spring physics for smoothness
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const springRotate = useSpring(rotate, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className={`absolute pointer-events-none z-0 ${className}`}>
      <motion.div
        style={{ y: springY, rotate: springRotate }}
        className={`w-full h-full ${blur ? 'blur-3xl' : ''}`}
      >
        <div className="w-full h-full bg-current opacity-20 rounded-full" />
      </motion.div>
    </div>
  );
}
