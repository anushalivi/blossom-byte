'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './BestSellersSection.module.css';

import { filterProductsWithValidImages } from '@/lib/validImages';

const TABS = [
  { id: 'all', label: 'All Best Sellers' },
  { id: 'fresh-flowers', label: 'Fresh Flowers' },
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'plants', label: 'Plants' },
  { id: 'gift-combos', label: 'Gift Sets' },
];

// Fallback products strictly with verified existing images on disk
const DEFAULT_PRODUCTS = [
  {
    id: 'fresh-flowers-1',
    name: 'Roses',
    slug: 'roses',
    price: 499,
    discount: 10,
    category: 'fresh-flowers',
    categoryName: 'Fresh Flowers',
    image: '/assets/products/fresh-flowers-roses.jpg',
    rating: 4.9,
    reviews: 142,
    shortDesc: 'Freshly cut, velvety crimson roses with long stems and intoxicating aroma.',
    badge: 'Luxury Pick'
  },
  {
    id: 'bouquets-1',
    name: 'Classic Red Rose Bouquet',
    slug: 'classic-red-rose-bouquet',
    price: 1299,
    discount: 15,
    category: 'bouquets',
    categoryName: 'Bouquets',
    image: '/assets/products/bouquets-classic-red-rose.jpg',
    rating: 5.0,
    reviews: 210,
    shortDesc: 'A magnificent signature bouquet crafted with premium long-stemmed red roses.',
    badge: 'Best Seller'
  },
  {
    id: 'plants-1',
    name: 'Money Plant',
    slug: 'money-plant',
    price: 499,
    discount: 10,
    category: 'plants',
    categoryName: 'Plants',
    image: '/assets/products/plants-money-plant.jpg',
    rating: 4.9,
    reviews: 189,
    shortDesc: 'Lush, thriving Golden Pothos Money Plant in an artisanal ceramic pot.',
    badge: 'Air Purifier'
  },
  {
    id: 'fresh-flowers-2',
    name: 'Lilies',
    slug: 'lilies',
    price: 699,
    discount: 0,
    category: 'fresh-flowers',
    categoryName: 'Fresh Flowers',
    image: '/assets/products/fresh-flowers-lilies.jpg',
    rating: 4.8,
    reviews: 115,
    shortDesc: 'Exquisite, aromatic white oriental lilies with multiple fragrant buds.',
    badge: 'Seasonal Pick'
  },
  {
    id: 'gift-combos-1',
    name: 'Flowers + Cake',
    slug: 'flowers-plus-cake',
    price: 1499,
    discount: 10,
    category: 'gift-combos',
    categoryName: 'Gift Sets',
    image: '/assets/products/gift-combos-flowers-cake.jpg',
    rating: 4.9,
    reviews: 164,
    shortDesc: 'Handcrafted red roses bouquet paired with a fresh half-kg artisan chocolate cake.',
    badge: 'Gifting Favorite'
  },
  {
    id: 'decor-1',
    name: 'Table Decor',
    slug: 'table-decor',
    price: 2499,
    discount: 10,
    category: 'decor',
    categoryName: 'Decor',
    image: '/assets/products/decor-table-decor.jpg',
    rating: 4.9,
    reviews: 84,
    shortDesc: 'Bespoke dining table floral runner with cascading roses and ambient candles.',
    badge: 'Artisan Choice'
  }
];

export default function BestSellersSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [addedItem, setAddedItem] = useState(null);
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Combine and strictly filter by valid image availability
  const sourceProducts = products && products.length > 0 ? products : DEFAULT_PRODUCTS;
  const validOnly = filterProductsWithValidImages(sourceProducts);

  const mapped = validOnly.map(p => ({
    id: p.id || p._id,
    name: p.name,
    slug: p.slug || p.id,
    price: Number(p.price) || 499,
    discount: Number(p.discount) || 0,
    category: typeof p.category === 'object' ? p.category?.slug : p.category,
    categoryName: typeof p.category === 'object' ? p.category?.name : (p.category || 'Featured'),
    image: p.image,
    rating: Number(p.rating) || 4.8,
    reviews: Number(p.reviews) || 65,
    shortDesc: p.shortDesc || (p.description ? p.description.slice(0, 75) + '...' : 'Handcrafted fresh bloom arrangement.'),
    badge: p.badge || (p.isFeatured || p.featured ? 'Featured' : 'Best Seller')
  }));

  const filtered = activeTab === 'all' 
    ? mapped.slice(0, 6)
    : mapped.filter(p => p.category === activeTab).slice(0, 6);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
      image: item.image,
      category: item.categoryName
    }, 1);

    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section id="best-sellers" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div>
            <div className={styles.badge}>
              <Star size={14} fill="#E91E63" color="#E91E63" />
              <span>THE CLIENT FAVORITES</span>
            </div>
            <h2 className={styles.title}>Best Sellers &amp; Most Loved</h2>
            <p className={styles.subtitle}>
              From our famous Blush Peony to the exotic Velvet Orchid, discover the arrangements 
              our patrons order time and time again.
            </p>
          </div>

          <Link href="/products" className={styles.viewAllBtn}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const discountedPrice = item.discount > 0 
                ? item.price - (item.price * (item.discount / 100))
                : item.price;
              const isAdded = addedItem === item.id;
              const inWish = isInWishlist && isInWishlist(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={styles.card}
                >
                  <div className={styles.imageHolder}>
                    <img src={item.image} alt={item.name} className={styles.image} />
                    
                    {item.discount > 0 && (
                      <span className={styles.discountBadge}>-{item.discount}%</span>
                    )}

                    <span className={styles.topBadge}>{item.badge}</span>

                    <button
                      className={styles.wishlistBtn}
                      onClick={() => toggleWishlist(item)}
                      aria-label="Save to Wishlist"
                      style={inWish ? { color: '#E91E63', background: '#fff' } : {}}
                    >
                      <Heart size={16} fill={inWish ? '#E91E63' : 'none'} />
                    </button>
                  </div>

                  <div className={styles.content}>
                    <div className={styles.metaRow}>
                      <span className={styles.categoryName}>{item.categoryName}</span>
                      <div className={styles.rating}>
                        <Star size={13} fill="#D4AF37" color="#D4AF37" />
                        <span>{item.rating}</span>
                        <span className={styles.reviewsCount}>({item.reviews})</span>
                      </div>
                    </div>

                    <Link href={`/products/${item.slug}`} className={styles.nameLink}>
                      <h3 className={styles.productName}>{item.name}</h3>
                    </Link>

                    <p className={styles.shortDesc}>{item.shortDesc}</p>

                    <div className={styles.priceRow}>
                      <div className={styles.prices}>
                        <span className={styles.currentPrice}>{formatPrice(discountedPrice)}</span>
                        {item.discount > 0 && (
                          <span className={styles.oldPrice}>{formatPrice(item.price)}</span>
                        )}
                      </div>

                      <button
                        className={`${styles.addBtn} ${isAdded ? styles.addBtnSuccess : ''}`}
                        onClick={(e) => handleAddToCart(e, item)}
                        aria-label="Add to cart"
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
