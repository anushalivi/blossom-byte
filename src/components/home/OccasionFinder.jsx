'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, Heart, Sparkles, Home, Briefcase, Smile, ArrowRight } from 'lucide-react';
import styles from './OccasionFinder.module.css';

const OCCASIONS = [
  {
    id: 'anniversary',
    title: 'Anniversaries & Romance',
    desc: 'Velvet crimson roses, fragrant peonies, and bespoke love notes.',
    icon: Heart,
    categoryLink: '/category/fresh-flowers',
    tag: 'Deep Affection',
    color: '#E91E63'
  },
  {
    id: 'birthday',
    title: 'Birthdays & Festivities',
    desc: 'Vibrant kaleidoscope bouquets paired with artisanal gourmet chocolates.',
    icon: Gift,
    categoryLink: '/category/gift-combos',
    tag: 'Celebration',
    color: '#D4AF37'
  },
  {
    id: 'housewarming',
    title: 'New Home & Fresh Starts',
    desc: 'Air-purifying peace lilies, fiddle leaf figs, and ceramic bonsai planters.',
    icon: Home,
    categoryLink: '/category/plants',
    tag: 'Serenity',
    color: '#6DBE45'
  },
  {
    id: 'sympathy',
    title: 'Sympathy & Gentle Comfort',
    desc: 'Serene white lilies, ivory hydrangeas, and soft pastel condolences.',
    icon: Smile,
    categoryLink: '/category/fresh-flowers',
    tag: 'Thoughtful',
    color: '#8E8D8A'
  },
  {
    id: 'corporate',
    title: 'Executive & Corporate Gifting',
    desc: 'Prestigious botanical displays and elegant floral arrangements for VIPs.',
    icon: Briefcase,
    categoryLink: '/category/decor',
    tag: 'Distinguished',
    color: '#264653'
  },
  {
    id: 'gardeners',
    title: 'Botanical & Gardening Lovers',
    desc: 'Heirloom flower seeds and decorative floral planting kits.',
    icon: Sparkles,
    categoryLink: '/category/seeds',
    tag: 'Green Thumb',
    color: '#2A9D8F'
  }
];

export default function OccasionFinder() {
  return (
    <section id="occasions" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Gift size={14} />
            <span>EXPRESSIVE BOTANICALS</span>
          </div>
          <h2 className={styles.title}>Shop By Occasion &amp; Mood</h2>
          <p className={styles.subtitle}>
            Every bloom communicates a distinct sentiment. Find the perfect floral gesture crafted specifically for life's unforgettable chapters.
          </p>
        </div>

        <div className={styles.grid}>
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            return (
              <div key={occ.id} className={styles.cardWrapper}>
                <Link href={occ.categoryLink} className={styles.card}>
                  <div className={styles.iconCircle} style={{ background: `${occ.color}15`, color: occ.color }}>
                    <Icon size={24} />
                  </div>

                  <span className={styles.tag} style={{ color: occ.color }}>{occ.tag}</span>
                  <h3 className={styles.cardTitle}>{occ.title}</h3>
                  <p className={styles.cardDesc}>{occ.desc}</p>

                  <div className={styles.cardLink}>
                    <span>Discover Arrangements</span>
                    <ArrowRight size={15} />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
