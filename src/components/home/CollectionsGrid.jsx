'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Layers } from 'lucide-react';
import styles from './CollectionsGrid.module.css';

const COLLECTIONS = [
  {
    id: 'fresh-flowers',
    name: 'Fresh Flowers',
    subtitle: 'Harvested Daily at Dawn',
    description: 'Crisp, velvety blossoms cut from private organic valleys. Long-lasting vase life.',
    image: '/assets/products/fresh-flowers.jpg',
    count: '15+ Stems',
    popular: 'Crimson Rose, White Lily, Orchid',
    href: '/category/fresh-flowers',
    badge: 'Farm Fresh'
  },
  {
    id: 'bouquets',
    name: 'Flower Bouquets',
    subtitle: 'Hand-Tied Artisan Creations',
    description: 'Layered textures wrapped in Korean silk paper with silk ribbons for gifting.',
    image: '/assets/products/bouquets.jpg',
    count: '15+ Arrangements',
    popular: 'Midnight Rose, Pastel Meadow',
    href: '/category/bouquets',
    badge: 'Most Popular'
  },
  {
    id: 'plants',
    name: 'Flower Plants',
    subtitle: 'Botanical Living Decor',
    description: 'Thriving potted perennials and rare orchids that purify air and uplift spaces.',
    image: '/assets/products/plants.jpg',
    count: '12+ Varieties',
    popular: 'Peace Lily, Bonsai, Anthurium',
    href: '/category/plants',
    badge: 'Living Green'
  },
  {
    id: 'seeds',
    name: 'Flower Seeds',
    subtitle: 'Heirloom Garden Beginnings',
    description: 'High-germination certified non-GMO seeds for pollinators and cutting gardens.',
    image: '/assets/products/seeds.jpg',
    count: '12+ Seed Packs',
    popular: 'Wildflower Mix, Sunflowers',
    href: '/category/seeds',
    badge: 'Pure Heritage'
  },
  {
    id: 'decor',
    name: 'Decoration Flowers',
    subtitle: 'Atmospheric Event Artistry',
    description: 'Dramatic centerpieces, floral arches, and tablescapes for memorable milestones.',
    image: '/assets/products/decor.jpg',
    count: '10+ Installations',
    popular: 'Gala Centerpieces, Floral Garlands',
    href: '/category/decor',
    badge: 'Event Ready'
  },
  {
    id: 'gift-combos',
    name: 'Gift Combos',
    subtitle: 'Curated Celebratory Boxes',
    description: 'Harmonious pairings of fresh blooms, gourmet chocolates, candles, and vases.',
    image: '/assets/products/gift-combos.jpg',
    count: '10+ Luxury Sets',
    popular: 'Deluxe Bloom Box, Spa & Flower Set',
    href: '/category/gift-combos',
    badge: 'Perfect Gift'
  }
];

export default function CollectionsGrid() {
  return (
    <section id="collections" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Layers size={14} />
            <span>EXPLORE OUR CURATED REALM</span>
          </div>
          <h2 className={styles.title}>All Collections &amp; Departments</h2>
          <p className={styles.subtitle}>
            Every corner of Blossom Byte is designed to elevate gifting and interior serenity. 
            Choose a department below to dive directly into that curated world.
          </p>
        </div>

        {/* 6 Category Tiles */}
        <div className={styles.grid}>
          {COLLECTIONS.map((col) => (
            <div key={col.id} className={styles.cardWrapper}>
              <Link href={col.href} className={styles.card}>
                <div className={styles.imageHolder}>
                  <img src={col.image} alt={col.name} className={styles.image} />
                  <div className={styles.imageOverlay}></div>
                  <span className={styles.cardBadge}>{col.badge}</span>
                  <span className={styles.cardCount}>{col.count}</span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.cardSubtitle}>{col.subtitle}</span>
                      <h3 className={styles.cardTitle}>{col.name}</h3>
                    </div>
                    <div className={styles.arrowCircle}>
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <p className={styles.cardDesc}>{col.description}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.popularLabel}>Highlights:</span>
                    <span className={styles.popularItems}>{col.popular}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Global Shop All Banner */}
        <div className={styles.shopAllBanner}>
          <div className={styles.bannerContent}>
            <span className={styles.bannerTag}><Sparkles size={14} /> COMPLETE INVENTORY</span>
            <h3 className={styles.bannerTitle}>Looking for something uniquely specific?</h3>
            <p className={styles.bannerDesc}>
              Filter across 70+ blooming arrangements by color, flower species, fragrance profile, and price range.
            </p>
          </div>
          <div className={styles.bannerActions}>
            <Link href="/products" className={styles.bannerBtnPrimary}>
              Browse Full Catalog &rarr;
            </Link>
            <Link href="/categories" className={styles.bannerBtnSecondary}>
              Category Overview
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
