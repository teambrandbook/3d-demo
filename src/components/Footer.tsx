import { motion } from 'motion/react';

const footerLinks = {
  Services: ['Web Development', '3D Design', 'Consulting'],
  Legal: ['Privacy', 'Terms']
};

export function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-serif font-bold text-white tracking-tighter block mb-8">BrandBook.</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              Let's build <br />
              <span className="italic text-gray-400">something</span> amazing.
            </h2>
            <div className="flex gap-4">
              <a href="mailto:info@brandbooktech.com" className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
                Email Us
              </a>
              <a href="#contact" className="px-6 py-3 text-white border border-white/20 rounded-full font-medium hover:bg-white/10 transition-colors">
                Schedule Call
              </a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-mono uppercase text-gray-500 mb-6">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-gray-600 text-sm">
            BrandBook © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
