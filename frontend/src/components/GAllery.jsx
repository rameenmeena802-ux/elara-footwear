import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const products = [
  { 
    id: 1, 
    name: "Carbon Runner V1", 
    price: 380, 
    category: "Performance", 
    rating: 4.9, 
    stock: 15, 
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    colors: ["#000", "#fff", "#f00"],
    sizes: ["EU39","EU40","EU41","EU42","EU43","EU44","EU45"] 
  },
  { 
    id: 2, 
    name: "Sculpt High-Top", 
    price: 520, 
    category: "Lifestyle", 
    rating: 4.8, 
    stock: 8, 
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    colors: ["#000", "#fff"],
    sizes: ["EU39","EU40","EU41","EU42","EU43","EU44","EU45"] 
  },
  { 
    id: 3, 
    name: "AeroKnit Unyx", 
    price: 290, 
    category: "Minimalist", 
    rating: 4.7, 
    stock: 0, 
    image: "https://images.pexels.com/photos/1456705/pexels-photo-1456705.jpeg",
    colors: ["#000", "#00f"],
    sizes: ["EU39","EU40","EU41","EU42","EU43","EU44","EU45"] 
  },
  { 
    id: 4, 
    name: "Vanguard Plaid", 
    price: 410, 
    category: "Lifestyle", 
    rating: 4.9, 
    stock: 12, 
    image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
    colors: ["#000", "#fff", "#00f"],
    sizes: ["EU39","EU40","EU41","EU42","EU43","EU44","EU45"] 
  },
  { 
    id: 5, 
    name: "Trail Phantom", 
    price: 450, 
    category: "Trail", 
    rating: 4.8, 
    stock: 6, 
    image: "https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg",
    colors: ["#000", "#f00"],
    sizes: ["EU39","EU40","EU41","EU42","EU43","EU44","EU45"] 
  },
  { 
    id: 6, 
    name: "Zero-Gravity Elite", 
    price: 680, 
    category: "Performance", 
    rating: 5.0, 
    stock: 4, 
    image: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg",
    colors: ["#fff", "#f00", "#00f"],
    sizes: ["EU39","EU40","EU41","EU42","EU43","EU44","EU45"] 
  }
];

export default function Gallery() {
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollSpeed = 0.5;

    const autoScroll = () => {
      if (!isHovering && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    autoScroll();

    return () => cancelAnimationFrame(animationId);
  }, [isHovering]);

  const handleItemClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <section className="py-16 bg-[#060606] border-t border-[#333]">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#f5f5f0] leading-none mb-1">
              ATELIER PIECES
            </h2>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#666]">
              CUSTOM FOOTWEAR, COMPUTED FOR HIGH PERFORMANCE. GLOBALLY DISPATCHED.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'PERFORMANCE', 'LIFESTYLE', 'TRAIL', 'MINIMALIST'].map((cat) => (
              <button
                key={cat}
                className="text-[9px] font-mono tracking-[0.15em] px-3 py-1.5 border border-[#333] text-[#666] hover:border-[#999] hover:text-[#f5f5f0] transition-all duration-300"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#333] mb-6" />

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-[#1a1a1a] border border-[#333] p-3">
          <div className="flex-1 flex items-center gap-2 border border-[#333] bg-[#060606] px-3 py-2">
            <span className="text-[#666] text-xs">Q</span>
            <input
              placeholder="SEARCH FOOTWEAR SPECS, MATERIALS, MODELS."
              className="flex-1 bg-transparent text-[10px] font-mono tracking-wider text-[#f5f5f0] placeholder:text-[#666] outline-none"
            />
          </div>
        </div>

        {/* Auto-Slide Gallery */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex overflow-x-auto gap-4 pb-4"
          style={{ scrollBehavior: 'smooth', overflowX: 'auto' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleItemClick(product)}
              className="relative flex-none w-[280px] group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:z-10"
            >
              <div className="relative bg-[#1a1a1a] border border-[#333] overflow-hidden group-hover:border-[#f5f5f0] transition-all duration-300">
                <div className="h-[280px] overflow-hidden">
                  <img
                    src={`${product.image}?auto=compress&cs=tinysrgb&w=400`}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-mono text-[#f5f5f0]">{product.rating}</span>
                </div>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500/80 text-white text-[8px] font-mono tracking-widest px-2 py-1">
                    SOLD OUT
                  </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-amber-500/80 text-white text-[8px] font-mono tracking-widest px-2 py-1">
                    LOW STOCK
                  </div>
                )}

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-light text-[#f5f5f0] mb-0.5">
                        {product.name}
                      </p>
                      <p className="text-[8px] font-mono tracking-[0.2em] text-[#666]">
                        CAT:{product.category.toUpperCase()}-EL-{String(product.id).padStart(3, '0')}
                      </p>
                    </div>
                    <span className="text-lg font-light text-[#f5f5f0]">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}