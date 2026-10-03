'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '@/lib/data';
import { filterProductsWithValidImages } from '@/lib/validImages';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => filterProductsWithValidImages(
    MOCK_PRODUCTS.map(p => ({ ...p, isFeatured: p.featured || p.isFeatured }))
  ));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    try {
      // Purge any stale products in localStorage from older sessions
      localStorage.removeItem('blossom_offline_products');
    } catch (e) {
      // ignore in environments without localStorage
    }

    const validMock = filterProductsWithValidImages(
      MOCK_PRODUCTS.map(p => ({ ...p, isFeatured: p.featured || p.isFeatured }))
    );
    setProducts(validMock);

    // Fetch live products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
          const validLive = filterProductsWithValidImages(data.products);
          setProducts(validLive.length > 0 ? validLive : validMock);
          setIsOffline(Boolean(data.isOffline));
        } else {
          setProducts(validMock);
          setIsOffline(true);
        }
        setIsLoaded(true);
      })
      .catch(err => {
        setProducts(validMock);
        setIsOffline(true);
        setIsLoaded(true);
      });
  }, []);

  const addProduct = async (product) => {
    if (isOffline) {
      const newProduct = { ...product, id: 'offline-' + Date.now() };
      setProducts(prev => {
        const updated = [newProduct, ...prev];
        const localOnly = updated.filter(p => String(p.id).includes('-'));
        localStorage.setItem('blossom_offline_products', JSON.stringify(localOnly));
        return updated;
      });
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        if (data.isOffline) {
          const newProduct = { ...product, id: 'offline-' + Date.now() };
          setProducts(prev => {
            const updated = [newProduct, ...prev];
            const localOnly = updated.filter(p => String(p.id).includes('-'));
            localStorage.setItem('blossom_offline_products', JSON.stringify(localOnly));
            return updated;
          });
        } else {
          setProducts(prev => [data.product, ...prev]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (id, updatedData) => {
    const isLocal = String(id).includes('-');
    if (isLocal) {
      setProducts(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, ...updatedData } : p);
        const localOnly = updated.filter(p => String(p.id).includes('-'));
        localStorage.setItem('blossom_offline_products', JSON.stringify(localOnly));
        return updated;
      });
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (id) => {
    const isLocal = String(id).includes('-');
    if (isLocal) {
      setProducts(prev => {
        const updated = prev.filter(p => p.id !== id);
        const localOnly = updated.filter(p => String(p.id).includes('-'));
        localStorage.setItem('blossom_offline_products', JSON.stringify(localOnly));
        return updated;
      });
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, isLoaded, isOffline }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
