import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';

const products = [
  { id: 1, name: "Carbon Runner V1", price: 380, category: "Performance", rating: 4.9, stock: 15, colors: ["Black", "White", "Red"], sizes: ["39","40","41","42","43","44","45"], images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"] },
  { id: 2, name: "Sculpt High-Top", price: 520, category: "Lifestyle", rating: 4.8, stock: 8, colors: ["Black", "White"], sizes: ["39","40","41","42","43","44","45"], images: ["https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg"] },
  { id: 3, name: "AeroKnit Unyx", price: 290, category: "Minimalist", rating: 4.7, stock: 0, colors: ["Black", "Blue"], sizes: ["39","40","41","42","43","44","45"], images: ["https://images.pexels.com/photos/1456705/pexels-photo-1456705.jpeg"] },
  { id: 4, name: "Vanguard Plaid", price: 410, category: "Lifestyle", rating: 4.9, stock: 12, colors: ["Black", "White", "Blue"], sizes: ["39","40","41","42","43","44","45"], images: ["https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"] },
  { id: 5, name: "Trail Phantom", price: 450, category: "Trail", rating: 4.8, stock: 6, colors: ["Black", "Red"], sizes: ["39","40","41","42","43","44","45"], images: ["https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg"] },
  { id: 6, name: "Zero-Gravity Elite", price: 680, category: "Performance", rating: 5.0, stock: 4, colors: ["White", "Red", "Blue"], sizes: ["39","40","41","42","43","44","45"], images: ["https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg"] }
];

const CATS = ['ALL', 'PERFORMANCE', 'LIFESTYLE', 'TRAIL', 'MINIMALIST'];

export default function Catalog() {
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    const matchCat = category === 'ALL' || p.category.toUpperCase() === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="catalog" className="py-16 bg-[#060606] border-t border-[#333]">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header - Small Font */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#f5f5f0] leading-none mb-1">ATELIER PIECES</h2>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#666]">CUSTOM FOOTWEAR, COMPUTED FOR HIGH PERFORMANCE. GLOBALLY DISPATCHED.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`text-[9px] font-mono tracking-[0.15em] px-3 py-1.5 border transition-all duration-300 ${
                  category === cat ? 'border-[#f5f5f0] text-[#f5f5f0] bg-white/5' : 'border-[#333] text-[#666] hover:border-[#999] hover:text-[#f5f5f0]'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#333] mb-6" />

        {/* Search - Small Font */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-[#1a1a1a] border border-[#333] p-3">
          <div className="flex-1 flex items-center gap-2 border border-[#333] bg-[#060606] px-3 py-2">
            <Search size={12} className="text-[#666] flex-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH FOOTWEAR SPECS, MATERIALS, MODELS..."
              className="flex-1 bg-transparent text-[10px] font-mono tracking-wider text-[#f5f5f0] placeholder:text-[#666] outline-none" />
          </div>
        </div>

        {/* Grid - Small Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="group relative bg-[#1a1a1a] border border-[#333] hover:border-[#999] transition-all duration-500 cursor-pointer overflow-hidden">
              <div className="p-4 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-light tracking-[0.05em] text-[#f5f5f0] mb-0.5">{product.name}</h3>
                  <p className="text-[8px] font-mono tracking-[0.2em] text-[#666]">CAT: {product.category.toUpperCase()} — EL-{String(product.id).padStart(3, '0')}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-light text-[#f5f5f0]">${product.price.toFixed(0)}</span>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-[7px] font-mono tracking-widest text-amber-500 border border-amber-500/30 px-1.5 py-0.5">LOW STOCK</span>
                  )}
                  {product.stock === 0 && (
                    <span className="text-[7px] font-mono tracking-widest text-red-500 border border-red-500/30 px-1.5 py-0.5">SOLD OUT</span>
                  )}
                </div>
              </div>
              <div className="relative overflow-hidden h-[220px] mx-0.5">
                <img src={product.images[0] + '?auto=compress&cs=tinysrgb&w=600'} alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => { e.target.src = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 to-transparent" />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1">
                  <Star size={8} className="text-amber-400 fill-amber-400" />
                  <span className="text-[8px] font-mono text-[#f5f5f0]">{product.rating}</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {product.colors.slice(0, 4).map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full border border-[#333]" style={{ backgroundColor: c.toLowerCase() }} />
                  ))}
                </div>
                <span className="text-[7px] font-mono tracking-widest text-[#666]">{product.sizes.length} SIZES</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#666]">NO MODELS MATCH CURRENT PARAMETERS</p>
          </div>
        )}
      </div>
    </section>
  );
}