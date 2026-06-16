import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const protocols = [
  { code: 'SYS.01', title: 'ANATOMICAL CALIBRATION', desc: 'Biometric foot mapping to design individual footbeds that distribute pressure evenly, reducing muscular strain on hard urban surfaces.' },
  { code: 'SYS.02', title: 'COMPUTATIONAL KNITTING', desc: 'Zero-waste fabrication utilizing ultra-strong Kevlar-woven fiber at variable densities for dynamic structural containment.' },
  { code: 'SYS.03', title: 'REACTIVE MIDSOLE SPRING', desc: 'Multi-density 3D lattices calibrated dynamically to load cycles, providing high forward propulsion with every strike.' },
  { code: 'SYS.04', title: 'CARBON PLATE GEOMETRY', desc: 'Aerospace-grade unidirectional carbon fiber plates bent to custom spring-rate curves per athlete biomechanics profile.' },
  { code: 'SYS.05', title: 'THERMAL REGULATION', desc: 'Phase-change micro-encapsulated materials integrated into the footbed absorb heat at peak load and release during recovery phases.' },
];

export default function Performance() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="performance" ref={ref} className="py-24 bg-vanta-dark border-t border-vanta-border">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-xs font-mono tracking-[0.3em] text-vanta-gray mb-16"
        >
          004 — PERFORMANCE ARCHITECTURE PROTOCOLS
        </motion.p>

        <div className="divide-y divide-vanta-border">
          {protocols.map(({ code, title, desc }, i) => (
            <motion.div
              key={code}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group grid grid-cols-1 md:grid-cols-[120px_1fr_2fr] gap-6 py-8 hover:bg-white/[0.02] transition-colors px-2 cursor-default"
            >
              <span className="text-xs font-mono text-vanta-muted tracking-[0.25em] pt-1">{code}</span>
              <h3 className="text-sm font-mono tracking-[0.2em] text-vanta-white group-hover:text-white transition-colors">{title}</h3>
              <p className="text-sm font-light text-vanta-gray leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 border-y border-vanta-border py-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-[10px] font-mono tracking-[0.4em] text-vanta-muted mr-16">
                VANTA FOOTWEAR — PARAMETRIC DESIGN — ZERO WASTE — BIOMATERIAL FABRIC — ANATOMICAL PRECISION — CARBON PLATE TECHNOLOGY — REACTIVE MIDSOLE — COMPUTATIONAL KNITTING —&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
