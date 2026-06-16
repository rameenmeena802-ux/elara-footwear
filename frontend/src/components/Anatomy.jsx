import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

export default function Anatomy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="anatomy" ref={ref} className="py-24 bg-vanta-black border-t border-vanta-border overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-xs font-mono tracking-[0.3em] text-vanta-gray mb-16"
        >
          003 — STRUCTURAL DESIGN PRINCIPLE
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.1 }}
          >
            <motion.div style={{ y }} className="relative">
              <div className="relative overflow-hidden border border-vanta-border">
                <img
                  src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Anatomy Model"
                  className="w-full h-[560px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-vanta-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/60 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                    TACTILE CALIBRATION: ACTIVE
                  </span>
                </div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-white/40">D07 — BIOMATERIAL FABRIC LIBRARY</span>
                </div>
                {[['top-3 left-3','border-t border-l'],['top-3 right-3','border-t border-r'],['bottom-3 left-3','border-b border-l'],['bottom-3 right-3','border-b border-r']].map(([pos, border], i) => (
                  <div key={i} className={`absolute ${pos} w-5 h-5 ${border} border-white/20`} />
                ))}
              </div>
              <div className="absolute -right-4 top-1/3 bg-vanta-card border border-vanta-border p-4 min-w-[140px]">
                <p className="text-[10px] font-mono text-vanta-gray tracking-widest mb-1">PRESSURE MAP</p>
                <p className="text-xl font-light text-white">97.4%</p>
                <p className="text-[9px] font-mono text-vanta-muted mt-1">DISTRIBUTION</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.3 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-vanta-white leading-[1.0] mb-8">
              ANATOMICAL<br />PRECISION<br /><span className="text-vanta-gray">ZERO-GRAVITY</span><br />SOLE MATRIX.
            </h2>
            <p className="text-sm font-light text-vanta-gray leading-[1.8] mb-12 max-w-lg">
              Our atelier formulates high-end footwear where computational physics meets artisanal hand-finishing.
              We construct footwear meant to function as geometric extensions of the biological foot.
              Zero-waste knitting, customized carbon-plate spring-rates, and strict minimalist styling define our visual philosophy.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '0.168', unit: 'KG', label: 'AVERAGE MASS' },
                { value: '847', unit: 'N', label: 'SPRING FORCE' },
                { value: '3.2', unit: 'MM', label: 'STACK HEIGHT' },
                { value: '100%', unit: '', label: 'ZERO WASTE' },
              ].map(({ value, unit, label }) => (
                <div key={label} className="border-l border-vanta-border pl-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-light text-white">{value}</span>
                    <span className="text-xs font-mono text-vanta-gray">{unit}</span>
                  </div>
                  <p className="text-[10px] font-mono tracking-[0.2em] text-vanta-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
