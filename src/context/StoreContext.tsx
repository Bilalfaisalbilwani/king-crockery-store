import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, StoreSettings } from '../types/index.ts';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings | null;
  loading: boolean;
  refreshProducts: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshProducts(), refreshCategories(), refreshSettings()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        loading,
        refreshProducts,
        refreshSettings,
        quickViewProduct,
        setQuickViewProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
