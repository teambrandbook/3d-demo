import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

const loadingTexts = [
  "Initializing...",
  "Loading Assets...",
  "Preparing Scene...",
  "Starting Experience..."
];

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === loadingTexts.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-serif font-bold text-white mb-8 tracking-tighter"
        >
          BrandBook.
        </motion.h1>
        <div className="h-8 overflow-hidden relative w-64 mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-400 font-mono text-sm uppercase tracking-widest absolute inset-0 flex justify-center items-center"
            >
              {loadingTexts[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
