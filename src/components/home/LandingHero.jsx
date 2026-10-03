'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Flower2, 
  Search,
  CheckCircle2,
  Star
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './LandingHero.module.css';

const HERO_SHOWCASE = [
  {
    id: 'bouquets-1',
    name: 'Classic Red Rose Bouquet',
    category: 'Luxury Bouquets',
    tag: 'Bestseller',
    price: 1299,
    priceStr: '₹1,299',
    image: '/assets/products/bouquets-classic-red-rose.jpg',
    href: '/category/bouquets',
    description: 'Grand signature bouquet of velvety crimson roses arranged in luxury paper.'
  },
  {
    id: 'fresh-flowers-2',
    name: 'Lilies',
    category: 'Fresh Flowers',
    tag: 'Aromatic Blooms',
    price: 699,
    priceStr: '₹699',
    image: '/assets/products/fresh-flowers-lilies.jpg',
    href: '/category/fresh-flowers',
    description: 'Stately oriental white lilies with intoxicating natural fragrance and long vase life.'
  },
  {
    id: 'plants-1',
    name: 'Money Plant',
    category: 'Air Purifying Plants',
    tag: 'Vastu & Luck',
    price: 499,
    priceStr: '₹499',
    image: '/assets/products/plants-money-plant.jpg',
    href: '/category/plants',
    description: 'Lush trailing variegated Golden Pothos Money Plant potted in artisanal pot.'
  },
  {
    id: 'decor-1',
    name: 'Table Decor',
    category: 'Botanical Decor',
    tag: 'Artisan Centerpiece',
    price: 2499,
    priceStr: '₹2,499',
    image: '/assets/products/decor-table-decor.jpg',
    href: '/category/decor',
    description: 'Bespoke dining table floral runner with cascading roses and ambient candles.'
  }
];

const QUICK_DEPARTMENTS = [
  { name: 'Fresh Flowers', href: '/category/fresh-flowers', icon: '🌸' },
  { name: 'Plants', href: '/category/plants', icon: '🌿' },
  { name: 'Bouquets', href: '/category/bouquets', icon: '💐' },
  { name: 'Seeds', href: '/category/seeds', icon: '🌱' },
  { name: 'Decor', href: '/category/decor', icon: '✨' },
  { name: 'Gift Combos', href: '/category/gift-combos', icon: '🎁' }
];

export default function LandingHero() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleQuickAdd = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category
    }, 1);
  };

  return (
    <section id="hero" className={styles.heroSection}>
      {/* Decorative ambient gradient blooms */}
      <div className={styles.ambientGlowPink}></div>
      <div className={styles.ambientGlowGold}></div>

      <div className={styles.container}>
        {/* Quick Category Jump Bar */}
        <motion.div 
          className={styles.quickBar}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.quickBarLabel}>Direct Jump:</span>
          <div className={styles.quickPills}>
            {QUICK_DEPARTMENTS.map((dept) => (
              <Link key={dept.name} href={dept.href} className={styles.deptPill}>
                <span>{dept.icon}</span>
                <span>{dept.name}</span>
              </Link>
            ))}
            <Link href="/products" className={`${styles.deptPill} ${styles.deptPillAll}`}>
              <span>Browse 70+ Items &rarr;</span>
            </Link>
          </div>
        </motion.div>

        {/* Hero Headline & Value Proposition */}
        <div className={styles.heroGrid}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.pillBadge}>
              <Sparkles size={14} className={styles.pillIcon} />
              <span>THE ART OF LUXURY FLORISTRY</span>
            </div>

            <h1 className={styles.title}>
              Fresh Flowers.<br />
              <span className={styles.titleGradient}>Crafted by Nature.</span><br />
              Delivered with Love.
            </h1>

            <p className={styles.subtitle}>
              Experience the elegance of handcrafted floral arrangements. From seed to bloom, 
              we curate nature's finest stems into breathless masterpieces for life's most meaningful moments.
            </p>

            {/* Main Navigation Actions */}
            <div className={styles.actionButtons}>
              <a 
                href="#collections" 
                className={styles.btnPrimary}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore All Collections</span>
                <ArrowRight size={18} />
              </a>

              <a 
                href="#best-sellers" 
                className={styles.btnSecondary}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Shop Best Sellers</span>
              </a>

              <Link href="/track-order" className={styles.btnGhost}>
                <Truck size={16} />
                <span>Track Order</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.trustIcon} />
                <span>Same-Day 2-Hour Express</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.trustIcon} />
                <span>7-Day Freshness Guarantee</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.trustIcon} />
                <span>100% Eco-Farm Sourced</span>
              </div>
            </div>

            {/* Social proof strip */}
            <div className={styles.socialProof}>
              <div className={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <p className={styles.ratingText}>
                <strong>4.9 / 5.0</strong> from over 12,400+ delighted floral connoisseurs
              </p>
            </div>
          </motion.div>

          {/* Interactive Hero Showcase Cards (Midnight Rose, Golden Lily, Blush Peony, Velvet Orchid) */}
          <motion.div 
            className={styles.showcaseGrid}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {HERO_SHOWCASE.map((item, idx) => {
              const inWish = isInWishlist && isInWishlist(item.id);
              return (
                <div key={item.id} className={styles.showcaseCard}>
                  <div className={styles.cardImageHolder}>
                    <img src={item.image} alt={item.name} className={styles.cardImage} />
                    <span className={styles.cardTag}>{item.tag}</span>
                    <button 
                      className={styles.cardWishBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist({ id: item.id, name: item.name, price: item.price, image: item.image });
                      }}
                      aria-label="Wishlist"
                      style={inWish ? { color: '#E91E63', background: '#fff' } : {}}
                    >
                      <Heart size={16} fill={inWish ? '#E91E63' : 'none'} />
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCategory}>{item.category}</span>
                      <span className={styles.cardPrice}>{item.priceStr}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardDesc}>{item.description}</p>

                    <div className={styles.cardFooter}>
                      <button 
                        className={styles.cardAddBtn}
                        onClick={(e) => handleQuickAdd(e, item)}
                        title="Add to Cart"
                      >
                        <ShoppingBag size={15} />
                        <span>Add to Cart</span>
                      </button>
                      <Link href={item.href} className={styles.cardDetailsLink}>
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
