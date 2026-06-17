import { useRef, useEffect, useState } from 'react';

export default function Hero3D() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sketchfab.com/assets/embed.js';
    script.async = true;
    script.onload = () => {
      setIsLoading(false);
      setTimeout(() => setIframeLoaded(true), 1500);
    };
    script.onerror = () => {
      setIsLoading(false);
      setIframeLoaded(true);
    };
    document.body.appendChild(script);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setIframeLoaded(true);
    }, 4000);

    return () => {
      document.body.removeChild(script);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#060606]">
      
      {/* 3D SHOE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div ref={containerRef} className="sketchfab-embed-wrapper w-full h-full">
          <iframe
            title="Reebok 2"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            src="https://sketchfab.com/models/3dd0d1490e6e4bddaac5e580ae7f388a/embed?autospin=1&autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_watermark=0&ui_theme=dark"
            className="w-full h-full"
            style={{ background: '#060606' }}
          />
        </div>
      </div>

      {/* LOADING SPINNER (No Text) */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-[#060606] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#060606] via-[#060606]/30 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 max-w-3xl">
        <div className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-gray-400 mb-6">
          PHYSICAL COORDINATES
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[-0.02em] text-white leading-[1.1]">
          PARAMETRIC
          <br />
          OUTSOLES
          <br />
          <span className="text-gray-400">ANATOMICAL</span>
          <br />
          <span className="text-gray-400">BIO-SCULPTS</span>
        </h1>

        <p className="text-gray-400 text-xs md:text-sm max-w-lg mt-4 leading-relaxed tracking-wide">
          A modern standard for spatial movement
          <br />
          and ergonomic footbeds.
        </p>
      </div>
    </section>
  );
}