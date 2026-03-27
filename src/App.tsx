/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Carousel } from './components/Carousel';
import { UseCases } from './components/UseCases';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { Scene } from './components/Scene';
import { TreeSection } from './components/TreeSection';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ReactLenis root>
      <div className="min-h-screen text-white selection:bg-white/20 relative pointer-events-none">
        <AnimatePresence mode="wait">
          {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>
        
        {!isLoading && (
          <>
            <Scene />
            <div className="relative z-10">
              <div className="pointer-events-auto">
                <Navbar />
              </div>
              <main>
                <Hero />
                <div className="pointer-events-auto">
                  <Features />
                  <Carousel />
                  <TreeSection />
                  <UseCases />
                </div>
              </main>
              <div className="pointer-events-auto">
                <Footer />
              </div>
            </div>
          </>
        )}
      </div>
    </ReactLenis>
  );
}
