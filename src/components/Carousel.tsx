import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const features = [
  "Delicio",
  "Tijaruk",
  "Abu Hind",
  "LAKFA",
  "Brand Strategy",
  "UI/UX Design",
  "3D Web Design",
  "Digital Marketing",
  "Creative Agency",
  "Dubai"
];

export function Carousel() {
  return (
    <div className="py-12 bg-black overflow-hidden border-y border-white/10">
      <div className="flex w-full">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30
          }}
          style={{ width: "max-content" }}
        >
          {[...features, ...features, ...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-6 py-3 bg-[#00F0FF] text-black rounded-full shrink-0"
            >
              <Star className="w-4 h-4 fill-black" />
              <span className="text-lg font-medium">{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
