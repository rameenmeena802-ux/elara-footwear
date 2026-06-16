import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = location.state?.product;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '#000');
  const [added, setAdded] = useState(false);

  if (!product) {
    navigate('/');
    return null;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060606] pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#666] hover:text-[#f5f5f0] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> BACK TO GALLERY
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-[#1a1a1a] border border-[#333] overflow-hidden">
            <img
              src={`${product.image}?auto=compress&cs=tinysrgb&w=800`}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="mb-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#666]">
                {product.category.toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl font-light text-[#f5f5f0] mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-sm text-[#999]">{product.rating} / 5.0</span>
            </div>

            <p className="text-sm text-[#999] leading-relaxed mb-8">
              Precision-engineered biomaterial footwear designed for peak performance.
              Zero-waste construction with anatomical precision.
            </p>

            <div className="border-t border-[#333] pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-light text-[#f5f5f0]">${product.price}</span>
                <span className={`text-xs font-mono px-3 py-1 border ${product.stock > 0 ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}>
                  {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-2">
                    COLOR
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-white scale-110' : 'border-[#333] hover:border-[#666]'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-3">
                  SELECT SIZE {selectedSize && `— ${selectedSize}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-[10px] font-mono tracking-[0.1em] px-4 py-2 border transition-all ${
                        selectedSize === size
                          ? 'border-[#f5f5f0] text-[#f5f5f0] bg-white/5'
                          : 'border-[#333] text-[#999] hover:border-[#999] hover:text-[#f5f5f0]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-[8px] font-mono text-[#666] mt-2 tracking-wider">
                    SELECT A SIZE TO CONTINUE
                  </p>
                )}
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || product.stock === 0}
                className={`w-full py-4 text-xs font-mono tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : selectedSize && product.stock > 0
                    ? 'bg-[#f5f5f0] text-[#060606] hover:bg-[#ccc]'
                    : 'bg-[#1a1a1a] border border-[#333] text-[#666] cursor-not-allowed'
                }`}
              >
                {added ? (
                  <><Check size={14} /> ADDED TO CART</>
                ) : (
                  <><ShoppingCart size={14} /> ADD TO CART</>
                )}
              </button>
            </div>

            <div className="border-t border-[#333] pt-4 flex justify-between">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#666]">
                CATEGORY: {product.category.toUpperCase()}
              </span>
              <button className="text-[10px] font-mono tracking-[0.25em] text-[#666] hover:text-[#f5f5f0] transition-colors">
                TECH BLUEPRINT ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}