import { motion } from 'motion/react';
import { ArrowDown, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden pointer-events-none">
      {/* Main Content Container - Full Height Grid */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Top Left - Label */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-12 md:col-span-6 flex flex-col justify-start items-start pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-sm font-mono uppercase tracking-widest text-gray-400">Creative Agency in Dubai</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light leading-[0.9] tracking-tight text-white mix-blend-difference">
            Brand <br />
            <span className="italic text-gray-300">Book</span>
          </h1>
          
          <p className="mt-8 text-lg text-gray-400 max-w-md font-light leading-relaxed">
            We shape your ideas into strong, compelling brand stories. Delivering innovative design, strategy, and digital experiences.
          </p>
        </motion.div>

        {/* Center/Right - Open for 3D Model */}
        <div className="col-span-12 md:col-span-6"></div>

        {/* Bottom Left - Scroll */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="col-span-6 md:col-span-4 flex items-end pb-8 pointer-events-auto"
        >
          <div className="flex items-center gap-4 text-gray-500 hover:text-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
              <ArrowDown className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          </div>
        </motion.div>

        {/* Bottom Right - CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="col-span-6 md:col-span-8 flex flex-col md:flex-row items-end justify-end gap-6 pb-8 pointer-events-auto"
        >
          <a
            href="#work"
            className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors text-sm uppercase tracking-widest border-b border-transparent hover:border-white pb-1"
          >
            <Play className="w-4 h-4 fill-current" />
            View Work
          </a>
          
          <a
            href="#contact"
            className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-200 transition-all hover:scale-105"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
