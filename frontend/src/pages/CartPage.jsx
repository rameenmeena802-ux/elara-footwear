import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  const TAX = total * 0.10;
  const SHIP = 10;
  const grand = total + TAX + SHIP;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#060606] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-[#333] mx-auto mb-4" />
          <h2 className="text-2xl font-light text-[#f5f5f0] mb-2">YOUR CART IS EMPTY</h2>
          <p className="text-[#666] text-sm mb-6">Explore our collection and find your perfect pair.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#f5f5f0] text-[#060606] px-8 py-3 text-xs font-mono tracking-[0.2em] hover:bg-[#ccc] transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#333] pb-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-1">YOUR CART</p>
            <h1 className="text-4xl font-light text-[#f5f5f0]">SHOPPING CART</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#666] hover:text-[#f5f5f0] transition-colors"
          >
            <ArrowLeft size={14} /> CONTINUE SHOPPING
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Cart Items */}
          <div>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex items-center gap-4 bg-[#1a1a1a] border border-[#333] p-4 mb-2"
              >
                {/* Image */}
                <div className="w-20 h-20 flex-none overflow-hidden border border-[#333]">
                  <img
                    src={`${item.product.images?.[0] || item.product.image}?auto=compress&cs=tinysrgb&w=200`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-[#f5f5f0]">{item.product.name}</p>
                  <p className="text-[10px] font-mono text-[#666]">Size: {item.size}</p>
                  <p className="text-[10px] font-mono text-[#666]">Color: {item.color || 'Black'}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                    className="w-8 h-8 border border-[#333] text-[#666] hover:text-[#f5f5f0] hover:border-[#666] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm text-[#f5f5f0] w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                    className="w-8 h-8 border border-[#333] text-[#666] hover:text-[#f5f5f0] hover:border-[#666] transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-light text-[#f5f5f0]">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  className="text-[#666] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-[10px] font-mono tracking-[0.2em] text-[#666] hover:text-red-400 transition-colors mt-4"
            >
              CLEAR CART
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-[#1a1a1a] border border-[#333] p-6 h-fit sticky top-24">
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-6">ORDER SUMMARY</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-[#999]">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#999]">
                <span>Tax (10%)</span>
                <span>${TAX.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#999]">
                <span>Shipping</span>
                <span>${SHIP.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#333] pt-3 flex justify-between">
                <span className="text-sm font-mono tracking-[0.15em] text-[#f5f5f0]">TOTAL</span>
                <span className="text-xl font-light text-[#f5f5f0]">${grand.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#f5f5f0] text-[#060606] py-4 text-xs font-mono tracking-[0.2em] hover:bg-[#ccc] transition-colors mt-6"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}