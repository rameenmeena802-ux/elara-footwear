import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { X, Star, ShoppingCart, Check } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useCart } from '../context/CartContext';

// ===== 3D SHOE MODEL (Parametric) =====
function ShoeModel({ color }) {
  return (
    <group rotation={[0, Math.PI / 6, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.32, 1.1, 8, 20]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.52, 0.08]} rotation={[Math.PI / 14, 0, 0]}>
        <boxGeometry args={[0.7, 0.1, 1.4]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.32, -0.42]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function ProductModal({ product, onClose }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#0a0a0a');
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inStock = product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1e1e1c] border border-[#323230] w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-6 border-b border-[#323230] sticky top-0 bg-[#1e1e1c] z-10">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#686866] mb-1">
              {product.sku}
            </p>
            <h2 className="text-xl font-light tracking-[0.1em] text-white">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#999997] hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: 3D Shoe + Images */}
          <div className="border-r border-[#323230]">
            <div className="h-[260px] bg-[#060606] relative">
              <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                  <ShoeModel color={selectedColor} />
                  <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={3}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 3}
                  />
                  <Environment preset="city" />
                  <ContactShadows
                    position={[0, -0.8, 0]}
                    opacity={0.3}
                    scale={4}
                    blur={2}
                  />
                </Suspense>
              </Canvas>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-[0.3em] text-white/30">
                  DRAG TO ROTATE
                </span>
                <div className="flex items-center gap-1.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-mono text-white/60">
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-0.5 p-0.5">
              {(product.images || []).slice(0, 2).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative overflow-hidden h-[150px] ${
                    activeImg === i ? 'ring-1 ring-white' : ''
                  }`}
                >
                  <img
                    src={`${img}?auto=compress&cs=tinysrgb&w=400`}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="p-8 flex flex-col gap-6">
            {/* Price & Stock */}
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light text-white">
                ${product.price.toFixed(0)}
              </span>
              <span
                className={`text-xs font-mono tracking-widest px-3 py-1 border ${
                  inStock
                    ? 'text-green-400 border-green-400/30'
                    : 'text-red-400 border-red-400/30'
                }`}
              >
                {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm font-light text-[#999997] leading-relaxed border-t border-[#323230] pt-6">
              {product.description}
            </p>

            {/* Color Selector */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-[#686866] mb-3">
                COLOR — <span className="text-[#999997]">{selectedColor}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {(product.colors || ['#0a0a0a']).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c
                        ? 'border-white scale-110'
                        : 'border-[#323230] hover:border-[#999997]'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-[#686866] mb-3">
                SIZE{selectedSize ? ` — ${selectedSize}` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || ['39', '40', '41', '42', '43', '44', '45']).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`text-[10px] font-mono tracking-[0.1em] px-3 py-2 border transition-all ${
                      selectedSize === s
                        ? 'border-white text-white bg-white/5'
                        : 'border-[#323230] text-[#999997] hover:border-[#999997]'
                    }`}
                  >
                    EU{s}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-[9px] font-mono text-[#686866] mt-2 tracking-wider">
                  SELECT A SIZE TO CONTINUE
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={inStock && selectedSize ? { scale: 1.02 } : {}}
              whileTap={inStock && selectedSize ? { scale: 0.98 } : {}}
              onClick={handleAdd}
              disabled={!inStock || !selectedSize}
              className={`w-full flex items-center justify-center gap-3 py-4 text-xs font-mono tracking-[0.2em] transition-all duration-300 ${
                added
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : inStock && selectedSize
                  ? 'bg-white text-[#060606] hover:bg-[#f5f5f0]'
                  : 'bg-[#282826] border border-[#323230] text-[#686866] cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check size={14} /> ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingCart size={14} /> {inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </>
              )}
            </motion.button>

            {/* Tech Blueprint Button */}
            <button
              onClick={() =>
                alert(
                  `TECH BLUEPRINT PDF\n\n${product.name}\nSKU: ${product.sku}\nCategory: ${product.category}\nPrice: $${product.price}\nRating: ${product.rating}/5.0`
                )
              }
              className="w-full py-4 text-xs font-mono tracking-[0.2em] border border-[#323230] text-[#999997] hover:border-[#999997] hover:text-white transition-all"
            >
              TECH BLUEPRINT ↓
            </button>

            {/* Meta Info */}
            <div className="border-t border-[#323230] pt-4 flex justify-between">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#686866]">
                CATEGORY: {product.category?.toUpperCase() || 'N/A'}
              </span>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#686866]">
                STOCK: {product.stock} UNITS
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}