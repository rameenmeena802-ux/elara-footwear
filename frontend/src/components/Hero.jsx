import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1e1c 0%, #2a2a28 40%, #222220 100%)' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-30 grid-bg" />

      {/* Radial highlight */}
      <div className="absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(150,150,148,0.06) 0%, transparent 60%)' }} />

      {/* Left gradient for text readability */}
      <div className="absolute inset-0 z-[2]"
        style={{ background: 'linear-gradient(to right, #1e1e1c 35%, transparent 65%)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${20 + (i * 6.5) % 70}%`,
              top: `${10 + (i * 7.3) % 80}%`,
              background: 'rgba(180,180,178,0.25)',
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Main layout */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-xs font-mono tracking-[0.45em] text-gray-500 mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-gray-600" />
              001 — PARAMETRIC ENGINEERING
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="text-6xl sm:text-7xl lg:text-[80px] font-light tracking-tight leading-[0.92] mb-8"
              style={{ color: '#f5f5f0' }}
            >
              PRECI<br />
              SION<br />
              <span style={{ color: '#888886' }}>CRAFT</span><br />
              ED
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-sm font-light leading-relaxed max-w-sm mb-10"
              style={{ color: '#9a9a98' }}
            >
              Advanced parametric design meets anatomical precision. Every pair engineered for peak performance and zero compromise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 mb-12"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <span className="text-xs font-mono tracking-[0.3em] text-gray-600">COLLECTION 2026 — NOW AVAILABLE</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-3 text-xs font-mono tracking-[0.2em] px-10 py-5 transition-all duration-300"
                style={{ background: '#f5f5f0', color: '#1e1e1c' }}
              >
                EXPLORE COLLECTION
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('anatomy')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-3 text-xs font-mono tracking-[0.2em] px-10 py-5 transition-all duration-300 border border-[#484846] text-[#888886] hover:border-[#f5f5f0] hover:text-[#f5f5f0]"
              >
                VIEW ANATOMY
              </motion.button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex gap-8 mt-14 pt-8 border-t"
              style={{ borderColor: '#323230' }}
            >
              {[['168g', 'WEIGHT'], ['360°', 'ROTATION'], ['12', 'COLORWAYS']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-light" style={{ color: '#f5f5f0' }}>{val}</p>
                  <p className="text-[9px] font-mono tracking-[0.2em] mt-0.5" style={{ color: '#686866' }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Shoe image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="order-1 lg:order-2 relative h-[420px] lg:h-[560px] flex items-center justify-center"
          >
            {/* Glow behind shoe */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(ellipse at center, rgba(200,200,198,0.08) 0%, transparent 70%)' }}
            />

            {/* Floating shoe image */}
            <motion.img
              src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="VANTA Shoe"
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.8)) drop-shadow(0 0 30px rgba(180,180,178,0.1))' }}
            />

            {/* Shadow on floor */}
            <motion.div
              animate={{ scaleX: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)', filter: 'blur(12px)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-9 border rounded-full flex items-start justify-center p-1.5"
          style={{ borderColor: '#484846' }}
        >
          <motion.div className="w-0.5 h-2 rounded-full" style={{ background: '#686866' }} />
        </motion.div>
        <p className="text-[9px] font-mono tracking-[0.3em]" style={{ color: '#484846' }}>SCROLL</p>
      </motion.div>
    </section>
  );
}
