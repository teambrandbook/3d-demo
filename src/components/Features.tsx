import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    title: "Brand Strategy",
    subtitle: "Elevate Your Identity",
    description: "We shape your ideas into strong, compelling brand stories.",
    cta: "View Strategy",
    icon: null
  },
  {
    title: "Digital Experiences",
    subtitle: "Immersive Web Design",
    description: "Building immersive 3D websites using modern web technologies.",
    cta: "View Experiences",
    icon: null
  },
  {
    title: "Innovative Design",
    subtitle: "Creative Excellence",
    description: "Crafting intuitive and accessible user interfaces with a focus on motion.",
    cta: "View Design",
    icon: null
  }
];

export function Features() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [200, -100]);

  return (
    <section ref={containerRef} className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const y = index === 0 ? y1 : index === 1 ? y2 : y3;
            return (
              <motion.div
                key={index}
                style={{ y }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                    {feature.title}
                  </span>
                </div>
                
                <h3 className="text-3xl font-serif mb-4 leading-tight">
                  {feature.subtitle}
                </h3>
                
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {feature.icon && (
                  <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <img src={feature.icon} alt="" className="w-12 h-12" />
                  </div>
                )}

                <div className="flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform cursor-pointer">
                  <span className="text-sm font-medium">{feature.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
