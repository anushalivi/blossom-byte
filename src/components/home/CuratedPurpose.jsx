'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { filterProductsWithValidImages } from '@/lib/validImages';
import styles from './CuratedPurpose.module.css';

const CURATED_ITEMS = [
  {
    id: 'lilies-curated',
    title: 'Pristine Lilies',
    tagline: 'Elegant simplicity.',
    description: 'An architectural composition of stately oriental white lilies with deep natural fragrance. Designed for tranquil spaces and modern sanctuaries.',
    image: '/assets/products/fresh-flowers-lilies.jpg',
    price: '₹699',
    link: '/category/fresh-flowers',
    accent: '#8E8D8A'
  },
  {
    id: 'classic-romance',
    title: 'Classic Red Roses',
    tagline: 'Timeless passion.',
    description: 'A celebration of love featuring velvety crimson long-stem roses wrapped in luxury matte craft paper with satin ribbon.',
    image: '/assets/products/bouquets-classic-red-rose.jpg',
    price: '₹1,299',
    link: '/category/bouquets',
    accent: '#E91E63'
  },
  {
    id: 'golden-marigold',
    title: 'Festive Marigold',
    tagline: 'Sun-drenched warmth.',
    description: 'Auspicious golden-orange marigold flowers hand-gathered from Karnataka farms. Perfect for ceremonies, positive energy, and festive brightness.',
    image: '/assets/products/fresh-flowers-marigold.jpg',
    price: '₹299',
    link: '/category/fresh-flowers',
    accent: '#D4AF37'
  },
  {
    id: 'peace-lily-curated',
    title: 'Peace Lily Plant',
    tagline: 'Deep serene allure.',
    description: 'Graceful air-purifying Spathiphyllum with deep glossy foliage and pure white spathe blooms in an artisanal ceramic pot.',
    image: '/assets/products/plants-peace-lily.jpg',
    price: '₹649',
    link: '/category/plants',
    accent: '#10B981'
  }
];

export default function CuratedPurpose() {
  const validItems = filterProductsWithValidImages(CURATED_ITEMS);
  if (validItems.length === 0) return null;
  const mainItem = validItems[0];
  const secondaryItems = validItems.slice(1);
  return (
    <section id="curated" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>ARTISAN SPOTLIGHT</span>
          </div>
          <h2 className={styles.title}>Curated With Purpose</h2>
          <p className={styles.subtitle}>
            Discover our most loved arrangements, handcrafted for every moment. Each edition 
            is a poetic balance of form, scent, and seasonal rarity.
          </p>
        </div>

        {/* Editorial Layout: Large Feature + 3 Staggered Cards */}
        <div className={styles.curatedGrid}>
          {/* Main Hero Highlight */}
          <div className={styles.mainFeature}>
            <div className={styles.mainFeatureImageHolder}>
              <img 
                src={mainItem.image} 
                alt={mainItem.title} 
                className={styles.mainFeatureImage} 
              />
              <div className={styles.mainFeatureOverlay}></div>
              <span className={styles.mainFeatureTag}>Signature Icon</span>
            </div>

            <div className={styles.mainFeatureBody}>
              <span className={styles.itemTagline}>{mainItem.tagline}</span>
              <h3 className={styles.mainFeatureTitle}>{mainItem.title}</h3>
              <p className={styles.mainFeatureDesc}>{mainItem.description}</p>
              
              <div className={styles.mainFeatureFooter}>
                <div className={styles.priceTag}>
                  <span className={styles.priceLabel}>Starting from</span>
                  <span className={styles.priceVal}>{mainItem.price}</span>
                </div>
                <Link href={mainItem.link} className={styles.exploreLink}>
                  <span>Explore Design</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Stack */}
          <div className={styles.secondaryStack}>
            {secondaryItems.map((item) => (
              <div key={item.id} className={styles.secondaryCard}>
                <div className={styles.secondaryImageHolder}>
                  <img src={item.image} alt={item.title} className={styles.secondaryImage} />
                </div>

                <div className={styles.secondaryBody}>
                  <span className={styles.itemTagline} style={{ color: item.accent }}>
                    {item.tagline}
                  </span>
                  <h4 className={styles.secondaryTitle}>{item.title}</h4>
                  <p className={styles.secondaryDesc}>{item.description}</p>
                  
                  <div className={styles.secondaryFooter}>
                    <span className={styles.secondaryPrice}>{item.price}</span>
                    <Link href={item.link} className={styles.secondaryBtn}>
                      <span>View</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
