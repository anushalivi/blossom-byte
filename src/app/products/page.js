'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { useProducts } from '@/context/ProductContext';
import { filterProductsWithValidImages } from '@/lib/validImages';
import styles from './page.module.css';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Collections' },
  { id: 'fresh-flowers', label: 'Fresh Flowers' },
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'plants', label: 'Plants' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'decor', label: 'Decor' },
  { id: 'gift-combos', label: 'Gift Combos' },
];

export default function ProductsPage() {
  const { products, isLoaded } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const validProducts = filterProductsWithValidImages(products);

    return validProducts.filter((product) => {
      const catSlug = typeof product.category === 'object' ? product.category?.slug : product.category;
      const matchesCategory = selectedCategory === 'all' || catSlug === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.shortDesc && product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return (b.isFeatured || b.featured ? 1 : 0) - (a.isFeatured || a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <main className={styles.main}>
      {/* Header Banner */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>HAUTE BOTANICA CATALOG</span>
          </div>
          <h1 className={styles.title}>All Floral Arrangements</h1>
          <p className={styles.subtitle}>
            Explore our complete collection of 70+ artisan-crafted bouquets, rare perennial plants, 
            heirloom flower seeds, and luxury gift suites.
          </p>

          {/* Search & Sort Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peonies, orchids, roses, gifts..."
                className={styles.searchInput}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>
                  Clear
                </button>
              )}
            </div>

            <div className={styles.sortBox}>
              <SlidersHorizontal size={16} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className={styles.categoryPills}>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`${styles.pillBtn} ${selectedCategory === tab.id ? styles.pillBtnActive : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          <div className={styles.resultsInfo}>
            <span>Showing <strong>{filteredProducts.length}</strong> botanical items</span>
            {selectedCategory !== 'all' && (
              <button onClick={() => setSelectedCategory('all')} className={styles.resetFilter}>
                Reset Category
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No floral items matched your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                className={styles.resetBtn}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id || product._id || index} 
                  product={product} 
                  delay={Math.min(index * 0.04, 0.3)} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
