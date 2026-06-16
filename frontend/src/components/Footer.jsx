import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-vanta-black border-t border-vanta-border py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-vanta-white/30 flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-vanta-white">V</span>
              </div>
              <span className="text-sm font-mono tracking-[0.2em] text-vanta-light">VANTA FOOTWEAR</span>
            </div>
            <p className="text-xs font-light text-vanta-gray leading-relaxed max-w-xs">
              Designing strict parametric footwear for the next generation of athletes and creatives. Biomaterial precision. Zero waste.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-vanta-muted mb-4">NAVIGATION</p>
            <div className="space-y-3">
              {['COLLECTION', 'ANATOMY', 'PERFORMANCE', 'JOURNAL'].map(l => (
                <p key={l} className="text-xs font-mono tracking-[0.15em] text-vanta-gray hover:text-white transition-colors cursor-pointer">{l}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-vanta-muted mb-4">ACCOUNT</p>
            <div className="space-y-3">
              <Link to="/auth" className="block text-xs font-mono tracking-[0.15em] text-vanta-gray hover:text-white transition-colors">SIGN IN</Link>
              <Link to="/auth" className="block text-xs font-mono tracking-[0.15em] text-vanta-gray hover:text-white transition-colors">REGISTER</Link>
              <Link to="/profile" className="block text-xs font-mono tracking-[0.15em] text-vanta-gray hover:text-white transition-colors">ORDERS</Link>
              <Link to="/cart" className="block text-xs font-mono tracking-[0.15em] text-vanta-gray hover:text-white transition-colors">CART</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-vanta-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono tracking-[0.25em] text-vanta-muted">© 2026 VANTA FOOTWEAR. ALL RIGHTS RESERVED.</p>
          <p className="text-[10px] font-mono tracking-[0.2em] text-vanta-muted">SYS:ONLINE — BUILD 1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
