import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const useCases = [
  {
    category: "Discovery",
    title: "Understanding your brand, goals, and audience to define the perfect digital strategy.",
    step: "Phase 1",
    sub: "Research"
  },
  {
    category: "Design",
    title: "Crafting visual identities and interactive prototypes that align with your vision.",
    step: "Phase 2",
    sub: "Concept"
  },
  {
    category: "Development",
    title: "Building robust, scalable, and high-performance applications using modern tech stacks.",
    step: "Phase 3",
    sub: "Build"
  },
  {
    category: "Deployment",
    title: "Launching your project with optimized performance, SEO, and analytics integration.",
    step: "Phase 4",
    sub: "Launch"
  }
];

export function UseCases() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yRight = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-24 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {useCases.map((item, index) => {
            const isEven = index % 2 === 0;
            const y = isEven ? yLeft : yRight;
            return (
              <motion.div
                key={index}
                style={{ y }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group border-t border-white/20 pt-8 hover:border-white transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-mono uppercase text-gray-500">PROCESS</span>
                  <span className="text-xs font-mono uppercase text-gray-500">{item.step}</span>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-4xl font-serif">{item.category}</h3>
                  <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                  {item.title}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-gray-300 transition-colors">
                  Explore Now <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
