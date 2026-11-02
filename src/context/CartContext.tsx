import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types/index.ts';
import { useStore } from './StoreContext.tsx';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  shippingFee: number;
  freeShippingThreshold: number;
  progressToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'king_crockery_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useStore();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to local storage:', err);
    }
  }, [items]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVariant = variant || (product.variants.length > 0 ? product.variants[0] : undefined);
    const itemId = selectedVariant ? `${product.id}_${selectedVariant.id}` : product.id;
    const itemPrice = selectedVariant ? selectedVariant.price : product.price;
    const itemOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice || undefined;
    const maxStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const updatedQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) => (item.id === itemId ? { ...item, quantity: updatedQty } : item));
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          productTitle: product.title,
          productSlug: product.slug,
          variantId: selectedVariant?.id,
          variantName: selectedVariant?.name,
          price: itemPrice,
          originalPrice: itemOriginalPrice,
          quantity: Math.min(quantity, maxStock),
          image: product.images[0] || '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
          maxStock,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.min(newQty, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const standardShipping = settings?.shippingCharges || 250;
  const shippingFee = subtotal >= freeThreshold || items.length === 0 ? 0 : standardShipping;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        shippingFee,
        freeShippingThreshold: freeThreshold,
        progressToFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
