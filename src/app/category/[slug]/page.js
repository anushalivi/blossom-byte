'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, MOCK_PRODUCTS } from '@/lib/data';
import { NAV_SECTIONS } from '@/lib/navCategories';
import { useProducts } from '@/context/ProductContext';
import { filterProductsWithValidImages } from '@/lib/validImages';
import ProductCard from '@/components/ui/ProductCard';
import styles from './page.module.css';
import { motion } from 'framer-motion';

export default function CategoryProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.slug;
  const initialSub = searchParams.get('sub') || 'all';

  const { products, isLoaded } = useProducts();
  const [sortOption, setSortOption] = useState('Recommended');
  const [selectedSub, setSelectedSub] = useState(initialSub);

  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub) {
      setSelectedSub(sub);
    }
  }, [searchParams]);

  const category = CATEGORIES.find(c => c.id === categorySlug);
  const sectionMeta = NAV_SECTIONS.find(s => s.slug === categorySlug);
  const subcategories = sectionMeta?.subcategories || [];
  
  const allAvailable = products && products.length > 0 ? products : MOCK_PRODUCTS;
  // STRICT RULE: Filter strictly by valid existing images on disk
  const validAvailable = filterProductsWithValidImages(allAvailable);
  const uniqueProducts = Array.from(new Map(validAvailable.map(p => [p.id, p])).values());
  const categoryProducts = uniqueProducts.filter(p => 
    p.category === categorySlug || 
    p.categoryId === categorySlug || 
    p.category_id === categorySlug
  );

  // Filter by subcategory if one is active
  const filteredProducts = selectedSub === 'all' 
    ? categoryProducts 
    : categoryProducts.filter(p => {
        const query = selectedSub.replace(/-/g, ' ').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pDesc = (p.shortDesc || p.longDesc || '').toLowerCase();
        return pName.includes(query) || pDesc.includes(query) || query.split(' ').some(w => w.length > 3 && pName.includes(w));
      });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : categoryProducts;

  if (!category) {
    return (
      <main className={styles.main}>
        <div className={styles.notFound}>
          <h2>Category not found.</h2>
          <Link href="/" style={{ marginTop: '16px', display: 'inline-block', padding: '12px 24px', background: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
            Return to Storefront
          </Link>
        </div>
      </main>
    );
  }

  const sortedProducts = [...displayProducts].sort((a, b) => {
    switch (sortOption) {
      case 'Price: Low to High': return a.price - b.price;
      case 'Price: High to Low': return b.price - a.price;
      case 'Newest Arrivals': return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      default: return 0;
    }
  });

  return (
    <main className={styles.main}>
      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,242,0.92), rgba(255,255,242,0.85))` }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroContent}
        >
          <h1 className={styles.title}>{category.name}</h1>
          <p className={styles.subtitle}>
            {sectionMeta?.tagline || `Discover our exquisite collection of ${category.name.toLowerCase()}, hand-selected for ultimate luxury.`}
          </p>
        </motion.div>
      </section>

      <section className={styles.shopSection}>
        {/* 7 Subcategories Quick Filter Pills */}
        {subcategories.length > 0 && (
          <div className={styles.subcatBarWrapper}>
            <div className={styles.subcatBarTitle}>Browse Sub-Categories (7 Collections)</div>
            <div className={styles.subcatPillsList}>
              <button 
                type="button"
                className={`${styles.subcatPill} ${selectedSub === 'all' ? styles.subcatPillActive : ''}`}
                onClick={() => setSelectedSub('all')}
              >
                <span>✨ All {category.name}</span>
              </button>

              {subcategories.map((subcat) => (
                <button 
                  key={subcat.id}
                  type="button"
                  className={`${styles.subcatPill} ${selectedSub === subcat.slug ? styles.subcatPillActive : ''}`}
                  onClick={() => setSelectedSub(subcat.slug)}
                >
                  <span className={styles.subcatPillIcon}>{subcat.icon}</span>
                  <span>{subcat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Sort by:</span>
            <select className={styles.select} value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
          <p className={styles.resultsCount}>{sortedProducts.length} Products Found</p>
        </div>

        <div className={styles.grid}>
          {sortedProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '64px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', margin: '40px 0' }}>
               <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>No products found</h2>
               <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>We are currently updating our {category.name.toLowerCase()} collection. Please check back later.</p>
               <Link href="/" style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                 Return to Storefront
               </Link>
            </div>
          ) : (
            sortedProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                delay={(index % 4) * 0.1}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
